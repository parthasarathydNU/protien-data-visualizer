import time
import threading
from uuid import uuid4
from typing import Any, Dict, Optional
from dataclasses import dataclass, field

@dataclass
class MemoryStoreEntry:
    id: str
    value: Any
    expiry: float
    embedding: Optional[Any] = None
    metadata: Optional[Dict[str, Any]] = field(default_factory=dict)

class TempMemoryStore:
    def __init__(self, cleanup_interval: int = 60):
        self.store: Dict[str, MemoryStoreEntry] = {}
        self.lock = threading.Lock()
        self.cleanup_interval = cleanup_interval
        self.cleanup_thread = threading.Thread(target=self._cleanup_expired_entries, daemon=True)
        self.cleanup_thread.start()

    def set(self, value: Any, ttl: int = 300) -> str:
        key = str(uuid4())
        with self.lock:
            expiry = time.time() + ttl
            entry = MemoryStoreEntry(id=key, value=value, expiry=expiry)
            self.store[key] = entry
        return key

    def get(self, key: str) -> Optional[MemoryStoreEntry]:
        with self.lock:
            if key in self.store:
                entry = self.store[key]
                if time.time() < entry.expiry:
                    return entry
                else:
                    # Entry has expired, delete it
                    self.delete(key)
        return None

    def delete(self, key: str) -> None:
        with self.lock:
            if key in self.store:
                del self.store[key]

    def get_all(self) -> Dict[str, MemoryStoreEntry]:
        with self.lock:
            # Filter out expired entries
            current_time = time.time()
            valid_store = {k: v for k, v in self.store.items() if current_time < v.expiry}
        return valid_store

    def update_embedding(self, key: str, embedding: Any) -> None:
        with self.lock:
            if key in self.store:
                self.store[key].embedding = embedding

    def update_metadata(self, key: str, metadata: Dict[str, Any]) -> None:
        with self.lock:
            if key in self.store:
                self.store[key].metadata = metadata

    def _cleanup_expired_entries(self) -> None:
        while True:
            time.sleep(self.cleanup_interval)
            with self.lock:
                current_time = time.time()
                keys_to_delete = [key for key, entry in self.store.items() if current_time >= entry.expiry]
                for key in keys_to_delete:
                    del self.store[key]

# Create a global instance of the memory store
memory_store = TempMemoryStore()