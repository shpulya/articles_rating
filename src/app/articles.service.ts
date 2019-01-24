import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError as observableThrowError } from 'rxjs';
import { catchError, map, filter, find } from 'rxjs/operators';

import { ArticleResponse } from './article-response';

@Injectable()
export class ArticlesService {
  private topStories = [];
  topStoriesResponse: any;

  constructor(private http: HttpClient) {}

  getTopArticles(articlesAmount) {
    const url = 'https://hacker-news.firebaseio.com/v0/topstories.json?print=pretty';
    return this.http.get<number[]>(url).pipe(map(q => q.slice(0, articlesAmount) ), catchError(this.handleError));
    // return [...this.topStories];
  }

  getArticle(id: number) {
    const url = 'https://hacker-news.firebaseio.com/v0/item/' + id + '.json?print=pretty';
    return this.http.get<ArticleResponse>(url).pipe(
      map(article => article)
    );
  }

  private handleError(res: HttpErrorResponse | any) {
    console.error(res.error || res.body.error);
    return observableThrowError(res.error || 'Server error');
  }
}
