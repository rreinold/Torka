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
        "IMAGE": 10,
        "AUDIO": 7,
        "VIDEO": 0,
        "SIMULATION": 0
    },
    "incorrect": {
        "IMAGE": 10,
        "AUDIO": 7,
        "VIDEO": 0,
        "SIMULATION": 0
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
