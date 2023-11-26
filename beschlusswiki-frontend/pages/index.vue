<template>
  <MainSearchHero v-model="searchQuery" />
  <!-- Show Categories only if user didnt input any search query -->
  <MainCategoriesView v-if="searchQuery.length == 0" />
  <MainSearchView v-if="searchQuery.length > 0" v-model="searchQuery" />
</template>

<script setup>

const searchQuery = ref("");

</script>
