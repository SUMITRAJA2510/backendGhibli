"""FastAPI application for the B4 transaction ledger."""

from fastapi import FastAPI

from app.schemas import BalanceResponse, Transaction, TransactionCreate
from app.store import store

app = FastAPI(
    title="B4 Transaction API",
    version="1.0.0",
    description=(
        "In-memory ledger. The balance is the sum of credit amounts "
        "minus the sum of debit amounts. When type is omitted, the "
        "transaction is a credit."
    ),
)


@app.post("/transactions", response_model=Transaction, status_code=201)
def create_transaction(payload: TransactionCreate) -> Transaction:
    return store.add(payload)


@app.get("/transactions", response_model=list[Transaction])
def list_transactions() -> list[Transaction]:
    return store.list_all()


@app.get("/balance", response_model=BalanceResponse)
def get_balance() -> BalanceResponse:
    return BalanceResponse(balance=store.balance())
