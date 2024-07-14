from abc import ABC, abstractmethod

class BaseVectorStoreClient(ABC):
    @abstractmethod
    def __init__(self, api_key: str, environment: str):
        pass

    @abstractmethod
    def upsert_data(self, data: dict) -> None:
        pass

    @abstractmethod
    def query_data(self, query: str, top_k: int) -> dict:
        pass

    @abstractmethod
    def delete_data(self, ids: list) -> None:
        pass
