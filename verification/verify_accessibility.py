from playwright.sync_api import sync_playwright, expect

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    page = browser.new_page()

    # Mock API responses
    page.route("**/api/diaries/?page=1", lambda route: route.fulfill(
        status=200,
        content_type="application/json",
        body='{"results": [{"id": 1, "content": "Test Diary Content", "created_at": "2023-10-27T10:00:00Z", "emotion": "Happy", "image": "/media/test.jpg"}], "next": null}'
    ))

    # Mock any other calls that might happen (e.g. initial fetch)
    page.route("**/api/diaries/?all=true", lambda route: route.fulfill(
        status=200,
        content_type="application/json",
        body='[{"id": 1, "content": "Test Diary Content", "created_at": "2023-10-27T10:00:00Z", "emotion": "Happy", "image": "/media/test.jpg"}]'
    ))

    # Go to page
    page.goto("http://localhost:5173")

    # Inject token to simulate login
    page.evaluate("localStorage.setItem('accessToken', 'fake-token')")
    page.evaluate("localStorage.setItem('username', 'TestUser')")

    # Reload to pick up the token
    page.reload()

    # Wait for DiaryList to load
    expect(page.get_by_text("Test Diary Content")).to_be_visible()

    # 1. Verify Search Input ARIA label
    # The search input has aria-label="일기 검색"
    search_input = page.get_by_role("textbox", name="일기 검색")
    expect(search_input).to_be_visible()
    print("Verified: Search input has aria-label '일기 검색'")

    # 2. Verify List Item Buttons ARIA labels
    # We use .first because there might be multiple items if we mocked more, or just to be safe.
    edit_btn = page.get_by_role("button", name="일기 수정").first
    expect(edit_btn).to_be_attached()
    print("Verified: Edit button has aria-label '일기 수정'")

    delete_btn = page.get_by_role("button", name="일기 삭제").first
    expect(delete_btn).to_be_attached()
    print("Verified: Delete button has aria-label '일기 삭제'")

    # 3. Verify File Input Label ARIA label
    # The file input should be findable by its label "사진 첨부"
    # Note: <input type="file" ... className="sr-only"> is technically not visible,
    # but it should be attached and part of the a11y tree.
    file_input = page.get_by_label("사진 첨부")
    expect(file_input).to_be_attached()
    print("Verified: File input is accessible via label '사진 첨부'")

    # Take screenshot
    page.screenshot(path="verification/accessibility_check.png")
    print("Screenshot saved to verification/accessibility_check.png")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)
