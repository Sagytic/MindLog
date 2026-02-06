import os
from playwright.sync_api import sync_playwright, expect

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Mock API
        page.route("**/api/diaries/**", lambda route: route.fulfill(
            status=200,
            content_type="application/json",
            body='''
            {
                "results": [
                    {
                        "id": 1,
                        "content": "Test Diary 1",
                        "created_at": "2023-10-27T10:00:00Z",
                        "emotion": "Happy",
                        "image": "/media/test.jpg"
                    },
                    {
                        "id": 2,
                        "content": "Test Diary 2",
                        "created_at": "2023-10-26T10:00:00Z",
                        "emotion": "Sad",
                        "image": "http://example.com/test2.jpg"
                    }
                ],
                "next": null
            }
            '''
        ))

        # Mock login
        page.add_init_script("""
            localStorage.setItem('accessToken', 'mock_token');
            localStorage.setItem('username', 'testuser');
        """)

        page.goto("http://localhost:5173")

        # Wait for diary list to render
        page.wait_for_selector(".group")

        # Verify loading="lazy" on images
        images = page.locator(".group img")
        count = images.count()
        print(f"Found {count} diary images")

        for i in range(count):
            img = images.nth(i)
            loading_attr = img.get_attribute("loading")
            print(f"Image {i} loading attribute: {loading_attr}")
            if loading_attr != "lazy":
                print(f"ERROR: Image {i} missing loading='lazy'")
                exit(1)

        page.screenshot(path=".jules/verification/diary_list.png")
        print("Verification successful, screenshot saved.")
        browser.close()

if __name__ == "__main__":
    run()
