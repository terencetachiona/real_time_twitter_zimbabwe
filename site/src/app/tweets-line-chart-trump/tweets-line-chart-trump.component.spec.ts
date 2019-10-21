import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TweetsLineChartTrumpComponent } from './tweets-line-chart-trump.component';

describe('TweetsLineChartTrumpComponent', () => {
  let component: TweetsLineChartTrumpComponent;
  let fixture: ComponentFixture<TweetsLineChartTrumpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TweetsLineChartTrumpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TweetsLineChartTrumpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
