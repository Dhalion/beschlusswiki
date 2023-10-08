
<template>
    <div class="flex justify-center text-black w-full flex-grow">
        <div class="flex flex-col w-7/12 mx-auto ring-1 ring-gray-200 shadow">
            <ResolutionViewResolutionHead :resolution="resolution" />
            <ResolutionViewResolutionBody :resolution-text="resolution.body.text" :resolution-id="resolutionId" />
        </div>
        <div v-if="!resolution && !error">
            Loading
        </div>
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



const { data, pending, error, refresh } =
    await useFetch("/resolution", {
        baseURL: API_ENDPOINT,
        params: {
            id: resolutionId
        },
    });

</script>