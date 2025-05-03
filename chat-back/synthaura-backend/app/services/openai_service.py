import openai
import logging
from typing import Optional

from app.config import settings

class OpenAIService:
    def __init__(self):
        self.logger = logging.getLogger(__name__)
        openai.api_key = settings.OPENAI_API_KEY

    async def get_chat_response(self, message: str) -> Optional[str]:
        """
        Get response from OpenAI's ChatGPT 3.5
        """
        try:
            response = await openai.ChatCompletion.acreate(
                model="gpt-3.5-turbo",
                messages=[{"role": "user", "content": message}],
                temperature=0.7,
                max_tokens=1000
            )
            return response.choices[0].message['content']
        except Exception as e:
            self.logger.error(f"OpenAI API error: {str(e)}")
            raise