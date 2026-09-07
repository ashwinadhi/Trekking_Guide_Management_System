"""Guide booking API tests — POST /api/bookings."""
import pytest

from utils.test_data import guide_booking_payload


@pytest.mark.api
@pytest.mark.p0
class TestGuideBookingAPI:
    def test_valid_guide_booking_creates_record(self, api, db, cleanup_bookings, first_guide_id, test_email):
        payload = guide_booking_payload(first_guide_id, email=test_email, total_price=500)
        resp = api.post("/api/bookings", json=payload)

        assert resp.status_code == 201, resp.text
        data = resp.json()
        assert data["bookingType"] == "guide"
        assert data["email"] == test_email
        assert data["status"] == "pending"
        assert data["totalPrice"] > 0
        assert data["totalPrice"] != 500  # server recalculated
        assert "_id" in data

        db_record = db.find_booking_by_email(test_email)
        assert db_record is not None
        assert db_record["bookingType"] == "guide"
        assert db_record["totalPrice"] == data["totalPrice"]

    def test_missing_name_returns_400(self, api, first_guide_id):
        payload = guide_booking_payload(first_guide_id)
        del payload["name"]
        resp = api.post("/api/bookings", json=payload)
        assert resp.status_code == 400
        assert "name" in resp.json()["error"].lower()

    def test_invalid_email_returns_400(self, api, first_guide_id):
        payload = guide_booking_payload(first_guide_id, email="bad-email")
        resp = api.post("/api/bookings", json=payload)
        assert resp.status_code == 400

    def test_invalid_phone_returns_400(self, api, first_guide_id):
        payload = guide_booking_payload(first_guide_id)
        payload["phone"] = "123"
        resp = api.post("/api/bookings", json=payload)
        assert resp.status_code == 400

    def test_invalid_guide_id_returns_404(self, api):
        payload = guide_booking_payload("000000000000000000000000")
        resp = api.post("/api/bookings", json=payload)
        assert resp.status_code == 404

    def test_missing_guide_id_returns_400(self, api):
        payload = guide_booking_payload("000000000000000000000000")
        payload["bookingDetails"]["guide"] = ""
        resp = api.post("/api/bookings", json=payload)
        assert resp.status_code == 400

    @pytest.mark.security
    def test_server_recalculates_total_price(self, api, db, cleanup_bookings, first_guide_id, test_email):
        """Backend must ignore manipulated client totalPrice."""
        payload = guide_booking_payload(first_guide_id, email=test_email, total_price=0.01)
        resp = api.post("/api/bookings", json=payload)
        assert resp.status_code == 201
        db_record = db.find_booking_by_email(test_email)
        assert db_record["totalPrice"] > 0.01

    def test_duplicate_submission_returns_409(self, api, db, cleanup_bookings, first_guide_id, test_email):
        payload = guide_booking_payload(first_guide_id, email=test_email)
        resp1 = api.post("/api/bookings", json=payload)
        resp2 = api.post("/api/bookings", json=payload)
        assert resp1.status_code == 201
        assert resp2.status_code == 409
        assert db.count_bookings_by_email(test_email) == 1
