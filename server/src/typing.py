from typing import List

from pydantic import BaseModel


class ClientMessage(BaseModel):
    role: str
    content: str


class Request(BaseModel):
    messages: List[ClientMessage]
