<template>
  <div>
    <div v-if="isLoading" class="article-preview">Loading articles...</div>
    <div v-else>
      <div v-if="articles.length === 0" class="article-preview">
        No articles are here... yet.
      </div>
      <RwvArticlePreview
        v-for="(article, index) in articles"
        :article="article"
        :key="article.title + index"
      />
      <VPagination :pages="pages" v-model:currentPage="currentPage" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { useHomeStore } from '@/stores/home';
import RwvArticlePreview from "./VArticlePreview.vue";
import VPagination from "./VPagination.vue";

const props = defineProps({
  type: {
    type: String,
    required: false,
    default: "all"
  },
  author: {
    type: String,
    required: false
  },
  tag: {
    type: String,
    required: false
  },
  favorited: {
    type: String,
    required: false
  },
  itemsPerPage: {
    type: Number,
    required: false,
    default: 10
  }
});

const homeStore = useHomeStore();

const currentPage = ref(1);

const articles = computed(() => homeStore.articles);
const isLoading = computed(() => homeStore.isLoading);
const articlesCount = computed(() => homeStore.articlesCount);

const listConfig = computed(() => {
  const { type } = props;
  const filters: any = {
    offset: (currentPage.value - 1) * props.itemsPerPage,
    limit: props.itemsPerPage
  };
  if (props.author) {
    filters.author = props.author;
  }
  if (props.tag) {
    filters.tag = props.tag;
  }
  if (props.favorited) {
    filters.favorited = props.favorited;
  }
  return {
    type,
    filters
  };
});

const pages = computed(() => {
  if (isLoading.value || articlesCount.value <= props.itemsPerPage) {
    return [];
  }
  return [
    ...Array(Math.ceil(articlesCount.value / props.itemsPerPage)).keys()
  ].map(e => e + 1);
});

const fetchArticles = () => {
  homeStore.fetchArticles(listConfig.value);
};

const resetPagination = () => {
  // listConfig is computed, we cannot set modify its property directly to affect state unless we use a reactive object for it, 
  // but here we just need to reset currentPage which affects listConfig.
  // Original code: `this.listConfig.offset = 0` (this didn't do anything to state except local obj) AND `this.currentPage = 1`.
  currentPage.value = 1;
};

watch(currentPage, () => {
  fetchArticles();
});

watch(() => props.type, () => {
  resetPagination();
  fetchArticles();
});

watch(() => props.author, () => {
  resetPagination();
  fetchArticles();
});

watch(() => props.tag, () => {
  resetPagination();
  fetchArticles();
});

watch(() => props.favorited, () => {
  resetPagination();
  fetchArticles();
});

onMounted(() => {
  fetchArticles();
});
</script>

<style scoped></style>
