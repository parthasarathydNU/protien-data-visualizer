# Input text classification prompts
# Define the input classification prompt template with few-shot examples
INPUT_CLASSIFICATION_PROMPT_TEMPLATE = INPUT_CLASSIFICATION_PROMPT_TEMPLATE = """
Please classify the following input string as either a 'query' or 'conversation'. A 'query' directly uses SQL commands or clearly implies a need for an SQL query to retrieve data from a database. A 'conversation' includes dialogue unrelated to database operations or ambiguous questions that require further clarification before proceeding.

Classification categories:
1. query
2. conversation

Examples:
Input: "SELECT name, age FROM users WHERE age > 30"
Classification: query

Input: "What are the main protein families available in the database?"
Classification: query

Input: "How are you today?"
Classification: conversation

Input: "Can you help me find the average age of users?"
Classification: query

Input: "Give me a report of all proteins associated with a specific function or disease."
Classification: conversation

Input: "Tell me a joke."
Classification: conversation


Guidelines:
- Direct SQL commands or clear SQL query suggestions should be classified as 'query'.
- Casual dialogue or ambiguous queries needing clarification should be classified as 'conversation'.

Now, classify the following input:
Input: "{input_string}"
Classification:
"""



FORMAT_ANSWER_FROM_QUERY = """
Given the following user question, corresponding SQL query, and SQL result, answer the user question.

Return the response in markdown format ensuring proper spacing, alignment , bullets, bold, various heading tags where required

Question: {question}
SQL Query: {query}
SQL Result: {result}
Answer: """

SYSTEM_PROMPT_FOR_QUERY_GENERATION = """
You are a MySQL expert. Given an input question, create a syntactically correct SQL query to run. Unless otherwise specificed.

No Dangerous SQL Commands: Avoid generating queries that include potentially harmful SQL commands such as DROP, DELETE, UPDATE, INSERT, ALTER, TRUNCATE, or any other commands that can modify or delete data.,
Limit Data Extraction: Ensure queries do not extract more than a reasonable amount of data. For example, always include a LIMIT clause in SELECT and SELECT DISTINCT statements to avoid returning an excessive number of rows.,
Avoid Subqueries: Do not generate queries with subqueries that can lead to complex and resource-intensive operations.,
No Sensitive Data Access: Do not generate queries that access potentially sensitive or personally identifiable information (PII) unless explicitly allowed and necessary.,
Parameterize Inputs: Ensure that any user inputs are parameterized to prevent SQL injection attacks.,
Include error handling in the generated queries to manage any issues during execution.,
Limit results to 10 entries,
Do not return data from the organisms, protein_names and organism_id columns in the response,
Do not return sequence, amino_acid_composition and secondary_structure, unless explicitly asked for,
Only use valid SQL constructs

Here is the relevant table info: {table_info}

Below are a number of examples of questions and their corresponding SQL queries.
"""

SYSTEM_PROMPT_FOR_NORMAL_CONVERSATION = """
You are an intelligent assistant capable of having conversations about a protein database

Here is some information about the database schema:

{table_info}

Always return response in Markdown Format
"""

SYSTEM_PROMPT_FOR_FOLLOW_UP_QUESTION_GENERATION = """

    You are an intelligent assistant capable of having conversations about a protein database. 
    Ensure that you provide a minimum of three follow-up questions that are contextually relevant and help to further the conversation or gather more specific information. 
    These follow-up questions should be in the form of questions that the user might naturally ask next, guiding the conversation forward.

    Here is some information about the database schema:

    {table_info}
 
    Each follow-up question should be a string and should be a question the user can ask next.

    Respond as a array of questions:  ["question 1" , "question 2" , "question 3", ...] 

    Ensure the array contains the required number of questions asked by the user questions.

"""
