# Assessment B4 — FastAPI transaction ledger

Small FastAPI service that records transactions in memory and reports a running balance. There is no authentication and no database. Restarting the process clears every transaction.

## How the balance is computed

The balance starts at `0.00` when the store is empty.

Each transaction has a positive `amount` and a `type`:

- `credit` adds the amount to the balance
- `debit` subtracts the amount from the balance

`type` is optional and defaults to `credit`.

```text
balance = sum(credit amounts) − sum(debit amounts)
```

The result is rounded to cents (2 decimal places) using decimal arithmetic. A debit larger than the credits so far is allowed, so the balance can be negative. Invalid requests are rejected and do not change the balance.

## Requirements

- Python 3.11+

## Install

From this directory (`assessment/b4-fastapi`):

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

## Run

```bash
source .venv/bin/activate
uvicorn app.main:app --reload --port 8000
```

Interactive docs: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

## Test

```bash
source .venv/bin/activate
pytest -v
```

## API

### `POST /transactions`

Record one transaction. `amount` is required. `type` (`credit` or `debit`) and `description` are optional.

```bash
curl -s -X POST http://127.0.0.1:8000/transactions \
  -H 'Content-Type: application/json' \
  -d '{"amount": "100.00", "type": "credit", "description": "deposit"}'
```

`201 Created`:

```json
{
  "amount": "100.00",
  "type": "credit",
  "description": "deposit",
  "id": 1,
  "created_at": "2026-09-23T08:00:00.000000Z"
}
```

### `GET /transactions`

List every stored transaction, oldest first.

```bash
curl -s http://127.0.0.1:8000/transactions
```

### `GET /balance`

Return the current balance derived from the stored transactions.

```bash
curl -s http://127.0.0.1:8000/balance
```

```json
{"balance": "59.75"}
```

## Validation

Request bodies are validated with Pydantic. Bad input returns **422 Unprocessable Entity** and is not stored. Examples:

- missing `amount`
- `amount` that is zero, negative, non-numeric, non-finite, or has more than 2 decimal places
- `amount` with more than 12 digits in total
- `type` other than `credit` or `debit`
- `description` longer than 280 characters
- unexpected fields

`amount` may be a JSON number or a numeric string. Prefer a string (`"19.99"`) so decimal places stay exact.
