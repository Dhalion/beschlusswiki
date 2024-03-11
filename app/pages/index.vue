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

</script>
