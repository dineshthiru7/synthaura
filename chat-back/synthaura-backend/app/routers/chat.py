from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from typing import List

from app.schemas.chat import ChatRequest, ChatResponse, AIService
from app.services.chat_service import ChatService
from app.utils.security import validate_token

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

@router.post("/chat", response_model=ChatResponse)
async def chat_with_ai(
    request: ChatRequest,
    token: str = Depends(oauth2_scheme),
    chat_service: ChatService = Depends()
):
    """
    Process voice transcript and get responses from selected AI services
    """
    # Validate token
    await validate_token(token)
    
    try:
        results = await chat_service.process_request(request)
        return ChatResponse(
            success=True,
            message="AI responses generated",
            data=results
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error processing request: {str(e)}"
        )