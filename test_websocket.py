#!/usr/bin/env python3
"""
Quick WebSocket test for CodeSherpa
"""
import asyncio
import json

try:
    import websockets
except ImportError:
    print("Installing websockets...")
    import subprocess
    subprocess.check_call(["pip3", "install", "websockets"])
    import websockets

async def test_websocket():
    uri = "ws://localhost:8000/ws"
    print(f"🔌 Connecting to {uri}...")
    
    try:
        async with websockets.connect(uri) as websocket:
            print("✅ Connected successfully!")
            
            # Test 1: Namaste demo
            print("\n📤 Sending: 'Namaste demo'")
            await websocket.send(json.dumps({
                "message": "Namaste demo",
                "session_id": "test_session"
            }))
            
            # Receive status
            status_msg = await websocket.recv()
            status_data = json.loads(status_msg)
            print(f"📥 Status: {status_data}")
            
            # Receive response
            response_msg = await websocket.recv()
            response_data = json.loads(response_msg)
            print(f"📥 Response: {json.dumps(response_data, indent=2)}")
            
            print("\n✅ WebSocket test PASSED!")
            return True
            
    except Exception as e:
        print(f"❌ WebSocket test FAILED: {e}")
        return False

if __name__ == "__main__":
    result = asyncio.run(test_websocket())
    exit(0 if result else 1)
