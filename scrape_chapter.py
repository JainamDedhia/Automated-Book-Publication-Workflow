import os
import json
import time
import requests
from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.edge.options import Options
from selenium.webdriver.edge.service import Service
from datetime import datetime

# --- Settings ---
URL = "https://en.wikisource.org/wiki/The_Gates_of_Morning/Book_1/Chapter_1"
CHAPTER_ID = "chapter_1"
OUTPUT_DIR = "output"
SCREENSHOT_DIR = os.path.join(OUTPUT_DIR, "screenshots")
SCREENSHOT_PATH = os.path.join(SCREENSHOT_DIR, f"{CHAPTER_ID}.png")
JSON_PATH = os.path.join(OUTPUT_DIR, f"{CHAPTER_ID}.json")
EDGE_DRIVER_PATH = "./msedgedriver.exe"  # Assuming it's in the same folder

# --- Ensure output dirs exist ---
os.makedirs(SCREENSHOT_DIR, exist_ok=True)

# --- Step 1: Scrape text content ---
def fetch_chapter_text(url):
    response = requests.get(url)
    soup = BeautifulSoup(response.text, 'html.parser')

    content_div = soup.find("div", {"class": "mw-parser-output"})
    paragraphs = content_div.find_all(["p", "h2", "h3"])
    text = "\n\n".join(p.get_text(strip=True) for p in paragraphs if p.get_text(strip=True))

    title = soup.find("h1").get_text(strip=True)

    return {
        "book": "The Gates of Morning",
        "chapter": title,
        "url": url,
        "content": text,
        "timestamp": datetime.utcnow().isoformat() + "Z"
    }

# --- Step 2: Take Screenshot ---
def capture_screenshot(url, screenshot_path):
    options = Options()
    options.add_argument('--headless')
    options.add_argument('--disable-gpu')
    options.add_argument('--window-size=1920,1080')

    service = Service(EDGE_DRIVER_PATH)
    driver = webdriver.Edge(service=service, options=options)

    driver.get(url)
    time.sleep(2)

    # Adjust window size to full page
    total_width = driver.execute_script("return document.body.scrollWidth")
    total_height = driver.execute_script("return document.body.scrollHeight")
    driver.set_window_size(total_width, total_height)
    time.sleep(1)

    driver.save_screenshot(screenshot_path)
    driver.quit()

# --- Step 3: Save Everything Locally ---
def save_output(data, json_path):
    with open(json_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

# --- Run Everything ---
if __name__ == "__main__":
    print("[*] Fetching chapter content...")
    chapter_data = fetch_chapter_text(URL)
    chapter_data["screenshot_path"] = SCREENSHOT_PATH

    print("[*] Saving JSON...")
    save_output(chapter_data, JSON_PATH)

    print("[*] Taking screenshot...")
    capture_screenshot(URL, SCREENSHOT_PATH)

    print(f"[✓] Done! JSON saved to: {JSON_PATH}")
    print(f"[✓] Screenshot saved to: {SCREENSHOT_PATH}")
