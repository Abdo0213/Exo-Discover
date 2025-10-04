from app.models.ml_model import MLModel
from app.models.schemas import PredictionResponse, BatchPredictionResponse
import pandas as pd

class ModelService:
    def __init__(self):
        self.ml_model = MLModel()
    
    async def predict_single(self, features: list) -> PredictionResponse:
        """Make prediction for single input"""
        try:
            prediction = self.ml_model.predict(features)
            
            if prediction is not None:
                return PredictionResponse(
                    prediction=prediction,
                    confidence=0.95,  # You can calculate actual confidence
                    status="success"
                )
            else:
                return PredictionResponse(
                    prediction=None,
                    confidence=0.0,
                    status="error"
                )
        except Exception as e:
            return PredictionResponse(
                prediction=None,
                confidence=0.0,
                status=f"error: {str(e)}"
            )
    
    async def predict_batch(self, features_list: list) -> BatchPredictionResponse:
        """Make predictions for batch inputs"""
        try:
            predictions = self.ml_model.predict_batch(features_list)
            
            return BatchPredictionResponse(
                predictions=predictions,
                status="success"
            )
        except Exception as e:
            return BatchPredictionResponse(
                predictions=[],
                status=f"error: {str(e)}"
            )