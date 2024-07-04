import React, { useEffect, useState } from "react";
import AminoAcidCompositionChart from "./charts/AminoAcidsCompositionChart";
import SecondaryStructureChart from "./charts/SecondaryStructureChart";
import HydrophobicityGauge from "./charts/HydrophobicityGaugeChart";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import { fetchProteinCalculations } from "../api/api";

interface ProteinData {
  length: number;
  avg_hydrophobicity: number;
  amino_acid_composition: { [key: string]: number };
  secondary_structure: { [key: string]: number };
}

const ProteinVisualization: React.FC<{ proteinId: string }> = ({
  proteinId,
}) => {
  const [proteinData, setProteinData] = useState<ProteinData | null>(null);
  const [tabIndex, setTabIndex] = useState(0);

  useEffect(() => {
    const fetchProteinData = async () => {
      try {
        const response = await fetchProteinCalculations(proteinId);
        setProteinData(response);
      } catch (error) {
        console.error("Error fetching protein data:", error);
      }
    };

    fetchProteinData();
  }, [proteinId]);

  if (!proteinData) {
    return <div>Loading Charts...</div>;
  }

  return (
    <div>
      <Tabs selectedIndex={tabIndex} onSelect={(index) => setTabIndex(index)}>
        <TabList>
          <Tab>Amino Acid Composition</Tab>
          <Tab>Secondary Structure Composition</Tab>
          <Tab>Hydrophobicity</Tab>
        </TabList>

        <TabPanel>
          <AminoAcidCompositionChart
            composition={proteinData.amino_acid_composition}
          />
        </TabPanel>
        <TabPanel>
          <SecondaryStructureChart
            structure={proteinData.secondary_structure}
          />
        </TabPanel>
        <TabPanel>
          <HydrophobicityGauge
            hydrophobicity={proteinData.avg_hydrophobicity}
          />
        </TabPanel>
      </Tabs>
    </div>
  );
};

export default ProteinVisualization;
