from typing import Dict, List
import asyncio
import logging

from app.schemas.chat import ChatRequest, AIService, AIResponse
from app.services.openai_service import OpenAIService
from app.services.deepseek_service import DeepSeekService

class ChatService:
    def __init__(
        self,
        openai_service: OpenAIService,
        deepseek_service: DeepSeekService
    ):
        self.openai = openai_service
        self.deepseek = deepseek_service
        self.logger = logging.getLogger(__name__)

    async def process_request(self, request: ChatRequest) -> Dict[str, AIResponse]:
        """
        Process chat request with selected AI services
        """
        tasks = []
        
        if AIService.CHATGPT in request.services:
            tasks.append(self._get_openai_response(request.message))
        
        if AIService.DEEPSEEK in request.services:
            tasks.append(self._get_deepseek_response(request.message))
        
        results = await asyncio.gather(*tasks, return_exceptions=True)
        
        return {
            "chatgpt": results[0] if AIService.CHATGPT in request.services else None,
            "deepseek": results[1] if AIService.DEEPSEEK in request.services else None
        }

    async def _get_openai_response(self, message: str) -> AIResponse:
        try:
            response = await self.openai.get_chat_response(message)
            return AIResponse(
                service=AIService.CHATGPT,
                content=response,
                error=None
            )
        except Exception as e:
            self.logger.error(f"OpenAI error: {str(e)}")
            return AIResponse(
                service=AIService.CHATGPT,
                content=None,
                error=str(e)
            )

    async def _get_deepseek_response(self, message: str) -> AIResponse:
        try:
            response = await self.deepseek.get_chat_response(message)
            return AIResponse(
                service=AIService.DEEPSEEK,
                content=response,
                error=None
            )
        except Exception as e:
            self.logger.error(f"DeepSeek error: {str(e)}")
            return AIResponse(
                service=AIService.DEEPSEEK,
                content=None,
                error=str(e)
            )