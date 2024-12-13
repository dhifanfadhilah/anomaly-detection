import pandas as pd
from app.utils.visualizations import generate_venn_diagram, generate_kab_chart, generate_site_graph
from app.utils.data_analysis import normalize_monthly_data, clean_data, get_columns_by_month
import io
import datetime

# In-memory storage for session data
processed_data = {}
 
def detect_constant_bills(site_data, months=2):
    differences = site_data.diff()
    last_months = differences.tail(months)
    return (last_months == 0).all()

def detect_anomalies(data_transposed_cleaned):
    sites_with_anomalies = []
    for site in data_transposed_cleaned.columns:
        site_data = data_transposed_cleaned[site].dropna()
        if site_data.empty:
            continue
        if detect_constant_bills(site_data).all():
            sites_with_anomalies.append(site)
    return sites_with_anomalies

def list_to_dataframe(original_data, list_anomalies):
    list_anomalies_df = pd.DataFrame(list(list_anomalies),columns=['No'])
    filtered_data = original_data[original_data['No'].isin(list_anomalies_df['No'])]

    return filtered_data

def process_file(content: bytes, selected_month: int) -> dict:
    data = pd.read_csv(io.BytesIO(content), header=1)

    current_year = str(datetime.datetime.now().year)[-2:]

    # Clean and process data
    data_filtered = clean_data(data)
    # tagihan_columns = ['Jan-24', 'Feb-24', 'Mar-24', 'Apr-24', 'May-24', 'Jun-24', 'Jul-24', 'Aug-24', 'Sep-24', 'Oct-24', 'Nov-24', 'Dec-24']
    tagihan_columns = [f'{month}-{current_year}' for month in ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']]
    kwh_columns = ['∑KwH', '∑KwH.1', '∑KwH.2', '∑KwH.3', '∑KwH.4', '∑KwH.5', '∑KwH.6', '∑KwH.7', '∑KwH.8', '∑KwH.9', '∑KwH.10', '∑KwH.11']

    # Normalize data
    tagihan_columns_filtered, kwh_columns_filtered = get_columns_by_month(selected_month, tagihan_columns, kwh_columns)
    data_tagihan = normalize_monthly_data(data_filtered, tagihan_columns_filtered)
    data_kwh = normalize_monthly_data(data_filtered, kwh_columns_filtered)

    # Detect anomalies
    tagihan_anomalies = detect_anomalies(data_tagihan)
    kwh_anomalies = detect_anomalies(data_kwh)

    # Combine anomalies from both sets
    list_total_anomalies = set(tagihan_anomalies) | set(kwh_anomalies)
    total_anomalies_data = list_to_dataframe(data, list_total_anomalies)

    anomaly_type = []
    for index in total_anomalies_data['No']:
        if index in set(tagihan_anomalies) and index in set(kwh_anomalies):
            anomaly_type.append('Tagihan dan Kwh')
        elif index in set(tagihan_anomalies):
            anomaly_type.append('Tagihan')
        elif index in set(kwh_anomalies):
            anomaly_type.append('Kwh')

    type_df = pd.DataFrame({
        'No': total_anomalies_data['No'],
        'Anomaly Type': anomaly_type
    })

    filtered_data_anomalies = total_anomalies_data['Site ID'].tolist()
    anomalies_site_name = total_anomalies_data['Site Name'].tolist()
    anomalies_cluster = total_anomalies_data['Cluster'].tolist()
    anomalies_category = type_df['Anomaly Type'].tolist()
    anomalies_payment = total_anomalies_data['Status Bayar New'].tolist()

    # Count anomalies
    # tagihan_anomalies_count = len(tagihan_anomalies)
    tagihan_anomalies_count = anomaly_type.count('Tagihan')
    # kwh_anomalies_count = len(kwh_anomalies)
    kwh_anomalies_count = anomaly_type.count('Kwh')
    total_anomalies_count = len(list_total_anomalies)

    # Generate visualizations
    venn_diagram = generate_venn_diagram(tagihan_anomalies, kwh_anomalies)
    kab_count = total_anomalies_data["Cluster"].str.replace("TO", "").value_counts()
    kab_labels = kab_count.index.tolist()
    kab_values = kab_count.values.tolist()

    # Store results in session data
    processed_data["data"] = data
    processed_data["total_anomalies_data"] = total_anomalies_data
    processed_data["tagihan_anomalies"] = tagihan_anomalies
    processed_data["kwh_anomalies"] = kwh_anomalies
    processed_data["tagihan_columns_filtered"] = tagihan_columns_filtered
    processed_data["kwh_columns_filtered"] = kwh_columns_filtered
    processed_data["data_kwh"] = data_kwh

    return {
        "venn_diagram": venn_diagram,
        "anomalies": filtered_data_anomalies,
        "tagihan_anomalies_count": tagihan_anomalies_count,
        "kwh_anomalies_count": kwh_anomalies_count,
        "total_anomalies_count": total_anomalies_count,
        "kab_labels": kab_labels,
        "kab_values": kab_values,
        "tagihanSites": tagihan_anomalies,
        "kwhSites": kwh_anomalies,
        "anomalies_site_name": anomalies_site_name,
        "anomaly_type": anomalies_category,
        "anomalies_cluster": anomalies_cluster,
        "anomalies_payment": anomalies_payment,
    }

def get_site_details(site_id: str) -> dict:
    """
    Retrieve detailed data and graphs for a specific site.
    """
    data = processed_data.get("total_anomalies_data")
    if data is None:
        raise ValueError("No data found. Please upload a file first.")
    
    tagihan_columns = processed_data.get("tagihan_columns_filtered")
    kwh_columns = processed_data.get("kwh_columns_filtered")
    if tagihan_columns is None or kwh_columns is None:
        raise ValueError("error in tagihan_columns or kwh_columns")

    data["Cluster"] = data["Cluster"].str.replace('TO', '', regex=True)
    tagihan_graph_data = normalize_monthly_data(data, tagihan_columns, site_column="Site ID")
    kwh_graph_data = normalize_monthly_data(data, kwh_columns, site_column="Site ID")
    tagihan_values = tagihan_graph_data[site_id].tolist()
    kwh_values = kwh_graph_data[site_id].tolist()
    
    site_data = data[data["Site ID"] == site_id]
    if site_data.empty:
        raise ValueError(f"No data found for site: {site_id}")
   
    status_bayar = site_data["Status Bayar New"].iloc[0]
    site_name = site_data["Site Name"].iloc[0]
    kabupaten = site_data["Cluster"].iloc[0]

    # Generate graphs for the site
    try:
        bill_graph = generate_site_graph(data, site_id, "Bill")
        kwh_graph = generate_site_graph(data, site_id, "kWh")
    except Exception as e:
        raise ValueError(f"Error generating graphs for site {site_id}: {str(e)}")

    return {
        "site_id": site_id,
        "site_name": site_name,
        "kabupaten": kabupaten,
        "tagihan_values": tagihan_values,
        "kwh_values": kwh_values,
        "graph_labels": tagihan_columns,
        "status_bayar": status_bayar,
    }

def get_anomalies_csv() -> str:
    data = processed_data.get("total_anomalies_data")
    if data is None:
        raise ValueError("No data found. Please upload a file first.")
    # csv_stream = io.StringIO()
    # data.to_csv(csv_stream, index=False)
    # return csv_stream.getvalue()

    excel_stream = io.BytesIO()
    with pd.ExcelWriter(excel_stream) as writer:
        data.to_excel(writer, index=False, sheet_name="Anomalies")
    
    excel_stream.seek(0)
    return excel_stream.getvalue()
