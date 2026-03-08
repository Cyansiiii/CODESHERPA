"""
AWS Services for CodeSherpa
- DynamoDB: Persistent conversation memory
- Polly: Hindi/English text-to-speech
- Translate: Real multilingual translation
"""
import boto3
import json
import logging
import asyncio
from datetime import datetime
from app.core.config import settings

logger = logging.getLogger(__name__)

def _make_client(service: str):
    if not settings.AWS_ACCESS_KEY_ID or settings.AWS_ACCESS_KEY_ID == "your_access_key":
        return None
    try:
        return boto3.client(
            service,
            region_name=settings.AWS_REGION,
            aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
            aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY
        )
    except Exception as e:
        logger.error(f"Failed to create {service} client: {e}")
        return None


class DynamoDBService:
    def __init__(self):
        self.client = _make_client("dynamodb")
        self.table_name = settings.DYNAMODB_TABLE_NAME
        self.enabled = False
        if self.client:
            self._ensure_table()

    def _ensure_table(self):
        try:
            self.client.describe_table(TableName=self.table_name)
            self.enabled = True
            logger.info(f"✅ DynamoDB table '{self.table_name}' found.")
        except Exception:
            try:
                self.client.create_table(
                    TableName=self.table_name,
                    KeySchema=[
                        {"AttributeName": "session_id", "KeyType": "HASH"},
                        {"AttributeName": "timestamp", "KeyType": "RANGE"}
                    ],
                    AttributeDefinitions=[
                        {"AttributeName": "session_id", "AttributeType": "S"},
                        {"AttributeName": "timestamp", "AttributeType": "S"}
                    ],
                    BillingMode="PAY_PER_REQUEST"
                )
                self.enabled = True
                logger.info(f"✅ DynamoDB table '{self.table_name}' created.")
            except Exception as e:
                logger.error(f"DynamoDB init failed: {e}")

    async def save_conversation(self, session_id, role, content, agent="general"):
        if not self.enabled:
            return False
        try:
            import time
            loop = asyncio.get_event_loop()
            item = {
                "session_id": {"S": session_id},
                "timestamp": {"N": str(int(time.time() * 1000))},
                "role": {"S": role},
                "content": {"S": str(content)[:4000]},
                "agent": {"S": agent},
                "project": {"S": "CodeSherpa"}
            }
            await loop.run_in_executor(
                None,
                lambda: self.client.put_item(TableName=self.table_name, Item=item)
            )
            return True
        except Exception as e:
            logger.error(f"DynamoDB save failed: {e}")
            return False

    async def get_conversation_history(self, session_id, limit=10):
        if not self.enabled:
            return []
        try:
            loop = asyncio.get_event_loop()
            response = await loop.run_in_executor(
                None,
                lambda: self.client.query(
                    TableName=self.table_name,
                    KeyConditionExpression="session_id = :sid",
                    ExpressionAttributeValues={":sid": {"S": session_id}},
                    ScanIndexForward=False,
                    Limit=limit
                )
            )
            return [
                {"role": i["role"]["S"], "content": i["content"]["S"],
                 "agent": i.get("agent", {}).get("S", "general"),
                 "timestamp": i["timestamp"].get("N", i["timestamp"].get("S"))}
                for i in reversed(response.get("Items", []))
            ]
        except Exception as e:
            logger.error(f"DynamoDB get failed: {e}")
            return []

    def get_status(self):
        return {"enabled": self.enabled, "table": self.table_name if self.enabled else "Not connected"}


class PollyService:
    VOICES = {
        "hindi":    {"id": "Aditi",   "lang": "hi-IN"},
        "english":  {"id": "Raveena", "lang": "en-IN"},
        "hinglish": {"id": "Aditi",   "lang": "hi-IN"},
    }

    def __init__(self):
        self.client = _make_client("polly")
        self.enabled = self.client is not None
        if self.enabled:
            logger.info("✅ AWS Polly initialized")

    async def text_to_speech_base64(self, text, language="hindi"):
        if not self.enabled:
            return None
        try:
            import base64, re as re2
            voice = self.VOICES.get(language.lower(), self.VOICES["english"])
            clean = re2.sub(r'```[\s\S]*?```', 'code block', text)
            clean = re2.sub(r'[*#`_~{}\[\]]', '', clean)
            clean = re2.sub(r'\s+', ' ', clean).strip()[:500]
            if not clean:
                return None
            loop = asyncio.get_event_loop()
            response = await loop.run_in_executor(
                None,
                lambda: self.client.synthesize_speech(
                    Text=clean,
                    OutputFormat="mp3",
                    VoiceId=voice["id"],
                    LanguageCode=voice["lang"],
                    Engine="standard"
                )
            )
            return base64.b64encode(response["AudioStream"].read()).decode("utf-8")
        except Exception as e:
            logger.error(f"Polly failed: {e}")
            return None

    def get_status(self):
        return {"enabled": self.enabled, "voices": list(self.VOICES.keys())}


class TranslateService:
    LANGUAGE_CODES = {
        "hindi": "hi", "english": "en",
        "tamil": "ta", "bengali": "bn", "hinglish": "hi"
    }

    def __init__(self):
        self.client = _make_client("translate")
        self.enabled = self.client is not None
        if self.enabled:
            logger.info("✅ AWS Translate initialized")

    async def translate(self, text, target_language="hindi", source_language="auto"):
        if not self.enabled:
            return text
        target_code = self.LANGUAGE_CODES.get(target_language.lower(), "hi")
        source_code = "auto" if source_language == "auto" else self.LANGUAGE_CODES.get(source_language.lower(), "en")
        try:
            loop = asyncio.get_event_loop()
            response = await loop.run_in_executor(
                None,
                lambda: self.client.translate_text(
                    Text=text[:5000],
                    SourceLanguageCode=source_code,
                    TargetLanguageCode=target_code
                )
            )
            return response["TranslatedText"]
        except Exception as e:
            logger.error(f"Translate failed: {e}")
            return text

    def get_status(self):
        return {"enabled": self.enabled, "languages": list(self.LANGUAGE_CODES.keys())}


class AWSServices:
    def __init__(self):
        self.dynamodb = DynamoDBService()
        self.polly = PollyService()
        self.translate = TranslateService()

    def get_status(self):
        return {
            "dynamodb": self.dynamodb.get_status(),
            "polly": self.polly.get_status(),
            "translate": self.translate.get_status()
        }


aws_services = AWSServices()
