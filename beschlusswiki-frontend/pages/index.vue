<template>
  <MainSearchHero />
  <!-- Show Categories only if user didnt input any search query -->
  <MainCategoriesView v-if="!searching" />
  <MainSearchView v-else />
</template>

<script setup>
const search = useSearch();
const searching = computed(() => search.value.searchQuery);

onBeforeRouteLeave((to, from, next) => {
  console.log(
    `[ROUTER] Leaving search. Saving search query: ${search.value.searchQuery}`,
  );
  next();
});
</script>
