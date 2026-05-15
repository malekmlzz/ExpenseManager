import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./expenses.db")
    ALLOWED_ORIGINS: list = ["*"]
    API_VERSION: str = "v1"
    API_PREFIX: str = f"/api/{API_VERSION}"
    DEBUG: bool = os.getenv("DEBUG", "True").lower() == "true"

settings = Settings()
