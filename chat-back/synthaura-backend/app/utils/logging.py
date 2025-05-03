import logging
import sys
from logging.config import dictConfig
from pathlib import Path

from app.config import settings

def configure_logging(log_level: str = "INFO"):
    """Configure logging for the application"""
    
    logs_dir = Path("logs")
    logs_dir.mkdir(exist_ok=True)
    
    log_config = {
        "version": 1,
        "disable_existing_loggers": False,
        "formatters": {
            "default": {
                "()": "uvicorn.logging.DefaultFormatter",
                "fmt": "%(levelprefix)s %(asctime)s - %(name)s - %(message)s",
                "datefmt": "%Y-%m-%d %H:%M:%S",
            },
            "access": {
                "()": "uvicorn.logging.AccessFormatter",
                "fmt": '%(levelprefix)s %(asctime)s - %(client_addr)s - "%(request_line)s" %(status_code)s',
            },
        },
        "handlers": {
            "console": {
                "class": "logging.StreamHandler",
                "formatter": "default",
                "stream": sys.stdout,
            },
            "file": {
                "class": "logging.handlers.RotatingFileHandler",
                "formatter": "default",
                "filename": "logs/app.log",
                "maxBytes": 10485760,  # 10MB
                "backupCount": 5,
            },
            "error_file": {
                "class": "logging.handlers.RotatingFileHandler",
                "formatter": "default",
                "filename": "logs/error.log",
                "maxBytes": 10485760,
                "backupCount": 5,
                "level": "ERROR",
            },
        },
        "loggers": {
            "app": {
                "handlers": ["console", "file", "error_file"],
                "level": log_level,
                "propagate": False,
            },
            "uvicorn.error": {
                "handlers": ["console", "file", "error_file"],
                "level": log_level,
                "propagate": False,
            },
            "uvicorn.access": {
                "handlers": ["console", "file"],
                "level": log_level,
                "propagate": False,
            },
        },
    }
    
    dictConfig(log_config)
    logging.getLogger("httpx").setLevel(logging.WARNING)
    logging.getLogger("openai").setLevel(logging.WARNING)