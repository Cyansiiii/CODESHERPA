from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.agents.orchestrator import OrchestratorAgent
from app.api.endpoints import github, whatsapp
from pydantic import BaseModel
from app.services.aws_services import aws_services
import logging

import json

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("CodeSherpa")

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, replace with specific frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Orchestrator
orchestrator = OrchestratorAgent()

MAX_ATTACHMENT_CHARS = 12000
MAX_ATTACHMENTS = 3


def prepare_payload(payload: dict) -> dict:
    """
    Merge optional text attachments into code_context so existing agents
    can review attached code/files without changing orchestrator contracts.
    Expected attachment format:
    {
      "name": "file.py",
      "content": "...text..."
    }
    """
    normalized = dict(payload or {})
    attachments = normalized.get("attachments") or []

    if not isinstance(attachments, list) or not attachments:
        return normalized

    context_blocks: list[str] = []
    for attachment in attachments[:MAX_ATTACHMENTS]:
        if not isinstance(attachment, dict):
            continue

        name = str(attachment.get("name") or "attachment.txt")
        content = str(attachment.get("content") or "").strip()
        if not content:
            continue

        if len(content) > MAX_ATTACHMENT_CHARS:
            content = (
                content[:MAX_ATTACHMENT_CHARS]
                + "\n\n...[truncated for length]..."
            )

        context_blocks.append(f"File: {name}\n{content}")

    if context_blocks:
        merged_context = "\n\n".join(context_blocks)
        existing_context = str(normalized.get("code_context") or "").strip()
        normalized["code_context"] = (
            f"{existing_context}\n\n{merged_context}".strip()
            if existing_context
            else merged_context
        )

        if not str(normalized.get("message") or "").strip():
            normalized["message"] = "Please review the attached file."

    return normalized

# Include Routers
app.include_router(github.router, prefix="/api/github", tags=["github"])
app.include_router(whatsapp.router, prefix="/api/whatsapp", tags=["whatsapp"])

@app.get("/health")
def health_check():
    from app.services.bedrock_service import bedrock_client
    return {
        "status": "ok", 
        "service": "CodeSherpa Backend",
        "active_model": bedrock_client.current_provider,
        "available_models": list(bedrock_client.get_available_models().keys())
    }

@app.get("/api/aws-status")
def aws_status():
    return {
        "aws_infrastructure": aws_services.get_status(),
        "active_llm": orchestrator.review_monk.bedrock.current_provider,
        "available_models": orchestrator.review_monk.bedrock.get_available_models(),
        "message": "CodeSherpa runs on AWS infrastructure"
    }

@app.get("/api/models")
def get_models():
    return {
        "active": orchestrator.review_monk.bedrock.current_provider,
        "available": orchestrator.review_monk.bedrock.get_available_models()
    }

@app.post("/api/models/switch")
def switch_model(payload: dict):
    provider = payload.get("provider")
    success = orchestrator.review_monk.bedrock.set_provider(provider)
    orchestrator.codebase_sherpa.bedrock.set_provider(provider)
    orchestrator.bedrock.set_provider(provider)
    if success:
        return {"status": "switched", "active": provider}
    return {"status": "error", "message": f"Provider not available",
            "available": orchestrator.review_monk.bedrock.get_available_models()}

@app.post("/api/models/key")
def update_provider_key(payload: dict):
    provider = payload.get("provider")
    key = payload.get("key")
    if provider and key:
        orchestrator.review_monk.bedrock.update_api_key(provider, key)
        orchestrator.codebase_sherpa.bedrock.update_api_key(provider, key)
        orchestrator.bedrock.update_api_key(provider, key)
        return {"status": "success", "message": f"Updated key for {provider}"}
    return {"status": "error", "message": "Provider and key required"}

@app.post("/api/chat")
async def chat_endpoint(payload: dict):
    """
    Standard HTTP endpoint for chat
    Payload: {"message": "...", "session_id": "...", "code_context": "..."}
    """
    try:
        normalized_payload = prepare_payload(payload)
        session_id = normalized_payload.get("session_id", "default_session")
        response = await orchestrator.process(normalized_payload, session_id)
        return response
    except Exception as e:
        logger.error(f"Chat error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# WebSocket Connection Manager
class ConnectionManager:
    def __init__(self):
        self.active_connections: list[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def send_personal_message(self, message: str, websocket: WebSocket):
        await websocket.send_text(message)

    async def broadcast(self, message: str):
        for connection in self.active_connections:
            await connection.send_text(message)

manager = ConnectionManager()

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            # Expecting JSON string
            try:
                payload = json.loads(data)
                normalized_payload = prepare_payload(payload)
                session_id = normalized_payload.get("session_id", "ws_session")
                
                # Send "Processing..." status
                await manager.send_personal_message(json.dumps({"type": "status", "content": "thinking"}), websocket)
                
                # Process with Orchestrator
                response = await orchestrator.process(normalized_payload, session_id)
                
                # Send response
                await manager.send_personal_message(json.dumps({"type": "response", "content": response}), websocket)
                
            except json.JSONDecodeError:
                await manager.send_personal_message(json.dumps({"error": "Invalid JSON"}), websocket)
                
    except WebSocketDisconnect:
        manager.disconnect(websocket)
    except Exception as e:
        logger.error(f"WebSocket Error: {e}")
        try:
            await manager.send_personal_message(json.dumps({"error": str(e)}), websocket)
        except:
            pass

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
