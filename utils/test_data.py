"""Reusable test data builders."""
from utils.config import VALID_CUSTOMER, FUTURE_START, FUTURE_END


def guide_booking_payload(
    guide_id: str,
    *,
    email: str | None = None,
    total_price: float = 999.0,
    start_date: str = FUTURE_START,
) -> dict:
    return {
        "bookingType": "guide",
        "sessionId": "qa-test-session-001",
        "name": VALID_CUSTOMER["name"],
        "email": email or VALID_CUSTOMER["email"],
        "phone": VALID_CUSTOMER["phone"],
        "totalPrice": total_price,
        "bookingDetails": {
            "guide": guide_id,
            "guideName": "QA Guide",
            "serviceType": "trekking-guide",
            "startDate": start_date,
            "groupSize": "2",
            "country": VALID_CUSTOMER["country"],
        },
    }


def rental_payload(
    *,
    email: str | None = None,
    daily_price: float = 10.0,
    quantity: int = 1,
    equipment_id: str,
) -> dict:
    return {
        "customerName": VALID_CUSTOMER["name"],
        "customerEmail": email or VALID_CUSTOMER["email"],
        "customerPhone": VALID_CUSTOMER["phone"],
        "startDate": FUTURE_START,
        "endDate": FUTURE_END,
        "deliveryLocation": "Thamel Kathmandu Hotel",
        "specialRequests": "Please deliver before 9 AM sharp.",
        "items": [
            {
                "id": equipment_id,
                "name": "QA Tent",
                "quantity": quantity,
                "dailyPrice": daily_price,
            }
        ],
    }


def vehicle_booking_payload(
    vehicle_id: str,
    *,
    email: str | None = None,
    price_per_day: float = 50.0,
) -> dict:
    return {
        "vehicleId": vehicle_id,
        "vehicleName": "QA Vehicle",
        "customerName": VALID_CUSTOMER["name"],
        "customerEmail": email or VALID_CUSTOMER["email"],
        "customerPhone": VALID_CUSTOMER["phone"],
        "pickupLocation": "Kathmandu Airport",
        "dropOffLocation": "Pokhara Lakeside",
        "startDate": FUTURE_START,
        "endDate": FUTURE_END,
        "pricePerDay": price_per_day,
    }


def hotel_booking_payload(
    hotel_id: str,
    *,
    email: str | None = None,
    total_price: float | None = None,
    room_type: str = "Standard",
) -> dict:
    payload = {
        "hotelId": hotel_id,
        "roomType": room_type,
        "checkIn": FUTURE_START,
        "checkOut": FUTURE_END,
        "guestName": VALID_CUSTOMER["name"],
        "guestEmail": email or VALID_CUSTOMER["email"],
        "guestPhone": VALID_CUSTOMER["phone"],
    }
    if total_price is not None:
        payload["totalPrice"] = total_price
    return payload
