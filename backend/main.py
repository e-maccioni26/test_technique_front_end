import asyncio
import logging
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.encoders import jsonable_encoder

from alert_service import generate_alert, generate_alert_or_error
from models import AlertAction

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="SOC Alerts API")

# Configuration CORS pour autoriser le frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # En prod on mettra l'URL exacte du front
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

active_connections: list[WebSocket] = []

@app.websocket("/ws/alerts")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    active_connections.append(websocket)
    
    initial_alert = generate_alert()
    await websocket.send_json({"type": "alert", "payload": jsonable_encoder(initial_alert)})
 
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        if websocket in active_connections:
            active_connections.remove(websocket)


# Tâche de fond pour émettre les alertes toutes les 15 secondes
async def broadcast_alerts():
    while True:
        await asyncio.sleep(15)
        if not active_connections:
            continue
            
        result = generate_alert_or_error()
        if result["type"] == "alert":
            payload = {"type": "alert", "payload": jsonable_encoder(result["payload"])}
        else:
            payload = {"type": "error", "status_code": result["status_code"], "message": result["message"]}
            logger.warning(f"Simulated ingestion failure: {result['status_code']} - {result['message']}")
 
        for connection in active_connections.copy():
            try:
                await connection.send_json(payload)
            except Exception as e:
                logger.error(f"WebSocket delivery failed: {e}")
                if connection in active_connections:
                    active_connections.remove(connection)

@app.on_event("startup")
async def startup_event():
    asyncio.create_task(broadcast_alerts())
 
@app.post("/api/alerts/{alert_id}/action")
async def handle_alert_action(alert_id: str, action_data: AlertAction):
    await asyncio.sleep(0.5)
    return {"status": "success", "alert_id": alert_id, "action": action_data.action}