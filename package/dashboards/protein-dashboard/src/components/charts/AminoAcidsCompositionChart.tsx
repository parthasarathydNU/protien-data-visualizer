import React from "react";
import { Bar } from "react-chartjs-2";

interface AminoAcidCompositionProps {
  composition: { [key: string]: number };
}

const AminoAcidCompositionChart: React.FC<AminoAcidCompositionProps> = ({
  composition,
}) => {
  const data = {
    labels: Object.keys(composition),
    datasets: [
      {
        label: "Amino Acid Composition (%)",
        data: Object.values(composition),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
    ],
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return <Bar data={data} options={options} />;
};

export default AminoAcidCompositionChart;
