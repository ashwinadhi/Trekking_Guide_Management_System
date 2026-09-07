"""Test configuration loaded from environment."""
import os
from pathlib import Path
from dotenv import load_dotenv

ROOT = Path(__file__).resolve().parents[1]
load_dotenv(ROOT / ".env.local")

BASE_URL = os.getenv("TEST_BASE_URL", "http://localhost:3000")
MONGODB_URI = os.getenv("MONGODB_URI", "")
ADMIN_EMAIL = os.getenv("ADMIN_EMAIL", "")
ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD", "")

# Test customer data — safe synthetic values
VALID_CUSTOMER = {
    "name": "QA Test User",
    "email": "qa.test.user@example.com",
    "phone": "9801234567",
    "country": "Nepal",
}

INVALID_EMAIL = "not-an-email"
INVALID_PHONE = "12345"
PAST_DATE = "2020-01-01"
FUTURE_START = "2026-12-01"
FUTURE_END = "2026-12-05"
