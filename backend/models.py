from pydantic import BaseModel
from typing import Literal
from datetime import datetime
import uuid

class Alert(BaseModel):
    id: str
    ip: str
    timestamp: datetime
    severity: Literal["low", "medium", "high", "critical"]
    threat_type: str
    status: Literal["active", "banned", "ignored"]
    is_read: bool

class AlertAction(BaseModel):
    action: Literal["ban", "ignore"]