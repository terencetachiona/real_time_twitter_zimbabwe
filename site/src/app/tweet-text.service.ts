import {Injectable} from '@angular/core';
import {HttpClient,HttpErrorResponse,HttpHeaders} from '@angular/common/http';
import {environment} from '../environments/environment';
import {TweetText} from './tweet-text';
import { Subject, from, throwError, Observable } from  'rxjs';
import { catchError, retry } from 'rxjs/operators';
import * as socketio from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class TweetTextService {

  private baseUrl =  environment.api_base_url;
  constructor(private http: HttpClient) { }

  getInitialTweetTextStatus(): Observable<TweetText> {
    return this.http.get<TweetText>(`${this.baseUrl}/api/v1/tweet_text_all`);
  }

  getUpdates() {
    let socket = socketio(this.baseUrl);
    let tweettextSub = new Subject<TweetText>();
    let tweettextSubObservable = from(tweettextSub);
    socket.on('tweet_text_all', (fullTweet) => {
      let tweettextStatus = new TweetText(fullTweet);
      tweettextSub.next(tweettextStatus);
    });

    return tweettextSubObservable;
  }
}