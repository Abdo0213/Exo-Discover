from fastapi import APIRouter, UploadFile, File, HTTPException, Form
from app.models.schemas import PredictionRequest, PredictionResponse, BatchPredictionResponse, CSVPredictionRequest
from app.services.model_service import ModelService
from app.services.file_processing import FileProcessingService
# from app.services.preprocessing_service import PreprocessingService
# from app.services.explanation_service import ExplanationService
import pandas as pd

router = APIRouter()
model_service = ModelService()
file_service = FileProcessingService()
# preprocessing_service = PreprocessingService()
# explanation_service = ExplanationService()

@router.post("/predict", response_model=PredictionResponse)
async def predict_single(request: PredictionRequest):
    """Endpoint for single prediction"""
    return await model_service.predict_single(request.features, request.dataset_type)

@router.post("/predict/batch", response_model=BatchPredictionResponse)
async def predict_batch(features_list: list, dataset_type: str = "kepler"):
    """Endpoint for batch prediction with array input"""
    return await model_service.predict_batch(features_list, dataset_type)

@router.post("/predict/csv", response_model=BatchPredictionResponse)
async def predict_csv(file: UploadFile = File(...), dataset_type: str = Form("kepler")):
    """Endpoint for prediction from CSV file with manual dataset type selection"""
    try:
        # Process CSV file
        df = await file_service.process_csv(file)

        # Validate DataFrame (basic sanity check)
        if df is None or df.empty:
            raise HTTPException(status_code=400, detail="Uploaded CSV is empty or invalid")

        # Run predictions using the manual CSV prediction function
        predictions, detected_type, preprocessing_info = await model_service.predict_csv_with_detection(df, dataset_type)

        # Return structured batch response
        return BatchPredictionResponse(
            predictions=predictions.tolist() if hasattr(predictions, "tolist") else list(predictions),
            model_used=detected_type,
            status="success",
            preprocessing_info=preprocessing_info
        )

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
