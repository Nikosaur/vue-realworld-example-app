<template>
  <div class="profile-page">
    <RwvArticleList :favorited="favorited" :items-per-page="5">
    </RwvArticleList>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import RwvArticleList from "@/components/ArticleList.vue";

const route = useRoute();
const favorited = computed(() => route.params.username as string);
</script>

<style scoped></style>
