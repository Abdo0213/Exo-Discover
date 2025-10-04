import pandas as pd
import io
from fastapi import UploadFile, HTTPException

class FileProcessingService:
    def __init__(self):
        pass
    
    async def process_csv(self, file: UploadFile) -> pd.DataFrame:
        """Process uploaded CSV file and return DataFrame"""
        try:
            # Read file content
            content = await file.read()
            
            # Convert to DataFrame
            df = pd.read_csv(io.BytesIO(content))
            
            return df
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Error processing CSV file: {str(e)}")
    
    def validate_dataframe(self, df: pd.DataFrame, expected_columns: list = None) -> bool:
        """Validate DataFrame structure"""
        try:
            if df.empty:
                return False
            
            if expected_columns:
                if not all(col in df.columns for col in expected_columns):
                    return False
            
            return True
        except Exception:
            return False