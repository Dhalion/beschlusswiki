<template>
  <div class="flex flex-col items-center mt-10">
    <SharedLoadingSpinner v-if="pending" text="Loading Categories" />

    <!-- Category Cards Container -->
    <div class="bg-white h-full text-black mx-5 sm:w-3/4 items-center grid gap-6 grid-cols-2
                  md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
      <!-- Category Cards -->
      <div v-for="category in categories" :key="category._id" class="flex flex-col h-full">
        <MainCategoryCard :title="category.name" :id="category._id" :tag="category.tag"
          :resolutions="category.resolutions" />
      </div>
    </div>
  </div>
</template>

<script setup>
const search = useSearch();
const config = useRuntimeConfig();

// const cardsContainerWidth = ref(window.innerWidth * .75);


const { data: categories, error, pending, refresh } = useLazyFetch("/category", {
  baseURL: config.public.apiEndpoint,
  transform: (data) => data.categories,
});
</script>
