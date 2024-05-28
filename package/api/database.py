from databases import Database
from sqlalchemy import create_engine, MetaData

DATABASE_URL = "postgresql://postgres:postgres@localhost:5432/generatebiomedicines"

engine = create_engine(DATABASE_URL)
metadata = MetaData()

database = Database(DATABASE_URL)
