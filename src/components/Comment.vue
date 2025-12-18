<template>
  <div class="card">
    <div class="card-block">
      <p class="card-text">{{ comment.body }}</p>
    </div>
    <div class="card-footer">
      <a href="" class="comment-author">
        <img :src="comment.author.image" class="comment-author-img" />
      </a>
      <router-link
        class="comment-author"
        :to="{ name: 'profile', params: { username: comment.author.username } }"
      >
        {{ comment.author.username }}
      </router-link>
      <span class="date-posted">{{ dateFilter(comment.createdAt) }}</span>
      <span v-if="isCurrentUser" class="mod-options">
        <i class="ion-trash-a" @click="destroy(slug, comment.id)"></i>
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useArticleStore } from '@/stores/article';
// @ts-ignore
import { default as dateFilter } from "@/common/date.filter";

const props = defineProps({
  slug: { type: String, required: true },
  comment: { type: Object, required: true }
});

const authStore = useAuthStore();
const articleStore = useArticleStore();

const currentUser = computed(() => authStore.currentUser);

const isCurrentUser = computed(() => {
  if (currentUser.value.username && props.comment.author.username) {
    return props.comment.author.username === currentUser.value.username;
  }
  return false;
});

const destroy = (slug: string, commentId: number) => {
  articleStore.destroyComment({ slug, commentId });
};
</script>

<style scoped></style>
