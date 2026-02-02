from playwright.sync_api import Page, expect, sync_playwright
import datetime

def test_calendar(page: Page):
    # 1. Arrange: Go to the app.
    page.goto("http://localhost:5173")

    # 2. Act: Login.
    page.get_by_placeholder("아이디").fill("testuser")
    page.get_by_placeholder("비밀번호").fill("password123")
    page.get_by_role("button", name="로그인하기").click()

    # Wait for home page load
    expect(page.get_by_text("Hello world")).to_be_visible(timeout=10000)

    # 3. Act: Switch to Calendar tab.
    # The menu item has text "캘린더".
    page.get_by_role("button", name="캘린더").click()

    # 4. Assert: Check if calendar is visible.
    # Calendar class is usually "react-calendar".
    expect(page.locator(".react-calendar")).to_be_visible()

    # 5. Assert: Check if emojis are visible in the calendar.
    # "🥰" should be visible.
    expect(page.get_by_text("🥰")).to_be_visible()

    print("Verification successful: Calendar loaded and emojis displayed.")

    # 6. Screenshot
    page.screenshot(path="verification/calendar.png")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            test_calendar(page)
        except Exception as e:
            print(f"Error: {e}")
            page.screenshot(path="verification/calendar_error.png")
            raise e
        finally:
            browser.close()
