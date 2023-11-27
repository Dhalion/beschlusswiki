<template>
    <MainSearchHero v-model="searchQuery" />
    <!-- Show Categories only if user didnt input any search query -->
    <MainCategoriesView v-if="searchQuery.length == 0" />
    <MainSearchView v-if="searchQuery.length > 0" v-model="searchQuery" />
</template>

<script setup lang="ts">

const router = useRouter();
const route = useRoute();
const searchQuery = ref(route.query.q as string || "");

useListen("logoClicked", () => {
    // Listen for the logoClicked event and reset the search query
    searchQuery.value = "";
});

watch(searchQuery, () => {
    // Hinzufügen oder Aktualisieren des Query-Parameters
    router.push({ query: { q: searchQuery.value } });
});

</script>
