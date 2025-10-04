
drop_cols = [
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
]



import pandas as pd
import numpy as np

def prepare_and_predict(df, model, drop_cols):
    existing_cols = [col for col in drop_cols if col in df.columns]
    df = df.drop(columns=existing_cols, errors="ignore")
   
    for col in df.columns:
        if df[col].dtype == "object":
            try:
                df[col] = pd.to_numeric(df[col], errors="coerce")
            except:
                pass
   
    numeric_cols = df.select_dtypes(include=[np.number]).columns
    df[numeric_cols] = df[numeric_cols].fillna(df[numeric_cols].mean())
   
    preds = model.predict(df)
   
    return preds, df
