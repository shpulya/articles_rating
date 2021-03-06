import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ArticlesComponent } from './articles/articles.component';
import {HttpClientModule} from '@angular/common/http';
import {ArticlesService} from './articles.service';

@NgModule({
  declarations: [
    AppComponent,
    ArticlesComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
  ],
  providers: [ArticlesService],
  bootstrap: [AppComponent]
})
export class AppModule { }
