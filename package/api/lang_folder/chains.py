from typing import List
from operator import itemgetter
from lang_folder.llm import getLLM
from langchain.chains import create_sql_query_chain, RetrievalQA
from lang_folder.models import TableList, FollowUpQueries, ChartGenerateLLMResponse
from lang_folder.database import db
from lang_folder.prompts import INPUT_CLASSIFICATION_PROMPT, ANSWER_USER_QUESTION_PROMPT, GENERATE_QUERY_PROMPT_WITH_FEW_SHOT_SELECTION, GENERATE_CONVERSATION_PROMPT, GENERATE_FOLLOW_UP_CONVERSATION_PROMPT, TABLE_DETAILS_PROMPT, CHART_CLASSIFICATION_PROMPT, CHART_SPEC_GENERATION_PROMPT, GENERATE_CHART_CONVERSATION_PROMPT
from langchain_core.runnables import RunnablePassthrough
from lang_folder.pinecone import vectorstore
from langchain_core.output_parsers import StrOutputParser
from langchain_community.agent_toolkits import create_sql_agent
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

def get_spec_and_explannation(response: ChartGenerateLLMResponse) -> dict:
    """
    Extracts the required keys and values from the llm response

    Args: 
    response (ChartGenerateLLMResponse) : An instance of ChartGenerateLLMResponse containing the containing the AiResponse, Chart Specification and Explannation
    """

    print(f"Returned data : {response}")

    return response.spec

# Tools
# https://python.langchain.com/v0.1/docs/integrations/toolkits/sql_database
agent_executor = create_sql_agent(getLLM(), db=db, agent_type="openai-tools", verbose=True)

# Chains

# Classify if given input is query or conversation
classification_chain = INPUT_CLASSIFICATION_PROMPT | getLLM(model="gpt-4") | StrOutputParser()

# Classify if the given input is suppoed to be answered conversationally or should we return a chart
# Returns a single string
chart_classification_chain = CHART_CLASSIFICATION_PROMPT | getLLM(model="gpt-4") | StrOutputParser()

# Related to generating queries
generate_query_chain = getGenerateQueryChain(llm=getLLM(model="gpt-4"), prompt_to_llm="")
generate_query_chain_with_table_info_and_few_shot_examples = getGenerateQueryChain(getLLM(model="gpt-4"), GENERATE_QUERY_PROMPT_WITH_FEW_SHOT_SELECTION)

# Execute query
execute_query_chain = QuerySQLDataBaseTool(db=db)

# Normal conversation with bot
conversation_chain = GENERATE_CONVERSATION_PROMPT | getLLM(model="gpt-4o") | StrOutputParser()

# Conversation regarding chart generation
chart_conversation_chain = ( RunnablePassthrough.assign(table_info=agent_executor) | GENERATE_CHART_CONVERSATION_PROMPT | getLLM(model="gpt-4o") | StrOutputParser() )

# Generate follow up questsion for users
follow_up_questions_chain = GENERATE_FOLLOW_UP_CONVERSATION_PROMPT | getLLM(model="gpt-4").with_structured_output(FollowUpQueries)

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



_chart_spec_gen_chain = CHART_SPEC_GENERATION_PROMPT | getLLM(model="gpt-4o").with_structured_output(ChartGenerateLLMResponse) | get_spec_and_explannation

# Steps
# Get the table metadata from the db instance
# for the given table
# pass that along with the user query and conversation history to generate the spec
generate_chart_spec_with_table_info = ( RunnablePassthrough.assign(table_info=agent_executor)  | _chart_spec_gen_chain )


# Testing Retrieval chain from langchain
qa = RetrievalQA.from_chain_type(  
    llm=getLLM(model="gpt-4o"),  
    chain_type="stuff",  
    retriever=vectorstore.as_retriever()  
)  
