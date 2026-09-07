"""Vehicle booking API tests — POST /api/vehicle-bookings."""
import pytest

from utils.test_data import vehicle_booking_payload


@pytest.mark.api
@pytest.mark.p0
class TestVehicleBookingAPI:
    def test_valid_vehicle_booking_creates_record(self, api, db, cleanup_bookings, first_vehicle_id, test_email):
        vehicles = api.get("/api/vehicles").json()
        vehicle = next(v for v in vehicles if v["_id"] == first_vehicle_id)
        payload = vehicle_booking_payload(first_vehicle_id, email=test_email, price_per_day=100)
        resp = api.post("/api/vehicle-bookings", json=payload)

        assert resp.status_code == 201, resp.text
        data = resp.json()
        assert data["customerEmail"] == test_email
        assert data["status"] == "pending"
        expected_total = vehicle["pricePerDay"] * 4
        assert data["totalPrice"] == expected_total

        db_record = db.find_vehicle_booking_by_email(test_email)
        assert db_record is not None

    def test_invalid_vehicle_id_returns_404(self, api):
        payload = vehicle_booking_payload("000000000000000000000000")
        resp = api.post("/api/vehicle-bookings", json=payload)
        assert resp.status_code == 404

    def test_missing_fields_returns_400(self, api, first_vehicle_id):
        payload = vehicle_booking_payload(first_vehicle_id)
        del payload["customerPhone"]
        resp = api.post("/api/vehicle-bookings", json=payload)
        assert resp.status_code == 400

    @pytest.mark.security
    def test_server_uses_vehicle_db_price(self, api, db, cleanup_bookings, first_vehicle_id, test_email):
        vehicles = api.get("/api/vehicles").json()
        vehicle = next(v for v in vehicles if v["_id"] == first_vehicle_id)
        payload = vehicle_booking_payload(first_vehicle_id, email=test_email, price_per_day=1)
        resp = api.post("/api/vehicle-bookings", json=payload)
        assert resp.status_code == 201
        expected = vehicle["pricePerDay"] * 4
        assert resp.json()["totalPrice"] == expected

    def test_no_sold_out_date_validation_on_backend(self, api, first_vehicle_id, test_email):
        """BUG-BIZ-002: soldOutDates only checked in UI, not API."""
        vehicles = api.get("/api/vehicles").json()
        vehicle = next(v for v in vehicles if v["_id"] == first_vehicle_id)
        if vehicle.get("soldOutDates"):
            blocked = vehicle["soldOutDates"][0].split("T")[0]
            payload = vehicle_booking_payload(first_vehicle_id, email=test_email)
            payload["startDate"] = blocked
            payload["endDate"] = blocked
            resp = api.post("/api/vehicle-bookings", json=payload)
            # Currently accepts — documents the defect
            assert resp.status_code == 201
