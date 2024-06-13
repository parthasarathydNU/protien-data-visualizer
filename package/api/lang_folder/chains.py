from llm import getLLM
from database import db
from prompts import INPUT_CLASSIFICATION_PROMPT, ANSWER_USER_QUESTION_PROMPT, GENERATE_QUERY_PROMPT_WITH_FEW_SHOT_SELECTION
from operator import itemgetter
from vectorStore import vectorstore
from langchain_core.runnables import RunnablePassthrough
from langchain_core.output_parsers import StrOutputParser
from langchain.chains import LLMChain, create_sql_query_chain
from langchain_community.tools.sql_database.tool import QuerySQLDataBaseTool # Tool for querying a SQL database.

def getGenerateQueryChain(llm, prompt_to_llm:any):
    if prompt_to_llm == "" :
        return create_sql_query_chain(llm, db)
    return create_sql_query_chain(llm, db, prompt_to_llm)

def getLLmChainForPrompt(prompt, llm):
    return LLMChain(prompt=prompt, llm=llm)

def getExecuteQueryChain():
    return QuerySQLDataBaseTool(db=db)

# Chains
classification_chain = getLLmChainForPrompt(INPUT_CLASSIFICATION_PROMPT, getLLM(model="gpt-4"))
generate_query_chain = getGenerateQueryChain(llm=getLLM(model="gpt-4"), prompt_to_llm="")
generate_query_chain_with_table_info_and_few_shot_examples = getGenerateQueryChain(getLLM(model="gpt-4"), GENERATE_QUERY_PROMPT_WITH_FEW_SHOT_SELECTION)
execute_query_chain = QuerySQLDataBaseTool(db=db)

# combined chains
generate_query_and_execute_chain  = generate_query_chain | execute_query_chain
format_query_answer_chain = ANSWER_USER_QUESTION_PROMPT | getLLM() | StrOutputParser()
parsed_query_output_chain = (
    RunnablePassthrough.assign(query=generate_query_chain).assign(
        result= itemgetter("query") | execute_query_chain
    )
    | format_query_answer_chain
)

table_info_dynamic_few_shot_system_prompt_chain = (
    RunnablePassthrough.assign(query=generate_query_chain_with_table_info_and_few_shot_examples).assign(
        result= itemgetter("query") | execute_query_chain
    )
    | format_query_answer_chain
)
