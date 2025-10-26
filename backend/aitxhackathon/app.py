from enum import Enum
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins in development
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)


class MediaType(str, Enum):
    IMAGE = "IMAGE"
    AUDIO = "AUDIO"
    VIDEO = "VIDEO"
    SIMULATION = "SIMULATION"


class SubmitRequest(BaseModel):
    type: MediaType
    correct: bool


# In-memory store for tracking statistics
stats_store = {
    "correct": {
        "IMAGE": 1,
        "AUDIO": 1,
        "VIDEO": 1,
        "SIMULATION": 1
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
    - type: IMAGE, AUDIO, VIDEO, or SIMULATION
    - correct: true or false

    When correct, increments the counter for that media type.
    When incorrect, decrements the counter (minimum 0).

    Returns the current in-memory statistics.
    """
    if request.correct:
        stats_store["correct"][request.type.value] += 1
    else:
        # Decrement but ensure it never goes below 0
        stats_store["correct"][request.type.value] = max(0, stats_store["correct"][request.type.value] - 1)

    return stats_store
