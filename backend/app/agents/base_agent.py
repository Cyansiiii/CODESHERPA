from abc import ABC, abstractmethod
from app.services.bedrock_service import bedrock_client
from app.services.aws_services import aws_services
from app.core.redis_client import redis_client
import json
import logging

logger = logging.getLogger(__name__)

class BaseAgent(ABC):
    def __init__(self, agent_name: str):
        self.agent_name = agent_name
        self.bedrock = bedrock_client
        self.redis = redis_client
        self.aws = aws_services

    async def save_context(self, session_id: str, key: str, value: any, expire: int = 3600):
        """Saves context to Redis (Short-term memory)"""
        full_key = f"agent:{self.agent_name}:{session_id}:{key}"
        await self.redis.set(full_key, json.dumps(value), ex=expire)

    async def get_context(self, session_id: str, key: str):
        """Retrieves context from Redis"""
        full_key = f"agent:{self.agent_name}:{session_id}:{key}"
        data = await self.redis.get(full_key)
        return json.loads(data) if data else None

    async def call_claude(self, prompt: str, system_prompt: str = None, temperature: float = 0.5, provider: str = None):
        """Wrapper to call AI with agent-specific logging"""
        logger.info(f"Agent {self.agent_name} invoking {provider or self.bedrock.current_provider}...")
        return await self.bedrock.invoke_claude(prompt, system_prompt, temperature=temperature, provider=provider)

    async def save_to_memory(self, session_id: str, role: str, content: str):
        await self.aws.dynamodb.save_conversation(
            session_id=session_id,
            role=role,
            content=content if isinstance(content, str) else json.dumps(content),
            agent=self.agent_name
        )

    async def get_memory(self, session_id: str, limit: int = 5):
        """Retrieves conversation history from DynamoDB"""
        return await self.aws.dynamodb.get_conversation_history(session_id, limit=limit)

    async def translate_response(self, text: str, target_language: str = "english") -> str:
        if target_language.lower() in ["english", "en"]:
            return text
        return await self.aws.translate.translate(text, target_language)

    async def speak(self, text: str, language: str = "hindi"):
        return await self.aws.polly.text_to_speech_base64(text, language)

    @abstractmethod
    async def process(self, input_data: dict, session_id: str) -> dict:
        """Main entry point for the agent"""
        pass
