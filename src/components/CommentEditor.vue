<template>
  <div>
    <RwvListErrors :errors="errors" />
    <form class="card comment-form" @submit.prevent="onSubmit(slug, comment)">
      <div class="card-block">
        <textarea
          class="form-control"
          v-model="comment"
          placeholder="Write a comment..."
          rows="3"
        >
        </textarea>
      </div>
      <div class="card-footer">
        <img :src="userImage" class="comment-author-img" />
        <button class="btn btn-sm btn-primary">Post Comment</button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useArticleStore } from '@/stores/article';
import RwvListErrors from "./ListErrors.vue";

const props = defineProps({
  slug: { type: String, required: true },
  content: { type: String, required: false },
  userImage: { type: String, required: false }
});

const articleStore = useArticleStore();

const comment = ref(props.content || null);
const errors = ref({});

const onSubmit = (slug: string, commentContent: string | null) => {
  articleStore
    .createComment({ slug, comment: commentContent })
    .then(() => {
      comment.value = null;
      errors.value = {};
    })
    .catch(({ response }) => {
      errors.value = response.data.errors;
    });
};
</script>

<style scoped></style>
