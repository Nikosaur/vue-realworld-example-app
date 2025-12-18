<template>
  <div class="home-tag"><RwvArticleList :tag="tag"></RwvArticleList></div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import RwvArticleList from "@/components/ArticleList.vue";

const route = useRoute();
const tag = computed(() => route.params.tag as string);
</script>

<style scoped></style>
