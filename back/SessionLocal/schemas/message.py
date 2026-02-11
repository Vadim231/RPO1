from pydantic import BaseModel, ConfigDict
from datetime import datetime

class MessageBase(BaseModel):
    content: str

class MessageCreate(MessageBase):
    chat_id: int

class MessageOut(MessageBase):
    id: int
    sender_id: int
    receiver_id: int
    date_written: datetime
    is_edit: bool = False
    is_reply_message: bool = False
    is_forward_message: bool = False
    reply_to_message_id: Optional[int] = None
    forward_origin_id: Optional[int] = None

    model_config = ConfigDict(from_attributes=True)
