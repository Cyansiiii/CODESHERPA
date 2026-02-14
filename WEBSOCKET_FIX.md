# 🔧 WebSocket Connection Fix

## Problem Identified

The WebSocket connection was failing with error:
```
WebSocket connection to 'ws://localhost:8000/ws' failed
```

## Root Causes

1. **Missing WebSocket Library**
   - Error: `No supported WebSocket library detected`
   - Uvicorn needs `[standard]` extras for WebSocket support

2. **404 on /ws endpoint**
   - Backend was returning 404 for WebSocket connections
   - Caused by missing WebSocket dependencies

## Solution Applied

### 1. Updated requirements.txt

Changed from:
```
uvicorn
```

To:
```
uvicorn[standard]
websockets
```

This installs:
- `uvicorn[standard]` - Includes WebSocket support
- `websockets` - WebSocket protocol implementation
- Additional dependencies: `httptools`, `uvloop`, `watchfiles`

### 2. Rebuilt Docker Containers

```bash
docker compose down
docker compose up --build
```

## Verification Steps

Once Docker build completes, verify:

### 1. Check Backend Logs
```bash
docker compose logs backend | grep -i websocket
```

Should NOT show:
- ❌ "No supported WebSocket library detected"
- ❌ "Unsupported upgrade request"

### 2. Test WebSocket Endpoint

**Option A: Using wscat (if installed)**
```bash
npm install -g wscat
wscat -c ws://localhost:8000/ws
```

**Option B: Using Python**
```python
import asyncio
import websockets
import json

async def test():
    uri = "ws://localhost:8000/ws"
    async with websockets.connect(uri) as websocket:
        # Send test message
        await websocket.send(json.dumps({
            "message": "test",
            "session_id": "test123"
        }))
        
        # Receive response
        response = await websocket.recv()
        print(f"Received: {response}")

asyncio.run(test())
```

**Option C: Browser Console**
```javascript
const ws = new WebSocket('ws://localhost:8000/ws');

ws.onopen = () => {
    console.log('Connected!');
    ws.send(JSON.stringify({
        message: "Namaste demo",
        session_id: "test"
    }));
};

ws.onmessage = (event) => {
    console.log('Received:', JSON.parse(event.data));
};

ws.onerror = (error) => {
    console.error('WebSocket error:', error);
};
```

### 3. Test Frontend Connection

1. Open http://localhost:3000
2. Open browser DevTools (F12)
3. Go to Console tab
4. Should see: "Connected to CodeSherpa Backend"
5. Should NOT see: "WebSocket connection failed"

### 4. Test Chat Functionality

1. Type "Namaste demo" in chat
2. Should see:
   - Typing indicator (three dots)
   - Response with Hindi explanation
3. Type "Review demo"
4. Should see:
   - Sample PR review with findings

## Common Issues & Fixes

### Issue 1: Still Getting 404

**Check:**
```bash
# Verify WebSocket endpoint exists
curl -i -N -H "Connection: Upgrade" -H "Upgrade: websocket" \
  -H "Sec-WebSocket-Version: 13" -H "Sec-WebSocket-Key: test" \
  http://localhost:8000/ws
```

**Expected:** HTTP 101 Switching Protocols (not 404)

**If still 404:**
- Restart backend: `docker compose restart backend`
- Check logs: `docker compose logs backend`

### Issue 2: Connection Refused

**Check if backend is running:**
```bash
docker compose ps
curl http://localhost:8000/health
```

**If not running:**
```bash
docker compose up backend
```

### Issue 3: CORS Error

**Check backend logs for:**
```
Access to WebSocket at 'ws://localhost:8000/ws' from origin 'http://localhost:3000' 
has been blocked by CORS policy
```

**Fix:** Already configured in `main.py`:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Issue 4: Port Already in Use

**Error:** `Address already in use`

**Fix:**
```bash
# Find process using port 8000
lsof -i :8000

# Kill it
kill -9 <PID>

# Or use different port in docker-compose.yml
ports:
  - "8001:8000"
```

## Architecture Overview

```
Browser (localhost:3000)
    │
    │ WebSocket Connection
    │ ws://localhost:8000/ws
    │
    ▼
FastAPI Backend (localhost:8000)
    │
    ├─ @app.websocket("/ws")
    │   └─ ConnectionManager
    │       ├─ connect()
    │       ├─ disconnect()
    │       └─ send_personal_message()
    │
    └─ OrchestratorAgent
        ├─ Review Monk Agent
        └─ Codebase Sherpa Agent
```

## WebSocket Message Flow

### 1. Client Connects
```javascript
ws = new WebSocket('ws://localhost:8000/ws')
```

### 2. Client Sends Message
```javascript
ws.send(JSON.stringify({
    message: "Namaste demo",
    session_id: "demo-session-1"
}))
```

### 3. Server Processes
```python
# Receive message
data = await websocket.receive_text()
payload = json.loads(data)

# Send status
await manager.send_personal_message(
    json.dumps({"type": "status", "content": "thinking"}),
    websocket
)

# Process with agent
response = await orchestrator.process(payload, session_id)

# Send response
await manager.send_personal_message(
    json.dumps({"type": "response", "content": response}),
    websocket
)
```

### 4. Client Receives Response
```javascript
ws.onmessage = (event) => {
    const data = JSON.parse(event.data)
    
    if (data.type === 'status') {
        // Show typing indicator
    } else if (data.type === 'response') {
        // Display agent response
    }
}
```

## Expected Behavior

### Successful Connection
```
Console Output:
✅ Connected to CodeSherpa Backend
✅ Connection status: Online

Network Tab (WS):
✅ Status: 101 Switching Protocols
✅ Type: websocket
✅ Messages: Sent/Received
```

### Failed Connection
```
Console Output:
❌ WebSocket connection to 'ws://localhost:8000/ws' failed
❌ Connection status: Disconnected

Network Tab (WS):
❌ Status: 404 Not Found
❌ Type: (failed)
```

## Testing Checklist

- [ ] Docker containers running (`docker compose ps`)
- [ ] Backend health check OK (`curl http://localhost:8000/health`)
- [ ] No WebSocket errors in backend logs
- [ ] Frontend loads at http://localhost:3000
- [ ] Browser console shows "Connected"
- [ ] Connection status shows "Online" (green dot)
- [ ] Can send messages
- [ ] Typing indicator appears
- [ ] Responses are received
- [ ] "Namaste demo" works
- [ ] "Review demo" works

## Quick Debug Commands

```bash
# Check all services
docker compose ps

# View backend logs
docker compose logs backend -f

# View frontend logs
docker compose logs frontend -f

# Restart backend only
docker compose restart backend

# Rebuild backend only
docker compose build backend
docker compose up -d backend

# Full restart
docker compose down
docker compose up --build
```

## Success Indicators

When everything is working:

1. **Backend logs show:**
   ```
   INFO:     Uvicorn running on http://0.0.0.0:8000
   INFO:     Application startup complete
   ```

2. **No errors about:**
   - WebSocket library
   - Unsupported upgrade
   - 404 on /ws

3. **Frontend shows:**
   - Green dot (Online)
   - "Connected to CodeSherpa Backend"
   - Messages send and receive

4. **Network tab shows:**
   - WebSocket connection (101 status)
   - Messages flowing both ways

---

**Status:** Fix applied, rebuilding containers...

**Next:** Wait for `docker compose up --build` to complete, then test!
