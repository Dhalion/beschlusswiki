<template>
  <div class="flex w-screen">

    <!--* LAODING BANNER  -->
    <div v-if="!searchResults && error" class="flex flex-grow py-40 justify-center items-center">
      <div
        class="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite] text-jusorot-600">
      </div>
    </div>

    <!--* SEARCH RESULTS -->
    <div v-if="searchResults && !error" class="flex flex-col justify-center xl:w-3/4 xl:mx-auto w-10/12 mx-auto">
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
    <div v-if="error" class="flex justify-center p-20 mx-auto text-slate-600">
      <span>
        Fehler bei der Suche. Bitte versuche es später erneut.
        {{ search.error }}
      </span>
    </div>
  </div>
  <UNotifications />
</template>

<script setup lang="ts">
import debounce from "lodash.debounce";

const config = useRuntimeConfig();
const API_ENDPOINT = config.public.apiEndpoint;

const toast = useToast();

const props = defineProps(["modelValue"]);

const query = reactive({
  query: props.modelValue,
});


const { data: searchResults, status, error, refresh } = await useFetch("/api/resolution", {
  baseURL: API_ENDPOINT,
  query: query,
  onResponseError(err) {
    toast.add({
      title: "Fehler bei der Suche",
      description: err?.error?.message || "Unbekannter Fehler",
      icon: "i-heroicons-error"
    });
  },
});


watch(
  () => props.modelValue,
  debounce((value) => {
    query.query = value;
    refresh();
  }, 250)
);


</script>
