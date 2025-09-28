from __future__ import annotations
import os,json,joblib,pandas as pd,numpy as np
from typing import List,Dict,Any,Optional,Literal
from datetime import datetime,date
from decimal import Decimal
import requests
from fastapi import FastAPI,HTTPException,Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from app.models.lstm_forecaster import forecast_daily_spend,get_forecaster
from app.models.planner import project_savings_money,build_money_trajectory
from app.models.model_retrainer import model_retrainer
from app.features.featureizer import make_purchase_features,get_feature_columns
from app.models.gbm import GBMRegressor
from app.utils.scoring import money_correlation_score
app=FastAPI(title="Coach ML Service",version="1.1.0")
app.add_middleware(CORSMiddleware,allow_origins=["*"],allow_credentials=False,allow_methods=["*"],allow_headers=["*"])
ARTIFACT_DIR=os.getenv("MODEL_DIR","./model_artifacts")
MODEL=None
LSTM_MODEL=None
CURRENT_USER_ID=None
PURCHASE_CACHE_DIR=os.getenv("PURCHASE_CACHE_DIR",ARTIFACT_DIR)
PURCHASE_HISTORY:Dict[int,List[Dict[str,Any]]]={}
os.makedirs(PURCHASE_CACHE_DIR,exist_ok=True)
class GraphDataRequest(BaseModel):
    days_horizon:int=120
    projection_mode:Literal["piecewise","logistic","linear"]="piecewise"
    current_savings:float=1000
    user_id:int
    income_per_month:float
    goal_amount:float
    target_date:Optional[str]=None
    purchases:List[Dict[str,Any]]=[]
@app.get("/")
def root():return{"ok":True}
@app.get("/health")
def health():return{"status":"ok"}
@app.post("/reload_model")
def reload_model():
    global MODEL,LSTM_MODEL
    try:
        if MODEL is None:MODEL=GBMRegressor()
        MODEL.load(ARTIFACT_DIR)
        if LSTM_MODEL is None:
            try:
                from app.models.lstm_forecaster import forecast_daily_spend
                LSTM_MODEL=forecast_daily_spend
            except Exception:
                LSTM_MODEL=lambda history,horizon=30:np.full(int(horizon),float(history[-1]) if len(history) else 0.0)
        return{"ok":True,"gbm_loaded":True,"lstm_ready":True}
    except Exception as e:
        raise HTTPException(status_code=500,detail=str(e))
BACKEND_URL="http://143.215.104.239:8080"
class DataResponse(BaseModel):
    income:Decimal
    score:int
    amount:Optional[Decimal]=None
    saved:Optional[Decimal]=None
    expenditures:Decimal
    merchant:Optional[str]=None
    category:Optional[str]=None
    days:Optional[int]=None
    purchase_time:Optional[datetime]=None
    userId:int
@app.get("/all-data",response_model=DataResponse)
def get_all_data(x_user_id:int=Header(...,alias="X-User-Id")):
    url=f"{BACKEND_URL}/dashboard/{x_user_id}"
    resp=requests.get(url,timeout=5)
    if resp.status_code not in(200,201):raise HTTPException(status_code=resp.status_code,detail=f"Backend error: {resp.text}")
    return DataResponse(**resp.json())
