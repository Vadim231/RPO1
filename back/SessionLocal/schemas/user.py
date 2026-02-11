from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
from datetime import datetime

class UserBase(BaseModel):
    phone_number: str = Field(..., description="Unique phone number of the user")
    username: Optional[str] = None
    first_name: str
    last_name: Optional[str] = None

class UserCreate(UserBase):
    password: str = Field(..., min_length=6)

class UserOut(UserBase):
    id: int
    bio: Optional[str] = None
    is_premium: bool
    last_online_timestamp: Optional[datetime] = None
    
    model_config = ConfigDict(from_attributes=True)

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    phone_number: Optional[str] = None
