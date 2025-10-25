from enum import Enum
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()


class MediaType(str, Enum):
    IMAGE = "IMAGE"
    AUDIO = "AUDIO"


class SubmitRequest(BaseModel):
    type: MediaType
    correct: bool


# In-memory store for tracking statistics
stats_store = {
    "correct": {
        "IMAGE": 0,
        "AUDIO": 0
    },
    "incorrect": {
        "IMAGE": 0,
        "AUDIO": 0
    }
}


@app.get("/")
async def root():
    return {"message": "Hello World"}


@app.get("/health")
async def health_check():
    return {"status": "healthy"}


@app.post("/submit")
async def submit(request: SubmitRequest):
    """
    Track media type responses and return current statistics.

    Accepts JSON with:
    - type: IMAGE or AUDIO
    - correct: true or false

    Returns the current in-memory statistics.
    """
    category = "correct" if request.correct else "incorrect"
    stats_store[category][request.type.value] += 1

    return stats_store
