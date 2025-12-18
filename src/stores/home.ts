import { defineStore } from 'pinia';
import { TagsService, ArticlesService } from "@/common/api.service";

export const useHomeStore = defineStore('home', {
  state: () => ({
    tags: [] as string[],
    articles: [] as any[],
    isLoading: true,
    articlesCount: 0
  }),
  actions: {
    fetchArticles(params: any) {
      this.isLoading = true;
      return ArticlesService.query(params.type, params.filters)
        .then(({ data }) => {
          this.articles = data.articles;
          this.articlesCount = data.articlesCount;
          this.isLoading = false;
        })
        .catch(error => {
          throw new Error(error);
        });
    },
    fetchTags() {
      return TagsService.get()
        .then(({ data }) => {
            this.tags = data.tags;
        })
        .catch(error => {
          throw new Error(error);
        });
    },
    updateArticleInList(data: any) {
        this.articles = this.articles.map((article: any) => {
            if (article.slug !== data.slug) {
              return article;
            }
            article.favorited = data.favorited;
            article.favoritesCount = data.favoritesCount;
            return article;
        });
    }
  }
});
