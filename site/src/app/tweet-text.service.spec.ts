import { TestBed } from '@angular/core/testing';

import { TweetTextService } from './tweet-text.service';

describe('TweetTextService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TweetTextService = TestBed.get(TweetTextService);
    expect(service).toBeTruthy();
  });
});
