from pydantic import BaseModel
from typing import List, Optional, Any
import pandas as pd

class ChatRequest(BaseModel):
    query: str

class ChatResponse(BaseModel):
    response: str
    status: str

class PredictionRequest(BaseModel):
    features: List[float]

class PredictionResponse(BaseModel):
    prediction: Any
    confidence: Optional[float]
    status: str

class BatchPredictionResponse(BaseModel):
    predictions: List[Any]
    status: str

class TrainingResponse(BaseModel):
    message: str
    status: str
    accuracy: Optional[float]