import {Component, OnInit} from '@angular/core';
import {ArticlesService} from '../articles.service';

@Component({
  selector: 'app-articles',
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.css']
})
export class ArticlesComponent implements OnInit {
  topArticlesTitles = [];
  commentatorNamesList = [];
  error: any;
  commentatorCounts = {};
  sortableCommentatorsByCommentsCount = {};
  constructor(private articlesService: ArticlesService) {
  }

  getArticles() {
    this.articlesService
      .getTopArticles(30)
      .subscribe(
        articles => (articles.forEach(
            articleId => this.articlesService.getArticle(articleId)
              .subscribe(
                article => {
                  this.topArticlesTitles.push(article.title);
                  if (!!article.kids) {
                    article.kids.forEach(commentId => {
                      this.articlesService.getArticle(commentId).subscribe(comment => {
                        if (!!comment && !!comment.by) {
                          this.commentatorNamesList.push(comment.by);
                          for (let i = 0, len = this.commentatorNamesList.length; i < len; i++) {
                            let currentName = this.commentatorNamesList[i];
                            this.commentatorCounts[currentName] = (this.commentatorCounts[currentName] || 0) + 1;
                          }
                          this.sortableCommentatorsByCommentsCount = this.topCommentators(this.commentatorCounts, 10);
                        }
                      });
                    });
                  }
                }
              )
          )
        ),
        error => (this.error = error)
      );
  }

  topCommentators<Object>(obj, n) {
    return Object.keys(obj)
      .sort((a, b) => +a - +b)
      .slice(0, n)
      .reduce(function (result, current) {
        result[current] = obj[current];
        return result;
      }, {});
  }

  ngOnInit() {
    this.getArticles();
  }
}