from langchain_core.prompts import PromptTemplate
from templates import INPUT_CLASSIFICATION_PROMPT_TEMPLATE, FORMAT_ANSWER_FROM_QUERY

INPUT_CLASSIFICATION_PROMPT = PromptTemplate.from_template(
    INPUT_CLASSIFICATION_PROMPT_TEMPLATE
)

ANSWER_USER_QUESTION_PROMPT = PromptTemplate.from_template(
    FORMAT_ANSWER_FROM_QUERY
)
