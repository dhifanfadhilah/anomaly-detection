import matplotlib.pyplot as plt
from matplotlib_venn import venn2
import io
import base64
from app.utils.data_analysis import normalize_monthly_data

# Venn Diagram
def generate_venn_diagram(tagihan_sites, kwh_sites):
    plt.figure(figsize=(8, 6))
    venn = venn2([set(tagihan_sites), set(kwh_sites)], set_labels=("Anomali Tagihan", "Anomali KWh"))
    venn.get_patch_by_id("10").set_color("blue")
    venn.get_patch_by_id("10").set_edgecolor("black")
    venn.get_patch_by_id("01").set_color("red")
    venn.get_patch_by_id("01").set_edgecolor("black")
    
    img = io.BytesIO()
    plt.title("Venn Diagram - Anomali Berdasarkan Kwh dan Tagihan")
    plt.savefig(img, format="png")
    img.seek(0)
    venn_html = base64.b64encode(img.getvalue()).decode()
    plt.close()
    return venn_html

# Kabupaten Chart
def generate_kab_chart(data):
    kab_counts = data["Cluster"].str.replace("TO", "").value_counts()
    # kab_labels = kab_counts.index.tolist()

    plt.figure(figsize=(8, 6))
    plt.bar(kab_counts.index, kab_counts.values)
    plt.title("Kabupaten Site Anomali")
    plt.xlabel("Kabupaten")
    plt.ylabel("Number of Sites")
    for i, count in enumerate(kab_counts):
        plt.text(i, count/1, str(count), ha='center', va='center', fontsize=10)
    plt.xticks(rotation=45, ha="right", fontsize=10)
    plt.tight_layout()

    img = io.BytesIO()
    plt.savefig(img, format="png")
    img.seek(0)
    kab_chart_html = base64.b64encode(img.getvalue()).decode()
    plt.close()
    return kab_chart_html

# Site Graph (Bills or kWh)
def generate_site_graph(data, site_id, graph_type="Bill"):
    # Determine which columns to use based on graph type
    if graph_type == "Bill":
        columns = ['Jan-24', 'Feb-24', 'Mar-24', 'Apr-24', 'May-24', 'Jun-24', 'Jul-24', 'Aug-24', 'Sep-24', 'Oct-24']  # Adjust these based on your CSV
    elif graph_type == "kWh":
        columns = ['∑KwH', '∑KwH.1', '∑KwH.2', '∑KwH.3', '∑KwH.4', '∑KwH.5', '∑KwH.6', '∑KwH.7', '∑KwH.8', '∑KwH.9']  # Adjust these based on your CSV
    else:
        raise ValueError("Invalid graph type. Choose 'Bill' or 'kWh'.")
    
    months = ['Jan-24', 'Feb-24', 'Mar-24', 'Apr-24', 'May-24', 'Jun-24', 'Jul-24', 'Aug-24', 'Sep-24', 'Oct-24']

    site_data = normalize_monthly_data(data, columns, site_column="Site ID")

    if site_data.empty:
        raise ValueError(f"No data found for site: {site_id}")

    plt.figure(figsize=(8, 5))
    plt.plot(months, site_data[site_id], marker="o", label=site_id)
    plt.title(f"{graph_type} Data for {site_id}")
    plt.xlabel("Months")
    plt.ylabel(graph_type)
    plt.xticks(rotation=45)
    plt.grid(True)
    plt.legend()
    plt.grid(True)

    img = io.BytesIO()
    plt.savefig(img, format="png")
    img.seek(0)
    graph_html = base64.b64encode(img.getvalue()).decode()
    plt.close()
    return graph_html
