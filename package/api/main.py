from typing import List
from fastapi import FastAPI, HTTPException
from database import database
from models import protein_data
from protein import ProteinBase
import json
from contextlib import asynccontextmanager
from sqlalchemy import select

@asynccontextmanager
async def lifespan(app: FastAPI):
    await database.connect()
    yield
    await database.disconnect()

app = FastAPI(lifespan=lifespan)

@app.get("/proteins/{entry}", response_model=ProteinBase)
async def read_protein(entry: str):
    query = protein_data.select().where(protein_data.c.entry == entry)
    result = await database.fetch_one(query)
    if result is None:
        raise HTTPException(status_code=404, detail="Protein not found")

    result = dict(result)
    if isinstance(result['amino_acid_composition'], str):
        result['amino_acid_composition'] = json.loads(result['amino_acid_composition'])
    if isinstance(result['secondary_structure'], str):
        result['secondary_structure'] = json.loads(result['secondary_structure'])

    return result

@app.post("/proteins/", response_model=ProteinBase)
async def create_protein(protein: ProteinBase):
    query = protein_data.insert().values(**protein.dict())
    last_record_id = await database.execute(query)
    return {**protein.dict(), "id": last_record_id}

@app.get("/proteins/", response_model=List[ProteinBase])
async def list_proteins(skip: int = 0, limit: int = 10):
    query = select(
        protein_data.c.entry,
        protein_data.c.length,
        protein_data.c.first_seen,
        protein_data.c.last_seen,
        protein_data.c.sequence,
        protein_data.c.pfam,
        protein_data.c.smart,
        protein_data.c.avg_hydrophobicity,
    ).offset(skip).limit(limit)
    results = await database.fetch_all(query)
    response = []
    
    for result in results:
        result_dict = dict(result)
        response.append(result_dict)
    return response

@app.put("/proteins/{entry}", response_model=ProteinBase)
async def update_protein(entry: str, protein: ProteinBase):
    query = protein_data.update().where(protein_data.c.entry == entry).values(**protein.dict())
    await database.execute(query)
    return {**protein.dict(), "entry": entry}

@app.delete("/proteins/{entry}", response_model=dict)
async def delete_protein(entry: str):
    query = protein_data.delete().where(protein_data.c.entry == entry)
    await database.execute(query)
    return {"message": "Protein deleted successfully"}
