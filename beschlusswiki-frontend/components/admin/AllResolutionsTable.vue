<template>
  <div class="text-black">
    <div class="bg-slate-800 px-5 mx-10">
      <UTable :rows="rows" :columns="columns" :empty-state="emptyState" :loading="pending"
        :loading-state="{ icon: 'i-heroicons-arrow-path-20-solid', label: 'Loading...' }">
        <!--* Resolution State Column  -->
        <template #state-data="{ row }">
          <!-- Dropdown to select staged/live -->
          <UDropdown :items="stateOptions" :popper="{ placement: 'bottom-start' }">
            <UButton color="white" variant="solid" :label="capitalize(row.state)"
              trailing-icon="i-heroicons-chevron-down-20-solid" size="xs">
            </UButton>
            <template #actions-item="{ item }">
              <UButton color="white" variant="solid" :label="capitalize(item.label)" :icon="item.icon" size="xs"
                @click="handleResolutionStateChange(row, item.label)" />
            </template>
          </UDropdown>
        </template>

        <!--* Resolution Category Column  -->
        <template #category-data="{ row }">
          <UBadge color="amber" v-if="row.body.category?.tag">
            {{ row.body.category.tag }} - {{ row.body.category.name }}
          </UBadge>
          <span v-else>null</span>
        </template>

        <!--* ACTIONS COLUMN  -->
        <template #actions-data="{ row }">
          <div class="flex justify-start gap-x-5 text-lg">
            <NuxtLink :to="`/resolution/${row._id}`">
              <UIcon name="i-heroicons-eye" />
            </NuxtLink>

            <NuxtLink :to="`/edit?id=${row._id}`">
              <UIcon name=" i-heroicons-pencil" />
            </NuxtLink>

            <NuxtLink class="hover:cursor-pointer">
              <UIcon name="i-heroicons-trash" />
            </NuxtLink>
          </div>
        </template>
      </UTable>

      <div class="flex flex-row justify-between pt-5 items-center ">
        <div class="flex gap-3">
          <UButton label="Aktualisieren" variant="solid" color="primary" icon="i-heroicons-arrow-path"
            @click="refresh()" />
          <UButton label="Neuer Beschluss" variant="solid" color="primary" icon="i-heroicons-plus"
            to="/resolution/create" />
        </div>
        <div class="flex justify-center">
          <UPagination v-model="page" :page-count="pageCount" :total="data?.length || 0" />
        </div>
        <div class="flex justify-end p-3">
          <span class="text-gray-400 pr-3 text-sm pt-1">Einträge pro Seite:</span>
          <USelect v-model="pageCount" :options="pagePaginationOptions" />
        </div>
      </div>
    </div>
  </div>
  <UNotifications />
</template>

<script setup lang="ts">

import { ResolutionState } from '~/types/Interfaces';
import type { ICategory } from '~/types/models/category.schema';
import type { IResolution } from '~/types/models/resolution.schema';

const config = useRuntimeConfig();
const API_ENDPOINT = config.public.apiEndpoint;
const toast = useToast();


const page = ref(1);
const pageCount = ref(10);

const rows = computed(() => {
  if (!data.value) return [];
  return data.value.slice(
    (page.value - 1) * pageCount.value,
    page.value * pageCount.value,
  );
});

const columns = [
  { key: "rid", label: "rid", sortable: true },
  { key: "state", label: "state", sortable: true },
  { key: "rcode", label: "rcode", sortable: true },
  { key: "body.year", label: "Jahr", sortable: true },
  { key: "body.tag", label: "Tag", sortable: true },
  { key: "createdBy", label: "Autor", sortable: true },
  { key: "category", label: "Kategorie", sortable: true },
  { key: "created", label: "Erstellt", sortable: true },
  { key: "body.title", label: "Titel", sortable: true },
  { key: "actions", label: "Aktionen", sortable: false },
];


const stateOptions = [[
  { label: "Staged", icon: "i-heroicons-document-arrow-up" },
  { label: "Live", icon: "i-heroicons-clipboard-document-check" },
  { label: "Archived", icon: "i-heroicons-document-minus" },
]];

const pagePaginationOptions = [10, 20, 50, 100];

const { data, error, pending, refresh } = useLazyFetch<IResolution[]>("/resolution", {
  query: {
    category: true,
  },
  baseURL: API_ENDPOINT,
  onRequestError: (err) => {
    toast.add({
      timeout: 8000,
      title: "Fehler beim Laden der Beschlüsse",
      description: `Fehler: ${err.error.name} - ${err.error.message}`,
    });
  },
});

const { data: categories } = useLazyFetch<ICategory[]>("/category", {
  baseURL: API_ENDPOINT,
  onResponseError: (err) => {
    toast.add({
      timeout: 8000,
      title: "Fehler beim Laden der Kategorien",
      description: `Fehler: ${err?.error?.name} - ${err?.error?.message}`,
    });
  },
});

const emptyState = computed(() => {
  if (error.value) return { icon: 'i-heroicons-exclamation-triangle', label: 'Fehler beim Laden.' };
  else return { icon: 'i-heroicons-circle-stack-20-solid', label: 'No items.' };
});

const categoriesItems = computed(() => {
  if (categories.value) {
    return categories.value.map((category: ICategory) => {
      return { label: `${category.tag} - ${category.name}` };
    });
  }
});

const capitalize = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const handleResolutionStateChange = ((resolution: IResolution, newState: ResolutionState) => {
  console.log(resolution._id, newState);
});

</script>
