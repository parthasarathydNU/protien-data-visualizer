# nltk_setup.py
import os
import nltk

# Assuming your current script is in the 'api' folder, and 'nltk_downloads' is also here
base_dir = os.path.dirname(os.path.abspath(__file__))
nltk_data_path = os.path.join(base_dir, 'nltk_downloads')

# Add this path to nltk
nltk.data.path.append(nltk_data_path)


def download_nltk_resources():
    # Attempt to download the required resources
    try:
        nltk.download('stopwords', download_dir=nltk_data_path)
        nltk.download('wordnet', download_dir=nltk_data_path)
        print("NLTK resources downloaded successfully to:", nltk_data_path)
    except Exception as e:
        print("Error downloading NLTK resources:", e)
        
