from pydantic import BaseModel
from typing import List, Optional, Any, Dict
import pandas as pd

class ChatRequest(BaseModel):
    query: str

class ChatResponse(BaseModel):
    response: str
    status: str

class PredictionRequest(BaseModel):
    features: List[float]
    dataset_type: str  # 'kepler', 'tess', 'k2'

class PredictionResponse(BaseModel):
    prediction: Any
    confidence: Optional[float]
    status: str
    model_used: str

class BatchPredictionResponse(BaseModel):
    predictions: List[Any]
    status: str
    model_used: str

class CSVPredictionRequest(BaseModel):
    dataset_type: str  # 'kepler', 'tess', 'k2'

class TrainingResponse(BaseModel):
    message: str
    status: str
    accuracy: Optional[float]

# Feature mapping for different datasets
FEATURE_MAPPINGS = {
    'kepler': {
        'koi_fpflag_nt': 'False Positive Flag - Not Transit',
        'koi_fpflag_ss': 'False Positive Flag - Stellar Eclipse',
        'koi_fpflag_co': 'False Positive Flag - Centroid Offset',
        'koi_fpflag_ec': 'False Positive Flag - Ephemeris Match',
        'koi_period': 'Orbital Period (days)',
        'koi_period_err2': 'Orbital Period Error 2',
        'koi_time0bk': 'Transit Epoch (BJD-2454833)',
        'koi_impact': 'Impact Parameter',
        'koi_duration': 'Transit Duration (hours)',
        'koi_depth': 'Transit Depth (ppm)',
        'koi_prad': 'Planetary Radius (Earth radii)',
        'koi_teq': 'Equilibrium Temperature (K)',
        'koi_insol': 'Insolation Flux (Earth flux)',
        'koi_model_snr': 'Model Signal-to-Noise Ratio',
        'koi_tce_plnt_num': 'TCE Planet Number',
        'koi_steff': 'Stellar Effective Temperature (K)',
        'koi_slogg': 'Stellar Surface Gravity (log10 cm/s²)',
        'koi_srad': 'Stellar Radius (Solar radii)',
        'ra': 'Right Ascension (degrees)',
        'dec': 'Declination (degrees)',
        'koi_kepmag': 'Kepler Magnitude'
    },
    'tess': {
        'ra': 'Right Ascension (degrees)',
        'dec': 'Declination (degrees)',
        'st_pmra': 'Stellar Proper Motion RA (mas/yr)',
        'st_pmdec': 'Stellar Proper Motion Dec (mas/yr)',
        'pl_tranmid': 'Transit Midpoint (BJD)',
        'pl_orbper': 'Orbital Period (days)',
        'pl_trandurh': 'Transit Duration (hours)',
        'pl_trandep': 'Transit Depth (ppm)',
        'pl_trandeplim': 'Transit Depth Limit',
        'pl_rade': 'Planetary Radius (Earth radii)',
        'pl_insol': 'Insolation Flux (Earth flux)',
        'pl_eqt': 'Equilibrium Temperature (K)',
        'st_tmag': 'TESS Magnitude',
        'st_dist': 'Stellar Distance (pc)',
        'st_teff': 'Stellar Effective Temperature (K)',
        'st_logg': 'Stellar Surface Gravity (log10 cm/s²)',
        'st_rad': 'Stellar Radius (Solar radii)'
    },
    'k2': {
        'pl_orbperlim': 'Orbital Period Limit',
        'pl_rade': 'Planetary Radius (Earth radii)',
        'pl_radelim': 'Planetary Radius Limit',
        'pl_radj': 'Planetary Radius (Jupiter radii)',
        'pl_radjlim': 'Planetary Radius Jupiter Limit',
        'ttv_flag': 'TTV Flag',
        'st_rad': 'Stellar Radius (Solar radii)',
        'st_radlim': 'Stellar Radius Limit',
        'dec': 'Declination (degrees)',
        'sy_dist': 'System Distance (pc)',
        'sy_vmag': 'System V Magnitude',
        'sy_kmag': 'System K Magnitude',
        'sy_gaiamag': 'System Gaia Magnitude'
    }
}