from pydantic import BaseModel

class QueryRequest(BaseModel):
    query: str
    context: list = None  # To maintain the conversation context
    use_openai: bool = False  # Flag to decide which model to use


class QueryResponse(BaseModel):
    response: str
    context: list

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

SYSTEM_PROMPT = "You are an intelligent assistant capable of having conversations about a protein database and generating SQL queries based on user requests. The database schema is as follows:" + DB_SCHEMA +  "If the user asks for specific data or details that require an SQL query, generate the appropriate SQL query to answer the question.  If the user asks general questions or wants information about the data, provide a conversational response. In your response, clearly indicate whether the output is a conversation response or an SQL query."

CHAT_GPT_SYSTEM_PROMPT = {"role": "system", "content": SYSTEM_PROMPT}
