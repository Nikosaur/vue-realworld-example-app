<template>
  <div class="editor-page">
    <div class="container page">
      <div class="row">
        <div class="col-md-10 offset-md-1 col-xs-12">
          <RwvListErrors :errors="errors" />
          <form @submit.prevent="onPublish(article.slug)">
            <fieldset :disabled="inProgress">
              <fieldset class="form-group">
                <input
                  type="text"
                  class="form-control form-control-lg"
                  v-model="article.title"
                  placeholder="Article Title"
                />
              </fieldset>
              <fieldset class="form-group">
                <input
                  type="text"
                  class="form-control"
                  v-model="article.description"
                  placeholder="What's this article about?"
                />
              </fieldset>
              <fieldset class="form-group">
                <textarea
                  class="form-control"
                  rows="8"
                  v-model="article.body"
                  placeholder="Write your article (in markdown)"
                >
                </textarea>
              </fieldset>
              <fieldset class="form-group">
                <input
                  type="text"
                  class="form-control"
                  placeholder="Enter tags"
                  v-model="tagInput"
                  @keypress.enter.prevent="addTag(tagInput)"
                />
                <div class="tag-list">
                  <span
                    class="tag-default tag-pill"
                    v-for="(tag, index) of article.tagList"
                    :key="tag + index"
                  >
                    <i class="ion-close-round" @click="removeTag(tag)"> </i>
                    {{ tag }}
                  </span>
                </div>
              </fieldset>
            </fieldset>
            <button
              :disabled="inProgress"
              class="btn btn-lg pull-xs-right btn-primary"
              type="submit"
            >
              Publish Article
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter, onBeforeRouteLeave, onBeforeRouteUpdate } from 'vue-router';
import RwvListErrors from "@/components/ListErrors.vue";
import { useArticleStore } from '@/stores/article';

const props = defineProps({
  previousArticle: {
    type: Object,
    required: false
  }
});

const articleStore = useArticleStore();
const route = useRoute();
const router = useRouter();

const tagInput = ref<string | null>(null);
const inProgress = ref(false);
const errors = ref({});

const article = computed(() => articleStore.article);

const fetchArticle = async (slug: string, previousArticle: any) => {
  articleStore.resetState();
  if (slug !== undefined) {
    await articleStore.fetchArticle(slug, previousArticle);
  }
};

onMounted(async () => {
    // Check if we are editing an existing article
    if (route.params.slug) {
        await fetchArticle(route.params.slug as string, props.previousArticle);
    } else {
        articleStore.resetState();
    }
});

onBeforeRouteUpdate(async (to, from, next) => {
  articleStore.resetState();
  next();
});

onBeforeRouteLeave(async (to, from, next) => {
  articleStore.resetState();
  next();
});

const onPublish = (slug: string) => {
  let action = slug ? articleStore.articleEdit : articleStore.articlePublish;
  inProgress.value = true;
  action()
    .then(({ data }) => {
      inProgress.value = false;
      router.push({
        name: "article",
        params: { slug: data.article.slug }
      });
    })
    .catch(({ response }) => {
      inProgress.value = false;
      errors.value = response.data.errors;
    });
};

const removeTag = (tag: string) => {
  articleStore.articleRemoveTag(tag);
};

const addTag = (tag: string | null) => {
  if (!tag) return;
  articleStore.articleAddTag(tag);
  tagInput.value = null;
};
</script>

<style scoped></style>
