import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {fetchProtein} from "../api"

interface Protein {
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

  useEffect(() => {
    const getData = async () => {
      try {
        if(!entry) return ;
        const response = await fetchProtein(entry);
        setProtein(response);
      } catch (error) {
        console.error('Error fetching protein data', error);
      }
    };

    getData();
  }, [entry]);

  if (!protein) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">{protein.entry}</h2>
      <p><strong>Entry:</strong> {protein.entry}</p>
      <p><strong>Names:</strong> {protein.protein_names}</p>
      <p><strong>Length:</strong> {protein.length}</p>
      <p><strong>First Seen:</strong> {protein.first_seen}</p>
      <p><strong>Last Seen:</strong> {protein.last_seen}</p>
      <p><strong>Organism ID:</strong> {protein.organism_id}</p>
      <p><strong>Sequence:</strong> {protein.sequence}</p>
      <p><strong>Pfam:</strong> {protein.pfam}</p>
      <p><strong>Smart:</strong> {protein.smart}</p>
      <p><strong>Amino Acid Composition:</strong></p>
      <ul>
        {Object.entries(protein.amino_acid_composition).map(([amino, value]) => (
          <li key={amino}>{amino}: {value}</li>
        ))}
      </ul>
      <p><strong>Average Hydrophobicity:</strong> {protein.avg_hydrophobicity}</p>
      <p><strong>Secondary Structure:</strong> {protein.secondary_structure.join(', ')}</p>
    </div>
  );
};

export default ProteinDetail;
