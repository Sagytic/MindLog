from playwright.sync_api import Page, expect, sync_playwright

def test_lazy_loading(page: Page):
    # 1. Arrange: Go to the app.
    page.goto("http://localhost:5173")

    # 2. Act: Login.
    page.get_by_placeholder("아이디").fill("testuser")
    page.get_by_placeholder("비밀번호").fill("password123")

    page.get_by_role("button", name="로그인하기").click()

    # 3. Wait for home page.
    # Expect "Hello world" (content of diary) to be visible.
    # Increase timeout just in case
    expect(page.get_by_text("Hello world")).to_be_visible(timeout=10000)

    # 4. Assert: Check for lazy loading on image.
    # Select the image.
    img = page.locator("img[alt='썸네일']").first

    # Expect it to have attribute loading="lazy"
    expect(img).to_have_attribute("loading", "lazy")

    print("Verification successful: Image has loading='lazy' attribute.")

    # 5. Screenshot
    page.screenshot(path="verification/verification.png")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            test_lazy_loading(page)
        except Exception as e:
            print(f"Error: {e}")
            page.screenshot(path="verification/error.png")
            raise e
        finally:
            browser.close()
