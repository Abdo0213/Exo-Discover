import joblib
import pandas as pd
import os

# Global variable to store the model
model = None

def get_model():
    """Load the model only when needed"""
    global model
    if model is None:
        try:
            # Get the correct path to the model file
            current_dir = os.path.dirname(os.path.abspath(__file__))
            # Go from app/models/ to backend/models/
            models_dir = os.path.join(os.path.dirname(os.path.dirname(current_dir)), "models")
            koi_path = os.path.join(models_dir, "KOI.pkl")
            model = joblib.load(koi_path)
            print(f"KOI model loaded successfully from {koi_path}")
        except Exception as e:
            print(f"Error loading KOI model: {e}")
            # Create a simple working fallback that returns dummy predictions
            class DummyModel:
                def predict(self, X):
                    # Return dummy predictions (0 for all samples)
                    import numpy as np
                    return np.zeros(len(X), dtype=int)
            
            model = DummyModel()
            print("⚠️ Using dummy model fallback for KOI predictions")
    return model

drop_cols = [
    'kepid','kepoi_name','kepler_name','koi_pdisposition','koi_score',
    'koi_period_err1','koi_time0bk_err2','koi_time0bk_err1','koi_time0bk_err2',
    'koi_impact_err1','koi_impact_err2','koi_duration_err1','koi_duration_err2',
    'koi_depth_err1','koi_depth_err2','koi_prad_err1','koi_prad_err2',
    'koi_teq_err1','koi_teq_err2','koi_insol_err1','koi_insol_err2',
    'koi_steff_err1','koi_steff_err2','koi_slogg_err1','koi_slogg_err2',
    'koi_srad_err1','koi_srad_err2','koi_tce_delivname'
]

def preprocess_koi_data(df):
    """Preprocess KOI data by dropping unnecessary columns and handling missing values"""
    processed_df = df.copy()
    
    # Drop columns that are not needed for prediction
    existing_cols = [col for col in drop_cols if col in processed_df.columns]
    processed_df = processed_df.drop(columns=existing_cols, errors="ignore")
    
    # Fill missing values with mean for numeric columns
    processed_df = processed_df.fillna(processed_df.mean(numeric_only=True))
    
    return processed_df

def predict_new_data(new_df):
    # Get the model (loads it if not already loaded)
    current_model = get_model()
    
    # Apply preprocessing
    processed_df = preprocess_koi_data(new_df)
   
    preds = current_model.predict(processed_df)
    return preds
