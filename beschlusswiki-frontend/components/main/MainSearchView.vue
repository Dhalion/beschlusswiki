<template>
    <div class="flex justify-center" v-for="resolution in searchResults">
        <MainSearchResultResolutionCard :resolution="resolution" />
    </div>
</template>

<script setup>
const API_ENDPOINT = "http://orca-test:1313"

const search = useSearch();
const searchResults = ref("");
const searchQuery = computed(() => search.value.searchQuery);


watch(searchQuery, () => {
    console.log(`[WATCHER] searching: ${searchQuery.value}`);
    performSearch(searchQuery.value);
});


// Funktion zum Ausführen der Suche
const performSearch = async (query) => {
    try {
        const response = await fetch(`${API_ENDPOINT}/api/antrag/suche/${query}`);
        const data = await response.json();
        searchResults.value = data;
        console.log(searchResults.value);
    } catch (error) {
        console.error('Fehler bei der Suche:', error);
    }
};

// Initialisiere die Suche, wenn die Komponente montiert wird
onMounted(() => {
    console.log(`[MOUNTED] Search obj: ${search.value.searchQuery}`);
    performSearch(search.value.searchQuery);
});

</script>