@app.post("/force_retrain_models")
def force_retrain_models(x_user_id:int=Header(...,alias="X-User-Id")):
    global MODEL
    try:
        purchases_records=_load_user_history(int(x_user_id))
        if not purchases_records:return{"error":"No purchase history found for user","user_id":x_user_id}
        try:
            payload_obj=get_all_data(x_user_id=int(x_user_id))
            payload=payload_obj.dict() if hasattr(payload_obj,"dict") else payload_obj
            income_monthly=float(payload.get("income") or 5000.0)
        except:income_monthly=5000.0
        gbm_success=model_retrainer.retrain_model(purchases_records,income_monthly)
        if gbm_success:MODEL=model_retrainer.model
        forecaster=get_forecaster()
        df_hist=pd.DataFrame(purchases_records)
        if"purchase_time"in df_hist.columns and"ts"not in df_hist.columns:df_hist["ts"]=pd.to_datetime(df_hist["purchase_time"],errors="coerce")
        else:df_hist["ts"]=pd.to_datetime(df_hist.get("ts",pd.NaT),errors="coerce")
        df_hist["amount"]=pd.to_numeric(df_hist.get("amount",0.0),errors="coerce")
        df_hist=df_hist.dropna(subset=["ts"]).sort_values("ts")
        daily_spend=df_hist.set_index("ts")["amount"].resample("D").sum()
        last_ts=pd.to_datetime(df_hist["ts"].max()).normalize() if not df_hist.empty else pd.Timestamp.utcnow().normalize()
        idx=pd.date_range(end=last_ts,periods=60,freq="D")
        daily_spend=daily_spend.reindex(idx,fill_value=0.0)
        daily_spend_hist=daily_spend.values.astype(float).tolist()
        if len(daily_spend_hist)<3:
            baseline=float(np.mean(daily_spend_hist)) if daily_spend_hist else max(0.0,(income_monthly/30.0)*0.3)
            daily_spend_hist=[baseline]*(3-len(daily_spend_hist))+daily_spend_hist
        forecaster.last_training_data_hash=None
        lstm_success=forecaster.train_model(daily_spend_hist)
        return{"success":True,"gbm_retrained":gbm_success,"lstm_retrained":lstm_success,"purchases_processed":len(purchases_records),"user_id":x_user_id,"income_monthly":income_monthly}
    except Exception as e:
        import traceback
        return{"success":False,"error":str(e),"traceback":traceback.format_exc(),"user_id":x_user_id}
@app.get("/model_status")
def get_model_status(x_user_id:int=Header(...,alias="X-User-Id")):
    global MODEL
    try:
        from app.models.lstm_forecaster import get_forecaster,_HAS_TORCH
        forecaster=get_forecaster()
        gbm_status={"loaded":MODEL is not None,"fitted":MODEL.is_fitted if MODEL else False,"retrainer_loaded":model_retrainer.model is not None,"retrainer_fitted":(model_retrainer.model.is_fitted if model_retrainer.model else False),"training_samples":len(model_retrainer.training_history)}
        lstm_status={"loaded":forecaster.model is not None,"trained":forecaster.is_trained,"has_torch":_HAS_TORCH,"model_file_exists":os.path.exists("model_artifacts/lstm_model.pkl")}
        purchases_count=len(_load_user_history(int(x_user_id)))
        return{"user_id":x_user_id,"gbm_model":gbm_status,"lstm_model":lstm_status,"purchase_history_count":purchases_count,"model_artifacts_dir":ARTIFACT_DIR}
    except Exception as e:
        return{"error":str(e),"user_id":x_user_id}
@app.post("/test_prediction")
def test_prediction(x_user_id:int=Header(...,alias="X-User-Id")):
    try:
        purchases_records=_load_user_history(int(x_user_id))
        if not purchases_records:return{"error":"No purchase history"}
        latest_purchase=purchases_records[-1]
        try:
            payload_obj=get_all_data(x_user_id=int(x_user_id))
            payload=payload_obj.dict() if hasattr(payload_obj,"dict") else payload_obj
            income_monthly=float(payload.get("income") or 5000.0)
        except:income_monthly=5000.0
        score=model_retrainer.get_latest_score(latest_purchase,income_monthly)
        return{"user_id":x_user_id,"latest_purchase":latest_purchase,"predicted_score":score,"income_monthly":income_monthly}
    except Exception as e:
        import traceback
        return{"error":str(e),"traceback":traceback.format_exc()}
