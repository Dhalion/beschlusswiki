<template>
    <EditResolutionHead class="w-5/6 mx-auto" :resolution="state.resolution" />
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
    <div v-if="isLoading" class="flex justify-center items-center h-screen">
        <span class="text-gray-500">Lade Beschluss...</span>
    </div>
</template>

<script setup>
import MarkdownIt from 'markdown-it'

const md = new MarkdownIt();
const config = useRuntimeConfig();
const API_ENDPOINT = config.public.apiEndpoint;
const router = useRouter();
const resolutionId = router.currentRoute.value.query.id;

const url = API_ENDPOINT + '/antrag/' + resolutionId;

const resolution = useLoadedResolution();

const state = reactive({
    plainMarkdown: "",
    parsedMarkdown: "",
});

const isLoading = computed(() => {
    return resolution.value.titel === undefined
});

async function fetchResolution() {
    try {
        console.log(`Fetching resolution ${resolutionId} from ${url}`);
        const response = await fetch(url);
        const data = await response.json();
        resolution.value = data;
        state.plainMarkdown = data.fließtext;
    } catch (error) {
        console.log(error);
    }
}

onMounted(() => {
    fetchResolution();
});

const parseMD = async () => {
    state.parsedMarkdown = md.render(state.plainMarkdown);

}

watch(() => state.plainMarkdown, () => {
    parseMD();
});

</script>

<style></style>
