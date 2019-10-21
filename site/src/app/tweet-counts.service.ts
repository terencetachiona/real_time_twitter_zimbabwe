import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment'
import { TweetCount } from './tweet-count';
import { Subject, from } from  'rxjs';
import * as socketio from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})

export class TweetCountsService {

  private baseUrl =  environment.api_base_url;
  constructor(private httpClient: HttpClient) { }

  getInitialTweetCountBiden() {
    return this.httpClient.get<TweetCount[]>(`${this.baseUrl}/api/v1/tweet_counts_biden`);
  }
  
  getInitialTweetCountTrump() {
    return this.httpClient.get<TweetCount[]>(`${this.baseUrl}/api/v1/tweet_counts_trump`);
  }

  getTrumpUpdates() {
    let socket = socketio(this.baseUrl);
    let trumpSub = new Subject<TweetCount>();
    let trumpSubObservable = from(trumpSub);

    socket.on('tweet_counts_trump', (trumpStatus: TweetCount) => {
      trumpSub.next(trumpStatus);
    });

    return trumpSubObservable;
  }

  getBidenUpdates() {
    let socket = socketio(this.baseUrl);
    let marketSub = new Subject<TweetCount>();
    let marketSubObservable = from(marketSub);

    socket.on('tweet_counts_biden', (marketStatus: TweetCount) => {
      marketSub.next(marketStatus);
    });

    return marketSubObservable;
  }
}
