
import {Protein} from "./ProteinDetail"
import TextWrapper from "./TextWrapper";

const ProteinCard = ({ protein } : {protein: Protein}) => (
  <div className="bg-white shadow-md rounded-lg p-6 mb-6 overflow-y-auto">
    <h2 className="text-3xl font-bold mb-4">{protein.entry}</h2>
    <p><strong>Length:</strong> {protein.length}</p>
    <p><strong>First Seen:</strong> {protein.first_seen}</p>
    <p><strong>Last Seen:</strong> {protein.last_seen}</p>
    <p><strong>Sequence:</strong> <TextWrapper text={protein.sequence} maxLength={100} /> </p>
    <p><strong>PFAM:</strong> {protein.pfam}</p>
    <p><strong>SMART:</strong> {protein.smart}</p>
    <p><strong>Average Hydrophobicity:</strong> {protein.avg_hydrophobicity}</p>
    <p><strong>Secondary Structure:</strong> <TextWrapper text={JSON.stringify(protein.secondary_structure)} maxLength={100} /></p>
    <p><strong>Amino Acid Composition:</strong> <TextWrapper text={JSON.stringify(protein.amino_acid_composition)} maxLength={100} /> </p>
  </div>
);

export default ProteinCard;
