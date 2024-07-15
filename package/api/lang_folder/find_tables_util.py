import nltk
import re
import os
from functools import lru_cache

# Assuming your current script is in the 'api' folder, and 'nltk_downloads' is also here
base_dir = os.path.dirname(os.path.abspath(__file__))
nltk_data_path = os.path.join(base_dir, 'nltk_downloads')

# Add this path to nltk
nltk.data.path.append(nltk_data_path)
nltk.download("stopwords")

from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer

# Now you can load the resources as usual
stop_words = set(stopwords.words('english'))
lemmatizer = WordNetLemmatizer()

# Assuming _preprocess_description is defined elsewhere and suitable for caching
@lru_cache(maxsize=None)  # Cache results of preprocessing indefinitely
def cached_preprocess_description(description):
    return _preprocess_description(description)



def _preprocess_description(description):
    # Tokenize, remove stopwords, and lemmatize the description
    words = re.findall(r'\b\w+\b', description.lower())
    processed_words = [lemmatizer.lemmatize(word) for word in words if word not in stop_words]
    return set(processed_words)

def find_relevant_tables(user_query, tables):

    # Process the user query using caching
    query_keywords = cached_preprocess_description(user_query)

    print(f"Query key words {query_keywords}")
    
    # Use caching for table descriptions and avoid redundant processing
    table_keywords = {table: cached_preprocess_description(description) for table, description in tables.items()}

    print(f"Table key words {table_keywords}")
    
    # Create a list of tuples (table, count of matching keywords)
    relevance_scores = [(table, len(query_keywords & keywords)) for table, keywords in table_keywords.items()]

    # Sort the list by the number of matches in descending order and extract the top two
    top_three_tables = sorted(relevance_scores, key=lambda x: x[1], reverse=True)[:2]

    for table, score in top_three_tables:
            print(f"Relevance for {table}: {score} matches")


    # Return only the table names of the top three entries
    return [table for table, matches in top_three_tables if matches > 0]
