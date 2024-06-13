from llm import getLLM
from database import db
from chains import getGenerateQueryChain, getExecuteQueryChain, generate_query_and_execute_chain, parsed_query_output_chain
from prompts import INPUT_CLASSIFICATION_PROMPT
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
