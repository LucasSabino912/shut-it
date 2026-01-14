from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Table
from sqlalchemy.orm import relationship
from datetime import datetime
from .database import Base

game_participants = Table(
    "game_participants",
    Base.metadata,
    Column("player_id", Integer, ForeignKey("players.id"), primary_key=True),
    Column("game_id", Integer, ForeignKey("games.id"), primary_key=True),
    Column("joined_at", DateTime, default=datetime.utcnow)
)

class Player(Base):
    __tablename__ = "players"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True, nullable=True)
    avatar_url = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    hosted_games = relationship("Game", back_populates="host")
    games = relationship("Game", secondary=game_participants, back_populates="players")
    scores = relationship("Score", back_populates="player")

class Game(Base):
    __tablename__ = "games"
    id = Column(Integer, primary_key=True, index=True)
    host_id = Column(Integer, ForeignKey("players.id"))
    status = Column(String, default="waiting")
    mode = Column(String, default="multiplayer")
    started_at = Column(DateTime, default=datetime.utcnow)
    finished_at = Column(DateTime, nullable=True)
    tile_count = Column(Integer, default=9) # Puede ser 9 a 12
    host = relationship("Player", back_populates="hosted_games")
    players = relationship("Player", secondary=game_participants, back_populates="games")
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