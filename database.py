from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv

# Эта строка загружает переменные из файла .env для локальной разработки.
# На Vercel она ничего не будет делать, но позволит вам запускать бэкенд локально.
load_dotenv() 

# Эта строка читает переменную окружения, которую вы установили на Vercel.
DATABASE_URL = os.getenv("DATABASE_URL")

# Проверка, что переменная была найдена
if not DATABASE_URL:
    raise ValueError("Не найдена переменная окружения DATABASE_URL")

engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()