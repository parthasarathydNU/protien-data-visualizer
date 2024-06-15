from lang_folder.database import db
from lang_folder.few_shot_examples import few_shot_examples
from lang_folder.chains import classification_chain, conversation_chain, generate_response_with_table_info, follow_up_questions_chain
# Function to classify a given input string
def classify_input_string(input_string):
    # Prepare the input for the LLMChain
    input_data = {"input_string": input_string}
    print(f"Data to classification chain {input_data}")
    # Invoke the LLMChain to get the classification
    result = classification_chain.invoke(input_data)
    print(f"result from chain {result}")
    return result


# This will later be converted to an API call
def get_few_shot_examples():
    return few_shot_examples

def get_ai_response_for_conversation(conversation):
    formatted_conversation = [('ai' if entry["role"] == 'assistant' else 'human', entry["content"]) for entry in conversation]
    print(f"formatted_conversation {formatted_conversation}")
    result = conversation_chain.invoke({"table_info" : db.table_info , "conversation" : formatted_conversation})
    print(f"Result from ai {result}")
    return result

def get_follow_up_questions_from_ai(conversation):
    formatted_conversation = [('ai' if entry["role"] == 'assistant' else 'human', entry["content"]) for entry in conversation]
    result = follow_up_questions_chain.invoke({"table_info" : db.table_info , "conversation" : formatted_conversation})
    return result

def query_database(userQuery, conversation):
    formatted_conversation = [('ai' if entry["role"] == 'assistant' else 'human', entry["content"]) for entry in conversation]
    return generate_response_with_table_info.invoke({"question": userQuery, "table_descriptions" : table_descriptions, "table_dialect" : db.dialect, "conversation" : formatted_conversation })


table_descriptions = """
Table Name : codon_usage
Table Description:This table stores data about the usage frequency and abundance of each codon. Codons are sequences of three DNA or RNA nucleotides that correspond to a specific amino acid or stop signal during protein synthesis. Each row represents a codon, its corresponding amino acid, and its frequency and abundance metrics in the genome.

Table Name : gene_aliases
Table Description:This table contains alias names for gene IDs. It helps in linking various names or identifiers that a single gene might be known by in different studies or databases. Each row contains a gene ID followed by multiple columns for potential aliases, helping to consolidate gene identification across different scientific literature or databases.

Table Name : gene_annotations
Table Description:The gene_annotations table stores detailed annotations for genes. This includes the source of the annotation, symbols, Gene Ontology IDs, references, evidence types, aspects (like biological process, cellular component, etc.), descriptions, synonyms, gene types, taxon identifiers, the date of annotation, and the organization that assigned the annotation.

Table Name : gff_annotations
Table Description:This table contains annotations from GFF (General Feature Format) files which are used to describe genes, gene structure, and other features of DNA, RNA, and protein sequences. The table includes fields such as the sequence ID, source, type of feature (like exon, intron, UTR), start and stop positions, score, strand, phase, and a free-text attributes field that can include IDs and descriptions.

Table Name : protein_data
Table Description:The protein_data table holds information related to proteins, including entries, organisms they are associated with, the length of the proteins, the first and last seen dates of the proteins in studies or databases, organism IDs, protein names, amino acid sequences, domain information (Pfam, SMART), amino acid composition, average hydrophobicity, and secondary structure descriptions. This table is crucial for understanding protein characteristics and their functions in various organisms.
"""
