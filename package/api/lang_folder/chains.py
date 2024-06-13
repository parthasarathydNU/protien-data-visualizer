from llm import getLLM
from operator import itemgetter
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough
from langchain_community.tools.sql_database.tool import QuerySQLDataBaseTool # Tool for querying a SQL database.
from langchain.chains import LLMChain, create_sql_query_chain
from prompts import INPUT_CLASSIFICATION_PROMPT, ANSWER_USER_QUESTION_PROMPT
from database import db

def getGenerateQueryChain(llm):
    return create_sql_query_chain(llm, db)

def getLLmChainForPrompt(prompt, llm):
    return LLMChain(prompt=prompt, llm=llm)

def getExecuteQueryChain():
    return QuerySQLDataBaseTool(db=db)



# Chains
classification_chain = getLLmChainForPrompt(INPUT_CLASSIFICATION_PROMPT, getLLM(model="gpt-4"))
generate_query_chain = getGenerateQueryChain(getLLM(model="gpt-4"))
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
