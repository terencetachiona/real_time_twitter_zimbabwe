import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TweetsLineChartComponent } from './tweets-line-chart.component';

describe('TweetsLineChartComponent', () => {
  let component: TweetsLineChartComponent;
  let fixture: ComponentFixture<TweetsLineChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TweetsLineChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TweetsLineChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
