import { Component } from '@angular/core';
import { MarketStatusService } from './market-status.service';
import { TweetCountsService } from './tweet-counts.service';
import { TweetTextService } from './tweet-text.service';
import { Observable } from 'rxjs';
import { TweetText } from './tweet-text';
import { TweetCount } from './tweet-count'
import { faLinkedinIn } from '@fortawesome/free-brands-svg-icons';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { faLink } from '@fortawesome/free-solid-svg-icons';
import { faPause } from '@fortawesome/free-solid-svg-icons';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'app';
  faLinkedinIn = faLinkedinIn;
  faGithub = faGithub;
  faLink = faLink;
  faPause = faPause;
  marketStatus: TweetCount[];
  marketStatusToPlot: TweetCount[];
  
  bidenTweetCount: TweetCount[];
  bidenTweetCountToPlot: TweetCount[];
  
  trumpTweetCount: TweetCount[];
  trumpTweetCountToPlot: TweetCount[];

  tweetStatus: TweetText;
  tweetToShow: string;
  tweetId: string;

  
  set MarketStatus(status: TweetCount[]) {
    this.marketStatus = status;
    this.marketStatusToPlot = this.marketStatus.slice(0, 20);
  }

  set BidenTweetCount(tweetCount: TweetCount[]) {
    this.bidenTweetCount = tweetCount;
    this.bidenTweetCountToPlot = this.bidenTweetCount.slice(0, 20);
  }
  
  set TrumpTweetCount(tweetCount: TweetCount[]) {
    this.trumpTweetCount = tweetCount;
    this.trumpTweetCountToPlot = this.trumpTweetCount.slice(0, 20);
  }

  set TweetStatus(status: TweetText) {
    this.tweetStatus = status;
    this.tweetId = this.tweetStatus.id_str;
    this.tweetToShow = "https://twitter.com/" + this.tweetStatus.user_screen_name + "/status/" + this.tweetStatus.id_str;
  }
  constructor(private marketStatusSvc: MarketStatusService, private tweetsCountsSvc: TweetCountsService, private tweetTextSvc: TweetTextService) {
    this.marketStatusSvc.getInitialMarketStatus()
      .subscribe(prices => {
        this.MarketStatus = prices;
        let marketUpdateObservable =  this.marketStatusSvc.getUpdates();
        marketUpdateObservable.subscribe((latestStatus: TweetCount) => { 
          this.MarketStatus = [latestStatus].concat(this.marketStatus); 
        }); 
      });

    this.tweetsCountsSvc.getInitialTweetCountBiden()
      .subscribe(tweet_count => {
        this.BidenTweetCount = tweet_count;

        let tweetUpdatesObservable =  this.tweetsCountsSvc.getBidenUpdates(); 
        tweetUpdatesObservable.subscribe((latestCount: TweetCount) => {  
          this.BidenTweetCount = [latestCount].concat(this.bidenTweetCount); 
        }); 
      });

    this.tweetsCountsSvc.getInitialTweetCountTrump()
      .subscribe(tweet_count => {
        this.TrumpTweetCount = tweet_count;
        let tweetUpdatesObservable =  this.tweetsCountsSvc.getTrumpUpdates(); 
        tweetUpdatesObservable.subscribe((latestCount: TweetCount) => {  
          this.TrumpTweetCount = [latestCount].concat(this.trumpTweetCount); 
        }); 
      });
    this.tweetTextSvc.getInitialTweetTextStatus()
      .subscribe((tweets) => {
        this.TweetStatus = new TweetText(tweets);
        let tweetStatusObservable =  this.tweetTextSvc.getUpdates();
        tweetStatusObservable.subscribe((latestStatus: TweetText) => {
          this.TweetStatus = latestStatus;
        });
      });
  }
}
