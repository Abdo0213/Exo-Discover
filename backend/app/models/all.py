import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier

def preprocess_kepler_data(kepler_df):
    """
    Preprocess Kepler dataset for model training/prediction
    """
    kepler = kepler_df.copy()
   
    # Drop unnecessary columns
    kepler = kepler.drop(columns=[
        'kepid','kepoi_name','kepler_name','koi_pdisposition','koi_score',
        'koi_period_err1','koi_time0bk_err2','koi_time0bk_err1',
        'koi_impact_err1','koi_impact_err2','koi_duration_err1','koi_duration_err2',
        'koi_depth_err1','koi_depth_err2','koi_prad_err1','koi_prad_err2',
        'koi_teq_err1','koi_teq_err2','koi_insol_err1','koi_insol_err2',
        'koi_steff_err1','koi_steff_err2','koi_slogg_err1','koi_slogg_err2',
        'koi_srad_err1','koi_srad_err2','koi_tce_delivname'
    ], axis=1)
   
    # Fill missing values with mean
    kepler = kepler.fillna(kepler.mean(numeric_only=True))
   
    # Convert disposition to binary (Confirmed=0, Candidate=1)
    kepler['koi_disposition'] = kepler['koi_disposition'].map({
        'CONFIRMED': 0,
        'CANDIDATE': 1,
        'FALSE POSITIVE': 2  # If you want to include false positives
    })
   
    # Remove false positives if they exist
    kepler = kepler[kepler['koi_disposition'].isin([0, 1])]
   
    return kepler

def preprocess_k2_data(k2_df):
    """
    Preprocess K2 dataset for model training/prediction
    """
    k2 = k2_df.copy()
   
    # Drop unnecessary columns
    k2 = k2.drop(columns=[
        'pl_name','hostname','default_flag','disp_refname',
        'sy_snum','sy_pnum','discoverymethod','disc_year','disc_facility','soltype','pl_controv_flag',
        'pl_refname','pl_orbpererr1', 'pl_orbpererr2','pl_orbsmaxerr1', 'pl_orbsmaxerr2',
        'pl_radeerr1', 'pl_radeerr2','pl_radjerr1', 'pl_radjerr2','pl_bmasseerr1', 'pl_bmasseerr2',
        'pl_bmassjerr1', 'pl_bmassjerr2','pl_orbeccenerr1', 'pl_orbeccenerr2','pl_insolerr1', 'pl_insolerr2',
        'pl_eqterr1', 'pl_eqterr2','st_refname','st_spectype','st_tefferr1', 'st_tefferr2',
        'st_raderr1', 'st_raderr2','st_masserr1', 'st_masserr2','st_meterr1', 'st_meterr2',
        'st_loggerr1', 'st_loggerr2','sy_refname','sy_disterr1', 'sy_disterr2','sy_vmagerr1','sy_vmagerr2',
        'sy_kmagerr1','sy_kmagerr2','sy_gaiamagerr1', 'sy_gaiamagerr2','rowupdate','pl_pubdate','releasedate',
        'Unnamed: 94','Unnamed: 95','Unnamed: 96','Unnamed: 97','pl_orbsmaxlim','pl_bmasse','pl_bmasselim','pl_bmassj',
        'pl_bmassjlim','pl_bmassprov','pl_orbeccen','pl_orbeccenlim','pl_insol','pl_insollim','pl_orbsmax','pl_eqt','pl_eqtlim',
        'st_teff','st_tefflim','st_mass','st_masslim','st_met','st_metlim','st_metratio','st_logg','st_logglim','rastr','decstr',
        'ra','pl_orbper'
    ], axis=1)
   
    # Fill missing values with mean for numeric columns
    numeric_cols = k2.select_dtypes(include=['float64']).columns
    for col in numeric_cols:
        median_val = k2[col].mean()
        k2[col] = k2[col].fillna(median_val)
   
    # Convert disposition to binary (Confirmed=0, Candidate=1)
    k2['disposition'] = k2['disposition'].map({
        'Confirmed': 0,
        'Candidate': 1
    })
   
    return k2

