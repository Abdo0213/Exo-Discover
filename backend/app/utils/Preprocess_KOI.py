import pandas as pd
import numpy as np

def replace_outliers_with_median(data, cols):
    """
    Replace outliers (outside 1.5*IQR) with column median.
    Returns a new DataFrame copy.
    """
    clean_data = data.copy()
    for col in cols:
        if col not in clean_data.columns:
            continue
        # Only apply on numeric cols
        if not pd.api.types.is_numeric_dtype(clean_data[col]):
            continue
        Q1 = clean_data[col].quantile(0.25)
        Q3 = clean_data[col].quantile(0.75)
        IQR = Q3 - Q1
        lower = Q1 - 1.5 * IQR
        upper = Q3 + 1.5 * IQR
        median = clean_data[col].median()
        clean_data.loc[clean_data[col] < lower, col] = median
        clean_data.loc[clean_data[col] > upper, col] = median
    return clean_data


def preprocess_koi(df,
                   drop_extra_columns=True,
                   outlier_cols=None,
                   disposition_col='koi_disposition',
                   tce_col='koi_tce_delivname',
                   training_columns=None):
    """
    Preprocess KOI dataframe for model input.

    Parameters
    ----------
    df : pandas.DataFrame
        Raw KOI dataframe (e.g. uploaded by user).
    drop_extra_columns : bool
        If True, drop the list of columns the paper removed.
    outlier_cols : list or None
        If provided, apply replace_outliers_with_median on these numeric columns.
    disposition_col : str
        Name of the disposition/label column (default 'koi_disposition').
    tce_col : str
        Name of the koi_tce_delivname column (default 'koi_tce_delivname').
    training_columns : list or None
        If provided, reindex the final DataFrame to match these columns (fill missing with 0).
        This is useful to ensure uploaded data matches the trained model features.

    Returns
    -------
    X_proc : pandas.DataFrame
        Processed DataFrame ready for model prediction.
    y : pandas.Series or None
        Encoded labels (0/1) if disposition column present and valid, otherwise None.
    info : dict
        Useful info: {'dummies_for': [list of created dummy columns], 'tce_fill_method': 'mean_codes' or 'mean_numeric' or 'mode_fallback'}
    """
    data = df.copy()

    # === 1) Drop specified columns (if present) ===
    if drop_extra_columns:
        cols_to_drop = ['kepid','kepoi_name','kepler_name','koi_pdisposition','koi_score',
                        'koi_period_err1','koi_time0bk_err2','koi_time0bk_err1','koi_time0bk_err2',
                        'koi_impact_err1','koi_impact_err2','koi_duration_err1','koi_duration_err2',
                        'koi_depth_err1','koi_depth_err2','koi_prad_err1','koi_prad_err2',
                        'koi_teq_err1','koi_teq_err2','koi_insol_err1','koi_insol_err2',
                        'koi_steff_err1','koi_steff_err2','koi_slogg_err1','koi_slogg_err2',
                        'koi_srad_err1','koi_srad_err2','koi_tce_delivname']
        # user listed koi_tce_delivname as dropped earlier; but we will handle it explicitly below,
        # so remove from drop-list if you want to keep it handled. We'll NOT drop it here.
        # Remove koi_tce_delivname from drop list to process it.
        if tce_col in cols_to_drop:
            cols_to_drop.remove(tce_col)
        cols_present = [c for c in cols_to_drop if c in data.columns]
        if cols_present:
            data = data.drop(columns=cols_present)

    info = {'dummies_for': [], 'tce_fill_method': None}

    # === 2) Handle disposition: remove False Positive and encode Candidate/Confirmed ===
    y = None
    if disposition_col in data.columns:
        # normalize text
        disp = data[disposition_col].astype(str).str.strip().str.upper()
        # Remove False Positive rows (case-insensitive): any value containing 'FALSE' we drop.
        mask_falsepos = disp.str.contains('FALSE', na=False)
        if mask_falsepos.any():
            data = data.loc[~mask_falsepos].copy()
            disp = data[disposition_col].astype(str).str.strip().str.upper()

        # Keep only CANDIDATE and CONFIRMED rows (if other labels exist, drop them)
        valid_mask = disp.isin(['CANDIDATE', 'CONFIRMED'])
        data = data.loc[valid_mask].copy()
        if data.shape[0] == 0:
            raise ValueError("After removing False Positives and non-candidate/confirmed rows, no rows remain.")

        # Map to 0 / 1
        disp_after = data[disposition_col].astype(str).str.strip().str.upper()
        mapping = {'CANDIDATE': 0, 'CONFIRMED': 1}
        y = disp_after.map(mapping).astype(int)
        # Drop original disposition column from features (target separated)
        data = data.drop(columns=[disposition_col])
    else:
        # disposition not present => will return y = None and only X
        y = None

    # === 3) Handle koi_tce_delivname: fill missing, then dummy-encode if categorical ===
    # If column exists, we will create dummies from it (after filling)
    if tce_col in df.columns:
        # Work on original df column aligned to current index
        raw_series = df.loc[data.index, tce_col] if tce_col in df.columns else None

        if raw_series is None:
            # nothing to do
            pass
        else:
            s = raw_series.copy()

            # If numeric-like, fillna with mean
            if pd.api.types.is_numeric_dtype(s):
                mean_val = s.mean()
                s_filled = s.fillna(mean_val)
                info['tce_fill_method'] = 'mean_numeric'
                # attach this numeric column as-is
                data[tce_col] = s_filled.loc[data.index]
                # no dummies
            else:
                # treat as categorical
                # convert to categorical to get codes; missing -> NaN
                s_cat = s.astype('category')
                codes = s_cat.cat.codes  # missing -> -1
                valid_codes = codes[codes != -1]
                if len(valid_codes) == 0:
                    # fallback: fill missing with a string 'missing' and dummy encode
                    s_filled = s.fillna('missing')
                    info['tce_fill_method'] = 'mode_fallback'
                else:
                    mean_code = valid_codes.mean()
                    fill_code = int(round(mean_code))
                    # if fill_code out of range, use mode
                    if fill_code < 0 or fill_code >= len(s_cat.cat.categories):
                        fill_label = s_cat.cat.categories[s_cat.cat.codes.mode().iloc[0]] if hasattr(s_cat.cat.codes, 'mode') else s_cat.cat.categories[0]
                        s_filled = s.fillna(fill_label)
                        info['tce_fill_method'] = 'mode_fallback'
                    else:
                        fill_label = s_cat.cat.categories[fill_code]
                        s_filled = s.fillna(fill_label)
                        info['tce_fill_method'] = 'mean_codes'
                # now create dummies (one-hot) for this column
                dummies = pd.get_dummies(s_filled.loc[data.index].astype(str), prefix=tce_col)
                info['dummies_for'] = list(dummies.columns)
                # concatenate dummies into data
                data = pd.concat([data.reset_index(drop=True), dummies.reset_index(drop=True)], axis=1)
                # ensure index remains aligned
                data.index = s_filled.loc[data.index].index

    # If koi_tce_delivname not present in uploaded data but was present during training,
    # we will rely on training_columns reindexing below to add missing dummy columns.

    # === 4) Replace outliers if requested ===
    if outlier_cols:
        data = replace_outliers_with_median(data, outlier_cols)

    # === 5) Final cleaning: drop any non-finite numeric columns, fill remaining NaNs ===
    # For numeric columns, fill remaining NaNs with median
    num_cols = data.select_dtypes(include=[np.number]).columns.tolist()
    for col in num_cols:
        if data[col].isna().any():
            data[col] = data[col].fillna(data[col].median())

    # For object columns remaining (if any), fill with 'missing' and then get dummies
    obj_cols = data.select_dtypes(include=['object', 'category']).columns.tolist()
    if len(obj_cols) > 0:
        for col in obj_cols:
            data[col] = data[col].fillna('missing').astype(str)
        # convert these to dummies and drop originals
        dummies_obj = pd.get_dummies(data[obj_cols], drop_first=False)
        data = data.drop(columns=obj_cols)
        data = pd.concat([data.reset_index(drop=True), dummies_obj.reset_index(drop=True)], axis=1)

    # === 6) Reindex to training_columns (if provided) to guarantee the order & missing cols ===
    if training_columns is not None:
        # Ensure training_columns is a list-like
        expected = list(training_columns)
        # Add any training columns missing in data with zeros
        for c in expected:
            if c not in data.columns:
                data[c] = 0
        # Drop any extra columns not in expected (optionally keep them; here we align exactly)
        data = data[expected].copy()

    # Reset index to original-uploaded order (optional)
    data.index = data.index

    return data, y, info


# Example usage

# Suppose `uploaded_df` is the DataFrame from the website upload:
X_proc, y_proc, info = preprocess_koi(uploaded_df,
                                      outlier_cols=['koi_period', 'koi_depth', 'koi_duration', 'koi_prad'],
                                      training_columns=trained_feature_list)  # trained_feature_list = features used during training

# X_proc is now ready to pass to model.predict(X_proc)
# y_proc will be None if the upload had no koi_disposition column (typical for new predictions).
# info tells you what dummy columns were created and how tce column was filled.
