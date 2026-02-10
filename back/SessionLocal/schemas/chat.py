from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
from datetime import datetime

class ChatBase(BaseModel):
    type: str = Field(..., pattern="^(private|group)$")
    title: Optional[str] = None 

class ChatCreate(ChatBase):
    participant_ids: List[int] 

class ChatOut(ChatBase):
    id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
