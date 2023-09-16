<template>
    <MainSearchHero />
    <!-- Show Categories only if user didnt input any search query -->
    <MainCategoriesView v-if="!searching" />
    <MainSearchView v-else />
</template>

<script setup>
const search = useSearch();
const searching = computed(() => search.value.searchQuery);
</script>
