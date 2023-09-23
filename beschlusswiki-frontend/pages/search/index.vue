<template>
    <MainSearchHero />
    <MainSearchView />
</template>

<script setup>
const route = useRoute();
const search = useSearch();
const searchQuery = computed(() => route.query.query);

if (searchQuery.value) {
    search.value.searchQuery = searchQuery.value;
}

</script>
