<template>
  <div class="flex justify-center text-black dark:text-slate-200 w-full flex-grow">
    <div
      class="flex flex-col w-full md:w-9/12 lg:w-8/12 xl:w-7/12 xl:mx-auto ring-1 ring-gray-200 dark:ring-gray-600 shadow"
      v-if="!resolutionError && !resolutionPending && resolutionData?.body?.text && resolutionId">
      <ResolutionViewResolutionHead :resolution="resolutionData" />
      <ResolutionViewResolutionBody :resolution-text="resolutionData?.body?.text" :resolution-id="resolutionId" />
    </div>
    <div v-if="resolutionPending">Loading</div>
    <span v-if="resolutionError">Error: {{ resolutionError }}</span>
  </div>
</template>

<script setup lang="ts">
import { type IResolution } from "@/types/Interfaces"



const runtimeConfig = useRuntimeConfig();
const API_ENDPOINT = runtimeConfig.public.apiEndpoint;

const route = useRoute();
const resolutionId = route.params.id as string;

const {
  data: resolutionData,
  pending: resolutionPending,
  error: resolutionError,
  refresh: refreshResolution,
} = await useFetch<IResolution>("/resolution", {
  baseURL: API_ENDPOINT,
  params: {
    id: resolutionId,
    text: true,
    category: true,
    applicants: true,
  },
});

const pageTitle = computed(() => {
  const tag = resolutionData.value?.body?.tag || "";
  const year = resolutionData.value?.body?.year || "";
  const title = resolutionData.value?.body?.title || "";
  return `${tag} ${year}: ${title}`;
});

useHead({
  title: pageTitle,
});

</script>
