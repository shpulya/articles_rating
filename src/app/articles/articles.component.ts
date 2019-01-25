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
  sortableCommentatorsByCommentsCount: any;

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
                        this.populateCommentatorNameAndComment(comment);
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

  private populateCommentatorNameAndComment(comment) {
    if (!!comment && !!comment.by) {
      this.commentatorNamesList.push(comment.by);
      this.commentatorNamesList.forEach((currentName) => {
        this.commentatorCounts[currentName] = (this.commentatorCounts[currentName] || 0) + 1;
      });
      this.sortableCommentatorsByCommentsCount = this.topCommentators(this.commentatorCounts, 10);
    }
  }

  topCommentators(obj, n) {
    return Object.entries(obj)
      .sort((a, b) => a[1] < b[1] ? 1 : -1)
      .slice(0, n)
      .map(el => {
        return {
          'commentator': el[0],
          'count': el[1]
        };
      });
  }

  ngOnInit() {
    this.getArticles();
  }
}
