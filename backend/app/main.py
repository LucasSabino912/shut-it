from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine
from . import models
from .routers import game

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Shut The Box API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"], # Tu Front en React
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(game.router, prefix="/api", tags=["Game"])

@app.get("/")
def health_check():
    return {"status": "ok", "message": "Server is running"}