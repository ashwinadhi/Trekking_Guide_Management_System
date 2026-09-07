"""Hotel booking API tests — POST /api/hotel-bookings."""
import pytest

from utils.test_data import hotel_booking_payload


@pytest.mark.api
@pytest.mark.p0
class TestHotelBookingAPI:
    def test_valid_hotel_booking_creates_record(self, api, db, cleanup_bookings, first_hotel_id, test_email):
        payload = hotel_booking_payload(first_hotel_id, email=test_email)
        resp = api.post("/api/hotel-bookings", json=payload)

        assert resp.status_code == 201, resp.text
        data = resp.json()
        assert data["guestEmail"] == test_email
        assert data["status"] == "pending"
        assert data["totalPrice"] > 0

        db_record = db.find_hotel_booking_by_email(test_email)
        assert db_record is not None

    def test_invalid_hotel_id_returns_404(self, api):
        payload = hotel_booking_payload("000000000000000000000000")
        resp = api.post("/api/hotel-bookings", json=payload)
        assert resp.status_code == 404

    def test_missing_fields_returns_400(self, api, first_hotel_id):
        payload = hotel_booking_payload(first_hotel_id)
        del payload["guestPhone"]
        resp = api.post("/api/hotel-bookings", json=payload)
        assert resp.status_code == 400

    @pytest.mark.security
    def test_client_total_price_ignored(self, api, db, cleanup_bookings, first_hotel_id, test_email):
        payload = hotel_booking_payload(first_hotel_id, email=test_email, total_price=1)
        resp = api.post("/api/hotel-bookings", json=payload)
        assert resp.status_code == 201
        assert resp.json()["totalPrice"] != 1

    def test_invalid_room_type_returns_400(self, api, first_hotel_id):
        payload = hotel_booking_payload(first_hotel_id, room_type="Presidential Suite")
        resp = api.post("/api/hotel-bookings", json=payload)
        assert resp.status_code == 400
