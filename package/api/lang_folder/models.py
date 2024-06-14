from typing import List
from langchain_core.pydantic_v1 import BaseModel, Field

# Define the Table model
class Table(BaseModel):
    """Table in SQL database."""
    name: str = Field(description="Name of table in SQL database.")

# Define the TableList model
class TableList(BaseModel):
    """List of tables that are relevant to the given input"""
    list: List[Table] = Field(description="List of tables that are relevant to the given input")
