import re

def remove_control_characters(s):
    # Remove control characters
    s = re.sub(r'[\x00-\x1f\x7f-\x9f]', '', s)
    # Remove backticks
    s = s.replace('`', '')
    return s
from collections import Counter

def calculate_length(protein):
    return len(protein['sequence'])

def calculate_avg_hydrophobicity(protein):
    hydrophobicity = {
        'A': 1.8, 'C': 2.5, 'D': -3.5, 'E': -3.5, 'F': 2.8, 'G': -0.4,
        'H': -3.2, 'I': 4.5, 'K': -3.9, 'L': 3.8, 'M': 1.9, 'N': -3.5,
        'P': -1.6, 'Q': -3.5, 'R': -4.5, 'S': -0.8, 'T': -0.7, 'V': 4.2,
        'W': -0.9, 'Y': -1.3
    }
    total_hydrophobicity = sum(hydrophobicity.get(aa, 0) for aa in protein['sequence'])
    return total_hydrophobicity / len(protein['sequence'])

def calculate_amino_acid_composition(protein):
    sequence = protein['sequence']
    composition = Counter(sequence)
    return {aa: count / len(sequence) * 100 for aa, count in composition.items()}

def calculate_secondary_structure(protein):
    structure = protein['secondary_structure']
    composition = Counter(structure)
    return composition

def process_protein_data(protein):
    length = calculate_length(protein)
    avg_hydrophobicity = calculate_avg_hydrophobicity(protein)
    amino_acid_composition = calculate_amino_acid_composition(protein)
    secondary_structure = calculate_secondary_structure(protein)
    
    return {
        "length": length,
        "avg_hydrophobicity": avg_hydrophobicity,
        "amino_acid_composition": amino_acid_composition,
        "secondary_structure": secondary_structure,
    }
