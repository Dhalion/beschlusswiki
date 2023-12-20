<template>
  <div class="text-black">
    <div class="bg-slate-800 px-5 mx-10">
      <UTable :rows="rows" :columns="columns" :empty-state="emptyState" :loading="pending"
        :loading-state="{ icon: 'i-heroicons-arrow-path-20-solid', label: 'Loading...' }">

        <!--* ACTIONS COLUMN  -->
        <template #actions-data="{ row }: { row: IResolution }">
          <div class="flex justify-start gap-x-5 text-lg">
            <NuxtLink :to="`/resolution/${row._id}`">
              <UIcon name="i-heroicons-eye" />
            </NuxtLink>

            <NuxtLink class="hover:cursor-pointer">
              <UIcon name=" i-heroicons-check" @click="handleAcceptResolution(row._id.toString())" />
            </NuxtLink>

            <NuxtLink class="hover:cursor-pointer">
              <UIcon name=" i-heroicons-no-symbol" @click="handleRejectResolution(row._id.toString())" />
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
          <UPagination v-model="page" :page-count="pageCount" :total="data?.length" />
        </div>
        <div class="flex justify-end p-3">
          <span class="text-gray-400 pr-3 text-sm pt-1">Einträge pro Seite:</span>
          <USelect v-model="pageCount" :options="[10, 20, 50, 100]" />
        </div>
      </div>
    </div>
  </div>
  <UNotifications />
</template>

<script setup lang="ts">
import { PatchActions } from '~/types/Interfaces';
import type { IResolution } from '~/types/models/resolution.schema';
import { ResolutionState } from '~/types/Interfaces';

const config = useRuntimeConfig();
const API_ENDPOINT = config.public.apiEndpoint;
const toast = useToast();
const resolutionHandler = useResolutionHandler();

const page = ref(1);
const pageCount = ref(10);

const rows = computed(() => {
  if (pending.value || error.value || !data.value) return [];
  return data.value.slice(
    (page.value - 1) * pageCount.value,
    page.value * pageCount.value,
  );
});

const columns = [
  { key: "rid", label: "rid", sortable: true },
  { key: "rcode", label: "rcode", sortable: true },
  { key: "body.year", label: "Jahr", sortable: true },
  { key: "body.tag", label: "Tag", sortable: true },
  { key: "createdBy", label: "Autor", sortable: true },
  { key: "created", label: "Erstellt", sortable: true },
  { key: "body.title", label: "Titel", sortable: true },
  { key: "actions", label: "Aktionen", sortable: false },
];


const { data, error, pending, refresh } = useLazyFetch<IResolution[]>("/resolution", {
  baseURL: API_ENDPOINT,
  query: {
    filter: ResolutionState.Staged
  },
  onRequestError: (err) => {
    toast.add({
      timeout: 8000,
      title: "Fehler beim Laden der Beschlüsse zum Freigeben",
      description: `${err.error.message}`,
    });
  },
  onResponseError: (err) => {
    toast.add({
      timeout: 8000,
      title: "Fehler beim Laden der Beschlüsse zum Freigeben",
      description: `${err?.error?.message}`,
    });
  },
});

const emptyState = computed(() => {
  if (error.value) return {
    icon: 'i-heroicons-exclamation-triangle',
    label: 'Fehler beim Laden.'
  };
  else return { icon: 'i-heroicons-circle-stack-20-solid', label: 'No items.' };
});

const handleAcceptResolution = async (id: string) => {
  if (! await resolutionHandler.ensureSession()) return;
  resolutionHandler.handleResolutionState(id, PatchActions.ACCEPT);
  refresh();
};

const handleRejectResolution = async (id: string) => {
  if (! await resolutionHandler.ensureSession()) return;
  resolutionHandler.handleResolutionState(id, PatchActions.REJECT);
  refresh();
};
</script>
