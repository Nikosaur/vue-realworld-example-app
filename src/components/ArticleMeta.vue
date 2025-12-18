<template>
  <div class="article-meta">
    <router-link
      :to="{ name: 'profile', params: { username: article.author.username } }"
    >
      <img :src="article.author.image" />
    </router-link>
    <div class="info">
      <router-link
        :to="{ name: 'profile', params: { username: article.author.username } }"
        class="author"
      >
        {{ article.author.username }}
      </router-link>
      <span class="date">{{ dateFilter(article.createdAt) }}</span>
    </div>
    <rwv-article-actions
      v-if="actions"
      :article="article"
      :canModify="isCurrentUser()"
    ></rwv-article-actions>
    <button
      v-else
      class="btn btn-sm pull-xs-right"
      @click="toggleFavorite"
      :class="{
        'btn-primary': article.favorited,
        'btn-outline-primary': !article.favorited
      }"
    >
      <i class="ion-heart"></i>
      <span class="counter"> {{ article.favoritesCount }} </span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import RwvArticleActions from "@/components/ArticleActions.vue";
import { useArticleStore } from '@/stores/article';
import { useAuthStore } from '@/stores/auth';
// @ts-ignore
import { default as dateFilter } from "@/common/date.filter";

const props = defineProps({
  article: {
    type: Object,
    required: true
  },
  actions: {
    type: Boolean,
    required: false,
    default: false
  }
});

const articleStore = useArticleStore();
const authStore = useAuthStore();
const router = useRouter();

const currentUser = computed(() => authStore.currentUser);
const isAuthenticated = computed(() => authStore.isAuthenticated);

const isCurrentUser = () => {
  if (currentUser.value.username && props.article.author.username) {
    return currentUser.value.username === props.article.author.username;
  }
  return false;
};

const toggleFavorite = () => {
  if (!isAuthenticated.value) {
    router.push({ name: "login" });
    return;
  }
  const action = props.article.favorited ? articleStore.favoriteRemove : articleStore.favoriteAdd;
  action(props.article.slug);
};
</script>

<style scoped></style>
