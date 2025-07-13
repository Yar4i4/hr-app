from sqlalchemy import Column, Integer, String, Date, Numeric
from database import Base

class Employee(Base):
    __tablename__ = "employees"

    id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    position = Column(String(100))
    department = Column(String(100))
    hire_date = Column(Date)
    salary = Column(Numeric(10, 2))