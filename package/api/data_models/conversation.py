from pydantic import BaseModel
from typing import Optional, List

class Message(BaseModel):
    role: int
    content: str
    type: str
    
class ConversationEntryData(BaseModel):
    title: str
    type: str
    conversationHistory: List[Message]
