var request = require('request');

var now = new Date();
const querys = {
    count_all_query : {
        "from" : 0, "size" : 0,
        "query": {
            "range": {
                "timestamp_ms": {
                    "gte": "now-1m",
                    "lte": "now"
                }
            }
        }
    },
    count_biden_query : {
        "from" : 0, "size" : 0,
        "query": {
            "bool": {
                "must": [
                    {
                        "multi_match": {
                            "query": "joe biden",
                            "fields": ["text", "extended_tweet.full_text",
                                "retweeted_status.text",
                                "retweeted_status.extended_tweet.full_text"]
                        }
                    },
                    {
                        "range": {
                            "timestamp_ms": {
                                "gte": "now-1m",
                                "lte": "now"
                            }
                        }
                    }
                ]
            }
        }
    },
    count_trump_query : {
        "from" : 0, "size" : 0,
        "query": {
            "bool": {
                "must": [
                    {
                        "multi_match": {
                            "query": "donald trump",
                            "fields": ["text", "extended_tweet.full_text",
                                "retweeted_status.text",
                                "retweeted_status.extended_tweet.full_text"]
                        }
                    },
                    {
                        "range": {
                            "timestamp_ms": {
                                "gte": "now-1m",
                                "lte": "now"
                            }
                        }
                    }
                ]
            }
        }
    },
    text_all_query: {
        "from" : 0, "size" : 1,
        "sort": [
            { "timestamp_ms":"desc"}
        ]
    }
}
let query_set = [
    JSON.stringify(querys.count_all_query),
    JSON.stringify(querys.count_biden_query),
    JSON.stringify(querys.count_trump_query),
    JSON.stringify(querys.text_all_query),
];
const counts = {
    all: [
        { "date": now.toISOString(), "num_tweets": 10 }
    ], 
    biden: [
        { "date": now.toISOString(), "num_tweets": 10 }
    ], 
    trump: [
        { "date": now.toISOString(), "num_tweets": 10 }
    ], 
}

const text = {
    all: []
}

function updateTweets(callback) {
    let req_value = "" 
    query_set.forEach(item => {
        req_value += "{\"index\" : \"twitter\"}\n";
        req_value += item + "\n";
    });
    request.get(
        process.env.ES_URI + '/_msearch',
        {   
            headers: {
                "Content-Type" : "application/x-ndjson",
            },
            rejectUnauthorized: false,
            body: req_value,
        },
        function(error, response, body) {
            if (!error && response.statusCode == 200) {
                try {
                    body = JSON.parse(body);
                    let counts_all_current = body.responses[0].hits.total.value;
                    let counts_biden_current = body.responses[1].hits.total.value;
                    let counts_trump_current = body.responses[2].hits.total.value;
                    let text_all_current = body.responses[3].hits.hits[0];
                    
                    var current_time = new Date();
                    counts.all.unshift({
                        date: current_time.toISOString(),
                        num_tweets: counts_all_current
                    });
                    counts.biden.unshift({
                        date: current_time.toISOString(),
                        num_tweets: counts_biden_current
                    });
                    counts.trump.unshift({
                        date: current_time.toISOString(),
                        num_tweets: counts_trump_current
                    });
                    text.all.unshift(text_all_current);
                    callback();
                } catch (e) {
                    console.log(e);
                }
            } else {
                console.log("Error in tweet count requests.");
                console.log(error);
            }
        }
    );
}

module.exports = {
    counts,
    text,
    updateTweets,
};