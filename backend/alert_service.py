import random
import uuid
from datetime import datetime, timezone
from models import Alert

MOCK_IPS = ["8.8.8.8", "1.1.1.1", "192.168.1.254", "104.21.2.1", "142.250.179.110"]
THREATS = ["Brute-force SSH", "Scan de ports", "Injection SQL", "DDoS Attempt", "Malware C2 Communication"]
SEVERITIES = ["low", "medium", "high", "critical"]

def generate_alert() -> Alert:
    return Alert(
        id=str(uuid.uuid4()),
        ip=random.choice(MOCK_IPS),
        timestamp=datetime.now(timezone.utc),
        severity=random.choice(SEVERITIES),
        threat_type=random.choice(THREATS),
        status="active",
        is_read=False
    )