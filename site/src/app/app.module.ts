import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TweetEmbedComponent } from './tweet-embed/tweet-embed.component';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { TweetsLineChartComponent } from './tweets-line-chart/tweets-line-chart.component';
import { TweetsLineChartBidenComponent } from './tweets-line-chart-biden/tweets-line-chart-biden.component';
import { TweetsLineChartTrumpComponent } from './tweets-line-chart-trump/tweets-line-chart-trump.component';
@NgModule({
  declarations: [
    AppComponent,
    TweetEmbedComponent,
    TweetsLineChartComponent,
    TweetsLineChartBidenComponent,
    TweetsLineChartTrumpComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FontAwesomeModule,
    FormsModule,
    BrowserAnimationsModule,
    NgxChartsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
