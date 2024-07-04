import { ProteinData } from "api/apiDataTypes";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchProteins } from "../api/api";


const ProteinsList: React.FC = () => {
  const [proteins, setProteins] = useState<ProteinData[]>([]);

  useEffect(() => {
    const getProteins = async () => {
      const data = await fetchProteins();
      setProteins(data || []);
    };
    getProteins();
  }, []);



  return (
    <div>
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
            {/* <th className="py-2">Actions</th> */}
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
              <td className="border px-4 py-2">{protein.length.toString()}</td>
              <td className="border px-4 py-2">{protein.first_seen.toString()}</td>
              <td className="border px-4 py-2">{protein.last_seen.toString()}</td>
              <td className="border px-4 py-2">{protein.pfam}</td>
              <td className="border px-4 py-2">{protein.smart}</td>
              <td className="border px-4 py-2">{protein.avg_hydrophobicity.toString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProteinsList;
