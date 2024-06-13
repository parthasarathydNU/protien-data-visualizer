from langchain_openai import ChatOpenAI
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

def getLLM(model="gpt-3.5-turbo", temperature=0):
    return ChatOpenAI(model=model, temperature=temperature)
