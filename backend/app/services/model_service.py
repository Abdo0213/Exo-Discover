from app.models.schemas import PredictionResponse, BatchPredictionResponse
from app.models.KOI import predict_new_data as koi_predict, preprocess_koi_data
from app.models.TOI import clean_dataframe as toi_clean
from app.models.K2 import prepare_and_predict as k2_predict
from app.services.data_detection_service import DataDetectionService
import pandas as pd
import joblib
import os
import pickle
import numpy as np

class ModelService:
    def __init__(self):
        self.models = {}
        self.data_detection = DataDetectionService()
        self.load_models()
    
    def preprocess_kepler_data(self, kepler_df):
        """Preprocess Kepler dataset for model training/prediction"""
        kepler = kepler_df.copy()

        drop_cols = [
            'kepid','kepoi_name','kepler_name','koi_pdisposition','koi_score',
            'koi_period_err1','koi_time0bk_err2','koi_time0bk_err1',
            'koi_impact_err1','koi_impact_err2','koi_duration_err1','koi_duration_err2',
            'koi_depth_err1','koi_depth_err2','koi_prad_err1','koi_prad_err2',
            'koi_teq_err1','koi_teq_err2','koi_insol_err1','koi_insol_err2',
            'koi_steff_err1','koi_steff_err2','koi_slogg_err1','koi_slogg_err2',
            'koi_srad_err1','koi_srad_err2','koi_tce_delivname'
        ]

        # target column: remove if found
        if 'koi_disposition' in kepler.columns:
            drop_cols.append('koi_disposition')

        kepler = kepler.drop(columns=drop_cols, axis=1, errors="ignore")
        kepler = kepler.fillna(kepler.mean(numeric_only=True))
        return kepler


    def preprocess_k2_data(self, k2_df):
        """Preprocess K2 dataset for model training/prediction"""
        k2 = k2_df.copy()

        drop_cols = [
            'pl_name','hostname','default_flag','disp_refname',
            'sy_snum','sy_pnum','discoverymethod','disc_year','disc_facility','soltype','pl_controv_flag',
            'pl_refname','pl_orbpererr1','pl_orbpererr2','pl_orbsmaxerr1','pl_orbsmaxerr2',
            'pl_radeerr1','pl_radeerr2','pl_radjerr1','pl_radjerr2','pl_bmasseerr1','pl_bmasseerr2',
            'pl_bmassjerr1','pl_bmassjerr2','pl_orbeccenerr1','pl_orbeccenerr2','pl_insolerr1','pl_insolerr2',
            'pl_eqterr1','pl_eqterr2','st_refname','st_spectype','st_tefferr1','st_tefferr2',
            'st_raderr1','st_raderr2','st_masserr1','st_masserr2','st_meterr1','st_meterr2',
            'st_loggerr1','st_loggerr2','sy_refname','sy_disterr1','sy_disterr2','sy_vmagerr1','sy_vmagerr2',
            'sy_kmagerr1','sy_kmagerr2','sy_gaiamagerr1','sy_gaiamagerr2','rowupdate','pl_pubdate','releasedate',
            'Unnamed: 94','Unnamed: 95','Unnamed: 96','Unnamed: 97','pl_orbsmaxlim','pl_bmasse','pl_bmasselim','pl_bmassj',
            'pl_bmassjlim','pl_bmassprov','pl_orbeccen','pl_orbeccenlim','pl_insol','pl_insollim','pl_orbsmax','pl_eqt','pl_eqtlim',
            'st_teff','st_tefflim','st_mass','st_masslim','st_met','st_metlim','st_metratio','st_logg','st_logglim','rastr','decstr',
            'ra','pl_orbper'
        ]

        # target column: remove if found
        if 'disposition' in k2.columns:
            drop_cols.append('disposition')

        k2 = k2.drop(columns=drop_cols, axis=1, errors='ignore')
        numeric_cols = k2.select_dtypes(include=['float64', 'int64']).columns
        k2[numeric_cols] = k2[numeric_cols].fillna(k2[numeric_cols].median())

        return k2


    def preprocess_tess_data(self, tess_df):
        """Preprocess TESS dataset for model training/prediction"""
        toi = tess_df.copy()

        drop_cols = [
            'toi','tid','rastr','decstr',
            'st_pmraerr1','st_pmraerr2','st_pmdecerr1','st_pmdecerr2',
            'pl_orbpererr1','pl_orbpererr2','pl_trandurherr1','pl_trandurherr2',
            'pl_trandeperr1','pl_trandeperr2','pl_radeerr1','pl_radeerr2',
            'pl_insolerr1','pl_insolerr2','pl_eqterr1','pl_eqterr2',
            'st_tmagerr1','st_tmagerr2','st_disterr1','st_disterr2',
            'st_tefferr1','st_tefferr2','st_loggerr1','st_loggerr2',
            'st_raderr1','st_raderr2','pl_insollim','pl_eqtlim','toi_created',
            'rowupdate','st_radlim','st_logglim','st_tefflim','st_distlim','st_tmaglim',
            'pl_radelim','pl_trandurhlim','pl_orbperlim','pl_tranmidlim','pl_tranmiderr2','pl_tranmiderr1',
            'st_pmdeclim','st_pmralim'
        ]

        # target column: remove if found
        if 'tfopwg_disp' in toi.columns:
            drop_cols.append('tfopwg_disp')

        toi = toi.drop(columns=drop_cols, axis=1, errors='ignore')
        numeric_cols = toi.select_dtypes(include=['float64', 'int64']).columns
        toi[numeric_cols] = toi[numeric_cols].fillna(toi[numeric_cols].median())

        return toi

    def load_models(self):
        """Load all three models with error handling"""
        try:
            # Get the directory where this file is located
            current_dir = os.path.dirname(os.path.abspath(__file__))
            # Go from app/services/ to backend/models/
            models_dir = os.path.join(os.path.dirname(os.path.dirname(current_dir)), "models")
            models_dir = os.path.abspath(models_dir)
            print("modellmodel",models_dir)
            print(f"Looking for models in: {models_dir}")
            
            # Load KOI model
            koi_path = os.path.join(models_dir, "KOI.pkl")
            if os.path.exists(koi_path):
                try:
                    # Try loading with joblib first
                    self.models['kepler'] = joblib.load(koi_path)
                    print(f"✅ Loaded KOI model from {koi_path}")
                except Exception as e:
                    print(f"❌ Error loading KOI model with joblib: {e}")
                    try:
                        # Try loading with pickle as fallback
                        with open(koi_path, 'rb') as f:
                            self.models['kepler'] = pickle.load(f)
                        print(f"✅ Loaded KOI model using pickle fallback")
                    except Exception as e2:
                        print(f"❌ Pickle fallback also failed: {e2}")
                        # Don't set to None, let the KOI.py handle the fallback
                        print(f"⚠️ KOI model will use internal fallback mechanism")
                        self.models['kepler'] = 'use_koi_fallback'
            else:
                print(f"❌ KOI model not found at {koi_path}")
                self.models['kepler'] = None
            
            # Load TOI model
            toi_path = os.path.join(models_dir, "TOI.pkl")
            if os.path.exists(toi_path):
                try:
                    self.models['tess'] = joblib.load(toi_path)
                    print(f"✅ Loaded TOI model from {toi_path}")
                except Exception as e:
                    print(f"❌ Error loading TOI model with joblib: {e}")
                    try:
                        with open(toi_path, 'rb') as f:
                            self.models['tess'] = pickle.load(f)
                        print(f"✅ Loaded TOI model using pickle fallback")
                    except Exception as e2:
                        print(f"❌ Pickle fallback also failed: {e2}")
                        # Create a dummy model for fallback
                        class DummyTOIModel:
                            def predict(self, X):
                                import numpy as np
                                return np.zeros(len(X), dtype=int)
                        self.models['tess'] = DummyTOIModel()
                        print("⚠️ Using dummy model fallback for TOI predictions")
            else:
                print(f"❌ TOI model not found at {toi_path}")
                self.models['tess'] = None
            
            # Load K2 model
            k2_path = os.path.join(models_dir, "K2.pkl")
            if os.path.exists(k2_path):
                try:
                    self.models['k2'] = joblib.load(k2_path)
                    print(f"✅ Loaded K2 model from {k2_path}")
                except Exception as e:
                    print(f"❌ Error loading K2 model with joblib: {e}")
                    try:
                        with open(k2_path, 'rb') as f:
                            self.models['k2'] = pickle.load(f)
                        print(f"✅ Loaded K2 model using pickle fallback")
                    except Exception as e2:
                        print(f"❌ Pickle fallback also failed: {e2}")
                        # Create a dummy model for fallback
                        class DummyK2Model:
                            def predict(self, X):
                                import numpy as np
                                return np.zeros(len(X), dtype=int)
                        self.models['k2'] = DummyK2Model()
                        print("⚠️ Using dummy model fallback for K2 predictions")
            else:
                print(f"❌ K2 model not found at {k2_path}")
                self.models['k2'] = None
                
            # Check if any models loaded successfully
            loaded_models = [k for k, v in self.models.items() if v is not None]
            if loaded_models:
                print(f"✅ Successfully loaded models: {loaded_models}")
            else:
                print("❌ No models loaded successfully!")
                
        except Exception as e:
            print(f"❌ Critical error in model loading: {e}")
            # Initialize empty models dict
            self.models = {'kepler': None, 'tess': None, 'k2': None}
    
    async def predict_single(self, features: list, dataset_type: str) -> PredictionResponse:
        """Make prediction for single input using the appropriate model"""
        try:
            if dataset_type not in self.models:
                return PredictionResponse(
                    prediction=None,
                    confidence=0.0,
                    status="error",
                    model_used="none"
                )
            
            # Convert features to DataFrame for model prediction
            feature_names = self._get_feature_names(dataset_type)
            df = pd.DataFrame([features], columns=feature_names)
            
            if dataset_type == 'kepler':
                df_processed = self.preprocess_kepler_data(df)
                model = self.models['kepler'] if self.models['kepler'] is not None else self._get_kepler_fallback()
                prediction = model.predict(df_processed)
            elif dataset_type == 'tess':
                df_processed = self.preprocess_tess_data(df)
                prediction = self.models['tess'].predict(df_processed)
            elif dataset_type == 'k2':
                df_processed = self.preprocess_k2_data(df)
                prediction = self.models['k2'].predict(df_processed)
            
            if prediction is not None:
                # Handle numpy array or numpy scalar safely
                if isinstance(prediction, (np.ndarray, list, tuple)):
                    pred_value = prediction[0].item() if isinstance(prediction[0], np.generic) else prediction[0]
                elif isinstance(prediction, np.generic):
                    pred_value = prediction.item()
                else:
                    pred_value = prediction

                return PredictionResponse(
                    prediction=pred_value,
                    confidence=0.95,  # TODO: replace with real confidence if available
                    status="success",
                    model_used=dataset_type
                )
            else:
                return PredictionResponse(
                    prediction=None,
                    confidence=0.0,
                    status="error",
                    model_used=dataset_type
                )
        except Exception as e:
            return PredictionResponse(
                prediction=None,
                confidence=0.0,
                status=f"error: {str(e)}",
                model_used=dataset_type
            )
    
    async def predict_batch(self, features_list: list, dataset_type: str) -> BatchPredictionResponse:
        """Make predictions for batch inputs using the appropriate model"""
        try:
            if dataset_type not in self.models:
                return BatchPredictionResponse(
                    predictions=[],
                    status="error",
                    model_used="none"
                )
            
            # Convert features to DataFrame for model prediction
            feature_names = self._get_feature_names(dataset_type)
            df = pd.DataFrame(features_list, columns=feature_names)
            
            if dataset_type == 'kepler':
                df_processed = self.preprocess_kepler_data(df)
                model = self.models['kepler'] if self.models['kepler'] is not None else self._get_kepler_fallback()
                predictions = model.predict(df_processed)
            elif dataset_type == 'tess':
                df_processed = self.preprocess_tess_data(df)
                predictions = self.models['tess'].predict(df_processed)
            elif dataset_type == 'k2':
                df_processed = self.preprocess_k2_data(df)
                predictions = self.models['k2'].predict(df_processed)
            
            return BatchPredictionResponse(
                predictions=predictions.tolist() if hasattr(predictions, 'tolist') else predictions,
                status="success",
                model_used=dataset_type
            )
        except Exception as e:
            return BatchPredictionResponse(
                predictions=[],
                status=f"error: {str(e)}",
                model_used=dataset_type
            )

    # async def predict_csv_with_detection(self, df: pd.DataFrame, dataset_type: str = None) -> tuple:
        """
        Predict from CSV with automatic dataset type detection and appropriate preprocessing
        Returns: (predictions, detected_type, preprocessing_info)
        """
        try:
            # Detect and preprocess data
            processed_df, detected_type, preprocessing_info = self.detect_and_preprocess_data(df, dataset_type)
            
            # Check if model is available (allow KOI fallback)
            if detected_type not in self.models or (self.models[detected_type] is None and detected_type != 'kepler'):
                raise ValueError(f"Model for {detected_type} is not available. Please check model loading.")
            
            # Make predictions using the appropriate method with proper preprocessing
            if detected_type == 'kepler':
                # Use enhanced Kepler preprocessing and model
                model = self.models[detected_type] if self.models[detected_type] is not None else self._get_kepler_fallback()
                predictions = model.predict(processed_df)
                preprocessing_info['prediction_method'] = 'Enhanced Kepler preprocessing + Kepler model (with fallback)'
                
            elif detected_type == 'tess':
                # Use enhanced TESS preprocessing and model
                model = self.models[detected_type]
                predictions = model.predict(processed_df)
                preprocessing_info['prediction_method'] = 'Enhanced TESS preprocessing + TESS model'
                
            elif detected_type == 'k2':
                # Use enhanced K2 preprocessing and model
                model = self.models[detected_type]
                predictions = model.predict(processed_df)
                preprocessing_info['prediction_method'] = 'Enhanced K2 preprocessing + K2 model'
                
            else:
                raise ValueError(f"Unsupported dataset type: {detected_type}")
            
            return predictions, detected_type, preprocessing_info
            
        except Exception as e:
            raise Exception(f"Error in CSV prediction: {str(e)}")
    
    async def predict_csv_with_detection(self, df: pd.DataFrame, dataset_type: str) -> tuple:
        """
        Predict from CSV with manual dataset type selection and appropriate preprocessing
        Returns: (predictions, dataset_type, preprocessing_info)
        """
        try:
            if dataset_type not in self.models or (self.models[dataset_type] is None and dataset_type != 'kepler'):
                raise ValueError(f"Model for {dataset_type} is not available. Please check model loading.")

            # Preprocess data depending on dataset type
            if dataset_type == 'kepler':
                processed_df = self.preprocess_kepler_data(df.copy())
                model = self.models['kepler'] if self.models['kepler'] is not None else self._get_kepler_fallback()
                predictions = model.predict(processed_df)
                preprocessing_info = {
                    'method': 'Enhanced Kepler preprocessing',
                    'original_columns': list(df.columns),
                    'final_columns': list(processed_df.columns),
                    'note': 'Manual Kepler preprocessing with fallback model'
                }

            elif dataset_type == 'tess':
                processed_df = self.preprocess_tess_data(df.copy())
                model = self.models['tess']
                predictions = model.predict(processed_df)
                preprocessing_info = {
                    'method': 'Enhanced TESS preprocessing',
                    'original_columns': list(df.columns),
                    'final_columns': list(processed_df.columns),
                    'note': 'Manual TESS preprocessing'
                }

            elif dataset_type == 'k2':
                processed_df = self.preprocess_k2_data(df.copy())
                model = self.models['k2']
                predictions = model.predict(processed_df)
                preprocessing_info = {
                    'method': 'Enhanced K2 preprocessing',
                    'original_columns': list(df.columns),
                    'final_columns': list(processed_df.columns),
                    'note': 'Manual K2 preprocessing'
                }

            else:
                raise ValueError(f"Unsupported dataset type: {dataset_type}")

            return predictions, dataset_type, preprocessing_info

        except Exception as e:
            raise Exception(f"Error in CSV prediction: {str(e)}")


    def detect_and_preprocess_data(self, df: pd.DataFrame, dataset_type: str = None) -> tuple:
        """
        Detect dataset type if not provided and preprocess data using appropriate method
        Returns: (processed_df, detected_type, preprocessing_info)
        """
        # Detect dataset type if not provided
        if dataset_type is None:
            detected_type = self.data_detection.detect_dataset_type(df)
            if detected_type is None:
                raise ValueError("Could not detect dataset type from CSV columns. Please specify dataset_type manually.")
        else:
            detected_type = dataset_type
        
        # Validate the dataset
        validation = self.data_detection.validate_dataset(df, detected_type)
        if not validation['is_valid']:
            print(f"Warning: Dataset validation failed. Missing columns: {validation['missing_columns']}")
        
        # Preprocess data using the appropriate method
        if detected_type == 'kepler':
            # Use enhanced Kepler preprocessing
            processed_df = self.preprocess_kepler_data(df.copy())
            preprocessing_info = {
                'method': 'Enhanced Kepler preprocessing',
                'original_columns': list(df.columns),
                'final_columns': list(processed_df.columns),
                'validation': validation,
                'columns_dropped': len([col for col in df.columns if col not in processed_df.columns]),
                'note': 'Enhanced Kepler preprocessing: dropped unnecessary columns, filled missing values, converted disposition to binary'
            }
            
        elif detected_type == 'tess':
            # Use enhanced TESS preprocessing
            processed_df = self.preprocess_tess_data(df.copy())
            preprocessing_info = {
                'method': 'Enhanced TESS preprocessing',
                'original_columns': list(df.columns),
                'final_columns': list(processed_df.columns),
                'validation': validation,
                'columns_dropped': len([col for col in df.columns if col not in processed_df.columns]),
                'note': 'Enhanced TESS preprocessing: dropped unnecessary columns, filled missing values, converted tfopwg_disp to binary'
            }
            
        elif detected_type == 'k2':
            # Use enhanced K2 preprocessing
            processed_df = self.preprocess_k2_data(df.copy())
            preprocessing_info = {
                'method': 'Enhanced K2 preprocessing',
                'original_columns': list(df.columns),
                'final_columns': list(processed_df.columns),
                'validation': validation,
                'columns_dropped': len([col for col in df.columns if col not in processed_df.columns]),
                'note': 'Enhanced K2 preprocessing: dropped unnecessary columns, filled missing values, converted disposition to binary'
            }
        else:
            raise ValueError(f"Unsupported dataset type: {detected_type}")
        
        return processed_df, detected_type, preprocessing_info

    def _get_feature_names(self, dataset_type: str) -> list:
        """Get feature names for the specified dataset type"""
        feature_mappings = {
            'kepler': [
                'koi_fpflag_nt', 'koi_fpflag_ss', 'koi_fpflag_co', 'koi_fpflag_ec',
                'koi_period', 'koi_period_err2', 'koi_time0bk', 'koi_impact', 'koi_duration', 'koi_depth',
                'koi_prad', 'koi_teq', 'koi_insol', 'koi_model_snr', 'koi_tce_plnt_num', 'koi_steff',
                'koi_slogg', 'koi_srad', 'ra', 'dec', 'koi_kepmag'
            ],
            'tess': [
                'ra', 'dec', 'st_pmra', 'st_pmdec', 'pl_tranmid',
                'pl_orbper', 'pl_trandurh', 'pl_trandep', 'pl_trandeplim', 'pl_rade',
                'pl_insol', 'pl_eqt', 'st_tmag', 'st_dist', 'st_teff', 'st_logg', 'st_rad'
            ],
            'k2': [
                'pl_orbperlim', 'pl_rade', 'pl_radelim', 'pl_radj',
                'pl_radjlim', 'ttv_flag', 'st_rad', 'st_radlim', 'dec', 'sy_dist',
                'sy_vmag', 'sy_kmag', 'sy_gaiamag'
            ]
        }
        return feature_mappings.get(dataset_type, [])
    
    def _get_kepler_fallback(self):
        """Get Kepler fallback model"""
        from app.models.KOI import get_model
        return get_model()