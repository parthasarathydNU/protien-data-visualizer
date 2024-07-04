from pydantic import BaseModel

class CodonUsage(BaseModel):
    codon: str
    aa: str
    freq: float
    abundance: float

    class Config:
        from_attributes = True
