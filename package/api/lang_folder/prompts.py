from lang_folder.templates import INPUT_CLASSIFICATION_PROMPT_TEMPLATE, FORMAT_ANSWER_FROM_QUERY, SYSTEM_PROMPT_FOR_QUERY_GENERATION, SYSTEM_PROMPT_FOR_NORMAL_CONVERSATION
from lang_folder.vectorStore import vectorstore
from langchain_openai import OpenAIEmbeddings
from lang_folder.few_shot_examples import few_shot_examples
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder, FewShotChatMessagePromptTemplate, PromptTemplate
from langchain_core.example_selectors import SemanticSimilarityExampleSelector

INPUT_CLASSIFICATION_PROMPT = PromptTemplate.from_template(
    INPUT_CLASSIFICATION_PROMPT_TEMPLATE
)

ANSWER_USER_QUESTION_PROMPT = PromptTemplate.from_template(
    FORMAT_ANSWER_FROM_QUERY
)


# Normal Conversation with user
GENERATE_CONVERSATION_PROMPT = ChatPromptTemplate.from_messages([
    ("system", SYSTEM_PROMPT_FOR_NORMAL_CONVERSATION),
    # Means the template will receive an optional list of messages under
    # the "conversation" key
    ("placeholder", "{conversation}")
    # Equivalently:
    # MessagesPlaceholder(variable_name="conversation", optional=True)
])

# prompt_value = normal_conversation_prompt_template.invoke(
#     {
#         "conversation": [
#             ("human", "Hi!"),
#             ("ai", "How can I assist you today?"),
#             ("human", "Can you make me an ice cream sundae?"),
#             ("ai", "No.")
#         ],
#         "table_info" : ""
#     }
# )


# Few Shot Examples for forming the queries
# The passed in examples should be of type 
# {"input": "String", "query": "SQL Query String"}
_example_prompt_for_few_shot = ChatPromptTemplate.from_messages(
    [
        ("human", "{input}\nSQLQuery:"),
        ("ai", "{query}"),
    ]
)

# This few shot prompt is just like we pass a few examples to 
# the LLM as support before we let it answer any question
FEW_SHOT_PROMPT = FewShotChatMessagePromptTemplate(
    example_prompt=_example_prompt_for_few_shot,
    examples=few_shot_examples, # {"input": "String", "query": "SQL Query String"}[]
    input_variables=["input"], # The variable holds the value sent from the user 
)

def _getSemanticExampleSelectorChain(top_k = 2, input_field="input"):
    return SemanticSimilarityExampleSelector.from_examples(
        few_shot_examples, # Passing in all the available examples
        OpenAIEmbeddings(), # Using a pre trained embedding for both the query and the examples
        vectorstore, # Vector database that helps us with semantic search
        k=top_k, # Pick just the top 2 examples that are semantically similar to the input question from the user
        input_keys=[input_field], # Helps us pick the input queries that were similar to the previously asked queries, in real life, as users ask queries and keep using the app, we can get more examples so the system can learn from it's users
    )

# Whenever this prompt is used, it comes along with the few shot examples selected
DYNAMIC_FEW_SHOT_PROMPT_WITH_EXAMPLE_SELECTION = FewShotChatMessagePromptTemplate(
    example_prompt=_example_prompt_for_few_shot,
    example_selector=_getSemanticExampleSelectorChain(), # Here rather than passing in all the examples, we pass in the example selector object 
    input_variables=["input","top_k", "table_info"],
)


# Combined prompt that takes in the following
# 1. System prompt
# 2. Few shot examples
# 3. User query
# With this prompt, we aim to pass in examples for the llm to generate a query
# This function needs an input parameter in the field "input" --> this is the user query
GENERATE_QUERY_PROMPT_WITH_FEW_SHOT_SELECTION = ChatPromptTemplate.from_messages(
    [
        ("system", SYSTEM_PROMPT_FOR_QUERY_GENERATION),
        DYNAMIC_FEW_SHOT_PROMPT_WITH_EXAMPLE_SELECTION,
        ("human", "{input}\n\nSQL: "),
    ]
)
