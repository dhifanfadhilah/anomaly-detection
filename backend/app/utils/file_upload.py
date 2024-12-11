import pandas as pd
from io import BytesIO

def load_csv(content: bytes) -> pd.DataFrame:
    try:
        return pd.read_csv(BytesIO(content))
    except Exception as e:
        raise ValueError(f"Error reading CSV: {str(e)}")
