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
            (Engine: {{ resultsFrom }})
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
        {{ error }}
      </span>
    </div>
  </div>
  <UNotifications />
</template>

<script setup lang="ts">
import debounce from "lodash.debounce";
import { SearchEngine } from "~/types/Interfaces";

const config = useRuntimeConfig();
const toast = useToast();

const props = defineProps(["modelValue"]);



const { results: searchResults, pending, error, search, resultsFrom } =
  await useSearch(props.modelValue, { engine: SearchEngine.ELASTICSEARCH });


watch(
  () => props.modelValue,
  debounce(async (value) => {
    // console.log("debounced search", value);
    await search(value);
  }, 250)
);



</script>
