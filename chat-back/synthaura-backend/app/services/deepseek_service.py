import httpx
import logging
from typing import Optional

from app.config import settings

class DeepSeekService:
    def __init__(self):
        self.logger = logging.getLogger(__name__)
        self.api_url = settings.DEEPSEEK_API_URL
        self.api_key = settings.DEEPSEEK_API_KEY

    async def get_chat_response(self, message: str) -> Optional[str]:
        """
        Get response from DeepSeek AI
        """
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
        
        payload = {
            "model": "deepseek-chat",
            "messages": [{"role": "user", "content": message}],
            "temperature": 0.7,
            "max_tokens": 1000
        }
        
        async with httpx.AsyncClient(timeout=30.0) as client:
            try:
                response = await client.post(
                    self.api_url,
                    headers=headers,
                    json=payload
                )
                response.raise_for_status()
                return response.json()['choices'][0]['message']['content']
            except Exception as e:
                self.logger.error(f"DeepSeek API error: {str(e)}")
                raise