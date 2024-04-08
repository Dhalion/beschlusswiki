<template>
    <div class="sm:w-full lg:w-3/4 mx-auto">
        <MainSearchHero v-model="search" />
        <!-- Show Categories only if user didnt input any search query -->
        <MainCategoriesView v-if="emptySearch" />
        <MainSearchView v-if="!emptySearch" v-model:search="search" />
    </div>
</template>

<script setup lang="ts">
import type { ICategory } from '~/types/Interfaces';
import type { IApplicant } from '~/types/models/applicant.schema';


const router = useRouter();
const route = useRoute();

const search = ref({
    query: "",
    categories: <ICategory[]>[],
    applicants: <IApplicant[]>[],
    fromYear: "",
    toYear: "",
});



const pageTitle = computed(() => {
    if (search.value.query) {
        return `Beschlusswiki: ${search.value.query}`;
    }
    return "Jusos Beschlusswiki";
});

useHead({
    title: pageTitle,
});

onMounted(() => {
    loadSearchFromUrlParams();
});

watch(() => route.query, (newQuery, oldQuery) => {
    if (oldQuery?.query == undefined && newQuery.query) {
        loadSearchFromUrlParams();
    }
});


watch(() => search.value, (newSearch) => {
    console.log("search changed", newSearch);
}, { deep: true });


const emptySearch = computed(() => {
    let isEmpty = true;
    if (search.value.query) {
        return false;
    }
    if (search.value.categories.length) {
        return false;
    }
    if (search.value.applicants.length) {
        return false;
    }
    if (search.value.fromYear) {
        return false;
    }
    if (search.value.toYear) {
        return false;
    }

    return isEmpty;
});

useListen("logoClicked", () => {
    console.log("Logo clicked");
    // Listen for the logoClicked event and reset the search query
    search.value.query = "";
    search.value.categories = [];
    search.value.applicants = [];
    search.value.fromYear = "";
    search.value.toYear = "";
});

function loadSearchFromUrlParams() {
    const params = route.query;
    if (params.query) {
        search.value.query = params.query as string;
    }
    if (params.categories) {
        search.value.categories = JSON.parse(params.categories as string);
    }
    if (params.applicants) {
        search.value.applicants = JSON.parse(params.applicants as string);
    }
    if (params.fromYear) {
        search.value.fromYear = params.fromYear as string;
    }
    if (params.toYear) {
        search.value.toYear = params.toYear as string;
    }
}

</script>
