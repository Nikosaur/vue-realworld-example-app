<template>
  <!-- Used when user is also author -->
  <span v-if="canModify">
    <router-link class="btn btn-sm btn-outline-secondary" :to="editArticleLink">
      <i class="ion-edit"></i> <span>&nbsp;Edit Article</span>
    </router-link>
    <span>&nbsp;&nbsp;</span>
    <button class="btn btn-outline-danger btn-sm" @click="deleteArticle">
      <i class="ion-trash-a"></i> <span>&nbsp;Delete Article</span>
    </button>
  </span>
  <!-- Used in ArticleView when not author -->
  <span v-else>
    <button class="btn btn-sm btn-outline-secondary" @click="toggleFollow">
      <i class="ion-plus-round"></i> <span>&nbsp;</span>
      <span v-text="followUserLabel" />
    </button>
    <span>&nbsp;&nbsp;</span>
    <button
      class="btn btn-sm"
      @click="toggleFavorite"
      :class="toggleFavoriteButtonClasses"
    >
      <i class="ion-heart"></i> <span>&nbsp;</span>
      <span v-text="favoriteArticleLabel" /> <span>&nbsp;</span>
      <span class="counter" v-text="favoriteCounter" />
    </button>
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useProfileStore } from '@/stores/profile';
import { useArticleStore } from '@/stores/article';
import { useAuthStore } from '@/stores/auth';

const props = defineProps({
  article: { type: Object, required: true },
  canModify: { type: Boolean, required: true }
});

const profileStore = useProfileStore();
const articleStore = useArticleStore();
const authStore = useAuthStore();
const router = useRouter();

const profile = computed(() => profileStore.profile);
const isAuthenticated = computed(() => authStore.isAuthenticated);

const editArticleLink = computed(() => {
  return { name: "article-edit", params: { slug: props.article.slug } };
});

const toggleFavoriteButtonClasses = computed(() => {
  return {
    "btn-primary": props.article.favorited,
    "btn-outline-primary": !props.article.favorited
  };
});

const followUserLabel = computed(() => {
  return `${profile.value.following ? "Unfollow" : "Follow"} ${
    props.article.author.username
  }`;
});

const favoriteArticleLabel = computed(() => {
  return props.article.favorited ? "Unfavorite Article" : "Favorite Article";
});

const favoriteCounter = computed(() => {
  return `(${props.article.favoritesCount})`;
});

const toggleFavorite = async () => {
  if (!isAuthenticated.value) {
    router.push({ name: "login" });
    return;
  }
  const action = props.article.favorited ? articleStore.favoriteRemove : articleStore.favoriteAdd;
  await action(props.article.slug);
};

const toggleFollow = async () => {
  if (!isAuthenticated.value) {
    router.push({ name: "login" });
    return;
  }
  const action = profile.value.following
    ? profileStore.fetchProfileUnfollow
    : profileStore.fetchProfileFollow;
  
  await action({
    username: props.article.author.username
  });
};

const deleteArticle = async () => {
  try {
    await articleStore.articleDelete(props.article.slug);
    router.push("/");
  } catch (err) {
    console.error(err);
  }
};
</script>

<style scoped></style>
