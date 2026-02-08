from playwright.sync_api import sync_playwright
import time

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    # Mock API responses
    def handle_diaries(route):
        route.fulfill(
            status=200,
            content_type="application/json",
            body='{"results": [{"id": 1, "content": "Test Content", "created_at": "2023-01-01T12:00:00Z", "emotion": "Happy", "image": null}], "next": null}'
        )

    page.route("**/api/diaries/**", handle_diaries)

    # Set authentication token
    page.goto("http://localhost:5173/")
    page.evaluate("localStorage.setItem('accessToken', 'mock-token')")
    page.evaluate("localStorage.setItem('username', 'TestUser')")
    page.reload()

    # Wait for content to load
    page.wait_for_selector("text=Test Content", timeout=5000)

    # Check for aria-label on search input
    search_input = page.locator('input[aria-label="일기 검색"]')
    if search_input.count() > 0:
        print("✅ Search input found with aria-label='일기 검색'")
    else:
        print("❌ Search input not found or missing aria-label")

    # Check for aria-label on edit button
    edit_btn = page.locator('button[aria-label="일기 수정"]')
    if edit_btn.count() > 0:
        print("✅ Edit button found with aria-label='일기 수정'")
    else:
        print("❌ Edit button not found or missing aria-label")

    # Check for aria-label on delete button
    delete_btn = page.locator('button[aria-label="일기 삭제"]')
    if delete_btn.count() > 0:
        print("✅ Delete button found with aria-label='일기 삭제'")
    else:
        print("❌ Delete button not found or missing aria-label")

    # Check for aria-label on image upload input (hidden/sr-only)
    # Note: sr-only elements are usually not interactable directly but are present in DOM.
    # We use get_attribute to check class because 'visible' check might fail for sr-only.
    img_input = page.locator('input[type="file"][aria-label="이미지 업로드"]')
    if img_input.count() > 0:
        print("✅ Image upload input found with aria-label='이미지 업로드'")
        class_attr = img_input.get_attribute("class")
        if "sr-only" in class_attr:
            print("✅ Image upload input has 'sr-only' class")
        else:
            print(f"❌ Image upload input missing 'sr-only' class: {class_attr}")
    else:
        print("❌ Image upload input not found or missing aria-label")

    # Take screenshot
    page.screenshot(path="verification/verification.png")
    print("📸 Screenshot saved to verification/verification.png")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)
