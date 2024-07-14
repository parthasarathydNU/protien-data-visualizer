import os
import pinecone
from langchain_community.vectorstores import Pinecone
from langchain_community.embeddings.openai import OpenAIEmbeddings
from uuid import uuid4

DEFAULT_INDEX_ID = "default_index"

class PineconeVectorStoreClient:
    def __init__(self, api_key: str, environment: str, index_name: str = DEFAULT_INDEX_ID):
        self.index_name = index_name
        self.pc = pinecone(api_key=os.getenv('PINECONE_API_KEY'))
        if not self.pc.list_indexes():
            self.create_index(dimension=1536)
        self.index = pinecone.Index(index_name)
        self.embedding_model = OpenAIEmbeddings(api_key=os.getenv('OPENAI_API_KEY'))

    def create_index(self, dimension: int, metric: str = 'cosine'):
        self.pc.create_index(self.index_name, dimension=dimension, metric=metric)

    def delete_index(self):
        self.pc.delete_index(self.index_name)

    def upsert_data(self, data: dict) -> None:
        self.index.upsert(vectors=data)

    def query_data(self, query: list, top_k: int) -> dict:
        return self.index.query(query, top_k=top_k)

    def delete_data(self, ids: list) -> None:
        self.index.delete(ids=ids)

    def add_documents(self, documents: list):
        vectors = [{"id": doc['id'], "values": doc['embedding'], "metadata": doc['metadata']} for doc in documents]
        self.upsert_data(vectors)

    def search_documents(self, query_embedding: list, top_k: int = 10):
        response = self.pc.query(query_embedding, top_k=top_k)
        return response['matches']

    def initialize_client(self, examples: list):
        # Ensure index exists
        if self.index_name not in self.pc.list_indexes():
            self.create_index(dimension=1536)

        # Add example documents
        self.add_documents(examples)
    
    def embed_and_convert(self, texts: list, metadata_list: list) -> list:
        documents = []
        for i, text in enumerate(texts):
            embedding = self.embedding_model.embed_query(text)
            document = {
                "id": uuid4(),
                "embedding": embedding,
                "metadata": metadata_list[i]
            }
            documents.append(document)
        return documents
