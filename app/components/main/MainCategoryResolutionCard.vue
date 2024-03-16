<template>
  <NuxtLink :href="resolutionUrl"
    class="w-full flex mx-auto bg-white rounded-xl shadow-md hover:shadow-xl overflow-hidden p-3">
    <!-- Resolution Tag and Year -->
    <div class="xl:w-1/12 w-1/12 mr-3 flex flex-col text-center text-2xl xl:text-3xl text-slate-700">
      <span>{{ resolution?.body?.tag }}</span>
    </div>
    <!-- Resolution Title -->
    <div class="flex flex-col w-full items-start">
      <span class="text-xs text-slate-500">{{ resolution?.body?.year }}</span>
      <span> {{ resolution?.body?.title }} </span>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import type { IResolution } from '~/types/models/resolution.schema';

const config = useRuntimeConfig();
const toast = useToast();

const props = defineProps({
  resolution: {
    type: Object as PropType<IResolution>,
    required: true,
  },
});

const resolutionUrl = computed(() => `/resolution/${props.resolution._id}`);

</script>
