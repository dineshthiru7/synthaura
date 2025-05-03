from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import logging

from app.config import settings
from app.routers import chat, health
from app.utils.logging import configure_logging

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Backend for Voice-to-Chat AI Application",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json"
)

# Setup CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
configure_logging(settings.LOG_LEVEL)

# Include routers
app.include_router(health.router, prefix=settings.API_V1_STR)
app.include_router(chat.router, prefix=settings.API_V1_STR)

@app.on_event("startup")
async def startup_event():
    logging.info("Starting up application...")

@app.on_event("shutdown")
async def shutdown_event():
    logging.info("Shutting down application...")