import pandas as pd
# for csv upload
def clean_dataframe(df):
    cols_to_drop = ['toi','tid','rastr','decstr',
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
                       ,'st_pmdeclim','st_pmralim']
   
    existing_cols = [col for col in cols_to_drop if col in df.columns]
   
    df = df.drop(columns=existing_cols, axis=1)

    numeric_cols = df.select_dtypes(include=['float64', 'int64']).columns
   
    df[numeric_cols] = df[numeric_cols].fillna(df[numeric_cols].mean())
   
    return df