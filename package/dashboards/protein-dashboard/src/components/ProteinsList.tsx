import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchProteins, deleteProtein } from "../api";

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
      setProteins(data || []);
    };
    getProteins();
  }, []);



  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Proteins List</h1>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2">Entry</th>
            <th className="py-2">Length</th>
            <th className="py-2">First Seen</th>
            <th className="py-2">Last Seen</th>
            <th className="py-2">Pfam</th>
            <th className="py-2">SMART</th>
            <th className="py-2">Avg. Hydrophobicity</th>
            <th className="py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {proteins.map((protein) => (
            <tr key={protein.entry}>
              <Link
                to={`/proteins/${protein.entry}`}
                className="underline"
              >
                <td className="border px-4 py-2">{protein.entry}</td>
              </Link>
              <td className="border px-4 py-2">{protein.length}</td>
              <td className="border px-4 py-2">{protein.first_seen}</td>
              <td className="border px-4 py-2">{protein.last_seen}</td>
              <td className="border px-4 py-2">{protein.pfam}</td>
              <td className="border px-4 py-2">{protein.smart}</td>
              <td className="border px-4 py-2">{protein.avg_hydrophobicity}</td>
              <td className="border px-4 py-2">
                <Link
                  to={`/edit-protein?entry=${protein.entry}`}
                  className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded mr-2"
                >
                  Edit
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProteinsList;
