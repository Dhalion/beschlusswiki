<template>
  <div class="flex flex-col items-center mt-10">
    <SharedLoadingSpinner v-if="pending" text="Loading Categories" />
    <UAlert icon="i-heroicons-information-circle" title="Fehler beim Laden der Kategorien" :description="error.message"
      variant="solid" color="primary" v-if="error" class="w-2/3" />

    <UAlert icon="i-heroicons-information-circle" title="Keine Kategorien gefunden" :description="error?.message"
      variant="solid" color="primary" v-if="!pending && !categories" class="w-2/3" />
    <!-- Category Cards Container -->
    <div class="h-full text-black mx-5 items-center grid gap-6 grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4
      2xl:grid-cols-5" v-if="categories && !error">
      <!-- Category Cards -->
      <div v-for="category in categories" class="flex flex-col h-full">
        <MainCategoryCard :title="category.name" :id="category._id.toString()" :tag="category.tag"
          :resolutions="category.resolutions" />

      </div>
    </div>
  </div>
  <UNotifications />
</template>

<script setup lang="ts">

import type { ICategory } from '~/types/models/category.schema';

const config = useRuntimeConfig();
const toast = useToast();
// const cardsContainerWidth = ref(window.innerWidth * .75);


const { data: categories, error, pending, refresh } = useFetch<ICategory[]>("/api/category", {
  baseURL: config.public.apiEndpoint,
  onResponseError(err) {
    toast.add({
      title: "Fehler beim Laden der Kategorien",
      description: err?.error?.message || "Unbekannter Fehler",
      icon: "i-heroicons-error"
    });
  },
});
</script>
