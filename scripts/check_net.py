
import requests
import sys

if sys.platform == "win32":
    sys.stdout.reconfigure(encoding='utf-8')

try:
    print("Pinging google.com...")
    response = requests.get("https://www.google.com", timeout=10)
    print(f"Google Status: {response.status_code}")
except Exception as e:
    print(f"Google Error: {e}")
