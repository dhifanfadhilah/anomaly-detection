import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js modules
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const ChartGraph = ({ labels, values, graphType }) => {
  // Validasi data yang diterima
  if (!labels || !values || labels.length !== values.length) {
    console.error("Labels and values must have the same length");
    return null; // Return nothing if data is invalid
  }

  // Opsi chart
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top", // Posisi legend (di atas chart)
      },
      title: {
        display: true,
        text: `${graphType} Data`, // Judul chart berdasarkan props graphType
      },
      tooltip: {
        enabled: true, // Enable tooltips untuk interaktivitas
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Months", // Menambahkan judul untuk sumbu X
        },
      },
      y: {
        // beginAtZero: true, // Memulai sumbu Y dari 0
        title: {
          display: true,
          text: `${graphType} Value`, // Judul untuk sumbu Y (misalnya, Sales, Revenue)
        },
      },
    },
  };

  // Data untuk chart
  const data = {
    labels, // Labels (misalnya, bulan atau kategori)
    datasets: [
      {
        label: `${graphType}`, // Label dataset
        data: values, // Data untuk sumbu Y
        backgroundColor: "rgba(75, 192, 192, 0.2)", // Warna latar belakang area grafik
        borderColor: "rgba(75, 192, 192, 1)", // Warna garis grafik
        borderWidth: 2, // Ketebalan garis grafik
        fill: true, // Mengisi area di bawah grafik
      },
    ],
  };

  return <Line options={options} data={data} />;
};

export default ChartGraph;
