from fastapi import Depends
from redis import Redis
from sqlalchemy.orm import Session

from app.services.chat_service import ChatService
from app.services.openai_service import OpenAIService
from app.services.deepseek_service import DeepSeekService
from app.database.session import get_db, get_redis

def get_openai_service() -> OpenAIService:
    return OpenAIService()

def get_deepseek_service() -> DeepSeekService:
    return DeepSeekService()

def get_chat_service(
    openai_service: OpenAIService = Depends(get_openai_service),
    deepseek_service: DeepSeekService = Depends(get_deepseek_service),
) -> ChatService:
    return ChatService(openai_service, deepseek_service)

def get_current_active_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):
    # Implement your user authentication logic
    pass