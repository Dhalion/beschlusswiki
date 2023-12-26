<template>
  <UCard class="mt-5 text-slate-100">
    <template #header>
      <div class="flex items-center">
        <h3 class="font-bold text-2xl dark:text-slate-100 text-slate-500">{{ title }}</h3>
        <UIcon name="i-heroicons-arrow-path" class="text-2xl text-slate-100 ml-2 hover:cursor-pointer"
          @click="refresh()" />
      </div>
    </template>
    <span v-if="pending">Loading...</span>
    <span v-if="error">Error: {{ error.message }}</span>
    <span v-if="!pending && data?.length == 0">No data</span>
    <ul>
      <li v-for="item in data" :key="item._id.toString()" v-if="data && !error && !pending" class="mb-2">
        <UBadge size="xs" :color="resolutionStateColors[item.state]" class="mr-2">{{ capitalizeFirstLetter(item.state) }}
        </UBadge>
        <NuxtLink :to="`/resolution/${item._id}`">
          {{ item.rcode }} - {{ item.body.title }}
        </NuxtLink>
      </li>
    </ul>
  </UCard>
</template>

<script lang="ts" setup>

import { AdminDashboardResolutionsDisplay, ResolutionState } from "~/types/Interfaces";
import type { IResolution } from "~/types/models/resolution.schema";

const config = useRuntimeConfig()

const props = defineProps({
  display: Object as PropType<AdminDashboardResolutionsDisplay>,
});

const title = computed(() => {
  switch (props.display) {
    case AdminDashboardResolutionsDisplay.NEW:
      return "Neue Beschlüsse";
    case AdminDashboardResolutionsDisplay.MY:
      return "Meine Beschlüsse";
    case AdminDashboardResolutionsDisplay.STAGED:
      return "Beschlüsse zum Freigeben";
  }
});

const resolutionStateColors: Record<ResolutionState, string> = {
  [ResolutionState.Live]: "green",
  [ResolutionState.Staged]: "yellow",
  [ResolutionState.Rejected]: "amber",
  [ResolutionState.Archived]: "grey",
};

const { data, pending, error, refresh } = await useFetch<IResolution[]>('/resolution', {
  baseURL: config.public.apiEndpoint,
  params: {
    dashDisplay: props.display,
  },
})

function capitalizeFirstLetter(string: string) {
  return string[0].toUpperCase() + string.slice(1);
}

</script>
