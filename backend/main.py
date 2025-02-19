import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional

app = FastAPI()

# CORS: Allow frontend (React) to talk to backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change this in production (e.g., ["http://localhost:5173"])
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Define a model for reviews
class Review(BaseModel):
    author: str
    rating: float
    text: str
    timestamp: Optional[str] = None
    place_id: str

@app.post("/reviews/")
async def receive_reviews(reviews: List[Review]):
    """
    Receive reviews from frontend and process/store them.
    """
    # Here, you could add database storage logic
    print(f"Received {len(reviews)} reviews")  # Debugging
    return {"message": "Reviews received", "count": len(reviews)}

@app.post("/places/")
async def receive_places(places: List[str]):
    """
    Receive a place_id from frontend and process/store it.
    """
    # Here, you could add database storage logic
    print(f"Received {len(places)} place ids. First one: {places[0]}")  # Debugging
    return {"message": "Places received", "count": len(places)}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
