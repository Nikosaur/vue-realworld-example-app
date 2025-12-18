<template>
  <div id="app">
    <RwvHeader />
    <router-view></router-view>
    <RwvFooter />
  </div>
</template>

<script setup lang="ts">
import RwvHeader from "@/components/TheHeader.vue";
import RwvFooter from "@/components/TheFooter.vue";
</script>

<style scoped></style>
