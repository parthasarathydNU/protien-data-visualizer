export type ProteinData = {
    entry: string
    organisms: string
    length: number
    first_seen: Date
    last_seen: Date
    organism_id: string
    protein_names: string
    sequence: string
    pfam: string
    smart: string
    amino_acid_composition: JSON
    avg_hydrophobicity: number
    secondary_structure: [string]
}

export type CodonUsage = {
    codon: string
    aa: string
    freq: number
    abundance: number
}
