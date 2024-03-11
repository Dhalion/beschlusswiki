<template>
  <div class="flex w-full mt-2 px-5">

    <!--* LODING BANNER  -->
    <div v-if="isLoading" class="flex flex-grow py-40 justify-center items-center">
      <div
        class="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite] text-jusorot-600">
      </div>
    </div>
    <!--* SEARCH RESULTS -->
    <!-- <span class="text-black">{{ searchResults }}</span> -->
    <div v-if="searchResults && !error && !isLoading" class="flex flex-col justify-center w-full">
      <div class="flex items-baseline">
        <span class="text-slate-500 mt-3 text-xs xl:text-base">
          {{ total }}
          {{ total === 1 ? "Beschluss" : "Beschlüsse" }} in {{ took || "null" }} gefunden. (Zeige {{
      searchResults.length
    }} von {{ total }})
          <span class="text-xs align-baseline">
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
    <UAlert v-if="error" class="mt-5" title="Fehler bei der Suche"
      :description="'Bitte versuche es später erneut. ' + error" icon="i-heroicons-exclamation-circle" variant="soft"
      color="primary" />
  </div>
  <UNotifications />
</template>

<script setup lang="ts">
import debounce from "lodash.debounce";
import { type ResolutionSearchResult, type ISimpleResolution, type searchObject } from "~/types/Interfaces";

const config = useRuntimeConfig();
const toast = useToast();

const props = defineProps(["search"]);
const isLoading = ref(true);
const searchResults = ref<ISimpleResolution[]>([]);
const error = ref<string | null>(null);
const total = ref(0);
const took = ref<string | null>(null);


const search = async (searchParams: searchObject) => {
  try {
    console.log("searching for:", searchParams.query);
    if (!search) return;
    isLoading.value = true;
    const start = Date.now();
    const response = await $fetch("/api/resolution/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: {
        query: searchParams.query,
        categories: searchParams.categories.map((c) => c._id),
        applicants: searchParams.applicants.map((a) => a._id),
        fromYear: searchParams.fromYear,
        toYear: searchParams.toYear,
      },
    });
    const requestTook = Date.now() - start;

    // try to parse the response to a ResolutionSearchResult
    if (response) {
      const result = response as ResolutionSearchResult;
      if (result.results) {
        searchResults.value = result.results;
        total.value = result.total;
        took.value = `${requestTook} ms`;
      }
    }
    isLoading.value = false;
  } catch (e) {
    console.error(e);
    isLoading.value = false;
  }
};

watch(() => props.search, debounce((searchObj) => {
  console.log("searching debounced");
  if (!searchObj) return;
  search(searchObj);
}, 200), { deep: true });

onMounted(() => {
  if (props.search) {
    search(props.search);
  }
});


</script>
