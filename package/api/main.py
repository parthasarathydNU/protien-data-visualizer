import json
from dotenv import load_dotenv
from typing import List
from models import protein_data
from fastapi import FastAPI, HTTPException
from protein import ProteinBase
from database import database
import logging
from sqlalchemy import select, text
from contextlib import asynccontextmanager
from queryModel import QueryRequest, QueryResponse, ChartQueryRequest,ChartQueryResponse, ChatResponseTypes, CHAT_GPT_FOLLOWUP_PROMPT
from util_functions import process_protein_data
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse
from lang_folder.agents import classify_input_string_for_conversation, get_ai_response_for_conversation, query_database, get_follow_up_questions_from_ai, get_table_names, classify_input_string_for_chart, generate_chart_spec, get_ai_response_for_chart_conversation
from fastapi.middleware.cors import CORSMiddleware



logging.basicConfig(level=logging.INFO)

# Load environment variables from .env file
load_dotenv()

# Retrieve OpenAI API key from environment variables
# openai.api_key = os.getenv('OPENAI_API_KEY')


@asynccontextmanager
async def lifespan(app: FastAPI):
    await database.connect()
    yield
    await database.disconnect()

app = FastAPI(lifespan=lifespan)


# Define allowed origins
origins = ["*", "http://localhost:3000"]

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Handle OPTIONS requests
@app.options("/{rest_of_path:path}")
async def options_handler(rest_of_path: str):
    return JSONResponse(status_code=200, headers={
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization"
    })

# Simple endpoint for testing
@app.get("/")
async def read_root():
    return {"message": "Hello World"}

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

@app.get("/get_protein_data/{entry}")
async def get_protein_data(entry: str):

    query = protein_data.select().where(protein_data.c.entry == entry)
    protein = await database.fetch_one(query)
    if not protein:
        raise HTTPException(status_code=404, detail="Protein not found")
    processed_data = process_protein_data(protein)
    return processed_data    

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

@app.get("/data_sources", response_model=List[str])
async def data_sources():
    return get_table_names()

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



@app.post("/query_followup/")
async def query_followup(query_request: QueryRequest):
    messages = [CHAT_GPT_FOLLOWUP_PROMPT] + query_request.context + [{"role": "user", "content": query_request.query}]
    try:
        
        follow_up_questions = get_follow_up_questions_from_ai(messages)

        print("Follow up questions: ", follow_up_questions)

        if not follow_up_questions:
            return {"follow_up_questions": [""]}

        return follow_up_questions

    except Exception as e:
        print(e)
        return {"follow_up_questions": [""]}


@app.post("/query/")
async def query_model(query_request: QueryRequest) -> QueryResponse:

    print(f"\nData coming in to query : {query_request}")

    # Pick the last conversation from the user
    userQuery = query_request.query

    try:
        
        # Check if given input is query or a conversation
        classification = classify_input_string_for_conversation(userQuery)
        print(f"\nThe user input is classified as {classification}")

        # If it is a normal question, then just pass it along to the conversation chain
        if classification == "conversation":
            # Invoke the LLMChain to get the response
            result = get_ai_response_for_conversation(query_request.context)
            return {"response": result, "type" : ChatResponseTypes.conversation}
        else :
            result = query_database(userQuery, query_request.context[:-1])
            # Else pass it to the query generation chain
            return {"response": result, "type" : ChatResponseTypes.conversation}

    except Exception as e:
        print(e)
        # raise HTTPException(status_code=500, detail=str(e))
        return {"response": "Error in forming output "+ e}
    

@app.post("/query_chart")
async def query_chart(query_request: ChartQueryRequest) -> ChartQueryResponse:
    """
    This api takes in a data source name, the conversation history, the current user query
    and returns a json spec for the chart based on context

    This first iteration we build a simple API that is stateless 
    We will use the conversation history for context instead of storing context on the API side

    This api will return data of type ChartQueryResponse
    
    The focus is on getting the spec given the user query, conversation history and table name
    """
    print(f"Input body for generating chart {query_request}")

    # Pick the last conversation from the user
    userQuery = query_request.query

    try:
        # Check if given input is to generate a spec or a conversation
        classification = classify_input_string_for_chart(userQuery)
        print(f"\nThe user input is classified as {classification}")

        # If it is a normal question, then just pass it along to the conversation chain
        if classification == "conversation":
            # Invoke the LLMChain to get the response
            result = get_ai_response_for_chart_conversation(query_request.context,  query_request.table_name)
            return {
                        "type": ChatResponseTypes.conversation,
                        "response" : result
                    }
        else :
            result = generate_chart_spec(userQuery, query_request.context[:-1], query_request.table_name)
            # Else pass it to the query generation chain
            return {
                        "type": ChatResponseTypes.chart,
                        "response" : result
                    }

    except Exception as e:
        print(e)
        # raise HTTPException(status_code=500, detail=str(e))
        return {"response": "Error in forming output "+ e}
