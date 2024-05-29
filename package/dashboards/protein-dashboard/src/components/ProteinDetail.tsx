import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchProtein } from "../api";
import Protein3DViewer, { secondaryStructures } from "./Protein3DViewer";
import ProteinCard from "./ProteinCard";
import ProteinVisualization from "./ProteinDataVisualion";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";

export interface Protein {
  entry: string;
  length: number;
  first_seen: string;
  last_seen: string;
  organism_id: string;
  protein_names: string;
  sequence: string;
  pfam: string;
  smart: string;
  amino_acid_composition: Record<string, number>;
  avg_hydrophobicity: number;
  secondary_structure: string[];
}

const ProteinDetail: React.FC = () => {
  const { entry } = useParams<{ entry: string }>();
  const [protein, setProtein] = useState<Protein | null>(null);
  const [tabIndex, setTabIndex] = useState(0);

  useEffect(() => {
    const getData = async () => {
      try {
        if (!entry) return;
        const response = await fetchProtein(entry);
        setProtein(response);
      } catch (error) {
        console.error("Error fetching protein data", error);
      }
    };

    getData();
  }, [entry]);

  if (!protein) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      {protein ? (
        <Tabs selectedIndex={tabIndex} onSelect={(index) => setTabIndex(index)}>
          <TabList>
            <Tab>Metadata</Tab>
            <Tab>3D Viz</Tab>
            <Tab>Charts</Tab>
          </TabList>

          <TabPanel>
            <ProteinCard protein={protein} />
          </TabPanel>
          <TabPanel>
            <Protein3DViewer
              sequence={protein.sequence}
              secondaryStructure={
                protein.secondary_structure as secondaryStructures[]
              }
            />
          </TabPanel>
          <TabPanel>
            <ProteinVisualization proteinId={protein.entry} />
          </TabPanel>
        </Tabs>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default ProteinDetail;