def preprocess_tess_data(tess_df):
    """
    Preprocess TESS dataset for model training/prediction
    """
    toi = tess_df.copy()
   
    # Drop unnecessary columns
    toi = toi.drop(columns=[
        'toi','tid','rastr','decstr',
        'st_pmraerr1','st_pmraerr2','st_pmdecerr1',
        'st_pmdecerr2','pl_orbpererr1','pl_orbpererr2',
        'pl_trandurherr1','pl_trandurherr2','pl_trandeperr1'
        ,'pl_trandeperr2','pl_radeerr1','pl_radeerr2',
        'pl_insolerr1','pl_insolerr2','pl_insolerr1'
        ,'pl_insolerr2','pl_eqterr1','pl_eqterr2',
        'st_tmagerr1','st_tmagerr2','st_disterr1','st_disterr2',
        'st_tefferr1','st_tefferr2','st_loggerr1','st_loggerr2',
        'st_raderr1','st_raderr2','pl_insollim','pl_eqtlim','toi_created'
        ,'rowupdate','st_radlim','st_logglim'
        ,'st_tefflim','st_distlim','st_tmaglim'
        ,'pl_radelim','pl_trandurhlim','pl_orbperlim'
        ,'pl_tranmidlim','pl_tranmiderr2','pl_tranmiderr1'
        ,'st_pmdeclim','st_pmralim'
    ], axis=1)
   
    # Fill missing values with median for numeric columns
    numeric_cols = toi.select_dtypes(include=['float64', 'int64']).columns
    toi[numeric_cols] = toi[numeric_cols].fillna(toi[numeric_cols].median())
   
    # Convert tfopwg_disp to binary (Confirmed=1, Candidate=0)
    if 'tfopwg_disp' in toi.columns:
        toi['tfopwg_disp'] = toi['tfopwg_disp'].map({
            'Confirmed': 1,
            'Candidate': 0
        })
   
    return toi

def train_models(kepler_df, k2_df, tess_df):
    """
    Train Random Forest models for each mission
    """
    # Preprocess data
    kepler_processed = preprocess_kepler_data(kepler_df)
    k2_processed = preprocess_k2_data(k2_df)
    tess_processed = preprocess_tess_data(tess_df)
   
    # Prepare features and targets
    # Kepler
    X_kepler = kepler_processed.drop('koi_disposition', axis=1)
    y_kepler = kepler_processed['koi_disposition']
   
    # K2
    X_k2 = k2_processed.drop('disposition', axis=1)
    y_k2 = k2_processed['disposition']
   
    # TESS
    X_tess = tess_processed.drop('tfopwg_disp', axis=1)
    y_tess = tess_processed['tfopwg_disp']
   
    # Train models
    rf_kepler = RandomForestClassifier(n_estimators=100, random_state=42)
    rf_k2 = RandomForestClassifier(n_estimators=100, random_state=42)
    rf_tess = RandomForestClassifier(n_estimators=100, random_state=42)
   
    rf_kepler.fit(X_kepler, y_kepler)
    rf_k2.fit(X_k2, y_k2)
    rf_tess.fit(X_tess, y_tess)
   
    return {
        'kepler': {
            'model': rf_kepler,
            'features': X_kepler.columns.tolist(),
            'data': kepler_processed
        },
        'k2': {
            'model': rf_k2,
            'features': X_k2.columns.tolist(),
            'data': k2_processed
        },
        'tess': {
            'model': rf_tess,
            'features': X_tess.columns.tolist(),
            'data': tess_processed
        }
    }

