import React, { useState } from 'react';
import { createProtein } from '../api';

const AddProtein: React.FC = () => {
  const [protein, setProtein] = useState({
    entry: '',
    length: '',
    first_seen: '',
    last_seen: '',
    sequence: '',
    pfam: '',
    smart: '',
    amino_acid_composition: '',
    avg_hydrophobicity: '',
    secondary_structure: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProtein({ ...protein, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createProtein(protein);
    setProtein({
      entry: '',
      length: '',
      first_seen: '',
      last_seen: '',
      sequence: '',
      pfam: '',
      smart: '',
      amino_acid_composition: '',
      avg_hydrophobicity: '',
      secondary_structure: ''
    });
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Add Protein</h1>
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        <input className="border p-2" type="text" name="entry" placeholder="Entry" value={protein.entry} onChange={handleChange} />
        <input className="border p-2" type="number" name="length" placeholder="Length" value={protein.length} onChange={handleChange} />
        <input className="border p-2" type="date" name="first_seen" placeholder="First Seen" value={protein.first_seen} onChange={handleChange} />
        <input className="border p-2" type="date" name="last_seen" placeholder="Last Seen" value={protein.last_seen} onChange={handleChange} />
        <input className="border p-2" type="text" name="sequence" placeholder="Sequence" value={protein.sequence} onChange={handleChange} />
        <input className="border p-2" type="text" name="pfam" placeholder="Pfam" value={protein.pfam} onChange={handleChange} />
        <input className="border p-2" type="text" name="smart" placeholder="SMART" value={protein.smart} onChange={handleChange} />
        <input className="border p-2" type="text" name="amino_acid_composition" placeholder="Amino Acid Composition" value={protein.amino_acid_composition} onChange={handleChange} />
        <input className="border p-2" type="number" step="0.01" name="avg_hydrophobicity" placeholder="Avg. Hydrophobicity" value={protein.avg_hydrophobicity} onChange={handleChange} />
        <input className="border p-2" type="text" name="secondary_structure" placeholder="Secondary Structure" value={protein.secondary_structure} onChange={handleChange} />
        <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Add Protein</button>
      </form>
    </div>
  );
};

export default AddProtein;
