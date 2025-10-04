# import pandas as pd
# import numpy as np
# from typing import Tuple, Dict, Any
# import os
# import sys

# # Add the models directory to the path so we can import the preprocessing functions
# current_dir = os.path.dirname(os.path.abspath(__file__))
# models_dir = os.path.join(os.path.dirname(os.path.dirname(current_dir)), "app", "models")
# sys.path.append(models_dir)

# from K2 import prepare_and_predict as k2_preprocess
# from KOI import predict_new_data as kepler_preprocess
# from TOI import clean_dataframe as tess_preprocess

# class UnifiedPreprocessingService:
#     def __init__(self):
#         self.data_detection = None  # Will be set when needed
    
#     def preprocess_data(self, df: pd.DataFrame, dataset_type: str = None) -> Tuple[pd.DataFrame, Dict[str, Any]]:
#         """
#         Preprocess data using the appropriate preprocessing function based on dataset type
#         """
#         preprocessing_info = {
#             'original_rows': len(df),
#             'original_columns': list(df.columns),
#             'dataset_type': dataset_type,
#             'preprocessing_method': None,
#             'missing_values_handled': 0,
#             'columns_dropped': 0,
#             'final_columns': [],
#             'final_rows': 0
#         }
        
#         try:
#             if dataset_type == 'kepler':
#                 # Use KOI preprocessing
#                 preprocessing_info['preprocessing_method'] = 'KOI preprocessing'
#                 # The KOI preprocessing expects the model to be passed, but we'll handle that separately
#                 # For now, just clean the data
#                 df_processed = df.copy()
                
#                 # Apply KOI-specific preprocessing
#                 from KOI import drop_cols as kepler_drop_cols
#                 existing_cols = [col for col in kepler_drop_cols if col in df_processed.columns]
#                 df_processed = df_processed.drop(columns=existing_cols, errors="ignore")
#                 preprocessing_info['columns_dropped'] = len(existing_cols)
                
#                 # Fill missing values
#                 df_processed = df_processed.fillna(df_processed.mean(numeric_only=True))
#                 preprocessing_info['missing_values_handled'] = df_processed.isnull().sum().sum()
                
#             elif dataset_type == 'tess':
#                 # Use TOI preprocessing
#                 preprocessing_info['preprocessing_method'] = 'TOI preprocessing'
#                 df_processed = tess_preprocess(df.copy())
#                 preprocessing_info['missing_values_handled'] = df.isnull().sum().sum() - df_processed.isnull().sum().sum()
                
#             elif dataset_type == 'k2':
#                 # Use K2 preprocessing
#                 preprocessing_info['preprocessing_method'] = 'K2 preprocessing'
#                 from K2 import drop_cols as k2_drop_cols
                
#                 # Apply K2-specific preprocessing
#                 existing_cols = [col for col in k2_drop_cols if col in df.columns]
#                 df_processed = df.drop(columns=existing_cols, errors="ignore")
#                 preprocessing_info['columns_dropped'] = len(existing_cols)
                
#                 # Convert object columns to numeric
#                 for col in df_processed.columns:
#                     if df_processed[col].dtype == "object":
#                         try:
#                             df_processed[col] = pd.to_numeric(df_processed[col], errors="coerce")
#                         except:
#                             pass
                
#                 # Fill missing values
#                 numeric_cols = df_processed.select_dtypes(include=[np.number]).columns
#                 df_processed[numeric_cols] = df_processed[numeric_cols].fillna(df_processed[numeric_cols].mean())
#                 preprocessing_info['missing_values_handled'] = df.isnull().sum().sum() - df_processed.isnull().sum().sum()
                
#             else:
#                 # Fallback to basic preprocessing
#                 preprocessing_info['preprocessing_method'] = 'Basic preprocessing'
#                 df_processed = df.copy()
#                 df_processed = df_processed.fillna(df_processed.mean(numeric_only=True))
#                 preprocessing_info['missing_values_handled'] = df.isnull().sum().sum() - df_processed.isnull().sum().sum()
            
#             preprocessing_info['final_columns'] = list(df_processed.columns)
#             preprocessing_info['final_rows'] = len(df_processed)
            
#             return df_processed, preprocessing_info
            
#         except Exception as e:
#             preprocessing_info['error'] = str(e)
#             # Fallback to basic preprocessing
#             df_processed = df.copy()
#             df_processed = df_processed.fillna(df_processed.mean(numeric_only=True))
#             preprocessing_info['preprocessing_method'] = 'Fallback preprocessing'
#             preprocessing_info['final_columns'] = list(df_processed.columns)
#             preprocessing_info['final_rows'] = len(df_processed)
            
#             return df_processed, preprocessing_info
    
#     def get_feature_columns_for_prediction(self, df: pd.DataFrame, dataset_type: str) -> List[str]:
#         """
#         Get the feature columns that should be used for prediction based on dataset type
#         """
#         if dataset_type == 'kepler':
#             # For Kepler, use the columns that remain after dropping the drop_cols
#             from KOI import drop_cols as kepler_drop_cols
#             return [col for col in df.columns if col not in kepler_drop_cols]
        
#         elif dataset_type == 'tess':
#             # For TESS, use the columns that remain after TOI preprocessing
#             return list(tess_preprocess(df.copy()).columns)
        
#         elif dataset_type == 'k2':
#             # For K2, use the columns that remain after dropping the drop_cols
#             from K2 import drop_cols as k2_drop_cols
#             return [col for col in df.columns if col not in k2_drop_cols]
        
#         else:
#             # Fallback to all numeric columns
#             return list(df.select_dtypes(include=[np.number]).columns)
