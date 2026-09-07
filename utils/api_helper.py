"""HTTP helpers for API testing."""
import requests
from typing import Any

from utils.config import BASE_URL


class APIClient:
    def __init__(self, base_url: str = BASE_URL):
        self.base_url = base_url.rstrip("/")
        self.session = requests.Session()
        self.session.headers.update({"Content-Type": "application/json"})

    def get(self, path: str, **kwargs) -> requests.Response:
        return self.session.get(f"{self.base_url}{path}", **kwargs)

    def post(self, path: str, json: dict | None = None, **kwargs) -> requests.Response:
        return self.session.post(f"{self.base_url}{path}", json=json, **kwargs)

    def put(self, path: str, json: dict | None = None, **kwargs) -> requests.Response:
        return self.session.put(f"{self.base_url}{path}", json=json, **kwargs)

    def delete(self, path: str, **kwargs) -> requests.Response:
        return self.session.delete(f"{self.base_url}{path}", **kwargs)


def assert_json_error(response: requests.Response, expected_status: int) -> str:
    assert response.status_code == expected_status, (
        f"Expected {expected_status}, got {response.status_code}: {response.text}"
    )
    data = response.json()
    assert "error" in data, f"Expected error field in response: {data}"
    return data["error"]
