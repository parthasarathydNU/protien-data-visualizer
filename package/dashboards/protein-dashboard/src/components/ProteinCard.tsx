
import {Protein} from "./ProteinDetail"

const ProteinCard = ({ protein } : {protein: Protein}) => (
  <div className="bg-white shadow-md rounded-lg p-6 mb-6 overflow-y-auto">
    <h2 className="text-3xl font-bold mb-4">{protein.entry}</h2>
    <p><strong>Length:</strong> {protein.length}</p>
    <p><strong>First Seen:</strong> {protein.first_seen}</p>
    <p><strong>Last Seen:</strong> {protein.last_seen}</p>
    <p><strong>Sequence:</strong> {protein.sequence}</p>
    <p><strong>PFAM:</strong> {protein.pfam}</p>
    <p><strong>SMART:</strong> {protein.smart}</p>
    <p><strong>Average Hydrophobicity:</strong> {protein.avg_hydrophobicity}</p>
    <p><strong>Secondary Structure:</strong> {JSON.stringify(protein.secondary_structure)}</p>
    <p><strong>Amino Acid Composition:</strong> {JSON.stringify(protein.amino_acid_composition)}</p>
  </div>
);

export default ProteinCard;
