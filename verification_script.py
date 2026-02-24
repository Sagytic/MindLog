from playwright.sync_api import sync_playwright

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    page = browser.new_page()

    # Mock API
    page.route("**/api/diaries/**", lambda route: route.fulfill(
        status=200,
        content_type="application/json",
        body='''{
            "results": [
                {
                    "id": 1,
                    "content": "오늘 하루는 정말 좋았다. Accessible UX is cool!",
                    "created_at": "2023-10-27T10:00:00Z",
                    "emotion": "행복",
                    "image": null
                }
            ],
            "next": null,
            "previous": null,
            "count": 1
        }'''
    ))

    # Mock Login
    page.goto("http://localhost:5173")
    page.evaluate("localStorage.setItem('accessToken', 'mock-token')")
    page.evaluate("localStorage.setItem('username', 'PaletteUser')")
    page.reload()

    # Wait for the diary list to load
    try:
        page.wait_for_selector('role=article', timeout=5000)
    except:
        print("❌ Failed to load diary list. Taking screenshot.")
        page.screenshot(path="verification_load_fail.png")
        browser.close()
        return

    # 1. Check Search Input Accessibility
    try:
        search_input = page.get_by_label("일기 검색")
        if search_input.is_visible():
            print("✅ Search input with aria-label='일기 검색' found.")
        else:
            print("❌ Search input not found or incorrect label.")
    except:
        print("❌ Error finding search input.")

    # 2. Check Diary Card Accessibility
    diary_card = page.get_by_role("article").first
    if diary_card.is_visible():
        print("✅ Diary card with role='article' found.")

    # Check tabIndex
    tab_index = diary_card.get_attribute("tabindex")
    if tab_index == "0":
        print("✅ Diary card has tabIndex='0'.")
    else:
        print(f"❌ Diary card tabIndex is {tab_index}.")

    # 3. Check Focus State and Action Buttons visibility
    diary_card.focus()
    # Take screenshot of focussed card
    page.screenshot(path="verification_focus.png")
    print("📸 Screenshot taken: verification_focus.png")

    # Check if Edit button inside is visible (due to focus-within)
    edit_button = diary_card.get_by_label("수정")
    if edit_button.count() > 0:
         print("✅ Edit button with aria-label='수정' found inside card.")
    else:
         print("❌ Edit button not found inside card.")

    delete_button = diary_card.get_by_label("삭제")
    if delete_button.count() > 0:
         print("✅ Delete button with aria-label='삭제' found inside card.")
    else:
         print("❌ Delete button not found inside card.")

    # 4. Check Keyboard Interaction (Enter to open Modal)
    diary_card.press("Enter")

    # Wait for modal
    close_button = page.get_by_label("닫기")
    # Wait for it to be visible
    try:
        close_button.wait_for(state="visible", timeout=2000)
        print("✅ Modal opened via keyboard (Enter key). Close button with aria-label='닫기' found.")
    except:
        print("❌ Modal did not open or close button not found.")
        page.screenshot(path="verification_failure.png")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)
