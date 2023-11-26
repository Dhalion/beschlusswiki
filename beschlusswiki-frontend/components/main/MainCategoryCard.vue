<template>
  <NuxtLink :to="destination" class="bg-creme rounded-3xl shadow-lg p-4 flex flex-col text-center h-full">

    <div class="h-3/4 flex justify-center align-top p-2">
      <img src="../../assets/work-in-progress.png" class="w-1/2" :alt="props.title" />
    </div>

    <h2 class="text-gray-800 font-bold text-xs sm:text-sm lg:text-lg  mb-2 h-1/4 px-2">
      {{ props.title }}
    </h2>

    <span class="text-gray-500 text-sm font-light h-full flex justify-center items-end">
      {{ props.resolutions.length }} Beschlüsse
    </span>
  </NuxtLink>
</template>

<script setup>
// Props: Title and Img Source and no. of entries and ID
const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  tag: {
    type: String,
  },
  id: {
    type: String,
    required: true,
  },
  resolutions: {
    type: Array,
    required: true,
  },
});

const destination = computed(() => `/category?id=${props.id}`);


</script>
