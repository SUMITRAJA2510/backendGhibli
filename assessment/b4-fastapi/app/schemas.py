"""Request and response models."""

from datetime import datetime
from decimal import Decimal
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field, field_validator

TransactionType = Literal["credit", "debit"]


class TransactionCreate(BaseModel):
    """A transaction to record. `type` and `description` may be omitted."""

    model_config = ConfigDict(extra="forbid", str_strip_whitespace=True)

    amount: Decimal = Field(
        ...,
        gt=0,
        max_digits=12,
        decimal_places=2,
        description="Positive amount with at most 2 decimal places.",
        examples=["19.99"],
    )
    type: TransactionType = Field(
        default="credit",
        description="credit adds to the balance; debit subtracts. Defaults to credit.",
    )
    description: str | None = Field(default=None, max_length=280)

    @field_validator("amount")
    @classmethod
    def amount_must_be_finite(cls, value: Decimal) -> Decimal:
        if not value.is_finite():
            raise ValueError("amount must be a finite number")
        return value

    @field_validator("description")
    @classmethod
    def blank_description_is_omitted(cls, value: str | None) -> str | None:
        if value is None:
            return None
        return value or None


class Transaction(TransactionCreate):
    id: int
    created_at: datetime


class BalanceResponse(BaseModel):
    balance: Decimal = Field(
        description="Sum of credit amounts minus sum of debit amounts.",
        examples=["60.00"],
    )
