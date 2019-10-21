export class TweetText {
    text: string;
    id_str: string;
    user_screen_name: string;
    original: boolean;

    constructor(fullTweet: object) {
        let tweet = fullTweet['_source']
        this.text = tweet['text'];
        this.id_str = tweet['id_str'];
        this.user_screen_name = tweet['user']['screen_name'];
        if (tweet['extended_tweet']) {
            this.text = tweet['extended_tweet']['full_text'];
        }
        if (tweet['retweeted_status']) {
            this.text = tweet['retweeted_status']['text'];
            if (tweet['retweeted_status']['extended_tweet']) {
                this.text = tweet['retweeted_status']['extended_tweet']['full_text']
            }
        }
        this.original = true;
        //if (tweet.hasOwnProperty('retweeted_status')) {
        //    this.original = false;
        //}
    }
}