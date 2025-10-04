import pandas as pd
from typing import Optional, Dict, List

class DataDetectionService:
    def __init__(self):
        # Define key columns that identify each dataset type
        self.dataset_signatures = {
            'kepler': [
                'koi_pdisposition', 'koi_fpflag_nt', 'koi_fpflag_ss', 'koi_fpflag_co', 'koi_fpflag_ec',
                'koi_period', 'koi_time0bk', 'koi_impact', 'koi_duration', 'koi_depth', 'koi_prad',
                'koi_teq', 'koi_insol', 'koi_model_snr', 'koi_tce_plnt_num', 'koi_steff',
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
    
    def __init__(self):
        # Define key columns that identify each dataset type
        self.dataset_signatures = {
            'kepler': [
                'koi_pdisposition', 'koi_fpflag_nt', 'koi_fpflag_ss', 'koi_fpflag_co', 'koi_fpflag_ec',
                'koi_period', 'koi_time0bk', 'koi_impact', 'koi_duration', 'koi_depth', 'koi_prad',
                'koi_teq', 'koi_insol', 'koi_model_snr', 'koi_tce_plnt_num', 'koi_steff',
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
    
    def detect_dataset_type(self, df: pd.DataFrame) -> Optional[str]:
        """
        Detect the dataset type based on column names
        Returns the detected type or None if no match
        """
        df_columns = set(df.columns)
        
        # Calculate match scores for each dataset type
        scores = {}
        for dataset_type, signature_cols in self.dataset_signatures.items():
            signature_set = set(signature_cols)
            # Calculate how many signature columns are present
            matches = len(df_columns.intersection(signature_set))
            # Calculate the percentage of signature columns present
            score = matches / len(signature_set) if signature_set else 0
            scores[dataset_type] = score
        
        # Find the dataset type with the highest score
        if scores:
            best_match = max(scores.items(), key=lambda x: x[1])
            # Only return if we have at least 50% of the signature columns
            if best_match[1] >= 0.5:
                return best_match[0]
        
        return None
    
    def get_required_columns(self, dataset_type: str) -> List[str]:
        """Get the required columns for a specific dataset type"""
        return self.dataset_signatures.get(dataset_type, [])
    
    def validate_dataset(self, df: pd.DataFrame, dataset_type: str) -> Dict[str, any]:
        """
        Validate that the dataset has the required columns for the specified type
        Returns validation results
        """
        required_cols = self.get_required_columns(dataset_type)
        missing_cols = [col for col in required_cols if col not in df.columns]
        present_cols = [col for col in required_cols if col in df.columns]
        
        return {
            'is_valid': len(missing_cols) == 0,
            'missing_columns': missing_cols,
            'present_columns': present_cols,
            'total_required': len(required_cols),
            'total_present': len(present_cols),
            'completeness': len(present_cols) / len(required_cols) if required_cols else 0
        }
