"""Equipment rental API tests — POST /api/rentals."""
import pytest

from utils.test_data import rental_payload


@pytest.mark.api
@pytest.mark.p0
class TestRentalBookingAPI:
    def test_valid_rental_creates_record(self, api, db, cleanup_bookings, first_equipment_id, test_email):
        equipment = api.get("/api/equipment").json()
        item = next(e for e in equipment if e["_id"] == first_equipment_id)
        payload = rental_payload(email=test_email, daily_price=15.0, quantity=2, equipment_id=first_equipment_id)
        resp = api.post("/api/rentals", json=payload)

        assert resp.status_code == 201, resp.text
        data = resp.json()
        assert data["customerEmail"] == test_email
        assert data["status"] == "pending"
        expected_total = item["price"] * 2 * 4
        assert data["totalPrice"] == expected_total

        db_record = db.find_rental_by_email(test_email)
        assert db_record is not None
        assert db_record["totalPrice"] == expected_total

    def test_missing_fields_returns_400(self, api, first_equipment_id):
        resp = api.post("/api/rentals", json={"customerName": "Test"})
        assert resp.status_code == 400

    def test_invalid_email_returns_400(self, api, first_equipment_id):
        payload = rental_payload(email="not-valid", equipment_id=first_equipment_id)
        resp = api.post("/api/rentals", json=payload)
        assert resp.status_code == 400

    def test_empty_cart_returns_400(self, api, first_equipment_id):
        payload = rental_payload(equipment_id=first_equipment_id)
        payload["items"] = []
        resp = api.post("/api/rentals", json=payload)
        assert resp.status_code == 400

    @pytest.mark.security
    def test_server_uses_catalog_daily_price(self, api, db, cleanup_bookings, first_equipment_id, test_email):
        payload = rental_payload(email=test_email, daily_price=0.01, equipment_id=first_equipment_id)
        resp = api.post("/api/rentals", json=payload)
        assert resp.status_code == 201
        assert resp.json()["totalPrice"] > 0.04

    def test_end_before_start_rejected(self, api, first_equipment_id):
        payload = rental_payload(equipment_id=first_equipment_id)
        payload["startDate"] = "2026-12-10"
        payload["endDate"] = "2026-12-01"
        resp = api.post("/api/rentals", json=payload)
        assert resp.status_code == 400
