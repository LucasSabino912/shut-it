from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from .database import Base

class Player(Base):
    __tablename__ = "players"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    password
    email = Column(String, unique=True, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    games = relationship("Game", back_populates="player")
    scores = relationship("Score", back_populates="player")

class Game(Base):
    __tablename__ = "games"

    id = Column(Integer, primary_key=True, index=True)
    player_id = Column(Integer, ForeignKey("players.id"))
    
    # Datos de la partida
    status = Column(String)
    mode = Column(String, default="single")
    started_at = Column(DateTime, default=datetime.utcnow)
    finished_at = Column(DateTime, nullable=True)

    player = relationship("Player", back_populates="games")
    score = relationship("Score", back_populates="game", uselist=False)

class Score(Base):
    __tablename__ = "scores"

    id = Column(Integer, primary_key=True, index=True)
    player_id = Column(Integer, ForeignKey("players.id"))
    game_id = Column(Integer, ForeignKey("games.id"))
    
    points = Column(Integer)
    duration_seconds = Column(Float)
    created_at = Column(DateTime, default=datetime.utcnow)

    player = relationship("Player", back_populates="scores")
    game = relationship("Game", back_populates="score")