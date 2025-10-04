import joblib
import pandas as pd

model = joblib.load("KOI.pkl")

drop_cols = [
    'kepid','kepoi_name','kepler_name','koi_pdisposition','koi_score',
    'koi_period_err1','koi_time0bk_err2','koi_time0bk_err1','koi_time0bk_err2',
    'koi_impact_err1','koi_impact_err2','koi_duration_err1','koi_duration_err2',
    'koi_depth_err1','koi_depth_err2','koi_prad_err1','koi_prad_err2',
    'koi_teq_err1','koi_teq_err2','koi_insol_err1','koi_insol_err2',
    'koi_steff_err1','koi_steff_err2','koi_slogg_err1','koi_slogg_err2',
    'koi_srad_err1','koi_srad_err2','koi_tce_delivname'
]

def predict_new_data(new_df):
 
    new_df = new_df.drop(columns=[col for col in drop_cols if col in new_df.columns], errors="ignore")
   
    new_df = new_df.fillna(new_df.mean(numeric_only=True))
   
    preds = model.predict(new_df)
    return preds
