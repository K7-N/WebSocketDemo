import asyncio
import websockets
import json
import uuid
import time

url = "0.0.0.0"

connected_clients = {}
lastMessage = {}

async def handler(websocket):
    hm = {}
    client_id = str(uuid.uuid4())
    lastMessage[client_id] = 0
    connected_clients[client_id] = websocket
    print(f"Client {client_id} : connected")
    asyncio.create_task(send_message_to_client(client_id, "Connected ID: " + client_id ))
    try:
        async for message in websocket:
            ctime = int(time.time())
            if(ctime - lastMessage[client_id] < 10):
                asyncio.create_task(send_message_to_client(client_id, "Rate Limited: You can only send one message per 10 Second"))
                continue
            if(client_id not in hm):
                if(len(message) > 25):
                    asyncio.create_task(send_message_to_client(client_id, "Name too long: Your first message is your username and must be less than or equal to 25 characters"))
                    continue
                hm[client_id] = message
                continue
            m1 = hm[client_id] + " : " + message
            lastMessage[client_id] = ctime
            websockets.broadcast(connected_clients.values(), m1)

    except websockets.exceptions.ConnectionClosed as e:
        print(f"Client {client_id} disconnected: {e}")

    finally:
        del connected_clients[client_id]
        print(f"Client {client_id} disconnected and removed from the list")

async def send_message_to_client(client_id, message):
    if client_id in connected_clients:
        await connected_clients[client_id].send(message)
        print("Message Sent to Client")
async def main():
    async with websockets.serve(handler, url, 8080):
        print(f"WebSocket server started on ws://{url}:8080")
        await asyncio.Future()  

asyncio.run(main())