@app.get("/get_graph_data")
def get_graph_data(x_user_id:int=Header(...,alias="X-User-Id")):
    global CURRENT_USER_ID,MODEL
    CURRENT_USER_ID=int(x_user_id)
    print(f"[REQ] /get_graph_data user={CURRENT_USER_ID}")
    try:
        payload_obj=get_all_data(x_user_id=CURRENT_USER_ID)
        payload=payload_obj.dict() if hasattr(payload_obj,"dict") else payload_obj
    except Exception as e:
        raise HTTPException(status_code=502,detail=f"Failed to fetch all-data: {e}")
    income_monthly=float(payload.get("income") or 0.0)
    current_savings=float(payload.get("saved") or payload.get("current_savings") or 0.0)
    goal_amount=float(payload.get("saved") or 10000.0)
    days_horizon=int(payload.get("days") or 90)
    print(f"[INFO] income={income_monthly} saved={current_savings} goal_amount={goal_amount} horizon={days_horizon}")
    latest_df=build_purchases_df(payload)
    latest_records=latest_df.to_dict(orient="records")
    old_history=_load_user_history(CURRENT_USER_ID)
    purchases_records=_merge_history(CURRENT_USER_ID,latest_records)
    has_new_purchase=len(purchases_records)>len(old_history)
    print(f"[INFO] purchases_history={len(purchases_records)} (was {len(old_history)}), new_purchase={has_new_purchase}")
    if has_new_purchase and purchases_records:
        newest_purchase=purchases_records[-1]
        print(f"[TRAIN] GBM+LSTM on new purchase: {newest_purchase}")
        gbm_success=model_retrainer.retrain_model([newest_purchase],income_monthly)
        if gbm_success and model_retrainer.model is not None:MODEL=model_retrainer.model
        print(f"[TRAIN] GBM retrain success={bool(gbm_success)}")
        df_hist=pd.DataFrame(purchases_records)
        if"purchase_time"in df_hist.columns and"ts"not in df_hist.columns:df_hist["ts"]=pd.to_datetime(df_hist["purchase_time"],errors="coerce")
        else:df_hist["ts"]=pd.to_datetime(df_hist.get("ts",pd.NaT),errors="coerce")
        df_hist["amount"]=pd.to_numeric(df_hist.get("amount",0.0),errors="coerce")
        df_hist=df_hist.dropna(subset=["ts"]).sort_values("ts")
        daily_spend=df_hist.set_index("ts")["amount"].resample("D").sum()
        last_ts=pd.to_datetime(df_hist["ts"].max()).normalize() if not df_hist.empty else pd.Timestamp.utcnow().normalize()
        idx=pd.date_range(end=last_ts,periods=60,freq="D")
        daily_spend=daily_spend.reindex(idx,fill_value=0.0)
        daily_spend_hist=daily_spend.values.astype(float).tolist()
        if len(daily_spend_hist)<3:
            baseline=float(np.mean(daily_spend_hist)) if daily_spend_hist else max(0.0,(income_monthly/30.0)*0.3)
            daily_spend_hist=[baseline]*(3-len(daily_spend_hist))+daily_spend_hist
        forecaster=get_forecaster()
        lstm_success=forecaster.train_model(daily_spend_hist)
        print(f"[TRAIN] LSTM retrain success={bool(lstm_success)} len_hist_days={len(daily_spend_hist)}")
    else:
        daily_spend_hist=[]
    model_error=None;scores=[];used_features=[]
    try:
        _ensure_loaded_model()
        feats=make_purchase_features(pd.DataFrame(purchases_records),income=income_monthly) if len(purchases_records) else pd.DataFrame()
        if not feats.empty and MODEL is not None and getattr(MODEL,"is_fitted",False):
            scores=MODEL.predict(feats).tolist()
            used_features=get_feature_columns()
            print(f"[SCORE] GBM predicted {len(scores)} scores; last={scores[-1] if scores else None}")
    except Exception as e:
        model_error=f"ML pipeline failed: {e}";scores=[]
        print(f"[ERR] {model_error}")
    df_hist=pd.DataFrame(purchases_records) if purchases_records else pd.DataFrame()
    if not df_hist.empty:
        if"purchase_time"in df_hist.columns and"ts"not in df_hist.columns:df_hist["ts"]=pd.to_datetime(df_hist["purchase_time"],errors="coerce")
        else:df_hist["ts"]=pd.to_datetime(df_hist.get("ts",pd.NaT),errors="coerce")
        df_hist["amount"]=pd.to_numeric(df_hist.get("amount",0.0),errors="coerce")
        df_hist=df_hist.dropna(subset=["ts"])
        if not df_hist.empty:
            df_hist=df_hist.sort_values("ts")
            daily_spend=df_hist.set_index("ts")["amount"].resample("D").sum()
            last_ts=pd.to_datetime(df_hist["ts"].max()).normalize() if not df_hist.empty else pd.Timestamp.utcnow().normalize()
            idx=pd.date_range(end=last_ts,periods=60,freq="D")
            daily_spend=daily_spend.reindex(idx,fill_value=0.0)
            daily_spend_hist=daily_spend.values.astype(float).tolist()
            if len(daily_spend_hist)<3:
                baseline=float(np.mean(daily_spend_hist)) if daily_spend_hist else max(0.0,(income_monthly/30.0)*0.3)
                daily_spend_hist=[baseline]*(3-len(daily_spend_hist))+daily_spend_hist
        else:daily_spend_hist=[]
    else:daily_spend_hist=[]
    daily_income=income_monthly/30.0 if income_monthly>0 else 100.0
    alpha=0.15
    if len(daily_spend_hist)>=1:
        ema=daily_spend_hist[0]
        for x in daily_spend_hist[1:]:ema=alpha*x+(1-alpha)*ema
    else:
        ema=daily_income
    shock=max(0.0,(daily_spend_hist[-1] if len(daily_spend_hist) else ema)-ema)
    adj_avg=ema+0.35*shock
    base_budget=max(daily_income-ema,0.0)
    daily_savings_budget=max(daily_income-adj_avg,0.0)
    daily_savings_budget=max(daily_savings_budget,0.5*base_budget)
    recent_avg_spend=adj_avg
    print(f"[INFO] daily_income={daily_income:.2f} recent_avg_spend={recent_avg_spend:.2f} daily_savings_budget={daily_savings_budget:.2f}")
    try:
        if len(daily_spend_hist)>=3 and np.std(daily_spend_hist)>=1e-6:
            spend_forecast=forecast_daily_spend(daily_spend_hist,horizon=days_horizon)
        else:
            spend_forecast=np.full(days_horizon,recent_avg_spend,dtype=float)
        adj=np.asarray(recent_avg_spend-np.asarray(spend_forecast,dtype=float),dtype=float)
        cap=max(daily_savings_budget*0.5,0.0)
        daily_adjustments=np.clip(adj,-cap,cap)
    except Exception as e:
        print(f"[WARN] LSTM forecast error: {e}");daily_adjustments=np.zeros(days_horizon,dtype=float)
    projected_money,_=build_money_trajectory(current_savings=current_savings,daily_savings_budget=daily_savings_budget,days_horizon=days_horizon,daily_adjustments=daily_adjustments)
    ideal_money,_=project_savings_money(current_savings=current_savings,daily_savings_budget=daily_savings_budget,goal_amount=goal_amount,days_horizon=days_horizon)
    if len(ideal_money)==0:ideal_money=np.linspace(current_savings,goal_amount,days_horizon)
    if len(projected_money)==0:projected_money=np.linspace(current_savings,current_savings+daily_savings_budget*days_horizon,days_horizon)
    ideal_dollars=np.asarray(ideal_money,dtype=float)
    projected_dollars=np.asarray(projected_money,dtype=float)
    if ideal_dollars.size and float(ideal_dollars[-1])!=float(goal_amount) and float(ideal_dollars[-1])>0:
        s=float(goal_amount)/float(ideal_dollars[-1]);ideal_dollars=ideal_dollars*s;projected_dollars=projected_dollars*s;print(f"[ADJUST] scaled ideal/projected by {s:.4f} to hit goal={goal_amount}")
    money_score_raw=float(money_correlation_score(ideal_dollars,projected_dollars))
    overall_score=_compute_overall_score_fixed(ideal_dollars,projected_dollars,current_savings,goal_amount)
    days=list(range(int(days_horizon)))
    ideal=np.linspace(0.0,float(goal_amount),int(days_horizon))
    projected=projected_dollars-projected_dollars[0]
    daily_net=np.diff(projected,prepend=0.0)
    llm_adj=daily_adjustments if len(daily_adjustments)==days_horizon else np.zeros(days_horizon)
    trend=np.ones(days_horizon,dtype=float)
    gbm_model_score=None
    try:
        if purchases_records and model_retrainer.model and model_retrainer.model.is_fitted:
            gbm_model_score=model_retrainer.get_latest_score(purchases_records[-1],income_monthly);print(f"[SCORE] GBM latest_score={gbm_model_score}")
    except Exception as e:
        print(f"[WARN] GBM latest score error: {e}")
    print(f"[OUT] projected_delta={float(projected[-1]) if len(projected)>0 else 0:.2f} money_score={money_score_raw:.4f} overall_score={overall_score}")
    return{"metadata":{"current_savings":float(current_savings),"goal_amount":float(goal_amount),"income_monthly":float(income_monthly),"days_horizon":int(days_horizon),"projection_mode":"lstm+planner","money_score":float(money_score_raw),"score":int(overall_score),"model_error":model_error,"user_id":CURRENT_USER_ID,"target_date":None,"has_goal":bool(goal_amount),"purchases_processed":int(len(purchases_records)),"model_updated":has_new_purchase,"gbm_model_score":gbm_model_score,"daily_savings_budget":daily_savings_budget,"recent_avg_spend":recent_avg_spend},"data_points":{"days":days,"projected_savings":projected.tolist(),"ideal_plan":ideal.tolist(),"goal_line":[float(goal_amount)]*len(days)},"time_series":{"daily_net_savings":daily_net.tolist(),"daily_income":[daily_income]*len(days),"llm_adjustments":llm_adj.tolist(),"trend_factor":trend.tolist()},"purchase_scores":{"scores":scores,"used_features":used_features},"views":{"week":{"days":days[:7],"projected_savings":projected[:7].tolist() if len(projected)>=7 else projected.tolist(),"ideal_plan":ideal[:7].tolist() if len(ideal)>=7 else ideal.tolist(),"goal_line":[float(goal_amount)]*min(7,len(days))},"month":{"days":days[:30],"projected_savings":projected[:30].tolist() if len(projected)>=30 else projected.tolist(),"ideal_plan":ideal[:30].tolist() if len(ideal)>=30 else ideal.tolist(),"goal_line":[float(goal_amount)]*min(30,len(days))},"full_horizon":{"days":days,"projected_savings":projected.tolist(),"ideal_plan":ideal.tolist(),"goal_line":[float(goal_amount)]*len(days)}}}
