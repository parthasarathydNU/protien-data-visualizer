import logging
import os
import time
from langchain_community.embeddings.openai import OpenAIEmbeddings
from uuid import uuid4
from vector_store.basevectorstoreclient import BaseVectorStoreClient
from pinecone.grpc import PineconeGRPC as Pinecone
from pinecone import ServerlessSpec
from langchain.vectorstores import VectorStore

DEFAULT_INDEX_ID = "default-index"

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class PineconeVectorStoreClient(BaseVectorStoreClient, VectorStore):
    def __init__(self, index_name: str = DEFAULT_INDEX_ID):
        try:
            self.index_name = index_name
            self.client = Pinecone(api_key=os.getenv('PINECONE_API_KEY'))
            self.spec = ServerlessSpec(cloud="aws", region="us-east-1")
            if DEFAULT_INDEX_ID not in self.client.list_indexes().names():
                self.create_index(dimension=1536)
            self.index = self.client.Index(index_name)
            self.embedding_model = OpenAIEmbeddings(api_key=os.getenv('OPENAI_API_KEY'))
            self._wait_for_index(DEFAULT_INDEX_ID)
            logger.info("PineconeVectorStoreClient initialized successfully.")
        except Exception as e:
            logger.error(f"Error initializing PineconeVectorStoreClient: {e}")
            raise

    def create_index(self, dimension: int, metric: str = 'cosine'):
        try:
            self.client.create_index(self.index_name, dimension=dimension, metric=metric, spec=self.spec)
            self._wait_for_index(self.index_name)
            logger.info(f"Index {self.index_name} created successfully.")
        except Exception as e:
            logger.error(f"Error creating index {self.index_name}: {e}")
            raise

    def delete_index(self):
        try:
            self.client.delete_index(self.index_name)
            logger.info(f"Index {self.index_name} deleted successfully.")
        except Exception as e:
            logger.error(f"Error deleting index {self.index_name}: {e}")
            raise

    def upsert_data(self, data: list) -> None:
        try:
            self.index.upsert(vectors=data)
            logger.info("Data upserted successfully.")
        except Exception as e:
            logger.error(f"Error upserting data: {e}")
            raise

    def query_data(self, query: list, top_k: int) -> dict:
        try:
            result = self.index.query(queries=query, top_k=top_k)
            logger.info("Data queried successfully.")
            return result
        except Exception as e:
            logger.error(f"Error querying data: {e}")
            raise

    def delete_data(self, ids: list) -> None:
        try:
            self.index.delete(ids=ids)
            logger.info("Data deleted successfully.")
        except Exception as e:
            logger.error(f"Error deleting data: {e}")
            raise

    def add_documents(self, documents: list):
        try:
            vectors = [{"id": str(doc['id']), "values": doc['embedding'], "metadata": doc['metadata']} for doc in documents]
            self.upsert_data(vectors)
        except Exception as e:
            logger.error(f"Error adding documents: {e}")
            raise

    def search_documents(self, query_embedding: list, top_k: int = 10):
        try:
            response = self.client.query(query_embedding, top_k=top_k)
            logger.info("Documents searched successfully.")
            return response['matches']
        except Exception as e:
            logger.error(f"Error searching documents: {e}")
            raise

    def initialize_client(self, examples: list):
        try:
            # Ensure index exists
            if self.index_name not in self.client.list_indexes():
                self.create_index(dimension=1536)

            # Add example documents
            self.add_documents(examples)
            logger.info("Client initialized with example documents successfully.")
        except Exception as e:
            logger.error(f"Error initializing client: {e}")
            raise

    def is_base_data_loaded(self):
        return DEFAULT_INDEX_ID in self.client.list_indexes().names()
    
    def embed_and_convert(self, texts: list, metadata_list: list) -> list:
        try:
            documents = []
            for i, text in enumerate(texts):
                embedding = self.embedding_model.embed_query(text)
                document = {
                    "id": str(uuid4()),
                    "embedding": embedding,
                    "metadata": metadata_list[i]
                }
                documents.append(document)
            logger.info("Texts embedded and converted successfully.")
            return documents
        except Exception as e:
            logger.error(f"Error embedding and converting texts: {e}")
            raise
    
    def _wait_for_index(self, index_id):
        try:
            while not self.client.describe_index(index_id).status['ready']:
                time.sleep(1)
            logger.info(f"Index {index_id} is ready.")
        except Exception as e:
            logger.error(f"Error waiting for index {index_id} to be ready: {e}")
            raise

    def from_texts(self, texts: list, metadata_list: list = None):
        try:
            if metadata_list is None:
                metadata_list = [{}] * len(texts)
            return self.embed_and_convert(texts, metadata_list)
        except Exception as e:
            logger.error(f"Error converting texts to documents: {e}")
            raise

    def similarity_search(self, query: str, top_k: int = 10):
        try:
            query_embedding = self.embedding_model.embed_query(query)
            return self.search_documents(query_embedding, top_k)
        except Exception as e:
            logger.error(f"Error performing similarity search: {e}")
            raise

