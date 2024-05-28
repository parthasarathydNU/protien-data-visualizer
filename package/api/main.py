from typing import List
from fastapi import FastAPI, HTTPException
from fastapi.encoders import jsonable_encoder
from fastapi.middleware.cors import CORSMiddleware
import requests
from database import database
from models import protein_data
from queryModel import DB_SCHEMA, QueryRequest, QueryResponse
from protein import ProteinBase
import json
from contextlib import asynccontextmanager
from sqlalchemy import select
import logging

logging.basicConfig(level=logging.INFO)

@asynccontextmanager
async def lifespan(app: FastAPI):
    await database.connect()
    yield
    await database.disconnect()

app = FastAPI(lifespan=lifespan)

# Define the origins that are allowed to make CORS requests
origins = [
    "http://localhost:3000",  # React development server
    "http://localhost:8000",  # FastAPI server
    # Add more origins as needed
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Allow specific origins
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods
    allow_headers=["*"],  # Allow all headers
)


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
    try:
        query = protein_data.insert().values(
            entry=protein.entry,
            length=protein.length,
            first_seen=str(protein.first_seen),
            last_seen=str(protein.last_seen),
            organism_id=protein.organism_id,
            protein_names=protein.protein_names,
            sequence=protein.sequence,
            pfam=protein.pfam,
            smart=protein.smart,
            amino_acid_composition=jsonable_encoder(protein.amino_acid_composition),
            avg_hydrophobicity=protein.avg_hydrophobicity,
            secondary_structure=jsonable_encoder(protein.secondary_structure)
        )
        last_record_id = await database.execute(query)
        return {**protein.dict(), "id": last_record_id}
    except Exception as e:
        logging.error(f"Error creating protein: {e}")
        raise HTTPException(status_code=400, detail="Error creating protein")

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

@app.put("/proteins/{entry}")
async def update_protein(entry: str, protein: ProteinBase):
    # Step 1: Perform the update
    query = (
        protein_data.update()
        .where(protein_data.c.entry == entry)
        .values(
            length=protein.length,
            first_seen=str(protein.first_seen),
            last_seen=str(protein.last_seen),
            sequence=protein.sequence,
            pfam=protein.pfam,
            smart=protein.smart,
            amino_acid_composition=protein.amino_acid_composition,
            avg_hydrophobicity=protein.avg_hydrophobicity,
            secondary_structure=protein.secondary_structure
        )
    )
    result = await database.execute(query)
    
    # Check if any rows were affected
    if result == 0:
        raise HTTPException(status_code=404, detail="Protein not found")
    
    # Step 2: Retrieve the updated record
    select_query = protein_data.select().where(protein_data.c.entry == entry)
    updated_protein = await database.fetch_one(select_query)
    
    if not updated_protein:
        raise HTTPException(status_code=404, detail="Protein not found")
    
    return updated_protein

@app.delete("/proteins/{entry}", response_model=dict)
async def delete_protein(entry: str):
    query = protein_data.delete().where(protein_data.c.entry == entry)
    await database.execute(query)
    return {"message": "Protein deleted successfully"}

    
@app.post("/query/", response_model=QueryResponse)
async def query_data(query_request: QueryRequest):
    try:
        prompt = f"{DB_SCHEMA}\n\nQuestion: {query_request.query}\n\nGenerate the appropriate SQL query to answer this question."

        params = {
            "model": "llama3",
            "prompt": prompt,
            "format": "json",
            "stream": False,
            "system": "Generate SQL queries based on the given database schema and question."
        }

        print(prompt)

        llama_response = requests.post(
            "http://localhost:11434/api/generate",
            json=params
        )

        if llama_response.status_code != 200:
            raise HTTPException(status_code=llama_response.status_code, detail=llama_response.text)

        

        response_data = llama_response.json()

        print(response_data)

        generated_sql_query = json.loads(response_data.get("response").strip()).get("query")
        

        if not generated_sql_query:
            return QueryResponse(sql_query="No valid SQL query generated by LLaMA model.")

        # result = await database.fetch_all(generated_sql_query)

        # print(result)

        return QueryResponse(sql_query=generated_sql_query)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
