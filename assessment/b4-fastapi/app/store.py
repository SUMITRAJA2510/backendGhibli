"""Process-local transaction ledger."""

from datetime import datetime, timezone
from decimal import Decimal
from threading import Lock

from app.schemas import Transaction, TransactionCreate

_ZERO = Decimal("0.00")
_CENT = Decimal("0.01")


def compute_balance(transactions: list[Transaction]) -> Decimal:
    """Return credits minus debits, quantized to cents.

    Missing transactions yield 0.00. A debit larger than the current
    credits produces a negative balance; the store does not reject it.
    """
    total = _ZERO
    for transaction in transactions:
        if transaction.type == "debit":
            total -= transaction.amount
        else:
            total += transaction.amount
    return total.quantize(_CENT)


class TransactionStore:
    def __init__(self) -> None:
        self._items: list[Transaction] = []
        self._next_id = 1
        self._lock = Lock()

    def add(self, payload: TransactionCreate) -> Transaction:
        with self._lock:
            transaction = Transaction(
                id=self._next_id,
                created_at=datetime.now(timezone.utc),
                amount=payload.amount,
                type=payload.type,
                description=payload.description,
            )
            self._next_id += 1
            self._items.append(transaction)
            return transaction

    def list_all(self) -> list[Transaction]:
        with self._lock:
            return list(self._items)

    def balance(self) -> Decimal:
        return compute_balance(self.list_all())

    def clear(self) -> None:
        with self._lock:
            self._items.clear()
            self._next_id = 1


store = TransactionStore()
