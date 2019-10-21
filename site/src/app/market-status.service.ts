import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment'
import { TweetCount } from './tweet-count';
import { Subject, from } from  'rxjs';
import * as socketio from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class MarketStatusService {

  private baseUrl =  environment.api_base_url;
  constructor(private httpClient: HttpClient) { }

  getInitialMarketStatus() {
    return this.httpClient.get<TweetCount[]>(`${this.baseUrl}/api/v1/tweet_counts_all`);
  }

  getUpdates() {
    let socket = socketio(this.baseUrl);
    let marketSub = new Subject<TweetCount>();
    let marketSubObservable = from(marketSub);

    socket.on('tweet_counts_all', (marketStatus: TweetCount) => {
      marketSub.next(marketStatus);
    });

    return marketSubObservable;
  }
}