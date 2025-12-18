<template>
  <div class="article-preview">
    <RwvArticleMeta isPreview :article="article" />
    <router-link :to="articleLink" class="preview-link">
      <h1 v-text="article.title" />
      <p v-text="article.description" />
      <span>Read more...</span>
      <TagList :tags="article.tagList" />
    </router-link>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import RwvArticleMeta from "./ArticleMeta.vue";
import TagList from "./TagList.vue";

const props = defineProps({
  article: { type: Object, required: true }
});

const articleLink = computed(() => {
  return {
    name: "article",
    params: {
      slug: props.article.slug
    }
  };
});
</script>

<style scoped></style>
