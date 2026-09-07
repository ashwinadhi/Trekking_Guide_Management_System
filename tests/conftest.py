"""Shared pytest fixtures."""
import pytest
import requests

from utils.api_helper import APIClient
from utils.config import BASE_URL, MONGODB_URI, VALID_CUSTOMER
from utils.db_helper import DBHelper


@pytest.fixture(scope="session")
def api() -> APIClient:
    client = APIClient(BASE_URL)
    # Wait for server readiness
    for _ in range(30):
        try:
            resp = client.get("/api/guides", timeout=3)
            if resp.status_code == 200:
                return client
        except requests.RequestException:
            pass
    pytest.fail(f"Application not reachable at {BASE_URL}")


@pytest.fixture(scope="session")
def db() -> DBHelper:
    if not MONGODB_URI:
        pytest.skip("MONGODB_URI not configured — skipping DB verification")
    helper = DBHelper(MONGODB_URI)
    yield helper
    helper.close()


@pytest.fixture
def test_email() -> str:
    return VALID_CUSTOMER["email"]


@pytest.fixture
def cleanup_bookings(db: DBHelper, test_email: str):
    yield
    try:
        db.delete_test_bookings(test_email)
    except Exception:
        pass


@pytest.fixture(scope="session")
def first_guide_id(api: APIClient) -> str:
    guides = api.get("/api/guides").json()
    if not guides:
        pytest.skip("No guides in database — seed data required for booking tests")
    return guides[0]["_id"]


@pytest.fixture(scope="session")
def first_vehicle_id(api: APIClient) -> str:
    vehicles = api.get("/api/vehicles").json()
    if not vehicles:
        pytest.skip("No vehicles in database")
    return vehicles[0]["_id"]


@pytest.fixture(scope="session")
def first_equipment_id(api: APIClient) -> str:
    equipment = api.get("/api/equipment").json()
    if not isinstance(equipment, list) or not equipment:
        pytest.skip("No equipment in database")
    return equipment[0]["_id"]


@pytest.fixture(scope="session")
def first_hotel_id(api: APIClient) -> str:
    resp = api.get("/api/hotels")
    if resp.status_code != 200:
        pytest.skip(f"Hotels API unavailable ({resp.status_code}): {resp.text[:120]}")
    hotels = resp.json()
    if not isinstance(hotels, list) or not hotels:
        pytest.skip("No hotels in database")
    return hotels[0]["_id"]
