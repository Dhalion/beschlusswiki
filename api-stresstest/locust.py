import time
import random
from locust import HttpUser, task, between

# Load ids from file
ids = []
with open('ids.txt', 'r') as f:
    ids = f.read().splitlines()

# Load words from file
words = []
with open('wordlist-german.txt', 'r') as f:
    words = f.read().splitlines()

class User(HttpUser):
    def __init__(self, parent):
        super().__init__(parent)

    wait_time = between(3, 30)

    @task(1)
    def fetchAll(self):
        self.client.get("/api/antrag/")
        time.sleep(1)

    @task(2)
    def fetchOne(self):
        self.client.get("/api/antrag/" + random.choice(ids))
        time.sleep(1)

    @task(2)
    def fetchQuery(self):
        self.client.get("/api/antrag/suche/" + random.choice(words))
        time.sleep(1)