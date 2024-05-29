import React from "react";
import { Pie } from "react-chartjs-2";

interface SecondaryStructureProps {
  structure: { [key: string]: number };
}

const SecondaryStructureChart: React.FC<SecondaryStructureProps> = ({
  structure,
}) => {
  const data = {
    labels: Object.keys(structure),
    datasets: [
      {
        label: "Secondary Structure Composition",
        data: Object.values(structure),
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
        ],
      },
    ],
  };

  return (
    <div>
      <Pie data={data} />
    </div>
  );
};

export default SecondaryStructureChart;
