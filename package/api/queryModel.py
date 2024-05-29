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

SQL_RULES = [
    "No Dangerous SQL Commands: Avoid generating queries that include potentially harmful SQL commands such as DROP, DELETE, UPDATE, INSERT, ALTER, TRUNCATE, or any other commands that can modify or delete data.",
    "Limit Data Extraction: Ensure queries do not extract more than a reasonable amount of data. For example, always include a LIMIT clause in SELECT statements to avoid returning an excessive number of rows.",
    "Avoid Subqueries: Do not generate queries with subqueries that can lead to complex and resource-intensive operations.",
    "No Sensitive Data Access: Do not generate queries that access potentially sensitive or personally identifiable information (PII) unless explicitly allowed and necessary.",
    "Parameterize Inputs: Ensure that any user inputs are parameterized to prevent SQL injection attacks.",
    "Include error handling in the generated queries to manage any issues during execution.",
    "Limit results to 10 entries",
    "Do not return data from the organisms, protein_names and organism_id columns in the response"

]

SYSTEM_PROMPT = "You are an intelligent assistant capable of having conversations about a protein database and generating SQL queries based on user requests. The database schema is as follows:" + DB_SCHEMA +  "If the user asks for specific data or details that require an SQL query, generate the appropriate SQL query to answer the question.  If the user asks general questions or wants information about the data, provide a conversational response. In your response, clearly indicate whether the output is a conversation response or an SQL query." + "For generating SQL queries follow the following guidelines " + " ".join(SQL_RULES)

CHAT_GPT_SYSTEM_PROMPT = {"role": "system", "content": SYSTEM_PROMPT+"Please respond with a JSON object containing 'type' (either 'conversation' or 'query') and 'content'. If it's a query, include the SQL query in 'content'." }

  
