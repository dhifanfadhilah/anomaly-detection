import React, { useState, useRef, useEffect } from "react";
import DownloadCSV from "../components/DownloadCSV";
import ChartBar from "../components/ChartBar";
import ChartGraph from "../components/ChartGraph";
import "./Results.css";

const Results = ({ data }) => {
  const [selectedSite, setSelectedSite] = useState(null);
  const [siteDetails, setSiteDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Menambahkan ref untuk scroll ke site details
  const siteDetailsRef = useRef(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [sitesPerPage] = useState(10); // Jumlah site per halaman

  // Mengambil data sites untuk halaman tertentu
  const indexOfLastSite = currentPage * sitesPerPage;
  const indexOfFirstSite = indexOfLastSite - sitesPerPage;
  const currentSites = data.anomalies.slice(indexOfFirstSite, indexOfLastSite);

  // Menambahkan ref untuk scroll ke site details setelah data berhasil diambil
  useEffect(() => {
    if (siteDetails) {
      siteDetailsRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [siteDetails]); // Hanya dipanggil setelah siteDetails berubah

  if (!data) {
    return <p>No data available. Please upload a file first.</p>;
  }

  const fetchSiteDetails = async (siteName) => {
    if (siteName === selectedSite) return;

    setLoading(true);
    setError("");
    setSelectedSite(siteName);

    try {
      const response = await fetch(`http://127.0.0.1:8000/site/${siteName}`);
      if (!response.ok) {
        throw new Error("Failed to fetch the site details");
      }
      const details = await response.json();
      setSiteDetails(details);
    } catch (err) {
      setError(err.message || "An unexpected error occurred.");
      setSiteDetails(null);
    } finally {
      setLoading(false);
    }
  };

  const closeDetails = () => {
    setSelectedSite(null);
    setSiteDetails(null);
    setError("");
  };

  // Fungsi untuk ganti halaman
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="results-container">
      <header className="results-header">
        <h1>Analysis Results</h1>
        <DownloadCSV />
      </header>

      {/* Summary Section */}
      <section className="summary-section">
        <div className="summary-card">
          <h3>Anomalies Tagihan</h3>
          <p>{data.tagihan_anomalies_count}</p>
        </div>
        <div className="summary-card">
          <h3>Total Sites With Anomalies</h3>
          <p>{data.total_anomalies_count}</p>
        </div>
        <div className="summary-card">
          <h3>Kwh Anomalies</h3>
          <p>{data.kwh_anomalies_count}</p>
        </div>
      </section>

      {/* Venn Diagram dan Kabupaten Chart dalam satu baris */}
      <section className="diagram-chart-section">
        <div className="venn-container">
          <h2>Venn Diagram</h2>
          <img
            className="venn-diagram"
            src={`data:image/png;base64,${data.venn_diagram}`}
            alt="Venn Diagram"
          />
        </div>
        {/* <div className="chart-container"> */}
        {/* <h2>Kabupaten Chart</h2> */}
        <ChartBar
          labels={data.kab_labels}
          values={data.kab_values}
          graphType="Kabupaten"
        />
        {/* </div> */}
      </section>

      {/* Tabel Sites with Anomalies */}
      <section className="sites-section">
        <h2>Sites with Anomalies</h2>
        <table className="site-table">
          <thead className="table-head">
            <tr>
              <th>No</th>
              <th>Site ID</th>
              <th>Site Name</th>
              <th>Tipe Anomali</th>
              <th>Cluster</th>
              <th>Status Bayar</th>
            </tr>
          </thead>
          <tbody>
            {currentSites.map((site, index) => (
              <tr
                key={index}
                onClick={() => fetchSiteDetails(site)}
                className="site-detail-button"
              >
                <td>{(currentPage - 1) * sitesPerPage + index + 1}</td>
                <td className="site-id-table">
                  {/* <button
                    onClick={() => fetchSiteDetails(site)}
                    className="site-id-button"
                  > */}
                  {site}
                  {/* </button> */}
                </td>
                <td>
                  {
                    data.anomalies_site_name[
                      (currentPage - 1) * sitesPerPage + index
                    ]
                  }
                </td>
                <td>
                  {data.anomaly_type[(currentPage - 1) * sitesPerPage + index]}
                </td>
                <td>
                  {
                    data.anomalies_cluster[
                      (currentPage - 1) * sitesPerPage + index
                    ]
                  }
                </td>
                <td>
                  {
                    data.anomalies_payment[
                      (currentPage - 1) * sitesPerPage + index
                    ]
                  }
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="pagination">
          {Array.from(
            { length: Math.ceil(data.anomalies.length / sitesPerPage) },
            (_, i) => (
              <button
                key={i}
                onClick={() => paginate(i + 1)}
                className={currentPage === i + 1 ? "active" : ""}
              >
                {i + 1}
              </button>
            )
          )}
        </div>
      </section>

      {/* Loading, Error, and Site Details */}
      {loading && selectedSite && (
        <p className="loading-message">Loading details for {selectedSite}...</p>
      )}
      {error && selectedSite && <p className="error-message">{error}</p>}

      {siteDetails && selectedSite && (
        <section ref={siteDetailsRef} className="site-details-section">
          <div className="site-details-card">
            <button onClick={closeDetails} className="close-button">
              X
            </button>

            <h3>{siteDetails.site_id}</h3>
            <h3>{siteDetails.site_name}</h3>
            <p>Status Bayar: {siteDetails.status_bayar}</p>
            <p>Kabupaten: {siteDetails.kabupaten}</p>

            <h4>Bill Graph</h4>
            <ChartGraph
              labels={siteDetails.graph_labels}
              values={siteDetails.tagihan_values}
              graphType="Tagihan"
            />

            <h4>kWh Graph</h4>
            <ChartGraph
              labels={siteDetails.graph_labels}
              values={siteDetails.kwh_values}
              graphType="kWh"
            />

            {/* <button onClick={closeDetails} className="close-button">
              Close
            </button> */}
          </div>
        </section>
      )}
    </div>
  );
};

export default Results;
