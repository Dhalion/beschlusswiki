<template>
  <div class="bg-hellrosa text-beere flex justify-center justify-self-center place-items-center w-full">
    <div class="flex flex-col items-center xl:p-10 p-5">
      <span class="font-black xl:text-8xl text-4xl xl:pb-4">{{
        resolution.body.tag
      }}</span>
      <span class="font-black xl:text-6xl text-2xl">{{
        resolution.body.year
      }}</span>
    </div>
    <div class="w-3/4 xl:p-1 font-bold xl:text-4xl text-lg xl:line-clamp-3 xl:text-clip xl:pr-4">
      {{ resolution.body.title }}
    </div>
  </div>

  <!-- Category and Origin Bar -->
  <div class="bg-beere flex justify-between items-center p-1 px-3 h-6">
    <span class="text-xs font-sans text-white antialiased" v-if="category?.name">
      <NuxtLink :to="`/category?id=${category?._id}`" class="hover:underline">
        {{ category?.name }}
      </NuxtLink>
    </span>
    <span v-for="applicant in applicants"
      class="px-3 my-1 py-1 bg-hellrosa text-beere rounded-full text-sm tracking-wide">Bayern</span>
  </div>

  <!-- Resolution not live Warning -->
  <div v-if="warningMessage"
    class="bg-red-600 flex p-3 my-5 border-slate-400 text-white font-semibold tracking-widest justify-center">
    {{ warningMessage }}
  </div>
</template>

<script setup lang="ts">

import type { ICategory } from '~/types/models/category.schema';
import type { IResolution } from '~/types/models/resolution.schema';

const { resolution } = defineProps({
  resolution: {
    type: Object as PropType<IResolution>,
    required: true,
  },
});

const warningMessage = computed(() => {
  switch (resolution.state) {
    case "staged":
      return "Dieser Beschluss wurde noch nicht freigegeben!";
    case "archived":
      return "Dieser Beschluss ist archiviert!";
    case "live":
      return "";
    default:
      return "";
  }
});

const category = computed(() => {
  if (resolution.body.category === null) {
    return null;
  } else
    if ("name" in resolution.body.category) {
      return resolution.body.category;
    } else {
      return null;
    }
});


const applicants = () => {
  resolution.body.applicants.forEach((applicant) => {
    return applicant;
  });
};
</script>
