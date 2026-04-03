import os
from sqlalchemy import create_engine

DATABASE_URL = os.getenv("SQLI_DATABASE_URL")
engine = create_engine(DATABASE_URL)