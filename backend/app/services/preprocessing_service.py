# import pandas as pd
# import numpy as np
# from typing import Dict, List, Tuple
# import os

# class PreprocessingService:
#     def __init__(self):
#         self.feature_mappings = {
#             'kepler': [
#                 'koi_disposition', 'koi_fpflag_nt', 'koi_fpflag_ss', 'koi_fpflag_co', 'koi_fpflag_ec',
#                 'koi_period', 'koi_period_err2', 'koi_time0bk', 'koi_impact', 'koi_duration', 'koi_depth',
#                 'koi_prad', 'koi_teq', 'koi_insol', 'koi_model_snr', 'koi_tce_plnt_num', 'koi_steff',
#                 'koi_slogg', 'koi_srad', 'ra', 'dec', 'koi_kepmag'
#             ],
#             'tess': [
#                 'tfopwg_disp', 'ra', 'dec', 'st_pmra', 'st_pmdec', 'pl_tranmid',
#                 'pl_orbper', 'pl_trandurh', 'pl_trandep', 'pl_trandeplim', 'pl_rade',
#                 'pl_insol', 'pl_eqt', 'st_tmag', 'st_dist', 'st_teff', 'st_logg', 'st_rad'
#             ],
#             'k2': [
#                 'disposition', 'pl_orbperlim', 'pl_rade', 'pl_radelim', 'pl_radj',
#                 'pl_radjlim', 'ttv_flag', 'st_rad', 'st_radlim', 'dec', 'sy_dist',
#                 'sy_vmag', 'sy_kmag', 'sy_gaiamag'
#             ]
#         }
    
#     def preprocess_data(self, df: pd.DataFrame, dataset_type: str) -> Tuple[pd.DataFrame, Dict]:
#         """
#         Preprocess the data based on dataset type
#         Returns: (processed_df, preprocessing_info)
#         """
#         preprocessing_info = {
#             'original_rows': len(df),
#             'original_columns': list(df.columns),
#             'missing_values': {},
#             'data_types': {},
#             'statistics': {}
#         }
        
#         # Get required features for the dataset type
#         required_features = self.feature_mappings.get(dataset_type, [])
        
#         # Check for missing columns
#         missing_cols = [col for col in required_features if col not in df.columns]
#         if missing_cols:
#             raise ValueError(f"Missing required columns for {dataset_type} dataset: {missing_cols}")
        
#         # Select only required features
#         df_processed = df[required_features].copy()
        
#         # Handle missing values
#         for col in df_processed.columns:
#             missing_count = df_processed[col].isnull().sum()
#             preprocessing_info['missing_values'][col] = missing_count
            
#             if missing_count > 0:
#                 if df_processed[col].dtype in ['object', 'string']:
#                     # For categorical data, fill with mode
#                     mode_value = df_processed[col].mode()
#                     if len(mode_value) > 0:
#                         df_processed[col].fillna(mode_value[0], inplace=True)
#                     else:
#                         df_processed[col].fillna('Unknown', inplace=True)
#                 else:
#                     # For numerical data, fill with median
#                     df_processed[col].fillna(df_processed[col].median(), inplace=True)
        
#         # Convert categorical variables to numerical for kepler dataset
#         if dataset_type == 'kepler':
#             df_processed = self._preprocess_kepler_categorical(df_processed)
        
#         # Convert categorical variables to numerical for tess dataset
#         elif dataset_type == 'tess':
#             df_processed = self._preprocess_tess_categorical(df_processed)
        
#         # Convert categorical variables to numerical for k2 dataset
#         elif dataset_type == 'k2':
#             df_processed = self._preprocess_k2_categorical(df_processed)
        
#         # Store data types and statistics
#         for col in df_processed.columns:
#             preprocessing_info['data_types'][col] = str(df_processed[col].dtype)
#             if df_processed[col].dtype in ['int64', 'float64']:
#                 preprocessing_info['statistics'][col] = {
#                     'mean': float(df_processed[col].mean()),
#                     'std': float(df_processed[col].std()),
#                     'min': float(df_processed[col].min()),
#                     'max': float(df_processed[col].max())
#                 }
        
#         preprocessing_info['final_rows'] = len(df_processed)
#         preprocessing_info['final_columns'] = list(df_processed.columns)
        
#         return df_processed, preprocessing_info
    
#     def _preprocess_kepler_categorical(self, df: pd.DataFrame) -> pd.DataFrame:
#         """Preprocess Kepler categorical variables"""
#         df_processed = df.copy()
        
#         # Handle koi_disposition - convert to numerical
#         if 'koi_disposition' in df_processed.columns:
#             disposition_mapping = {
#                 'CONFIRMED': 1,
#                 'CANDIDATE': 0,
#                 'FALSE POSITIVE': -1
#             }
#             df_processed['koi_disposition'] = df_processed['koi_disposition'].map(disposition_mapping)
#             df_processed['koi_disposition'] = df_processed['koi_disposition'].fillna(0)
        
#         return df_processed
    
#     def _preprocess_tess_categorical(self, df: pd.DataFrame) -> pd.DataFrame:
#         """Preprocess TESS categorical variables"""
#         df_processed = df.copy()
        
#         # Handle tfopwg_disp - convert to numerical
#         if 'tfopwg_disp' in df_processed.columns:
#             disp_mapping = {
#                 'PC': 1,  # Planet Candidate
#                 'FP': 0,  # False Positive
#                 'KP': 0,  # Known Planet
#                 'CP': 1,  # Confirmed Planet
#                 'APC': 1, # Ambiguous Planet Candidate
#                 'FA': 0,  # False Alarm
#                 'EB': 0,  # Eclipsing Binary
#                 'V': 0,   # Variable
#                 'IS': 0,  # Instrumental
#                 'J': 0,   # Junk
#                 'U': 0    # Unclassified
#             }
#             df_processed['tfopwg_disp'] = df_processed['tfopwg_disp'].map(disp_mapping)
#             df_processed['tfopwg_disp'] = df_processed['tfopwg_disp'].fillna(0)
        
#         return df_processed
    
#     def _preprocess_k2_categorical(self, df: pd.DataFrame) -> pd.DataFrame:
#         """Preprocess K2 categorical variables"""
#         df_processed = df.copy()
        
#         # Handle disposition - convert to numerical
#         if 'disposition' in df_processed.columns:
#             disp_mapping = {
#                 'CONFIRMED': 1,
#                 'CANDIDATE': 0,
#                 'FALSE POSITIVE': -1,
#                 'NOT DISPOSITIONED': 0
#             }
#             df_processed['disposition'] = df_processed['disposition'].map(disp_mapping)
#             df_processed['disposition'] = df_processed['disposition'].fillna(0)
        
#         return df_processed
    
#     def get_sample_data_for_explanation(self, df: pd.DataFrame, dataset_type: str, row_index: int = 0) -> Dict:
#         """Get sample data for chatbot explanation"""
#         if row_index >= len(df):
#             row_index = 0
        
#         sample_row = df.iloc[row_index].to_dict()
        
#         # Convert numpy types to Python types for JSON serialization
#         for key, value in sample_row.items():
#             if isinstance(value, (np.integer, np.floating)):
#                 sample_row[key] = float(value)
#             elif isinstance(value, np.ndarray):
#                 sample_row[key] = value.tolist()
        
#         return {
#             'dataset_type': dataset_type,
#             'sample_data': sample_row,
#             'row_index': row_index
#         }
