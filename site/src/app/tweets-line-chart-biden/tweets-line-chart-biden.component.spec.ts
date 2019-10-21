import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TweetsLineChartBidenComponent } from './tweets-line-chart-biden.component';

describe('TweetsLineChartBidenComponent', () => {
  let component: TweetsLineChartBidenComponent;
  let fixture: ComponentFixture<TweetsLineChartBidenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TweetsLineChartBidenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TweetsLineChartBidenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
