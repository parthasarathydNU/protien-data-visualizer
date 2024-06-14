from lang_folder.few_shot_examples import few_shot_examples
from lang_folder.chains import classification_chain, conversation_chain, table_info_dynamic_few_shot_system_prompt_chain, follow_up_questions_chain
# Function to classify a given input string
def classify_input_string(input_string):
    # Prepare the input for the LLMChain
    input_data = {"input_string": input_string}
    print(f"Data to classification chain {input_data}")
    # Invoke the LLMChain to get the classification
    result = classification_chain.invoke(input_data)
    print(f"result from chain {result}")
    return result


# This will later be converted to an API call
def get_few_shot_examples():
    return few_shot_examples

def get_ai_response_for_conversation(conversation):
    formatted_conversation = [('ai' if entry["role"] == 'assistant' else 'human', entry["content"]) for entry in conversation]
    print(f"formatted_conversation {formatted_conversation}")
    result = conversation_chain.invoke({"table_info" : "" , "conversation" : formatted_conversation})
    print(f"Result from ai {result}")
    return result

def get_follow_up_questions_from_ai(conversation):
    formatted_conversation = [('ai' if entry["role"] == 'assistant' else 'human', entry["content"]) for entry in conversation]
    print(f"formatted_conversation {formatted_conversation}")
    result = follow_up_questions_chain.invoke({"table_info" : "" , "conversation" : formatted_conversation})
    print(f"Result from ai {result}")
    return result

def query_database(userQuery):
    print(f"user query : {userQuery}")
    return table_info_dynamic_few_shot_system_prompt_chain.invoke({"question": userQuery})
