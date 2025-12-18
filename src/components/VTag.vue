<template>
  <router-link :to="homeRoute" :class="className" v-text="name"></router-link>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
  name: {
    type: String,
    required: true
  },
  className: {
    type: String,
    default: "tag-pill tag-default"
  }
});

const homeRoute = computed(() => ({ 
  name: "home-tag", 
  params: { tag: props.name } 
}));
</script>

<style scoped></style>
