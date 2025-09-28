import os
from typing import Optional

class Settings:
    def __init__(self):
        self.model_dir = os.getenv("MODEL_DIR", "./model_artifacts")
        self.nessie_api_key = os.getenv("NESSIE_API_KEY", "")
        self.nessie_base_url = os.getenv("NESSIE_BASE_URL", "https://api.nessieisreal.com")
        
        # Database settings
        self.db_host = os.getenv("DB_HOST", "localhost")
        self.db_name = os.getenv("DB_NAME", "ml_service_db")
        self.db_user = os.getenv("DB_USER", "root")
        self.db_password = os.getenv("DB_PASSWORD", "")
        self.db_port = int(os.getenv("DB_PORT", 3306))
        
        # Create directories
        self.planner_dir = os.path.join(self.model_dir, "planner")
        self.personal_dir = os.path.join(self.model_dir, "personal")
        os.makedirs(self.planner_dir, exist_ok=True)
        os.makedirs(self.personal_dir, exist_ok=True)

settings = Settings()

MODEL_DIR = settings.model_dir
PLANNER_DIR = settings.planner_dir
PERSONAL_DIR = settings.personal_dir

