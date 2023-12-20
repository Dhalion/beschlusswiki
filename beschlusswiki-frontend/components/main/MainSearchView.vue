<template>
  <div class="flex w-full mt-2 px-5">

    <!--* LODING BANNER  -->
    <div v-if="!searchResults && error" class="flex flex-grow py-40 justify-center items-center">
      <div
        class="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite] text-jusorot-600">
      </div>
    </div>
    <!--* SEARCH RESULTS -->
    <div v-if="searchResults && !error" class="flex flex-col justify-center w-full">
      <div class="flex items-baseline">
        <span class="text-slate-500 mt-3 text-xs xl:text-base">
          {{ searchResults.length }}
          {{ searchResults.length === 1 ? "Beschluss" : "Beschlüsse" }} gefunden
          <span class="text-xs align-baseline">
            (Engine: {{ searchEngine.toUpperCase() }})
          </span>
          <!-- state: {{ elastic.elasticStatus.value.state }} -->
          <!-- last check: {{ new Date(elastic.elasticStatus.value.lastCheck).toLocaleTimeString() }} -->

        </span>
      </div>
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
import { ElasticStatus, SearchEngine } from "~/types/Interfaces";


const config = useRuntimeConfig();
const API_ENDPOINT = config.public.apiEndpoint;
const search = useSearch();
const toast = useToast();

const props = defineProps(["modelValue"]);
const elastic = useElastic();

onMounted(async () => {
  await elastic.checkElasticStatus();
});


const searchEngine = computed(() => {
  if (elastic.elasticStatus.value.state === ElasticStatus.AVAILABLE) {
    return SearchEngine.ELASTICSEARCH;
  } else {
    return SearchEngine.MONGO;
  }
});


const queryParams = reactive({
  query: props.modelValue,
  engine: searchEngine
});


const { data: searchResults, status, error, refresh } = await useFetch("/api/resolution", {
  baseURL: API_ENDPOINT,
  query: queryParams,
  key: Date.now().toLocaleString(),
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
    queryParams.query = value;
    refresh();
  }, 250)
);



</script>
