import pytest

from utils.config import BASE_URL


@pytest.fixture(scope="session")
def browser_context_args(browser_context_args):
    return {**browser_context_args, "baseURL": BASE_URL}
