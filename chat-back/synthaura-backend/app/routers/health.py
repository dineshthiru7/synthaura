from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from redis import Redis
import httpx

from app.database.session import get_db, get_redis
from app.schemas.health import HealthCheck, HealthStatus

router = APIRouter()

@router.get("/health", response_model=HealthCheck)
async def health_check(
    db: Session = Depends(get_db),
    redis: Redis = Depends(get_redis)
):
    db_status = HealthStatus.HEALTHY
    redis_status = HealthStatus.HEALTHY
    external_api_status = HealthStatus.HEALTHY

    # Check DB
    try:
        db.execute("SELECT 1")
    except Exception:
        db_status = HealthStatus.UNHEALTHY

    # Check Redis
    try:
        redis.ping()
    except Exception:
        redis_status = HealthStatus.UNHEALTHY

    # Check external APIs
    try:
        async with httpx.AsyncClient() as client:
            await client.get("https://api.openai.com/v1/models", timeout=5.0)
    except Exception:
        external_api_status = HealthStatus.DEGRADED

    return {
        "status": (
            HealthStatus.HEALTHY 
            if all(s == HealthStatus.HEALTHY for s in [db_status, redis_status]) 
            else HealthStatus.DEGRADED
        ),
        "services": {
            "database": db_status,
            "redis": redis_status,
            "external_apis": external_api_status
        }
    }