<template>
  <div class="profile-page">
    <RwvArticleList :author="author" :items-per-page="5"></RwvArticleList>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import RwvArticleList from "@/components/ArticleList.vue";

const route = useRoute();
const author = computed(() => route.params.username as string);
</script>

<style scoped></style>
