from pydantic import BaseModel
from typing import Optional, Dict, List
from datetime import date

class ProteinBase(BaseModel):
    entry: str
    organisms: Optional[str] = None
    length: Optional[int] = None
    first_seen: Optional[date] = None
    last_seen: Optional[date] = None
    organism_id: Optional[str] = None
    protein_names: Optional[str] = None
    sequence: Optional[str] = None
    pfam: Optional[str] = None
    smart: Optional[str] = None
    amino_acid_composition: Optional[Dict[str, float]] = None  # Expect a dictionary
    avg_hydrophobicity: Optional[float] = None
    secondary_structure: Optional[List[str]] = None  # Expect a list

    class Config:
        from_attributes = True
