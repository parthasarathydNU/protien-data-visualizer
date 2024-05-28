from fastapi import FastAPI, HTTPException
from database import database
from models import protein_data
from protein import ProteinBase
import json

app = FastAPI()

@app.on_event("startup")
async def startup():
    await database.connect()

@app.on_event("shutdown")
async def shutdown():
    await database.disconnect()

@app.get("/proteins/{entry}", response_model=ProteinBase)
async def read_protein(entry: str):
    try:
        query = protein_data.select().where(protein_data.c.entry == entry)
        result = await database.fetch_one(query)
        if result is None:
            raise HTTPException(status_code=404, detail="Protein not found")

        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/proteins/", response_model=ProteinBase)
async def create_protein(protein: ProteinBase):
    try:
        query = protein_data.insert().values(**protein.dict())
        last_record_id = await database.execute(query)
        return {**protein.dict(), "id": last_record_id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
