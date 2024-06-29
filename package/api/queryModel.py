from pydantic import BaseModel
from enum import Enum

class ChatResponseTypes(Enum):
    chart = "chart"
    conversation = "conversation"

class QueryRequest(BaseModel):
    query: str
    context: list = None  # To maintain the conversation context

class QueryResponse(BaseModel):
    response: str   
    type: ChatResponseTypes

class ChartQueryRequest(QueryRequest):
    table_name: str # Mandatory for chart generation


class ChartQueryResponse(BaseModel):
    type: ChatResponseTypes
    response: str


# QUERY PROMPTS =====================================
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
    "Do not return data from the organisms, protein_names and organism_id columns in the response",
    "Do not return sequence, amino_acid_composition and secondary_structure, unless explicitly asked for",
    "Only use valid SQL constructs"
]

SYSTEM_PROMPT = "You are an intelligent assistant capable of having conversations about a protein database and generating SQL queries based on user requests. The database schema is as follows:" + DB_SCHEMA +  "If the user asks for specific data or details that require an SQL query, generate the appropriate SQL query to answer the question.  If the user asks general questions or wants information about the data, provide a conversational response. In your response, clearly indicate whether the output is a conversation response or an SQL query." + "For generating SQL queries follow the following guidelines " + " ".join(SQL_RULES)

CHAT_GPT_SYSTEM_PROMPT = {"role": "system", "content": SYSTEM_PROMPT+"Please respond with a JSON object containing 'type' (either 'conversation' or 'query') and 'content'. If it's a query, include the SQL query in 'content'. Follow this convention strictly for all responses. Please ensure all responses are formatted as valid JSON. There must be no unnecessary white spaces in the JSON content. There must not be any unescaped control characters. Use the followig structure: \{\"type\" : \"conversation or query\", \"content\" : \"content of the query or the conversation response\" \}. DO NOT use constructs like ```json  ``` " }

  
# FOLLOW UP PROMPTS =====================================
SYSTEM_PROMPT_FOLLOWUP = (
    "You are an intelligent assistant capable of having conversations about a protein database. "
    "Your task is to generate relevant follow-up questions that the user can ask based on the user's current context and query. "
    "Ensure that you provide a minimum of three follow-up questions that are contextually relevant and help to further the conversation or gather more specific information. "
    "These follow-up questions should be in the form of questions that the user might naturally ask next, guiding the conversation forward."
)

CHAT_GPT_FOLLOWUP_PROMPT = {
    "role": "system",
    "content": SYSTEM_PROMPT_FOLLOWUP + "Please respond with a JSON object containing an array of follow-up questions under the key 'follow_up_questions'. "
                                        "Each follow-up question should be a string and should be a question the user can ask next. "
                                        "There must be no unnecessary white spaces in the JSON content. "
                                        "Use the following structure: {\"follow_up_questions\": [\"question 1\", \"question 2\", \"question 3\", ...]}. "
                                        "Ensure the array contains at least three questions."
}
