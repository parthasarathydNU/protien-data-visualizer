from llm import getLLM
from database import db
from chains import getGenerateQueryChain, getExecuteQueryChain, generate_query_and_execute_chain, parsed_query_output_chain, table_info_dynamic_few_shot_system_prompt_chain
from prompts import INPUT_CLASSIFICATION_PROMPT, DYNAMIC_FEW_SHOT_PROMPT_WITH_EXAMPLE_SELECTION, GENERATE_QUERY_PROMPT_WITH_FEW_SHOT_SELECTION
from agents import classify_input_string
print("Hello")

# print(db.get_usable_table_names())
# print(db.table_info)

# Generating a query
llm = getLLM(model="gpt-3.5-turbo")
# generate_query = getGenerateQueryChain(llm, db)
# query = generate_query.invoke({"question": "What is the average hydrophobicity of UPI00000001D7"})
# print(query)


# 1. Find if user input can be related to a query or a normal conversation
user_query = "What is the average hydrophobicity of UPI00000001D7"
print(user_query)
# classification_result = classify_input_string(user_query)
# print(f"The input string is classified as: {classification_result}")


# 2. Generating a query
# generate_query = getGenerateQueryChain(llm)
# query = generate_query.invoke({"question": user_query})
# print(query)

# 3. Executing a query
# execute_query = getExecuteQueryChain()
# query_result = execute_query.invoke(query)
# print(query_result)

# 4. Combining the above two
# combined_result = generate_query_and_execute_chain.invoke({"question": user_query})
# print(combined_result)

# 5. Formatting the answer in a readable format
clean_result = parsed_query_output_chain.invoke({"question": user_query})
print(clean_result)

print("\nDynamic few shot selected examples for given input")
# 6. Checking how the prompt would look with pasing in the few shot prompts as well
# print(DYNAMIC_FEW_SHOT_PROMPT_WITH_EXAMPLE_SELECTION.format(input=user_query, top_k=3))

print("\nPrompt to send to llm to generate query along with table info, selected few shot prompts and user info")
print(GENERATE_QUERY_PROMPT_WITH_FEW_SHOT_SELECTION.format(input=user_query, top_k=3, table_info="Pass table information in here"))

# 7. Invoking chain alon with table data, few shot examples and system prompt
print("\nInvoking chain alon with table data, few shot examples and system prompt")
clean_result = table_info_dynamic_few_shot_system_prompt_chain.invoke({"question": user_query})
print(clean_result)
