<template>
  <div class="flex justify-center flex-col mt-5">
    <div class="shadow-lg bg-rosa flex justify-center items-center flex-col mt-3 rounded-3xl xl:mx-5 mx-2">
      <h1 class="text-beere xl:text-5xl text-3xl mt-10 font-bold">Anträge suchen</h1>
      <!-- Searchbar -->
      <div class="flex flex-col mt-8 xl:mt-10 xl:w-1/2 w-10/12">
        <input v-model="searchInput" color="jusorot"
          class=" bg-white text-black p-3 rounded-xl shadow-xl border-cool-200 border-2 text-sm focus:outline-none hover:ring hover:ring-beere focus:ring focus:ring-beere focus:scale-105 transition-transform hover:scale-105 duration-300 ease-in-out"
          placeholder="Titel oder Stichwort" @input="handleSearchInput" />

        <!-- Erweiterte Suche -->
        <UAccordion color="cool" variant="link" :items="advancedSearchItems" class="mb-5">
          <template #advanced-search>
            <div v-if="!categoriesPending && !categoriesError">
              <UFormGroup label="Kategorie(n)">
                <USelectMenu v-model="advancedSearch.categories" v-if="categoriesData" :options="categoriesData"
                  multiple searchable>
                  <template #label>
                    <span v-if="advancedSearch.categories.length" class="truncate">
                      {{ advancedSearch.categories.map((category) => `${category.tag} - ${category.name}`).join(", ") }}
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
                  <UInput type="number" v-model="advancedSearch.fromYear" />
                  <span class="text-center self-center">Bis</span>
                  <UInput type="number" v-model="advancedSearch.toYear" />
                </div>
              </UFormGroup>

              <UFormGroup label="Antragsteller*innen">
                <USelectMenu v-model="advancedSearch.applicants" v-if="applicantsData" :options="applicantsData"
                  multiple searchable>
                  <template #label>
                    <span v-if="advancedSearch.applicants.length" class="truncate">
                      {{ advancedSearch.applicants.map((applicant) => applicant.name).join(", ") }}
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

const searchInput = ref(props.modelValue || "");
const advancedSearch = ref({
  categories: <ICategory[]>[],
  applicants: <IApplicant[]>[],
  fromYear: undefined,
  toYear: undefined,
});

const handleSearchInput = (event: Event) => {
  emit("update:modelValue", searchInput.value);
};

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

</script>