def _compute_overall_score_fixed(ideal,projected,current_savings,goal_amount)->int:
    ideal=np.asarray(ideal,dtype=float);projected=np.asarray(projected,dtype=float)
    if ideal.size==0 or projected.size==0:return 0
    base=float(money_correlation_score(ideal,projected));base01=max(0.0,min(1.0,base/1000.0))
    progress_ideal=(ideal[-1]-current_savings)/max(goal_amount-current_savings,1.0)
    progress_projected=(projected[-1]-current_savings)/max(goal_amount-current_savings,1.0)
    final01=0.6*base01+0.4*min(1.0,progress_projected/max(progress_ideal,0.01))
    return int(round(final01*1000))
def _safe_ts_str(v)->str:
    if v is None:return""
    try:
        import datetime as _dt
        if isinstance(v,(int,float)):return str(int(v))
        if isinstance(v,(_dt.datetime,_dt.date)):return v.isoformat()
        return str(v)
    except Exception:return str(v)
def build_purchases_df(payload:Dict[str,Any])->pd.DataFrame:
    if isinstance(payload.get("purchases"),list) and payload["purchases"]:
        df=pd.DataFrame(payload["purchases"]).rename(columns={"purchase_time":"ts","userId":"user_id"})
    else:
        df=pd.DataFrame([payload]).rename(columns={"purchase_time":"ts","userId":"user_id"})
    if"category"not in df.columns:df["category"]=""
    if"description"not in df.columns:df["description"]=""
    if"is_recurring"not in df.columns:df["is_recurring"]=False
    if"user_id"not in df.columns:df["user_id"]=payload.get("userId",0)
    if"ts"not in df.columns:df["ts"]=None
    if"merchant"not in df.columns:df["merchant"]=""
    if"amount"not in df.columns:df["amount"]=0
    df["amount"]=pd.to_numeric(df["amount"],errors="coerce").fillna(0.0)
    if"ts"in df.columns:df=df.sort_values("ts",kind="stable")
    return df[["user_id","ts","merchant","category","amount","is_recurring","description"]]
