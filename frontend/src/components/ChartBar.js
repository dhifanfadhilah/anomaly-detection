import React from "react";
import { Bar } from "react-chartjs-2";
import './ChartBar.css';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js modules
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const ChartBar = ({ labels, values, graphType }) => {
  const datasetLabel = graphType || "Dataset"; // Default if graphType is undefined

  const options = {
    responsive: true, // Pastikan chart responsif
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: `${datasetLabel} Data`,
      },
      tooltip: {
        enabled: true,
        callbacks: {
          label: (tooltipItem) => {
            return `${tooltipItem.label}: ${tooltipItem.raw} Sites`; // Tooltip dengan unit
          },
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Kabupaten",
        },
      },
      y: {
        beginAtZero: true,
      },
    },
    hover: {
      mode: "index",
      intersect: false,
    },
    animation: {
      duration: 1000,
      easing: "easeOutBounce",
    },
  };

  const data = {
    labels,
    datasets: [
      {
        label: `${datasetLabel} Dataset`,
        data: values,
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="chart-container">
      {/* <div className="chart-title">{`${datasetLabel} Data`}</div> */}
      <h2>Kabupaten Chart</h2>
      <Bar options={options} data={data} />
    </div>
  );
};

export default ChartBar;
