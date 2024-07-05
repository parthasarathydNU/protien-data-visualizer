from pinecone.grpc import PineconeGRPC as Pinecone
from langchain_openai import OpenAIEmbeddings  
from langchain_pinecone import PineconeVectorStore  
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# get openai api key from platform.openai.com  
model_name = 'text-embedding-3-small' 

embeddings = OpenAIEmbeddings(  
    model=model_name 
)  

pc = Pinecone()

index = pc.Index("queries")  
index.describe_index_stats()  

text_field = "input" 

vectorstore = PineconeVectorStore(  
    index, embeddings, text_field  
)
