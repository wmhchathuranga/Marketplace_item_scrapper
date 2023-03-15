import time
import json
import requests

from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.action_chains import ActionChains

options = Options()
options.add_argument('--headless')
options.add_argument('--disable-gpu')  # Last I checked this was necessary.

API = "http://127.0.0.1/marketplace/add_links.php"
postfix = [
    "vehicles",
    "apparel",
    "electronics",
    "propertyrentals",
    "pets",
    "sports",
]


all_links = []

# driver = webdriver.Chrome('chromedriver')


def scrap(category):
    driver.get(f'https://www.facebook.com/marketplace/nyc/{category}/')
    time.sleep(5)
    temp_links = []
    for i in range(2):
        elems = driver.find_elements("xpath", "//a[@href]")
        for elem in elems:
            href = elem.get_attribute("href")
            if "facebook.com/marketplace/item/" in href:
                href = href.split("/?ref")[0]
                if href not in all_links:
                    all_links.append(href)
                    temp_links.append(href)
                    payload = {"itemId": href, "category": category}
                    jsonObj = json.dumps(payload)
                    print(jsonObj)
                    res = requests.post(API, json=payload)
                    print(res.text)
        print("Scrolling")
        time.sleep(5)
        driver.execute_script(
            "window.scrollTo(0, document.body.scrollHeight);")
        # footer = driver.find_element(By.TAG_NAME, "footer")
        # delta_y = footer.rect['y']
        ActionChains(driver).scroll_by_amount(0, 300).perform()


for i in range(1000):
    driver = webdriver.Chrome("chromedriver", chrome_options=options)
    scrap(postfix[i % 6])
    print("Changing Category")
    driver.close()
    time.sleep(20)
