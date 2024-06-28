from typing import List
from langchain_core.pydantic_v1 import BaseModel, Field

# Define the Table model
class Table(BaseModel):
    """Table in SQL database."""
    name: str = Field(description="Name of table in SQL database.")

# Model for followup queries 
class FollowUpQueries(BaseModel):
    """List of questions that the user can ask as a follow up to the bot"""
    follow_up_questions : List[str] = Field(description="List of questions that the user can ask as a follow up to the bot")

# Define the TableList model
class TableList(BaseModel):
    """List of tables that are relevant to the given input"""
    list: List[Table] = Field(description="List of tables that are relevant to the given input")
