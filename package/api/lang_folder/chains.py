from typing import List
from operator import itemgetter
from lang_folder.llm import getLLM
from langchain.chains import create_sql_query_chain
from lang_folder.models import TableList
from lang_folder.database import db
from lang_folder.prompts import INPUT_CLASSIFICATION_PROMPT, ANSWER_USER_QUESTION_PROMPT, GENERATE_QUERY_PROMPT_WITH_FEW_SHOT_SELECTION, GENERATE_CONVERSATION_PROMPT, GENERATE_FOLLOW_UP_CONVERSATION_PROMPT, TABLE_DETAILS_PROMPT
from langchain_core.runnables import RunnablePassthrough
from langchain_core.output_parsers import StrOutputParser
from langchain.chains.openai_tools import create_extraction_chain_pydantic
from langchain_community.tools.sql_database.tool import QuerySQLDataBaseTool # Tool for querying a SQL database.



def getGenerateQueryChain(llm, prompt_to_llm:any):
    if prompt_to_llm == "" :
        return create_sql_query_chain(llm, db)
    return create_sql_query_chain(llm, db, prompt_to_llm)

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

# Chains

# Classify if given input is query or conversation
classification_chain = INPUT_CLASSIFICATION_PROMPT | getLLM(model="gpt-4") | StrOutputParser()

# Related to generating queries
generate_query_chain = getGenerateQueryChain(llm=getLLM(model="gpt-4"), prompt_to_llm="")
generate_query_chain_with_table_info_and_few_shot_examples = getGenerateQueryChain(getLLM(model="gpt-4"), GENERATE_QUERY_PROMPT_WITH_FEW_SHOT_SELECTION)

# Execute query
execute_query_chain = QuerySQLDataBaseTool(db=db)

# Normal conversation with bot
conversation_chain = GENERATE_CONVERSATION_PROMPT | getLLM() | StrOutputParser()

# Generate follow up questsion for users
follow_up_questions_chain = GENERATE_FOLLOW_UP_CONVERSATION_PROMPT | getLLM() | StrOutputParser()

# Get the apt table name for the current context
structured_table_llm = getLLM(model="gpt-4").with_structured_output(TableList)
table_chain = TABLE_DETAILS_PROMPT | structured_table_llm | get_tables

# Generate a query and execute it to get response
generate_query_and_execute_chain  = generate_query_chain | execute_query_chain

# Format the answer for the user
format_query_answer_chain = ANSWER_USER_QUESTION_PROMPT | getLLM() | StrOutputParser()

# Combined chain that merges generating query, executing the query and formatting the response for the user
parsed_query_output_chain = (
    RunnablePassthrough.assign(query=generate_query_chain).assign(
        result= itemgetter("query") | execute_query_chain
    )
    | format_query_answer_chain
)


# Combined chain that first fetches relevant tables
# Then generates query with the table details of te relevant table and few shot examples
# Executes the query and formats the response for the user
generate_response_with_table_info = (
    RunnablePassthrough.assign(table_names_to_use=table_chain) |
    RunnablePassthrough.assign(query=generate_query_chain_with_table_info_and_few_shot_examples).assign(
        result=itemgetter("query") | execute_query_chain
    )
    | format_query_answer_chain
)
