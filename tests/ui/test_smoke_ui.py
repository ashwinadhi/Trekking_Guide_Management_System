"""Basic UI smoke tests using Playwright."""
import pytest
from playwright.sync_api import Page, expect


@pytest.mark.ui
@pytest.mark.smoke
class TestUISmoke:
    def test_homepage_loads(self, page: Page):
        page.goto("/")
        expect(page.locator("body")).to_be_visible()

    def test_booking_page_renders(self, page: Page):
        page.goto("/booking")
        expect(page.locator("body")).to_contain_text("Booking")

    def test_equipment_page_renders(self, page: Page):
        page.goto("/equipment")
        expect(page.locator("body")).to_contain_text("Equipment")

    def test_admin_login_page_renders(self, page: Page):
        page.goto("/admin/login")
        expect(page.locator("h1")).to_contain_text("Admin Login")
        expect(page.locator('input[type="email"]')).to_be_visible()
        expect(page.locator('input[type="password"]')).to_be_visible()

    def test_car_booking_page_renders(self, page: Page):
        page.goto("/car-booking")
        expect(page.locator("body")).to_be_visible()
