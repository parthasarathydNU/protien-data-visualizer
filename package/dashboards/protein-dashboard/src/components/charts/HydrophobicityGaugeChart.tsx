import React from "react";
import GaugeChart from "react-gauge-chart";

interface HydrophobicityProps {
  hydrophobicity: number;
}

const HydrophobicityGauge: React.FC<HydrophobicityProps> = ({
  hydrophobicity,
}) => {
  const normalizedHydrophobicity = (hydrophobicity + 4.5) / 9; // Normalize to 0-1 scale

  return (
    <div>
      <GaugeChart
        id="hydrophobicity-gauge"
        nrOfLevels={30}
        percent={normalizedHydrophobicity}
        textColor="#000000"
        colors={["#FF5F6D", "#FFC371"]}
        formatTextValue={(value: any) => `${(value * 9 - 4.5).toFixed(2)}`}
      />
    </div>
  );
};

export default HydrophobicityGauge;
