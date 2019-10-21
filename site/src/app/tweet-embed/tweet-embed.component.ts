import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import { TweetText } from '../tweet-text';
import { faPause } from '@fortawesome/free-solid-svg-icons';
import { faPlay } from '@fortawesome/free-solid-svg-icons';
@Component({
  selector: 'app-tweet-embed',
  templateUrl: './tweet-embed.component.html',
  styleUrls: ['./tweet-embed.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class TweetEmbedComponent {
  @Input()
  tweetStatus: TweetText;
  @Input()
  tweetId:string;
  first = 1;
  second = 2;
  third = 3;
  test_tweets: string[];
  curr_twt: number;
  faPause = faPause;
  faPlay = faPlay;
  pause: boolean;
  prevTweetId: string;
  ngOnInit() {
    this.pause = false;
    this.curr_twt = 0;
    this.test_tweets = [];
    for (let i = 0; i < 1; i++){
       this.test_tweets.push("twt-" + i);
    }
    this.prevTweetId = '';
  }

  ngOnChanges() {
    if (this.tweetId && !this.pause && this.tweetStatus.original && (this.prevTweetId != this.tweetId)){
      this.prevTweetId = this.tweetId;
      if (this.test_tweets.length > 10) {
        this.test_tweets.shift();
      }
      this.test_tweets.push("twt-" + (1 + this.curr_twt));
      // @ts-ignore
      twttr.widgets.createTweet(
        this.tweetId,
        document.getElementById("twt-" + this.curr_twt),{
          cards: "hidden",
          conversation: "none",
          width: "300px"
        }
      );
      this.curr_twt += 1;
    }
  }
  ngAfterViewInit() {
    // @ts-ignore
    twttr.widgets.load();
  }
}