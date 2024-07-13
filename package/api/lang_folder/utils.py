import re
from typing import List
from lang_folder.models import TableList, ChartGenerateLLMResponse
from lang_folder.database import db
from langchain_community.tools.sql_database.tool import QuerySQLDataBaseTool



def getExecuteQueryChain():
    return QuerySQLDataBaseTool(db=db)

def get_tables(tables: TableList) -> List[str]:
    """
    Extract table names from a TableList instance.

    Args:
    tables (TableList): An instance of TableList containing Table instances.

    Returns:
    List[str]: A list containing the names of the tables.
    """
    # Debugging print statement
    print(f"Tables information from input: {tables.list}, is of type {type(tables.list)}")

    # Extract the name attribute from each Table instance in the TableList
    table_names = [table.name for table in tables.list]  # Access the 'list' attribute directly
    return table_names

# Preprocess descriptions to extract keywords
def _preprocess_description(description):
    keywords = re.findall(r'\b\w+\b', description.lower())
    return set(keywords)


def _get_table_key_words(tables) :
    # Preprocess all table descriptions
    return {table: _preprocess_description(description) for table, description in tables.items()}


# Function to find relevant tables
def find_relevant_tables(user_query, tables):
    query_keywords = set(re.findall(r'\b\w+\b', user_query.lower()))
    relevant_tables = []

    table_keywords = _get_table_key_words(tables)
    
    for table, keywords in table_keywords.items():
        if query_keywords & keywords:  # Check for intersection
            relevant_tables.append(table)
    
    return relevant_tables

def get_spec_and_explannation(response: ChartGenerateLLMResponse) -> dict:
    """
    Extracts the required keys and values from the llm response

    Args: 
    response (ChartGenerateLLMResponse) : An instance of ChartGenerateLLMResponse containing the containing the AiResponse, Chart Specification and Explannation
    """

    print(f"Returned data : {response}")

    return response.spec
