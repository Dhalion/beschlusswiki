<template>
  <div class="flex justify-center text-black w-full flex-grow">
    <div class="flex flex-col w-full md:w-9/12 lg:w-8/12 xl:w-7/12 xl:mx-auto ring-1 ring-gray-200 shadow"
      v-if="!error && !pending && resolution.body.text">
      <ResolutionViewResolutionHead :resolution="resolution" />
      <ResolutionViewResolutionBody :resolution-text="resolution.body.text" :resolution-id="resolutionId" />
    </div>
    <div v-if="!resolution && !error">Loading</div>
    <span v-if="error">Error: {{ error }}</span>
  </div>
</template>

<script setup>
const runtimeConfig = useRuntimeConfig();
const API_ENDPOINT = runtimeConfig.public.apiEndpoint;
// Get resolution ID from Route Url Parameters
const route = useRoute();
const resolutionId = route.params.id;

const resolution = computed(() => {
  return data.value;
});

const { data, pending, error, refresh } = await useFetch("/resolution", {
  baseURL: API_ENDPOINT,
  params: {
    id: resolutionId,
    text: true,
  },
});
</script>
