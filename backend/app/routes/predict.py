from fastapi import APIRouter, UploadFile, File, HTTPException
from app.models.schemas import PredictionRequest, PredictionResponse, BatchPredictionResponse
from app.services.model_service import ModelService
from app.services.file_processing import FileProcessingService
import pandas as pd

router = APIRouter()
model_service = ModelService()
file_service = FileProcessingService()

@router.post("/predict", response_model=PredictionResponse)
async def predict_single(request: PredictionRequest):
    """Endpoint for single prediction"""
    return await model_service.predict_single(request.features)

@router.post("/predict/batch", response_model=BatchPredictionResponse)
async def predict_batch(features_list: list):
    """Endpoint for batch prediction with array input"""
    return await model_service.predict_batch(features_list)

@router.post("/predict/csv", response_model=BatchPredictionResponse)
async def predict_csv(file: UploadFile = File(...)):
    """Endpoint for prediction from CSV file"""
    try:
        # Process CSV file
        df = await file_service.process_csv(file)
        
        # Validate DataFrame (adjust column validation as per your model)
        if not file_service.validate_dataframe(df):
            raise HTTPException(status_code=400, detail="Invalid CSV format")
        
        # Extract features (adjust based on your model's expected features)
        # Assuming all columns except the last one are features
        features_list = df.iloc[:, :-1].values.tolist()
        
        # Make predictions
        return await model_service.predict_batch(features_list)
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))