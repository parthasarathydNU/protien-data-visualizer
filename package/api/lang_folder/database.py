from langchain_community.utilities.sql_database import SQLDatabase
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

DATABASE_URL = os.getenv('DATABASE_URL')

db = SQLDatabase.from_uri(DATABASE_URL, sample_rows_in_table_info=1)
