"""MongoDB verification helpers for QA tests."""
from __future__ import annotations

import os
from typing import Any
from urllib.parse import urlparse

from pymongo import MongoClient

from utils.config import MONGODB_URI


def _resolve_db_name(uri: str) -> str:
    path = urlparse(uri).path.strip("/")
    return path or os.getenv("MONGODB_DB_NAME", "test")


class DBHelper:
    def __init__(self, uri: str = MONGODB_URI):
        if not uri:
            raise RuntimeError("MONGODB_URI is not configured for DB verification tests")
        self.client = MongoClient(uri, serverSelectionTimeoutMS=5000)
        self.db = self.client[_resolve_db_name(uri)]

    def close(self):
        self.client.close()

    def find_booking_by_email(self, email: str) -> dict[str, Any] | None:
        return self.db.bookings.find_one({"email": email.lower()})

    def find_rental_by_email(self, email: str) -> dict[str, Any] | None:
        return self.db.rentals.find_one({"customerEmail": email.lower()})

    def find_vehicle_booking_by_email(self, email: str) -> dict[str, Any] | None:
        return self.db.vehiclebookings.find_one({"customerEmail": email.lower()})

    def find_hotel_booking_by_email(self, email: str) -> dict[str, Any] | None:
        return self.db.hotelbookings.find_one({"guestEmail": email.lower()})

    def count_bookings_by_email(self, email: str) -> int:
        return self.db.bookings.count_documents({"email": email.lower()})

    def delete_test_bookings(self, email: str):
        """Clean up QA test data — only for synthetic test emails."""
        if not email.endswith("@example.com"):
            raise ValueError("Refusing to delete non-test email data")
        self.db.bookings.delete_many({"email": email.lower()})
        self.db.rentals.delete_many({"customerEmail": email.lower()})
        self.db.vehiclebookings.delete_many({"customerEmail": email.lower()})
        self.db.hotelbookings.delete_many({"guestEmail": email.lower()})
