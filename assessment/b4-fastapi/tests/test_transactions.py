from decimal import Decimal

import pytest


def test_create_credit_and_list_transactions(client):
    created = client.post(
        "/transactions",
        json={"amount": "25.50", "description": "invoice"},
    )
    assert created.status_code == 201
    body = created.json()
    assert body["id"] == 1
    assert Decimal(body["amount"]) == Decimal("25.50")
    assert body["type"] == "credit"
    assert body["description"] == "invoice"
    assert body["created_at"]

    listed = client.get("/transactions")
    assert listed.status_code == 200
    assert len(listed.json()) == 1
    assert listed.json()[0]["id"] == body["id"]

    balance = client.get("/balance")
    assert balance.status_code == 200
    assert Decimal(balance.json()["balance"]) == Decimal("25.50")


def test_balance_is_credits_minus_debits(client):
    assert client.post(
        "/transactions",
        json={"amount": "100.00", "type": "credit", "description": "deposit"},
    ).status_code == 201
    assert client.post(
        "/transactions",
        json={"amount": "40.25", "type": "debit", "description": "withdrawal"},
    ).status_code == 201
    assert client.post(
        "/transactions",
        json={"amount": "10"},
    ).status_code == 201

    listed = client.get("/transactions")
    assert listed.status_code == 200
    assert [item["type"] for item in listed.json()] == ["credit", "debit", "credit"]

    balance = client.get("/balance")
    assert balance.status_code == 200
    # 100.00 - 40.25 + 10.00
    assert Decimal(balance.json()["balance"]) == Decimal("69.75")


def test_balance_starts_at_zero(client):
    listed = client.get("/transactions")
    balance = client.get("/balance")
    assert listed.status_code == 200
    assert listed.json() == []
    assert balance.status_code == 200
    assert Decimal(balance.json()["balance"]) == Decimal("0.00")


@pytest.mark.parametrize(
    "payload",
    [
        {},
        {"amount": 0},
        {"amount": -10},
        {"amount": "abc"},
        {"amount": "NaN"},
        {"amount": "Infinity"},
        {"amount": "10.129"},
        {"amount": 10, "type": "transfer"},
        {"amount": 10, "description": "x" * 281},
        {"amount": 10, "unknown": True},
    ],
)
def test_invalid_transaction_returns_422(client, payload):
    response = client.post("/transactions", json=payload)
    assert response.status_code == 422
    assert "detail" in response.json()
    assert client.get("/transactions").json() == []
    assert Decimal(client.get("/balance").json()["balance"]) == Decimal("0.00")
