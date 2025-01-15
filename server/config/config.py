from dotenv import load_dotenv
import os
from datetime import datetime, timedelta

load_dotenv()

config = {
    "DATACUBE_API_KEY": str(os.getenv("DATACUBE_API_KEY")),
    "FLIGHT_SERVICE_APP_ID": str(os.getenv('FLIGHT_SERVICE_APP_ID')),
    "FLIGHT_SERVICE_APP_KEY" : str(os.getenv('FLIGHT_SERVICE_APP_KEY')),
    'JWT_SECRET_KEY': os.getenv("JWT_SECRET_KEY", "voc"),
    'JWT_ALGORITHM': os.getenv("JWT_ALGORITHM", "HS256"),
    'JWT_ALLOW_REFRESH': True,
    'JWT_EXPIRATION_DELTA': timedelta(days=2),
    'JWT_REFRESH_EXPIRATION_DELTA': timedelta(days=7),
    'FRONTEND_URL':str(os.getenv("FRONTEND_URL")),
    "SAVE_QRCODE": os.getenv("SAVE_QRCODE", "False").lower() == "true",
}

print(config)
