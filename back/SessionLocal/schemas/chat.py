from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
from datetime import datetime

class GroupOut(BaseModel):
    id: int
    title: str
    description: str
    available_reactions: bool
    is_private: bool
    is_history_hidden: bool = False
    creation_date: datetime
    creater_id: int

    model_config = ConfigDict(from_attributes=True)

class GroupCreate(BaseModel):
    title: str
    description: str
    available_reactions: bool
    is_private: bool

class ChannelOut(BaseModel):
    id: int
    title: str
    description: str
    available_reactions: bool
    is_private: bool
    is_verified: bool = False
    creation_date: datetime
    is_signed_message: bool
    comment_chat_id: Optional[int] = None
    creater_id: int

    model_config = ConfigDict(from_attributes=True)

class ChannelCreate(BaseModel):
    title: str
    description: str
    available_reactions: bool
    is_private: bool
    is_signed_message: bool
