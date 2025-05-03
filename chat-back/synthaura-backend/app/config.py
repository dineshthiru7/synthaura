import os
from pydantic import BaseSettings, AnyUrl

class Settings(BaseSettings):
    PROJECT_NAME: str = "AI Voice Backend"
    API_V1_STR: str = "/api/v1"
    
    OPENAI_API_KEY: str

    DEEPSEEK_API_KEY: str = "sk-e022a5db7bce435986987e166abfd9ef"
    DEEPSEEK_API_URL: str = "https://api.deepseek.com/v1/chat/completions"
    
    DATABASE_URL: AnyUrl = "postgresql://postgres:postgres@db:5432/aivoice"
    
    LOG_LEVEL: str = "INFO"
    CORS_ORIGINS: list = ["*"]
    
    class Config:
        case_sensitive = True
        env_file = ".env"

settings = Settings()