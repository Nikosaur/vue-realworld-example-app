import { defineStore } from 'pinia';
import { ArticlesService, CommentsService, FavoriteService } from "@/common/api.service";
import { useHomeStore } from './home';

const initialState = {
  article: {
    author: {},
    title: "",
    description: "",
    body: "",
    tagList: [] as string[],
    slug: ""
  } as any,
  comments: [] as any[]
};

export const useArticleStore = defineStore('article', {
  state: () => ({ ...initialState }),
  actions: {
    async fetchArticle(articleSlug: string, prevArticle?: any) {
      if (prevArticle !== undefined) {
        this.article = prevArticle;
        return;
      }
      const { data } = await ArticlesService.get(articleSlug);
      this.article = data.article;
      return data;
    },
    async fetchComments(articleSlug: string) {
      const { data } = await CommentsService.get(articleSlug);
      this.comments = data.comments;
      return data.comments;
    },
    async createComment(payload: any) {
      await CommentsService.post(payload.slug, payload.comment);
      this.fetchComments(payload.slug);
    },
    async destroyComment(payload: any) {
      await CommentsService.destroy(payload.slug, payload.commentId);
      this.fetchComments(payload.slug);
    },
    async favoriteAdd(slug: string) {
      const { data } = await FavoriteService.add(slug);
      this.updateArticleInList(data.article);
      this.article = data.article;
    },
    async favoriteRemove(slug: string) {
      const { data } = await FavoriteService.remove(slug);
      this.updateArticleInList(data.article);
      this.article = data.article;
    },
    articlePublish() {
      return ArticlesService.create(this.article);
    },
    articleDelete(slug: string) {
      return ArticlesService.destroy(slug);
    },
    articleEdit() {
      return ArticlesService.update(this.article.slug, this.article);
    },
    articleAddTag(tag: string) {
      this.article.tagList = this.article.tagList.concat([tag]);
    },
    articleRemoveTag(tag: string) {
      this.article.tagList = this.article.tagList.filter((t: string) => t !== tag);
    },
    resetState() {
        this.article = {
            author: {},
            title: "",
            description: "",
            body: "",
            tagList: [],
            slug: ""
        };
        this.comments = [];
    },
    updateArticleInList(data: any) {
        // This was previously checking root state for articles list updates.
        // In Pinia, stores are independent. We might need to call homeStore or listen to changes.
        // For now, if we are in article context, we might not need to update list unless we are in list view?
        // But the previous vuex mutation update `state.articles` in `home` module?
        // Wait, the previous code `context.commit(UPDATE_ARTICLE_IN_LIST, data.article, { root: true });`
        // calls `UPDATE_ARTICLE_IN_LIST` which was defined in `home.module.ts`.
        // So we need to access `homeStore` here.
        // I will handle this by importing `useHomeStore` inside the action to avoid circular deps if possible.
        // Or better, let the component handle it, but the logic was here.
        // Let's import useHomeStore casually.
        // BUT, `updateArticleInList` logic needs to be in Home Store.
        // I will just call it `updateArticleInList` on home store.
        const homeStore = useHomeStore(); 
        homeStore.updateArticleInList(data);
    }
  }
});
