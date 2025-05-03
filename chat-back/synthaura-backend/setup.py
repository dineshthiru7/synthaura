from setuptools import setup, find_packages

setup(
    name="ai-voice-backend",
    version="1.0.0",
    packages=find_packages(),
    install_requires=[
        "fastapi>=0.95.0",
        "uvicorn>=0.22.0",
        "python-dotenv>=1.0.0",
        "openai>=0.27.0",
        "httpx>=0.23.0",
        "psycopg2-binary>=2.9.0",
        "alembic>=1.11.0",
        "python-jose>=3.3.0",
        "passlib>=1.7.0",
        "redis>=4.5.0",
    ],
    extras_require={
        "dev": [
            "pytest>=7.0.0",
            "pytest-asyncio>=0.20.0",
            "httpx>=0.23.0",
            "black>=22.0",
            "flake8>=4.0.0",
            "mypy>=0.950",
        ],
    },
    entry_points={
        "console_scripts": [
            "ai-voice-backend=app.main:app",
        ],
    },
)