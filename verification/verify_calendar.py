
import time
from playwright.sync_api import sync_playwright

def verify_calendar():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        try:
            # 1. Login
            print("Logging in...")
            page.goto("http://localhost:5173/")

            # Check if we are on login page
            # Use a short timeout to check for login button
            try:
                page.wait_for_selector("button:has-text('로그인하기')", timeout=2000)
                print("Found login page. Filling form...")
                page.get_by_placeholder("아이디").fill("testuser")
                page.get_by_placeholder("비밀번호").fill("password")
                page.get_by_role("button", name="로그인하기").click()
                print("Clicked login button.")
            except:
                print("Login button not found, assuming already logged in.")

            # Wait for home page
            print("Waiting for home page...")
            # Wait for greeting or unique element
            page.wait_for_selector("text=👋", timeout=10000)
            print("Logged in successfully.")

            # 2. Create a diary entry
            print("Creating diary entry...")
            page.get_by_placeholder("오늘 하루는 어땠나요? 당신의 이야기를 들려주세요...").fill("Today I felt optimized!")

            # Click button
            page.locator("button[type='submit']").click()

            # Wait for entry to appear in list (optimistic update or refetch)
            try:
                 # Search for the content text
                 page.wait_for_selector("text=Today I felt optimized!", timeout=5000)
                 print("Diary created and visible in list.")
            except:
                 print("Diary creation verification timed out, but proceeding (maybe simplified view doesn't show it immediately?)")

            # 3. Navigate to Calendar
            print("Navigating to Calendar...")

            # Setup interception
            with page.expect_response(lambda response: "mode=calendar" in response.url) as response_info:
                # Click calendar button
                # It's a MenuItem: button with span "캘린더"
                # Use visible text to be sure
                page.get_by_text("캘린더").click()

            response = response_info.value
            print(f"Calendar API request URL: {response.url}")
            assert "mode=calendar" in response.url

            data = response.json()
            print(f"Calendar API response data length: {len(data)}")

            if len(data) > 0:
                item = data[0]
                if "content" not in item:
                    print("SUCCESS: Content is NOT in simplified calendar response")
                else:
                    print("FAILURE: Content IS in simplified calendar response")

                if "emotion" in item:
                    print("SUCCESS: Emotion IS in simplified calendar response")
                else:
                    print("FAILURE: Emotion is MISSING")

            # Allow time for rendering
            time.sleep(2)

            # 4. Take screenshot of calendar
            page.screenshot(path="verification/calendar_view.png")
            print("Screenshot saved to verification/calendar_view.png")

            # 5. Click a day with diary
            print("Clicking calendar tile...")

            # We need to find the tile that represents the diary we just added.
            # Ideally, it's today.
            # We can look for the tile with an emoji.
            # Wait for tiles
            page.wait_for_selector(".react-calendar__tile", timeout=5000)

            # Find a tile with an emoji (emoji is usually text-xl class)
            # The tile content we added: <div class="flex flex-col items-center mt-1"><span class="text-xl">{emoji}</span></div>

            # Use locator to find ALL tiles with emoji, then pick first
            emoji_locator = page.locator(".react-calendar__tile .text-xl")
            count = emoji_locator.count()
            print(f"Found {count} emoji tiles.")

            if count > 0:
                emoji_locator.first.click()
                print("Clicked emoji tile")
            else:
                print("No emoji tile found, clicking 'now' tile")
                page.locator(".react-calendar__tile--now").click()

            # 6. Verify modal opens and fetches details
            print("Waiting for modal...")
            # We expect a fetch request for details
            # Wait for modal content
            page.wait_for_selector("text=AI 회고록", timeout=5000)
            print("Modal opened.")

            # Check for content
            content_locator = page.get_by_text("Today I felt optimized!")
            if content_locator.count() > 0:
                 print("SUCCESS: Verified content in modal: Today I felt optimized!")
            else:
                 print("FAILURE: Content not found in modal immediately.")

            # Take screenshot of modal
            page.screenshot(path="verification/modal_view.png")
            print("Screenshot saved to verification/modal_view.png")

        except Exception as e:
            print(f"Script failed with error: {e}")
            page.screenshot(path="verification/script_fail.png")
        finally:
            browser.close()

if __name__ == "__main__":
    verify_calendar()
