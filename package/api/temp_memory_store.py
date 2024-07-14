import time
import threading
from uuid import uuid4

class TempMemoryStore:
    def __init__(self, cleanup_interval=60):
        self.store = {}
        self.lock = threading.Lock()
        self.cleanup_interval = cleanup_interval
        self.cleanup_thread = threading.Thread(target=self._cleanup_expired_entries, daemon=True)
        self.cleanup_thread.start()

    def set(self, value, ttl=300):
        key = str(uuid4())
        with self.lock:
            expiry = time.time() + ttl
            self.store[key] = {
                "id": key,
                "value": value,
                "expiry": expiry,
                "embedding": None,
                "metadata": {}
            }
        return key

    def get(self, key):
        with self.lock:
            if key in self.store:
                entry = self.store[key]
                if time.time() < entry["expiry"]:
                    return entry
                else:
                    # Entry has expired, delete it
                    self.delete(key)
        return None

    def delete(self, key):
        with self.lock:
            if key in self.store:
                del self.store[key]

    def get_all(self):
        with self.lock:
            # Filter out expired entries
            valid_store = {k: v for k, v in self.store.items() if time.time() < v["expiry"]}
        return valid_store

    def update_embedding(self, key, embedding):
        with self.lock:
            if key in self.store:
                self.store[key]["embedding"] = embedding

    def update_metadata(self, key, metadata):
        with self.lock:
            if key in self.store:
                self.store[key]["metadata"] = metadata

    def _cleanup_expired_entries(self):
        while True:
            time.sleep(self.cleanup_interval)
            with self.lock:
                current_time = time.time()
                keys_to_delete = [key for key, entry in self.store.items() if current_time >= entry["expiry"]]
                for key in keys_to_delete:
                    del self.store[key]

# Create a global instance of the memory store
memory_store = TempMemoryStore()