from sqlalchemy import Table, Column, Integer, String, Float, Date, JSON, Text, text
from sqlalchemy.sql.sqltypes import Float
from sqlalchemy.dialects.postgresql import UUID
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

gene_aliases = Table(
    "gene_aliases", metadata,
    Column("gene_id", String, primary_key=True),
    Column("alias1", String),
    Column("alias2", String),
    Column("alias3", String),
    Column("alias4", String),
    Column("alias5", String),
    Column("alias6", String),
    Column("alias7", String),
    Column("alias8", String),
    Column("alias9", String),
)

gene_annotations = Table(
    "gene_annotations", metadata,
    Column("source", String(50)),
    Column("gene_id", String(255), primary_key=True),
    Column("symbol", String(255)),
    Column("go_id", String(50)),
    Column("reference", String(255)),
    Column("evidence", String(50)),
    Column("aspect", String(10)),
    Column("description", Text),
    Column("synonym", String(255)),
    Column("gene_type", String(100)),
    Column("taxon", String(50)),
    Column("date", String(20)),
    Column("assigned_by", String(100)),
)


gff_annotations = Table(
    "gff_annotations", metadata,
    Column("seqid", String(255)),
    Column("source", String(255)),
    Column("type", String(255)),
    Column("start", Integer),
    Column("stop", Integer),
    Column("score", String(10)),
    Column("strand", String(1)),
    Column("phase", String(1)),
    Column("attributes", Text),
)

charts = Table(
    "charts", metadata,
    Column("chart_id", UUID(as_uuid=True), primary_key=True, server_default=text("uuid_generate_v4()")),
    Column("chart_data", JSON),
    Column("chart_spec", JSON),
)
