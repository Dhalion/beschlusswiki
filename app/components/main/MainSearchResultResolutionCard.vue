<template>
  <NuxtLink :href="resolutionUrl"
    class="w-full flex mx-auto bg-white dark:bg-slate-700 dark:shadow-gray-800 rounded-xl shadow-md hover:shadow-xl overflow-hidden p-3">
    <!-- Resolution Tag and Year -->
    <div class="xl:w-1/12 md:w-2/12 w-3/12 mr-3 flex flex-col text-2xl xl:text-3xl text-slate-700 dark:text-slate-200">
      <span class="my-auto self-center">{{ resolution?.tag }}</span>
    </div>
    <!-- Resolution Title -->
    <div class="flex flex-col w-full items-start">
      <span class="text-xs text-slate-500 dark:text-slate-400">{{ resolution?.year }}</span>
      <span class="text-slate-800 dark:text-slate-200"> {{ resolution?.title }} </span>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import { type ISimpleResolution } from '~/types/Interfaces';



const config = useRuntimeConfig();
const toast = useToast();

const props = defineProps({
  resolution: {
    type: Object as PropType<ISimpleResolution>,
    required: true,
  },
});


const resolutionUrl = computed(() => `/resolution/${props.resolution._id}`);
</script>
