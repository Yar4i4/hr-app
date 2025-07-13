from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from pydantic import BaseModel
from datetime import date
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel # Убедитесь, что BaseModel импортирован

import models, database

models.Base.metadata.create_all(bind=database.engine)
class EmployeeCreateSchema(BaseModel):
    first_name: str
    last_name: str
    position: str | None = None
    department: str | None = None
    hire_date: date | None = None
    salary: float | None = None

class EmployeeSchema(BaseModel):
    id: int
    first_name: str
    last_name: str
    position: str | None = None
    department: str | None = None
    hire_date: date | None = None
    salary: float | None = None

    class Config:
        from_attributes = True

app = FastAPI()

origins = [
    "http://localhost",
    "http://localhost:3000", 
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"], 
    allow_headers=["*"], 
)


def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/")
def read_root():
    return {"message": "Бэкенд запущен, добро пожаловать в HR-App API!"}

@app.post("/api/employees/", response_model=EmployeeSchema)
def create_employee(employee: EmployeeCreateSchema, db: Session = Depends(get_db)):
    # Создаем нового сотрудника на основе данных из запроса
    db_employee = models.Employee(**employee.dict())
    # Добавляем его в сессию базы данных
    db.add(db_employee)
    # Сохраняем изменения в базе
    db.commit()
    # Обновляем объект, чтобы получить id, присвоенный базой данных
    db.refresh(db_employee)
    # Возвращаем созданного сотрудника
    return db_employee






@app.get("/api/employees/", response_model=List[EmployeeSchema])
def get_employees(db: Session = Depends(get_db)):
    employees = db.query(models.Employee).all()
    return employees




