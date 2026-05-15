from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base
from .routers import expenses

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Expense Manager API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(expenses.router, prefix="/api")

@app.get("/")
def root():
    return {"message": "Expense Manager API", "docs": "/docs"}
from .routers import debts
app.include_router(debts.router, prefix="/api")
from .routers import claims
app.include_router(claims.router, prefix="/api")
from .routers import debts
app.include_router(debts.router, prefix="/api")
from .routers import incomes
app.include_router(incomes.router, prefix="/api")
