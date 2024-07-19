from langchain_openai import ChatOpenAI
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

def getLLM(model="gpt-4o-mini", temperature=0.5, max_tokens=1000):
    return ChatOpenAI(model=model, temperature=temperature, max_tokens=max_tokens)
