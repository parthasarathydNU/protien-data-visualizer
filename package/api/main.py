import os
from dotenv import load_dotenv
from typing import List
from fastapi import FastAPI, HTTPException
from fastapi.encoders import jsonable_encoder
from fastapi.middleware.cors import CORSMiddleware
import requests
from database import database, engine
from models import protein_data
from queryModel import DB_SCHEMA, QueryRequest, QueryResponse, CHAT_GPT_SYSTEM_PROMPT
from protein import ProteinBase
import json
from contextlib import asynccontextmanager
from sqlalchemy import select, text
import logging
import openai

from queryModel import SYSTEM_PROMPT, DB_SCHEMA

logging.basicConfig(level=logging.INFO)

# Load environment variables from .env file
load_dotenv()

# Retrieve OpenAI API key from environment variables
openai.api_key = os.getenv('OPENAI_API_KEY')


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

async def format_data_as_markdown(data: list, query: str) -> str:
    """
    Format the query result data into markdown using OpenAI's API.
    
    :param data: The data to format.
    :param query: The query that was used to generate the data.
    :return: A markdown-formatted string.
    """
    prompt = f"Given the following data retrieved using the query '{query}', format it into a well-structured markdown format:\n\n{data}\n\nReturn the response in markdown format."
    def split_data(data, chunk_size=100):
        """ Split data into smaller chunks to avoid exceeding token limit. """
        for i in range(0, len(data), chunk_size):
            yield data[i:i + chunk_size]
    
    markdown_parts = []
    for chunk in split_data(data):
        prompt = f"Given the following data retrieved using the query '{query}', format it into a well-structured markdown format:\n\n{chunk}\n\nReturn the response in markdown format."
        
        try:
            response = openai.ChatCompletion.create(
                model="gpt-4",
                messages=[
                    {"role": "system", "content": "You are an assistant that formats data into markdown. You only return the final output, no fillers"},
                    {"role": "user", "content": prompt}
                ]
            )
            content = response.choices[0].message['content']
            markdown_parts.append(content)
        except Exception as e:
            raise Exception(f"Error in formatting data as markdown: {e}")
    
    return "\n".join(markdown_parts)

@app.post("/query/")
async def query_model(query_request: QueryRequest):
    print(query_request.context)
    messages = [CHAT_GPT_SYSTEM_PROMPT] + query_request.context[-5:] + [{"role": "user", "content": query_request.query}]
    
    try:
        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=messages
        )
        content = response.choices[0].message['content']

        # Parse the JSON response from the model
        response_json = json.loads(content)              

        response_type = response_json.get("type")
        response_content = response_json.get("content")

        # print(response_json, response_content)

        if response_type == "query":
            # Execute the SQL query using raw SQL
            with engine.connect() as conn:
                result = conn.execute(text(response_content)).fetchall()
                markdown_result = await format_data_as_markdown(result, response_content)
                print(markdown_result)
                return { "response": markdown_result}   
        else:
            return { "response": response_content}


    except Exception as e:
        print(e)
        # raise HTTPException(status_code=500, detail=str(e))
        return {"response": "Error in forming output"}
    
