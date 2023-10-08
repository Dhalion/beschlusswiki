<template>
    <div class="w-screen">

        <EditResolutionHead class="w-5/6 mx-auto" :resolution="state.resolution" />
        <span class="text-black">Error: {{ error.statusCode }}</span>
        <br>
        <span class="text-black">Pending: {{ pending }}</span>
        <div v-if="!isLoading">
            <div class="w-5/6 mx-auto flex mt-2 justify-center">
                <span class="text-gray-400 text-lg w-1/2 text-center">Beschluss bearbeiten </span>
                <span class="text-gray-400 text-lg w-1/2 text-center">Vorschau</span>
            </div>
            <div class="text-black markdown mx-auto w-5/6 flex justify-center divide-x pt-3">
                <div class="w-1/2 h-screen p-3">
                    <UTextarea v-model="state.plainMarkdown" variant="none" autoresize
                        class="font-mono text-base outline outline-1 outline-gray-300 outline-offset-1 bg-white" />
                </div>
                <div class="w-1/2 p-3">
                    <div v-html="state.parsedMarkdown" class="prose w-full"></div>
                </div>
            </div>
        </div>
        <div v-if="isLoading && !error" class="flex justify-center items-center h-screen">
            <span class="text-gray-500">Lade Beschluss...</span>
        </div>
        <div class="bg-jusorot-700 w-2/3 mx-auto p-10 rounded-lg flex flex-col">
            <span class="text-white text-4xl font-semibold">Fehler!</span>
            <br>
            <span class="text-white mt-5">Beschluss konnte nicht geladen werden! Fehlercode: {{ error.statusCode }}</span>
        </div>
    </div>
</template>

<script setup>
import MarkdownIt from 'markdown-it'

const md = new MarkdownIt();
const config = useRuntimeConfig();
const API_ENDPOINT = config.public.apiEndpoint;
const router = useRouter();
const resolutionId = router.currentRoute.value.query.id;

const resolution = useLoadedResolution();

const state = reactive({
    plainMarkdown: "",
    parsedMarkdown: "",
});


const url = API_ENDPOINT + '/resolution?id=' + resolutionId;

const { data, error, pending } = useFetch(url, {
    onResponse: (response) => {
        if (response.ok) {
        }
        console.log(data.value);
        // resolution.value = response.value;
        // state.plainMarkdown = response.fließtext;
    }
});


const isLoading = computed(() => {
    return resolution.value.titel === undefined
});



const parseMD = async () => {
    state.parsedMarkdown = md.render(state.plainMarkdown);
}

watch(() => state.plainMarkdown, () => {
    parseMD();
});

</script>

<style></style>
