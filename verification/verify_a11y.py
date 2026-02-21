import os
from playwright.sync_api import sync_playwright, expect

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    # Mock API response
    page.route("**/api/diaries/**", lambda route: route.fulfill(
        status=200,
        content_type="application/json",
        body="""
        {
            "count": 1,
            "next": null,
            "previous": null,
            "results": [
                {
                    "id": 1,
                    "content": "오늘 하루는 정말 좋았다. 친구들과 맛있는 저녁을 먹었다.",
                    "created_at": "2023-10-27T10:00:00Z",
                    "emotion": "행복",
                    "image": null,
                    "advice": "좋은 하루였네요!"
                }
            ]
        }
        """
    ))

    # Inject localStorage to simulate logged-in state
    page.add_init_script("""
        localStorage.setItem("accessToken", "fake-token");
        localStorage.setItem("username", "Test User");
    """)

    # Visit the page
    page.goto("http://localhost:5173")

    # Wait for the list to load.
    try:
        page.wait_for_selector('div[role="article"]', timeout=5000)
    except:
        print("Timeout waiting for article. Dumping page content...")
        # print(page.content()) # Too verbose
        raise

    # 1. Verify Search Input Aria Label
    search_input = page.locator('input[placeholder="내용, 감정, 날짜로 검색해보세요..."]')
    expect(search_input).to_have_attribute("aria-label", "일기 검색")
    print("✅ Search Input aria-label verified")

    # 2. Verify List Item attributes
    article = page.locator('div[role="article"]').first
    expect(article).to_have_attribute("tabindex", "0")

    # Verify aria-label contains date and content
    label = article.get_attribute("aria-label")
    print(f"Article aria-label: {label}")
    assert "일기:" in label
    assert "오늘 하루는 정말 좋았다" in label
    print("✅ List Item attributes verified")

    # 3. Verify Edit/Delete buttons in List Item
    edit_btn = article.locator("button[aria-label='일기 수정']")
    expect(edit_btn).to_be_attached()

    delete_btn = article.locator("button[aria-label='일기 삭제']")
    expect(delete_btn).to_be_attached()
    print("✅ List Item Edit/Delete buttons verified")

    # 4. Verify Keyboard Interaction (Enter to open modal)
    article.focus()
    page.keyboard.press("Enter")

    # Wait for modal
    modal_close_btn = page.locator("button[aria-label='닫기']")
    expect(modal_close_btn).to_be_visible()
    print("✅ Modal opened via keyboard")

    # 5. Verify Modal Buttons
    modal_edit_btn = page.locator("button[aria-label='수정']")
    expect(modal_edit_btn).to_be_visible()

    # Take screenshot of the modal
    os.makedirs("/home/jules/verification", exist_ok=True)
    page.screenshot(path="/home/jules/verification/a11y_verification.png")
    print("📸 Screenshot taken")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)
