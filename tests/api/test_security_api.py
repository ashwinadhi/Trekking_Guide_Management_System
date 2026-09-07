"""Security-focused API tests."""
import pytest

from utils.test_data import guide_booking_payload, rental_payload


@pytest.mark.security
@pytest.mark.p1
class TestSecurityAPI:
    def test_xss_in_name_field_stored_as_is(self, api, first_guide_id):
        payload = guide_booking_payload(first_guide_id, email="xss.test@example.com")
        payload["name"] = "<script>alert('xss')</script>"
        resp = api.post("/api/bookings", json=payload)
        # Validation rejects special chars in name — good
        assert resp.status_code == 400

    def test_sql_injection_in_email_rejected(self, api, first_guide_id):
        payload = guide_booking_payload(first_guide_id, email="'; DROP TABLE bookings;--@test.com")
        resp = api.post("/api/bookings", json=payload)
        assert resp.status_code == 400

    def test_cart_uses_catalog_price(self, api, first_equipment_id):
        resp = api.post("/api/cart", json={
            "sessionId": "qa-security-session",
            "itemId": first_equipment_id,
            "itemType": "equipment",
            "name": "Ignored Name",
            "price": 0,
            "quantity": 1,
            "rentalDays": 1,
        })
        assert resp.status_code in (200, 201)
        assert resp.json()["price"] > 0

    def test_negative_quantity_rejected(self, api, first_equipment_id):
        payload = rental_payload(email="negative.qty@example.com", quantity=-5, equipment_id=first_equipment_id)
        resp = api.post("/api/rentals", json=payload)
        assert resp.status_code == 400
