from playwright.sync_api import sync_playwright, expect
import json
import os
from datetime import datetime

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context()
        page = context.new_page()

        today_iso = datetime.now().isoformat()

        # Mock /api/diaries/?mode=calendar
        def handle_calendar_mode(route):
            print("Intercepted /api/diaries/?mode=calendar")
            route.fulfill(
                status=200,
                content_type="application/json",
                body=json.dumps([
                    {
                        "id": 1,
                        "created_at": today_iso,
                        "emotion": "행복"
                    }
                ])
            )

        # Mock /api/diaries/1/ (full details)
        def handle_diary_detail(route):
            print("Intercepted /api/diaries/1/")
            route.fulfill(
                status=200,
                content_type="application/json",
                body=json.dumps({
                    "id": 1,
                    "created_at": today_iso,
                    "emotion": "행복",
                    "content": "This is the full content of the diary.",
                    "advice": "Good job!",
                    "image": None
                })
            )

        page.route("**/api/diaries/?mode=calendar", handle_calendar_mode)
        page.route("**/api/diaries/1/", handle_diary_detail)
        page.route("**/api/diaries/?page=1", lambda r: r.fulfill(status=200, body=json.dumps({"results": [], "next": None})))

        page.goto("http://localhost:5173")
        page.evaluate("localStorage.setItem('accessToken', 'mock_token')")
        page.evaluate("localStorage.setItem('username', 'testuser')")
        page.reload()

        # Go to Calendar
        page.get_by_role("button", name="캘린더").click()

        # Wait for emoji (🥰) which indicates the diary is rendered
        # "행복" maps to "🥰"
        expect(page.get_by_text("🥰")).to_be_visible()

        os.makedirs("/home/jules/verification", exist_ok=True)
        page.screenshot(path="/home/jules/verification/calendar_view.png")
        print("Calendar screenshot taken")

        # Click the emoji/tile
        page.get_by_text("🥰").click()

        # Wait for modal content
        expect(page.get_by_text("This is the full content of the diary.")).to_be_visible()

        page.screenshot(path="/home/jules/verification/modal_view.png")
        print("Modal screenshot taken")

        browser.close()

if __name__ == "__main__":
    run()