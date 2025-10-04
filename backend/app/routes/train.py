from fastapi import APIRouter, UploadFile, File, HTTPException
from app.models.schemas import TrainingResponse
from app.services.file_processing import FileProcessingService
from app.models.ml_model import MLModel
import pandas as pd

router = APIRouter()
file_service = FileProcessingService()
ml_model = MLModel()

@router.post("/train/csv", response_model=TrainingResponse)
async def train_from_csv(file: UploadFile = File(...)):
    """Endpoint for retraining model from CSV file"""
    try:
        # Process CSV file
        df = await file_service.process_csv(file)
        
        # Validate DataFrame
        if not file_service.validate_dataframe(df):
            raise HTTPException(status_code=400, detail="Invalid CSV format")
        
        # Extract features and labels (adjust based on your data structure)
        # Assuming last column is the target/label
        X = df.iloc[:, :-1].values
        y = df.iloc[:, -1].values
        
        # Train the model
        accuracy = ml_model.train(X, y)
        
        if accuracy is not None:
            return TrainingResponse(
                message="Model retrained successfully",
                status="success",
                accuracy=accuracy
            )
        else:
            return TrainingResponse(
                message="Error training model",
                status="error",
                accuracy=None
            )
            
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))