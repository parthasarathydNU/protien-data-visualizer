from fastapi.testclient import TestClient
from main import app
import pytest
import asyncio

@pytest.fixture(scope="module")
def client():
    with TestClient(app) as c:
        yield c

def test_read_protein_not_found(client):
    response = client.get("/proteins/nonexistent_entry")
    assert response.status_code == 404
    assert response.json() == {"detail": "Protein not found"}

def test_create_protein(client):
    protein_data = {
        "entry": "test_entry",
        "organisms": "Test Organism",
        "length": 100,
        "first_seen": "2023-01-01",
        "last_seen": "2023-12-31",
        "organism_id": "12345",
        "protein_names": "Test Protein",
        "sequence": "MVKVYAPASSANMSVG",
        "pfam": "PF00001",
        "smart": "SM00001",
        "amino_acid_composition": {"M": 3.4, "S": 12.2},
        "avg_hydrophobicity": 0.5,
        "secondary_structure": ["Sheet", "Helix"]
    }
    response = client.post("/proteins/", json=protein_data)
    assert response.status_code == 200
    assert response.json()["entry"] == "test_entry"

def test_read_protein(client):
    response = client.get("/proteins/test_entry")
    assert response.status_code == 200
    assert response.json()["entry"] == "test_entry"
