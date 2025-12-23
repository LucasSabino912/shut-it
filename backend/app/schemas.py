from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List

# Player schemmas
class PlayerBase(BaseModel):
  username: str

class PlayerCreate(PlayerBase):
  pass # Solo pido el user por ahora

