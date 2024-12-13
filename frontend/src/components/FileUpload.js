import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./FileUpload.css";

const FileUpload = ({ selectedMonth, onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // State for loading
  const navigate = useNavigate();

  // Validasi file CSV
  const validateFile = (selectedFile) => {
    if (!selectedFile) {
      setError("No file selected.");
      return false;
    }

    const fileType = selectedFile.type;
    const fileName = selectedFile.name;

    // Cek tipe file dan ekstensi untuk memastikan file CSV
    if (fileType !== "text/csv" && !fileName.endsWith(".csv")) {
      setError("Please upload a valid CSV file.");
      return false;
    }

    // Reset error jika valid
    setError("");
    return true;
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (validateFile(selectedFile)) {
      setFile(selectedFile);
    } else {
      setFile(null); // Reset file jika invalid
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError("No file selected.");
      return;
    }

    setLoading(true); // Mulai loading animation

    const formData = new FormData();
    formData.append("file", file);
    formData.append("month", selectedMonth);

    try {
      const response = await fetch("https://anomaly-detection-production.up.railway.app/upload/", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Upload failed");
      }

      const result = await response.json();
      console.log("Upload successful:", result);
      onUploadSuccess(result);
      navigate("/results");
    } catch (error) {
      console.error("Error uploading file:", error);
      setError(error.message || "An unexpected error occurred.");
    } finally {
      setLoading(false); // Stop loading animation
    }
  };

  return (
    <div className="upload-container">
      <input
        type="file"
        id="fileInput"
        onChange={handleFileChange}
        className="file-input"
      />
      <label
        htmlFor="fileInput"
        className={`file-input-label ${file ? "file-selected" : ""}`}
      >
        {file ? "File Chosen" : "Choose a file"}
      </label>

      {file && <p className="file-name">{file.name}</p>}

      <button
        onClick={handleUpload}
        className="upload-button"
        disabled={!file || loading} // Disable button when loading
      >
        {loading ? "Uploading..." : "Upload"}
      </button>

      {loading && <div className="loader"></div>} {/* Loading spinner */}

      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default FileUpload;
