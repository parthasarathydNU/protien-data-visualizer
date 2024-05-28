from fastapi import FastAPI, HTTPException
from database import database, engine, metadata
from models import protein_data
from protein import ProteinBase
import json
from contextlib import asynccontextmanager

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

    return result

@app.post("/proteins/", response_model=ProteinBase)
async def create_protein(protein: ProteinBase):
    query = protein_data.insert().values(**protein.model_dump())
    last_record_id = await database.execute(query)
    return {**protein.model_dump(), "id": last_record_id}
