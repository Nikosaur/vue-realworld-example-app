<template>
  <nav>
    <ul class="pagination">
      <li
        v-for="page in pages"
        :data-test="`page-link-${page}`"
        :key="page"
        :class="paginationClass(page)"
        @click.prevent="changePage(page)"
      >
        <a class="page-link" href="javascript:void(0)" v-text="page" />
      </li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
const props = defineProps<{
  pages: number[];
  currentPage: number;
}>();

const emit = defineEmits<{
  (e: 'update:currentPage', page: number): void
}>();

const changePage = (goToPage: number) => {
  if (goToPage === props.currentPage) return;
  emit("update:currentPage", goToPage);
};

const paginationClass = (page: number) => {
  return {
    "page-item": true,
    active: props.currentPage === page
  };
};
</script>

<style scoped></style>
