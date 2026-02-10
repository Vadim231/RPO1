from pydantic import BaseModel, ConfigDict
from datetime import datetime

class MessageBase(BaseModel):
    content: str

class MessageCreate(MessageBase):
    chat_id: int

class MessageOut(MessageBase):
    id: int
    sender_id: int
    chat_id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
