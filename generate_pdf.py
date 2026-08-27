import sys
import os
from playwright.sync_api import sync_playwright

def generate_pdf():
    print("Generating exact-match ATS CV PDF with Playwright...")
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()
        page.goto("http://localhost:3000/cv_template.html", wait_until="networkidle")
        output_path = os.path.abspath("Dhika_Satria_Khrisna_CV_Tech_ATS.pdf")
        page.pdf(
            path=output_path,
            format="A4",
            print_background=True,
            margin={"top": "0mm", "bottom": "0mm", "left": "0mm", "right": "0mm"}
        )
        browser.close()
        print(f"SUCCESS: PDF generated at {output_path}")

if __name__ == "__main__":
    generate_pdf()
