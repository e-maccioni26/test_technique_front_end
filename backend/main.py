import asyncio
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from alert_service import generate_alert
from models import AlertAction

app = FastAPI(title="SOC Alerts API")

# Configuration CORS pour autoriser le frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # En prod, mettre l'URL exacte du front
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

active_connections: list[WebSocket] = []

@app.websocket("/ws/alerts")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    active_connections.append(websocket)
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        active_connections.remove(websocket)

# Tâche de fond pour émettre les alertes toutes les 15 secondes
async def broadcast_alerts():
    while True:
        await asyncio.sleep(15)
        if active_connections:
            new_alert = generate_alert()
            for connection in active_connections:
                try:
                    await connection.send_json(new_alert.dict())
                except Exception:
                    pass

@app.on_event("startup")
async def startup_event():
    asyncio.create_task(broadcast_alerts())

@app.post("/api/alerts/{alert_id}/action")
async def handle_alert_action(alert_id: str, action_data: AlertAction):
    
    await asyncio.sleep(0.5)
    return {"status": "success", "alert_id": alert_id, "action": action_data.action}