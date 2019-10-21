import time
import redis
import requests
import os
import json
from requests.packages.urllib3.exceptions import InsecureRequestWarning
requests.packages.urllib3.disable_warnings(InsecureRequestWarning)
cache = redis.Redis(host='redis', port=6379)
ES_INDEX = os.getenv("ES_INDEX")
ES_URI = os.getenv("ES_URI")
ES_MAX_SIZE = int(os.getenv("ES_MAX_SIZE"))

def initalize_es():
    r = requests.put(ES_URI + ES_INDEX, verify=False)
    
    data = {
        "properties" : {
            "timestamp_ms": {
                "type":   "date",
                "format": "epoch_millis"
            }
        }
    }

    r = requests.put(ES_URI + ES_INDEX + "/_mapping", json=data, verify=False)
    print("Create index status:",r.json())

    data = {
        "index.mapping.total_fields.limit": 2000
    }
    r = requests.put(ES_URI + ES_INDEX + '/_settings', json=data, verify=False)
    print("Change config status:",r.json())

def delete_old():
    r = requests.get(ES_URI + ES_INDEX + "/_stats/", verify=False)
    try:
        es_size = r.json()['_all']['total']['store']['size_in_bytes']
    except KeyError as e:
        print("KEY ERROR!", e)
        print("Errored request:", r.text)
        return
    print("Index size:",es_size)
    if es_size < ES_MAX_SIZE:
        return
    data = {
        "query": {
            "range": {
                "timestamp_ms": {
                    "lte": "now-5m",
                }
            }
        }
    }
    r = requests.post(ES_URI + ES_INDEX + '/_delete_by_query?conflicts=proceed', json=data, verify=False)
    print("Deleted response:", r.json())
    r = requests.post(ES_URI + ES_INDEX + '/_forcemerge?only_expunge_deletes=true&max_num_segments=1', json=data, verify=False)
    print("Force merge response:", r.json())

def bulk_add_to_elastic_search(doc_list):
    if len(doc_list) == 0:
        print("WARN: No documents to send.")
        return False, {}
    
    es_doc_list = []
    for doc in doc_list:
        es_doc_list.append({"index": {}})
        es_doc_list.append(doc)

    data_to_post = '\n'.join(json.dumps(d) for d in es_doc_list) + "\n"
    headers = {"Content-Type": "application/x-ndjson"}
    r = requests.post(ES_URI + ES_INDEX + "/_bulk?pretty", headers=headers, data=data_to_post, verify=False)
    return r.json()

es_initialized = False
while not es_initialized:
    try:
        initalize_es()
        es_initialized = True
    except Exception as e:
        print("Failed to initialize ES:", e)
        time.sleep(10)
print("Cleaning redis")
redis_list = "mylist"
cache.delete(redis_list)
print(redis_list, "deleted.")
count = 0
while True:
    try:
        incoming_tweets = []
        num_items = 100
        print("REDIS Used memory:",cache.info()['used_memory_human'])
        print("REDIS Used memory RSS:",cache.info()['used_memory_rss_human'])
        redis_pipeline = cache.pipeline()
        redis_pipeline.multi()
        redis_pipeline.lrange(redis_list, 0, num_items - 1)
        redis_pipeline.ltrim(redis_list, num_items, -1)
        resp = redis_pipeline.execute()
        for tweet in resp[0]:
            incoming_tweets.append(json.loads(tweet))
        print("Incoming tweets:",len(incoming_tweets))
        response = bulk_add_to_elastic_search(incoming_tweets)
        count += len(incoming_tweets)
        if count > 1024: # Arbitrary number to make sure index doesn't get too big
            count = 0
            delete_old()
    except Exception as exc:
        print("Error sending tweets to ES")
        print(exc)
        time.sleep(10)
    time.sleep(1)