<template>
  <div class="flex justify-center flex-col mt-5">
    <div
      class="shadow-lg bg-rosa-300 dark:bg-rosa-200 flex justify-center items-center flex-col mt-3 rounded-3xl xl:mx-5 mx-2">
      <h1 class="text-beere-600 dark:text-beere-500 xl:text-5xl text-3xl mt-10 font-bold">Beschlüsse suchen</h1>
      <!-- Searchbar -->
      <div class="flex flex-col mt-8 xl:mt-10 xl:w-1/2 w-10/12">
        <div class="flex flex-row">
          <input v-model="search.query" color="jusorot"
            class=" bg-white w-full text-black p-3 rounded-xl shadow-xl border-cool-200 border-2 text-sm focus:outline-none hover:ring hover:ring-beere focus:ring focus:ring-beere focus:scale-105 transition-transform hover:scale-105 duration-300 ease-in-out"
            placeholder="Titel oder Stichwort" />
          <MainHowToSearch />
        </div>

        <!-- Erweiterte Suche -->
        <UAccordion color="slate" variant="link" :items="advancedSearchItems" class="mb-5">
          <template #advanced-search>
            <div v-if="!categoriesPending && !categoriesError">
              <UFormGroup label="Kategorie(n)">
                <USelectMenu v-model="search.categories" v-if="categoriesData" :options="categoriesData" multiple
                  searchable>
                  <template #label>
                    <span v-if="search.categories.length" class="truncate">
                      {{ search.categories.map((category) => `${category.tag} - ${category.name}`).join(", ") }}
                    </span>
                    <span v-else>Kategorie(n) wählen</span>
                  </template>

                  <template #option="{ option }">
                    <span>{{ option.tag }} - {{ option.name }}</span>
                  </template>
                </USelectMenu>
              </UFormGroup>

              <UFormGroup label="Zeitraum">
                <div class="flex flex-row gap-3">
                  <span class="text-center self-center">Von</span>
                  <UInput type="number" v-model="search.fromYear" />
                  <span class="text-center self-center">Bis</span>
                  <UInput type="number" v-model="search.toYear" />
                </div>
              </UFormGroup>

              <UFormGroup label="Antragsteller*innen">
                <USelectMenu v-model="search.applicants" v-if="applicantsData" :options="applicantsData" multiple
                  searchable>
                  <template #label>
                    <span v-if="search.applicants.length" class="truncate">
                      {{ search.applicants.map((applicant) => applicant.name).join(", ") }}
                    </span>
                    <span v-else>Antragsteller*innen wählen</span>
                  </template>

                  <template #option="{ option }">
                    <span>{{ option.name }}</span>
                  </template>
                </USelectMenu>
              </UFormGroup>
            </div>
            <div v-else-if="categoriesPending">Loading...</div>
          </template>
        </UAccordion>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ICategory } from '~/types/Interfaces';
import type { IApplicant } from '~/types/models/applicant.schema';

const props = defineProps(["modelValue"]);
const emit = defineEmits(["update:modelValue"]);

const route = useRoute();
const router = useRouter();

const search = ref({
  query: props.modelValue.query || "",
  categories: <ICategory[]>[],
  applicants: <IApplicant[]>[],
  fromYear: "",
  toYear: "",
});

const { data: categoriesData,
  pending: categoriesPending,
  error: categoriesError,
  refresh: categoriesRefresh
} = await useFetch<ICategory[]>('/api/category');

const { data: applicantsData,
  pending: applicantsPending,
  error: applicantsError,
  refresh: applicantsRefresh
} = await useFetch<IApplicant[]>('/api/applicants');

const advancedSearchItems = [{
  label: "Erweiterte Suche",
  icon: "i-heroicons-adjustments-vertical",
  defaultOpen: false,
  slot: "advanced-search",
}]


watch(() => search, () => {
  // save search params in url
  const params: any = {};
  if (search.value.query) params.query = search.value.query;
  if (search.value.categories.length) params.categories = search.value.categories.map((category) => category._id).join(",");
  if (search.value.applicants.length) params.applicants = search.value.applicants.map((applicant) => applicant._id).join(",");
  if (search.value.fromYear) params.fromYear = search.value.fromYear;
  if (search.value.toYear) params.toYear = search.value.toYear;

  // Use router.push to change the URL
  router.push({ path: router.currentRoute.value.path, query: params }).catch(err => { });

  emit("update:modelValue", search.value);
}, { deep: true });

function loadSearchFromUrlParams() {
  // load params from url
  const params = new URLSearchParams(route.query as any);
  if (params.has("query")) search.value.query = params.get("query") || "";
  if (params.has("categories")) {
    const categoryIds = params.get("categories")?.split(",");
    if (categoryIds) {
      search.value.categories = categoriesData.value?.filter((category) => {
        return categoryIds.includes(category._id.toString());
      }) || [];
    }
  }
  if (params.has("applicants")) {
    const applicantIds = params.get("applicants")?.split(",");
    if (applicantIds) {
      search.value.applicants = applicantsData.value?.filter((applicant) => {
        return applicantIds.includes(applicant._id.toString());
      }) || [];
    }
  }
  if (params.has("fromYear")) search.value.fromYear = params.get("fromYear") || "";
  if (params.has("toYear")) search.value.toYear = params.get("toYear") || "";

  emit("update:modelValue", search.value);
};
</script>
