import pandas as pd

# Store processed data in memory for simplicity (use a database in production)
processed_data = {}

def clean_data(data, status_column="Status Bayar New"):
    return data[~data[status_column].isin(["By Telkom", "Include Sewa", "Local Electric", "Building Electricity"])]

def normalize_monthly_data(data_filtered, monthly_columns, site_column="No"):
    data_cleaned = (
        data_filtered.set_index(site_column)[monthly_columns]
        .replace(",", "", regex=True)
        .apply(pd.to_numeric, errors="coerce")
        .fillna(0)
    )
    return data_cleaned.T.loc[:, (data_cleaned.T != 0).any(axis=0)]

def get_columns_by_month(selected_month, tagihan_columns, kwh_columns):
    tagihan_end_index = selected_month
    kwh_end_index = selected_month

    tagihan_columns_filtered = tagihan_columns[:tagihan_end_index]
    kwh_columns_filtered = kwh_columns[:kwh_end_index]

    return tagihan_columns_filtered, kwh_columns_filtered