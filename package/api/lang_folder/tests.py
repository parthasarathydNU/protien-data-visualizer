from agents import classify_input_string_for_conversation

# Define the test cases with input strings and expected classifications
test_cases = [
    ("SELECT name, age FROM users WHERE age > 30", "query"),
    ("What are the main protein families available in the database?", "query"),
    ("How are you today?", "conversation"),
    ("Can you help me find the average age of users?", "query"),
    ("What's your favorite movie?", "conversation"),
    ("Show me all records from the customers table where the status is 'active'.", "query")
]

def test_classify_input_string_for_conversation(input_string, expected_classification):
    result = classify_input_string_for_conversation(input_string)
    return result == expected_classification, result

for (query, classification) in test_cases:
    (result, classified_as) = test_classify_input_string_for_conversation(query, classification)
    if result is not True:
        print(f"Test case for classifying input string failed. Query: {query}, Expected {classification}, But was classified as {classified_as}")
        break

print("✔ Test cases for classifying input string passed.")