def predict_and_explain(features_dict, models_dict, top_n=5):
    """
    Unified function to predict using appropriate model and explain the decision
    """
    # Determine which model to use based on available columns
    model_to_use = None
    mission_type = None
    feature_names = None
    target_column = None
   
    # Check for mission-specific columns
    kepler_key_columns = ['koi_fpflag_nt', 'koi_fpflag_ss', 'koi_fpflag_co', 'koi_fpflag_ec']
    k2_key_columns = ['disposition', 'pl_rade', 'pl_insol']
    tess_key_columns = ['tfopwg_disp', 'pl_rade', 'pl_insol']
   
    if any(col in features_dict for col in kepler_key_columns):
        model_to_use = models_dict['kepler']['model']
        mission_type = "Kepler"
        feature_names = models_dict['kepler']['features']
        target_column = 'koi_disposition'
        print("🔭 Using Kepler model")
       
    elif any(col in features_dict for col in k2_key_columns):
        model_to_use = models_dict['k2']['model']
        mission_type = "K2"
        feature_names = models_dict['k2']['features']
        target_column = 'disposition'
        print("🔭 Using K2 model")
       
    elif any(col in features_dict for col in tess_key_columns):
        model_to_use = models_dict['tess']['model']
        mission_type = "TESS"
        feature_names = models_dict['tess']['features']
        target_column = 'tfopwg_disp'
        print("🔭 Using TESS model")
       
    else:
        raise ValueError("❌ No recognized mission columns found in features!")
   
    # Prepare data for prediction
    df = pd.DataFrame([features_dict])
   
    # Ensure we only use columns that exist in both the features_dict and model
    available_features = [f for f in feature_names if f in features_dict]
    missing_features = [f for f in feature_names if f not in features_dict]
   
    if missing_features:
        print(f"⚠️ Missing features: {missing_features}")
   
    df = df[available_features]
   
    # Add missing features with default values
    for feature in missing_features:
        df[feature] = 0  # or use mean/median from training data
   
    # Ensure correct column order
    df = df[feature_names]
   
    # Prediction
    prediction = model_to_use.predict(df)[0]
    probability = model_to_use.predict_proba(df)[0]
   
    # Map prediction to correct labels based on mission
    if mission_type == "Kepler":
        pred_label = "CANDIDATE" if prediction == 1 else "CONFIRMED"
    elif mission_type == "K2":
        pred_label = "CANDIDATE" if prediction == 1 else "CONFIRMED"  
    elif mission_type == "TESS":
        pred_label = "CONFIRMED" if prediction == 1 else "CANDIDATE"
   
    confidence = max(probability) * 100
   
    print(f"🎯 Prediction: {pred_label} (Confidence: {confidence:.1f}%)")
   
    # Get feature importances
    feature_importances = model_to_use.feature_importances_
    importance_dict = dict(zip(feature_names, feature_importances))
    sorted_importances = sorted(importance_dict.items(), key=lambda x: x[1], reverse=True)
   
    # Get detailed explanation from chatbot
    explanation = get_detailed_explanation(
        features_dict,
        sorted_importances,
        pred_label,
        mission_type,
        top_n=top_n
    )
   
    return {
        'prediction': pred_label,
        'confidence': confidence,
        'mission': mission_type,
        'explanation': explanation,
        'top_features': sorted_importances[:top_n],
        'probability': probability.tolist()
    }

def get_detailed_explanation(features_dict, sorted_importances, prediction, mission, top_n=5):
    """
    Chatbot provides detailed explanation of how each feature influenced the decision
    """
    # Build features block
    feature_lines = "\n".join([f"- {k}: {v}" for k, v in features_dict.items()])
   
    # Top features and their values
    top_features_text = ""
    for i, (name, importance) in enumerate(sorted_importances[:top_n]):
        value = features_dict.get(name, "N/A")
        top_features_text += f"{i+1}. {name}: {value} (importance: {importance:.4f})\n"
   
    prompt = f"""
You are an expert in explaining machine learning decisions for exoplanet discovery missions.
Mission: {mission}
Prediction: {prediction}

Input Data:
{feature_lines}

Top {top_n} most influential features:
{top_features_text}

Required Analysis:

1. Feature-by-Feature Detailed Analysis:
   - Analyze each of the top {top_n} features
   - Explain exactly how its value influenced the model's decision
   - Use specific examples: "The value X for feature Y increased/decreased probability because..."

2. Top Decision Factors (3-4 key reasons):
   - List the main factors that led to this prediction
   - Explain how different features interacted with each other

3. Recommendations (if CANDIDATE):
   - Which features if changed could alter the decision?
   - What values need review?

Output in clear, structured English with bullet points.
"""
   
    try:
        response = gemini.generate_content(prompt)
        return response.text
    except Exception as e:
        return f"Error generating explanation: {e}"