
<template>
    <div class="flex justify-center text-black">
        <div v-if="resolution">
            <div class="flex flex-col h-full w-7/12 ring-1 ring-gray-200 shadow">
                <ResolutionViewResolutionHead :resolution="resolution" />
                <ResolutionViewResolutionBody :resolution="resolution.body.text" :error="error" />
            </div>
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