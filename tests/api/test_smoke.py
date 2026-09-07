"""Smoke tests — verify application is accessible."""
import pytest


@pytest.mark.smoke
@pytest.mark.p0
class TestSmoke:
    def test_home_page_loads(self, api):
        resp = api.get("/")
        assert resp.status_code == 200

    def test_booking_page_loads(self, api):
        resp = api.get("/booking")
        assert resp.status_code == 200

    def test_guides_api_returns_data(self, api):
        resp = api.get("/api/guides")
        assert resp.status_code == 200
        assert isinstance(resp.json(), list)

    def test_treks_api_returns_data(self, api):
        resp = api.get("/api/treks")
        assert resp.status_code == 200
        assert isinstance(resp.json(), list)

    def test_equipment_api_returns_data(self, api):
        resp = api.get("/api/equipment")
        assert resp.status_code == 200
        assert isinstance(resp.json(), list)

    def test_vehicles_api_returns_data(self, api):
        resp = api.get("/api/vehicles")
        assert resp.status_code == 200
        assert isinstance(resp.json(), list)

    def test_hotels_api_returns_data(self, api):
        resp = api.get("/api/hotels")
        assert resp.status_code == 200
        assert isinstance(resp.json(), list)

    def test_admin_bookings_requires_auth(self, api):
        resp = api.get("/api/bookings")
        assert resp.status_code == 401
