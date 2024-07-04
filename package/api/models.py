from sqlalchemy import Table, Column, Integer, String, Float, Date, JSON
from sqlalchemy.sql.sqltypes import Float
from database import metadata

protein_data = Table(
    "protein_data", metadata,
    Column("entry", String, primary_key=True),
    Column("organisms", String),
    Column("length", Integer),
    Column("first_seen", Date),
    Column("last_seen", Date),
    Column("organism_id", String),
    Column("protein_names", String),
    Column("sequence", String),
    Column("pfam", String),
    Column("smart", String),
    Column("amino_acid_composition", JSON),
    Column("avg_hydrophobicity", Float),
    Column("secondary_structure", JSON),
)

codon_usage = Table(
    "codon_usage", metadata,
    Column("codon", String, primary_key=True),
    Column("aa", String),
    Column("freq", Float),
    Column("abundance", Float),
)