def _rebase_to_zero(arr_like):
    arr=np.asarray(arr_like,dtype=float)
    if arr.size==0:return arr
    return arr-arr[0]
def _scale_factor_to_goal(arr_like,goal):
    arr=np.asarray(arr_like,dtype=float)
    if arr.size==0:return 1.0
    last=float(arr[-1])
    if last==0.0:return 1.0
    return float(goal)/last
def _compute_overall_score(ideal,projected)->int:
    return _compute_overall_score_fixed(ideal,projected,0,1000)
def _purchase_key(p:Dict[str,Any])->tuple:
    return(str(p.get("ts")),float(p.get("amount") or 0.0),str(p.get("merchant") or ""),str(p.get("category") or ""))
@app.delete("/purchases/cache")
def clear_purchase_cache(x_user_id:int=Header(...,alias="X-User-Id")):
    uid=int(x_user_id);PURCHASE_HISTORY.pop(uid,None)
    try:os.remove(_history_path(uid))
    except FileNotFoundError:pass
    return{"ok":True}
def _normalize_purchase_dict(p:Dict[str,Any])->Dict[str,Any]:
    return{"user_id":int(p.get("user_id") or p.get("userId") or 0),"ts":str(p.get("ts") or p.get("purchase_time") or ""),"merchant":str(p.get("merchant") or ""),"category":str(p.get("category") or ""),"amount":float(p.get("amount") or 0.0),"is_recurring":bool(p.get("is_recurring") or False),"description":str(p.get("description") or "")}
