<template>
    <div class="flex w-screen">
        <!--* LAODING BANNER  -->
        <div class="flex flex-grow py-40 justify-center items-center" v-if="!searchResults && !search.error">
            <div class="inline-block h-12 w-12 animate-spin rounded-full border-4
                        border-solid border-current border-r-transparent
                        align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]
                        text-jusorot-600">
            </div>
        </div>

        <!--* SEARCH RESULTS -->
        <div v-if="searchResults && !search.error" class="flex flex-col justify-center w-3/4 mx-auto">
            <span class="text-slate-500 ml-4 mt-3">
                {{ searchResults.length }}
                {{ searchResults.length === 1 ? 'Beschluss' : 'Beschlüsse' }} gefunden
            </span>
            <div v-for="resolution in searchResults">
                <MainSearchResultResolutionCard :resolution="resolution" />
            </div>
        </div>
        <span class="text-black">{{ }}</span>

        <!--* ERROR BANNER  -->
        <div class="flex justify-center p-20 mx-auto text-slate-600" v-if="search.error">
            <span>
                Fehler bei der Suche. Bitte versuche es später erneut.
            </span>
        </div>
    </div>
</template>

<script setup>
const config = useRuntimeConfig();
const API_ENDPOINT = config.public.apiEndpoint;

const search = useSearch();
const searchResults = ref("");
const searchQuery = computed(() => search.value.searchQuery);
const error = ref("");

watch(searchQuery, () => {
    performSearch(searchQuery.value);
});


// Funktion zum Ausführen der Suche
const performSearch = async (query) => {
    // Reset Error
    search.value.error = "";
    try {
        const response = await fetch(`${API_ENDPOINT}/resolution?q=${query}`);
        const data = await response.json();
        const status = await response.status;

        if (status && status !== 200) {
            search.value.error = status;
        }
        searchResults.value = data;
        console.log(searchResults.value);
    } catch (e) {
        search.value.error = e;
        console.error('Fehler bei der Suche:', e);
    }
};

// Initialisiere die Suche, wenn die Komponente montiert wird
onMounted(() => {
    console.log(`[MOUNTED] Search obj: ${search.value.searchQuery}`);
    performSearch(search.value.searchQuery);
});

</script>