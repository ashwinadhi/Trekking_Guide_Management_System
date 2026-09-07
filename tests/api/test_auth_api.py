"""Authentication and authorization API tests."""
import pytest


@pytest.mark.api
@pytest.mark.p0
class TestAuthAPI:
    def test_admin_endpoints_reject_unauthenticated(self, api):
        protected = [
            "/api/bookings",
            "/api/rentals",
            "/api/vehicle-bookings",
            "/api/hotel-bookings",
            "/api/admin/notifications",
        ]
        for path in protected:
            resp = api.get(path)
            assert resp.status_code == 401, f"{path} should require auth"

    def test_public_can_create_bookings_without_auth(self, api, first_guide_id):
        resp = api.post("/api/bookings", json={
            "bookingType": "guide",
            "name": "Public User",
            "email": "public.unique.test@example.com",
            "phone": "9801111111",
            "totalPrice": 100,
            "bookingDetails": {
                "guide": first_guide_id,
                "startDate": "2027-06-01",
                "country": "Nepal",
            },
        })
        assert resp.status_code == 201

    def test_public_can_submit_review_with_name(self, api):
        resp = api.post("/api/reviews", json={
            "userName": "QA Tester",
            "description": "This is a public test review with enough characters for validation.",
            "rating": 5,
            "slug": "general",
        })
        assert resp.status_code == 201
