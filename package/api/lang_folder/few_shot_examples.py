few_shot_examples = [
    {
        "input": "Retrieve all gene aliases for gene_id 'PF3D7_1314600'.",
        "query": "SELECT * FROM gene_aliases WHERE gene_id = 'PF3D7_1314600';"
    },
    {
        "input": "Count the total number of unique genes listed in the gene_annotations table.",
        "query": "SELECT COUNT(DISTINCT gene_id) FROM gene_annotations;"
    },
    {
        "input": "Find the most frequently used codon in the codon_usage table.",
        "query": "SELECT codon, MAX(freq) FROM codon_usage GROUP BY codon ORDER BY MAX(freq) DESC LIMIT 1;"
    },
    {
        "input": "List all protein data entries first seen after 2010.",
        "query": "SELECT * FROM protein_data WHERE first_seen > '2010-01-01';"
    },
    {
        "input": "Get details of gene annotations where the symbol is 'VAR'.",
        "query": "SELECT * FROM gene_annotations WHERE symbol = 'VAR';"
    },
    {
        "input": "Show sequences from the protein_data table with an average hydrophobicity greater than 0.",
        "query": "SELECT sequence FROM protein_data WHERE avg_hydrophobicity > 0;"
    },
    {
        "input": "List all genes and their aliases from gene_aliases where alias9 is not NULL.",
        "query": "SELECT gene_id, alias1, alias2, alias3, alias4, alias5, alias6, alias7, alias8, alias9 FROM gene_aliases WHERE alias9 IS NOT NULL;"
    },
    {
        "input": "Find all GFF annotations related to pseudogenes.",
        "query": "SELECT * FROM gff_annotations WHERE type = 'pseudogene';"
    },
    {
        "input": "Retrieve all protein entries for Homo sapiens.",
        "query": "SELECT * FROM protein_data WHERE organisms LIKE '%Homo sapiens%';"
    },
    {
        "input": "Show details of the longest protein sequence.",
        "query": "SELECT MAX(length), entry FROM protein_data GROUP BY entry ORDER BY MAX(length) DESC LIMIT 1;"
    },
    {
        "input": "List gene annotations categorized under biological process (BP).",
        "query": "SELECT * FROM gene_annotations WHERE aspect = 'BP';"
    },
    {
        "input": "Find codon usage details where the abundance is less than 0.2.",
        "query": "SELECT * FROM codon_usage WHERE abundance < 0.2;"
    },
    {
        "input": "Retrieve annotations for genes first annotated by VEuPathDB.",
        "query": "SELECT * FROM gene_annotations WHERE source = 'VEuPathDB';"
    },
    {
        "input": "List all gene_ids and their corresponding protein names with multiple aliases.",
        "query": "SELECT ga.gene_id, pd.protein_names FROM gene_aliases ga JOIN protein_data pd ON ga.gene_id = pd.entry WHERE ga.alias2 IS NOT NULL;"
    },
    {
        "input": "Find proteins with no known pfam assigned.",
        "query": "SELECT entry, protein_names FROM protein_data WHERE pfam IS NULL;"
    },
    {
        "input": "List all entries from gff_annotations between start positions 500000 and 600000.",
        "query": "SELECT * FROM gff_annotations WHERE start BETWEEN 500000 AND 600000;"
    },
    {
        "input": "Show all protein data entries last seen before 2010 but first seen after 2000.",
        "query": "SELECT * FROM protein_data WHERE first_seen > '2000-01-01' AND last_seen < '2010-01-01';"
    },
    {
        "input": "Aggregate the average frequency of each amino acid in codon_usage.",
        "query": "SELECT aa, AVG(freq) AS average_frequency FROM codon_usage GROUP BY aa;"
    },
    {
        "input": "Find all annotations that have a gene_type of 'protein_coding' and are assigned by 'GeneDB'.",
        "query": "SELECT * FROM gene_annotations WHERE gene_type = 'protein_coding' AND assigned_by = 'GeneDB';"
    },
    {
        "input": "List every unique organism in the protein_data table along with the count of entries for each.",
        "query": "SELECT organisms, COUNT(*) FROM protein_data GROUP BY organisms;"
    },
    {
        "input": "List all gene_ids along with their corresponding protein names and the last time they were seen.",
        "query": "SELECT ga.gene_id, pd.protein_names, pd.last_seen FROM gene_aliases ga JOIN protein_data pd ON ga.gene_id = pd.entry;"
    },
    {
        "input": "Retrieve gene annotations and corresponding alias information for gene_id 'PF3D7_0100100'.",
        "query": "SELECT ga.gene_id, ga.alias1, ga.alias2, ga.alias3, ga.alias4, ga.alias5, ga.alias6, ga.alias7, ga.alias8, ga.alias9, ann.description FROM gene_aliases ga JOIN gene_annotations ann ON ga.gene_id = ann.gene_id WHERE ga.gene_id = 'PF3D7_0100100';"
    },
    {
        "input": "Find all gene annotations that have corresponding protein data, showing the gene's symbol, protein names, and sequence.",
        "query": "SELECT ann.symbol, pd.protein_names, pd.sequence FROM gene_annotations ann JOIN protein_data pd ON ann.gene_id = pd.entry;"
    },
    {
        "input": "List all genes that have a 'protein_coding' type in gene_annotations and their corresponding protein names and sequences from protein_data.",
        "query": "SELECT ann.gene_id, pd.protein_names, pd.sequence FROM gene_annotations ann JOIN protein_data pd ON ann.gene_id = pd.entry WHERE ann.gene_type = 'protein_coding';"
    },
    {
        "input": "Show gene_id, all aliases, and description for genes that are associated with the GO term 'GO:0020013'.",
        "query": "SELECT ga.gene_id, ga.alias1, ga.alias2, ga.alias3, ga.alias4, ga.alias5, ga.alias6, ga.alias7, ga.alias8, ga.alias9, ann.description FROM gene_aliases ga JOIN gene_annotations ann ON ga.gene_id = ann.gene_id WHERE ann.go_id = 'GO:0020013';"
    },
    {
        "input": "Retrieve detailed annotations for all genes annotated by 'GeneDB' along with their aliases and last seen protein data.",
        "query": "SELECT ann.gene_id, ann.description, ga.alias1, pd.last_seen FROM gene_annotations ann JOIN gene_aliases ga ON ann.gene_id = ga.gene_id JOIN protein_data pd ON ann.gene_id = pd.entry WHERE ann.assigned_by = 'GeneDB';"
    },
    {
        "input": "List all GFF annotations and corresponding gene annotations for the sequences starting from position 500000 to 600000.",
        "query": "SELECT gff.seqid, gff.start, gff.stop, gff.type, ann.gene_id, ann.description FROM gff_annotations gff JOIN gene_annotations ann ON gff.seqid = ann.gene_id WHERE gff.start BETWEEN 500000 AND 600000;"
    },
    {
        "input": "Find proteins and their codon usage statistics where the protein was first seen before 2005 and the codon frequency is greater than 0.5.",
        "query": "SELECT pd.protein_names, cu.codon, cu.freq FROM protein_data pd JOIN codon_usage cu ON pd.entry = cu.codon WHERE pd.first_seen < '2005-01-01' AND cu.freq > 0.5;"
    },
    {
        "input": "Show all protein sequences and their gene annotations where the protein is related to Homo sapiens and has a hydrophobicity less than 0.",
        "query": "SELECT pd.sequence, ann.gene_id, ann.description FROM protein_data pd JOIN gene_annotations ann ON pd.entry = ann.gene_id WHERE pd.organisms LIKE '%Homo sapiens%' AND pd.avg_hydrophobicity < 0;"
    },
    {
        "input": "List all gene aliases and corresponding protein data for genes that have more than five aliases.",
        "query": "SELECT ga.gene_id, ga.alias1, ga.alias2, ga.alias3, ga.alias4, ga.alias5, ga.alias6, ga.alias7, ga.alias8, ga.alias9, pd.protein_names FROM gene_aliases ga JOIN protein_data pd ON ga.gene_id = pd.entry WHERE ga.alias6 IS NOT NULL;"
    }    
]
