# Input text classification prompts
# Define the input classification prompt template with few-shot examples
INPUT_CLASSIFICATION_PROMPT_TEMPLATE = """
I want you to classify the following input string. Determine whether it is a query or a conversation. A query directly interacts with databases using SQL commands or is a natural language question that suggests forming an SQL query to fetch information from a database. A conversation is any other type of dialogue not related to SQL or databases.

Please classify the input string into one of the following categories:
1. query
2. conversation

Here are some examples:

Example 1:
Input: "SELECT name, age FROM users WHERE age > 30"
Classification: query

Example 2:
Input: "What are the main protein families available in the database?"
Classification: query

Example 3:
Input: "How are you today?"
Classification: conversation

Example 4:
Input: "Can you help me find the average age of users?"
Classification: query

Example 5:
Input: "What's your favorite movie?"
Classification: conversation

Example 6:
Input: "Show me all records from the customers table where the status is 'active'."
Classification: query

Now, classify the following input string:

Input: "{input_string}"
Classification:
"""


FORMAT_ANSWER_FROM_QUERY = """
Given the following user question, corresponding SQL query, and SQL result, answer the user question.

Question: {question}
SQL Query: {query}
SQL Result: {result}
Answer: """

SYSTEM_PROMPT_FOR_QUERY_GENERATION = """
You are a MySQL expert. Given an input question, create a syntactically correct MySQL query to run. Unless otherwise specificed.

Here is the relevant table info: {table_info}

Below are a number of examples of questions and their corresponding SQL queries.
"""
