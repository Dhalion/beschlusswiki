
<template>
    <div class="flex justify-center text-black">

        <div class="flex flex-col h-full w-7/12 ring-1 ring-gray-200 shadow">
            <ResolutionViewResolutionHead :resolution="resolution" />
            <ResolutionViewResolutionBody :resolution="resolution.fließtext" :error="error" />
        </div>

    </div>
</template>

<script setup>
const runtimeConfig = useRuntimeConfig();
const API_ENDPOINT = "http://orca-test:1313"
// Get resolution ID from Route Url Parameters
const route = useRoute();
const resolutionId = route.params.id;
const { data: resolution, pending, error, refresh } = await useFetch(API_ENDPOINT + '/api/antrag/' + resolutionId);

</script>