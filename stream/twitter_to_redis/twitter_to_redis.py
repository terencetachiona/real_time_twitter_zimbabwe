import os
import twitter
import pprint
import requests
import json
import time
import redis

CONSUMER_KEY = os.getenv("CONSUMER_KEY")
CONSUMER_SECRET = os.getenv("CONSUMER_SECRET")
ACCESS_TOKEN_KEY = os.getenv("ACCESS_TOKEN_KEY")
ACCESS_TOKEN_SECRET = os.getenv("ACCESS_TOKEN_SECRET")

TRACK = [
    'election',
    'joe biden',
    'bernie sanders',
    'kamala harris',
    'elizabeth warren',
    'donald trump',
    'ben sasse',
    'john kasich',
    'ted cruz',
    'mitt romney'
]
LANGUAGES = ['en']
api = twitter.Api(consumer_key=CONSUMER_KEY,
                    consumer_secret=CONSUMER_SECRET,
                    access_token_key=ACCESS_TOKEN_KEY,
                    access_token_secret=ACCESS_TOKEN_SECRET)

t = time.perf_counter()

cache = redis.Redis(host='redis', port=6379)

count = 0
interval_end_time = time.time() + 60
while True:
    try:
        for line in api.GetStreamFilter(track=TRACK, languages=LANGUAGES, stall_warnings=True):
            try:
                cache.rpush("mylist",json.dumps(line))
                count += 1
                if time.time() > interval_end_time:
                    print("Count:",count)
                    print("Throughput:",count/60,"tweets per second")
                    interval_end_time = time.time() + 60
                    count = 0
            except redis.exceptions.ConnectionError as exc:
                print(exc)
                print("Redis connection error in twitter_to_redis.py.")
    except Exception as e:
        print(e)
        print("Waiting 90 seconds before trying to reconnect.")
    time.sleep(90)
