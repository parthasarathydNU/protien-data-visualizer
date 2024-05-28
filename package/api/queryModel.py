from pydantic import BaseModel

class QueryRequest(BaseModel):
    query: str

class QueryResponse(BaseModel):
    sql_query: str

DB_SCHEMA = """
The database has the following tables and columns:
Table: protein_data
- entry (varchar): Primary key, unique identifier for each protein.
- organisms (varchar): The organisms where the protein is found.
- length (int): The length of the protein sequence.
- first_seen (date): Date when the protein was first observed.
- last_seen (date): Date when the protein was last observed.
- organism_id (varchar): Unique identifier for the organism.
- protein_names (text): Names of the protein.
- sequence (text): Amino acid sequence of the protein.
- pfam (text): Protein family.
- smart (text): Protein domain annotations.
- amino_acid_composition (jsonb): Amino acid composition of the protein.
- avg_hydrophobicity (float): Average hydrophobicity of the protein.
- secondary_structure (jsonb): Secondary structure of the protein.
"""
