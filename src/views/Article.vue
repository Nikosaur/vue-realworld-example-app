<template>
  <div class="article-page">
    <div class="banner">
      <div class="container">
        <h1>{{ article.title }}</h1>
        <RwvArticleMeta :article="article" :actions="true"></RwvArticleMeta>
      </div>
    </div>
    <div class="container page">
      <div class="row article-content">
        <div class="col-xs-12">
          <div v-html="parseMarkdown(article.body)"></div>
          <ul class="tag-list">
            <li v-for="(tag, index) of article.tagList" :key="tag + index">
              <RwvTag
                :name="tag"
                className="tag-default tag-pill tag-outline"
              ></RwvTag>
            </li>
          </ul>
        </div>
      </div>
      <hr />
      <div class="article-actions">
        <RwvArticleMeta :article="article" :actions="true"></RwvArticleMeta>
      </div>
      <div class="row">
        <div class="col-xs-12 col-md-8 offset-md-2">
          <RwvCommentEditor
            v-if="isAuthenticated"
            :slug="slug"
            :userImage="currentUser.image"
          >
          </RwvCommentEditor>
          <p v-else>
            <router-link :to="{ name: 'login' }">Sign in</router-link>
            or
            <router-link :to="{ name: 'register' }">sign up</router-link>
            to add comments on this article.
          </p>
          <RwvComment
            v-for="(comment, index) in comments"
            :slug="slug"
            :comment="comment"
            :key="index"
          >
          </RwvComment>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { marked } from "marked";
import RwvArticleMeta from "@/components/ArticleMeta.vue";
import RwvComment from "@/components/Comment.vue";
import RwvCommentEditor from "@/components/CommentEditor.vue";
import RwvTag from "@/components/VTag.vue";
import { useArticleStore } from '@/stores/article';
import { useAuthStore } from '@/stores/auth';

const props = defineProps({
  slug: {
    type: String,
    required: true
  }
});

const articleStore = useArticleStore();
const authStore = useAuthStore();
const route = useRoute();

const article = computed(() => articleStore.article);
const currentUser = computed(() => authStore.currentUser);
const comments = computed(() => articleStore.comments);
const isAuthenticated = computed(() => authStore.isAuthenticated);

onMounted(() => {
  // Use props.slug or route.params.slug
  const slug = props.slug || route.params.slug as string;
  articleStore.fetchArticle(slug);
  articleStore.fetchComments(slug);
});

const parseMarkdown = (content: string | null) => {
  return marked.parse(content || "") as string;
};
</script>

<style scoped></style>
