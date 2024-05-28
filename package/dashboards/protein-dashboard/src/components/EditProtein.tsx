import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { fetchProtein, updateProtein } from "../api";

const EditProtein: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const entry = queryParams.get("entry") || "";
  const [protein, setProtein] = useState({
    entry: "",
    length: "",
    first_seen: "",
    last_seen: "",
    sequence: "",
    pfam: "",
    smart: "",
    amino_acid_composition: "",
    avg_hydrophobicity: "",
    secondary_structure: "",
  });

  useEffect(() => {
    const getProtein = async () => {
      if (!entry) return;
      const data = await fetchProtein(entry);
      setProtein(data);
    };
    getProtein();
  }, [entry]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProtein({ ...protein, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!entry) {
      return;
    }
    await updateProtein(entry, protein);
    navigate("/");
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Edit Protein</h1>
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        <input
          className="border p-2"
          type="text"
          name="entry"
          placeholder="Entry"
          value={protein.entry}
          onChange={handleChange}
          readOnly
        />
        <input
          className="border p-2"
          type="number"
          name="length"
          placeholder="Length"
          value={protein.length}
          onChange={handleChange}
        />
        <input
          className="border p-2"
          type="date"
          name="first_seen"
          placeholder="First Seen"
          value={protein.first_seen}
          onChange={handleChange}
        />
        <input
          className="border p-2"
          type="date"
          name="last_seen"
          placeholder="Last Seen"
          value={protein.last_seen}
          onChange={handleChange}
        />
        <input
          className="border p-2"
          type="text"
          name="sequence"
          placeholder="Sequence"
          value={protein.sequence}
          onChange={handleChange}
        />
        <input
          className="border p-2"
          type="text"
          name="pfam"
          placeholder="Pfam"
          value={protein.pfam}
          onChange={handleChange}
        />
        <input
          className="border p-2"
          type="text"
          name="smart"
          placeholder="SMART"
          value={protein.smart}
          onChange={handleChange}
        />
        <input
          className="border p-2"
          type="text"
          name="amino_acid_composition"
          placeholder="Amino Acid Composition"
          value={JSON.stringify(protein.amino_acid_composition)}
          onChange={handleChange}
        />
        <input
          className="border p-2"
          type="number"
          step="0.01"
          name="avg_hydrophobicity"
          placeholder="Avg. Hydrophobicity"
          value={protein.avg_hydrophobicity}
          onChange={handleChange}
        />
        <input
          className="border p-2"
          type="text"
          name="secondary_structure"
          placeholder="Secondary Structure"
          value={protein.secondary_structure}
          onChange={handleChange}
        />
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Update Protein
        </button>
      </form>
    </div>
  );
};

export default EditProtein;
