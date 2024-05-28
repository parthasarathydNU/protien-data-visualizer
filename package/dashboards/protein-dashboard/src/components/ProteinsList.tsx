import React, { useEffect, useState } from 'react';
import { fetchProteins, deleteProtein } from '../api';

interface Protein {
  entry: string;
  length: number;
  first_seen: string;
  last_seen: string;
  sequence: string;
  pfam: string;
  smart: string;
  avg_hydrophobicity: number;
}

const ProteinsList: React.FC = () => {
  const [proteins, setProteins] = useState<Protein[]>([]);

  useEffect(() => {
    const getProteins = async () => {
      const data = await fetchProteins();
      setProteins(data);
    };
    getProteins();
  }, []);

  const handleDelete = async (entry: string) => {
    await deleteProtein(entry);
    setProteins(proteins.filter(protein => protein.entry !== entry));
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Proteins List</h1>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2">Entry</th>
            <th className="py-2">Length</th>
            <th className="py-2">First Seen</th>
            <th className="py-2">Last Seen</th>
            <th className="py-2">Sequence</th>
            <th className="py-2">Pfam</th>
            <th className="py-2">SMART</th>
            <th className="py-2">Avg. Hydrophobicity</th>
            <th className="py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {proteins.map((protein) => (
            <tr key={protein.entry}>
              <td className="border px-4 py-2">{protein.entry}</td>
              <td className="border px-4 py-2">{protein.length}</td>
              <td className="border px-4 py-2">{protein.first_seen}</td>
              <td className="border px-4 py-2">{protein.last_seen}</td>
              <td className="border px-4 py-2">{protein.sequence}</td>
              <td className="border px-4 py-2">{protein.pfam}</td>
              <td className="border px-4 py-2">{protein.smart}</td>
              <td className="border px-4 py-2">{protein.avg_hydrophobicity}</td>
              <td className="border px-4 py-2">
                <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" onClick={() => handleDelete(protein.entry)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProteinsList;
