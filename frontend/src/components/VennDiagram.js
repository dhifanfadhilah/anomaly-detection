import React, { useEffect, useState } from "react";
import { Chart as ChartJS } from "chart.js";
import { VennDiagramChart } from "chartjs-chart-venn";

// Register the VennDiagramChart with Chart.js
ChartJS.register(VennDiagramChart);

const VennDiagram = ({ tagihanSites, kwhSites }) => {
  const [vennData, setVennData] = useState(null);

  // Fungsi untuk menghitung irisan antara dua array
  const getIntersection = (arr1, arr2) => {
    return arr1.filter(value => arr2.includes(value));
  };

  useEffect(() => {
    // Menghitung irisan antara tagihanSites dan kwhSites
    const intersection = getIntersection(tagihanSites, kwhSites);

    // Membuat data untuk diagram Venn
    const vennData = {
      type: "venn",  // Menggunakan tipe venn
      data: {
        labels: ["Tagihan", "KWh"],  // Label untuk set
        datasets: [
          {
            label: "Tagihan vs KWh",
            data: [
              { sets: ["Tagihan"], size: tagihanSites.length - intersection.length },  // Set Tagihan hanya
              { sets: ["KWh"], size: kwhSites.length - intersection.length },  // Set KWh hanya
              { sets: ["Tagihan", "KWh"], size: intersection.length },  // Irisan Tagihan & KWh
            ]
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: "top",  // Posisi legenda
          },
          title: {
            display: true,
            text: "Diagram Venn - Tagihan vs KWh"  // Judul diagram
          },
        }
      }
    };

    // Update state vennData
    setVennData(vennData);
  }, [tagihanSites, kwhSites]);

  useEffect(() => {
    // Jika vennData sudah siap, buat chart
    if (vennData) {
      const ctx = document.getElementById("canvas");
      new VennDiagramChart(ctx, vennData);
    }
  }, [vennData]);

  return (
    <div>
      <h2>Venn Diagram - Tagihan vs KWh</h2>
      <canvas id="canvas"></canvas>
    </div>
  );
};

export default VennDiagram;
