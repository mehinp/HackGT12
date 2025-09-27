package com.finance.hackathon.repository;
import com.finance.hackathon.domain.Purchase;

public interface PurchaseRepository {

    Purchase newPurchase(Purchase purchase);
}
