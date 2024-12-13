import React from "react";
import "./DownloadCSV.css"; // Make sure to import the CSS file

const DownloadCSV = () => {
  const downloadCSV = () => {
    fetch("https://anomaly-detection-production.up.railway.app/download_csv/") // Backend URL for the CSV
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to download CSV");
        }
        return response.blob();
      })
      .then((blob) => {
        // Create a temporary URL for the blob and trigger download
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.style.display = "none";
        a.href = url;
        a.download = "anomalies_data.xlsx"; // Suggested filename
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      })
      .catch((error) => {
        console.error("Error downloading CSV:", error);
        alert("Failed to download CSV. Please try again.");
      });
  };

  return (
    <button onClick={downloadCSV} className="download-csv-button">
      Download Excel
    </button>
  );
};

export default DownloadCSV;
