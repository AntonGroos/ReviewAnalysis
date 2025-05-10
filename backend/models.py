from pydantic import BaseModel
from typing import List, Optional

# Define a model for reviews
class Review(BaseModel):
    author: str
    rating: float
    text: str
    timestamp: Optional[str] = None
    place_id: str