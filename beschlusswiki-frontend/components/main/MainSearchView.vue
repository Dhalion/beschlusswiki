<template>
  <div class="flex w-screen">
    <!--* LAODING BANNER  -->
    <div v-if="!searchResults && !search.error" class="flex flex-grow py-40 justify-center items-center">
      <div
        class="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite] text-jusorot-600">
      </div>
    </div>

    <!--* SEARCH RESULTS -->
    <div v-if="searchResults && !search.error" class="flex flex-col justify-center xl:w-3/4 xl:mx-auto w-10/12 mx-auto">
      <span class="text-slate-500 xl:ml-4 mt-3 text-xs xl:text-lg">
        {{ searchResults.length }}
        {{ searchResults.length === 1 ? "Beschluss" : "Beschlüsse" }} gefunden
      </span>
      <div v-for="resolution in searchResults">
        <MainSearchResultResolutionCard :resolution="resolution" />
      </div>
    </div>
    <span class="text-black">{{}}</span>

    <!--* ERROR BANNER  -->
    <div v-if="search.error" class="flex justify-center p-20 mx-auto text-slate-600">
      <span>
        Fehler bei der Suche. Bitte versuche es später erneut.
        {{ search.error }}
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
  } catch (e) {
    search.value.error = e;
    console.error("Fehler bei der Suche:", e);
  }
};

// Initialisiere die Suche, wenn die Komponente montiert wird
onMounted(() => {
  performSearch(search.value.searchQuery);
});
</script>