def _history_path(user_id:int)->str:return os.path.join(PURCHASE_CACHE_DIR,f"purchases_{user_id}.jsonl")
def _load_user_history(user_id:int)->List[Dict[str,Any]]:
    if user_id in PURCHASE_HISTORY:return PURCHASE_HISTORY[user_id]
    path=_history_path(user_id);records:List[Dict[str,Any]]=[]
    if os.path.exists(path):
        with open(path,"r",encoding="utf-8") as f:
            for line in f:
                try:records.append(_normalize_purchase_dict(json.loads(line.strip())))
                except Exception:continue
    PURCHASE_HISTORY[user_id]=records;return records
def _save_user_history(user_id:int,records:List[Dict[str,Any]])->None:
    path=_history_path(user_id)
    with open(path,"w",encoding="utf-8") as f:
        for r in records:f.write(json.dumps(r,default=str)+"\n")
    PURCHASE_HISTORY[user_id]=records
def _merge_history(user_id:int,new_records:list[dict])->list[dict]:
    hist=_load_user_history(user_id)
    if not new_records:return hist
    latest=_normalize_purchase_dict(new_records[-1]);latest["ts"]=latest.get("ts") or latest.get("purchase_time")
    if not hist:full=[latest];_save_user_history(user_id,full);return full
    last=hist[-1];last_ts=_safe_ts_str(last.get("ts") or last.get("purchase_time"));new_ts=_safe_ts_str(latest.get("ts"))
    if new_ts and new_ts!=last_ts:full=hist+[latest];_save_user_history(user_id,full);return full
    identical=(float(last.get("amount") or 0.0)==float(latest.get("amount") or 0.0) and str(last.get("merchant") or "")==str(latest.get("merchant") or "") and str(last.get("category") or "")==str(latest.get("category") or "") and str(last.get("description") or "")==str(latest.get("description") or "") and last_ts==new_ts)
    if identical:return hist
    full=hist+[latest];_save_user_history(user_id,full);return full
def _ensure_loaded_model():
    global MODEL
    if MODEL is None:
        MODEL=GBMRegressor()
        MODEL.load(ARTIFACT_DIR)
