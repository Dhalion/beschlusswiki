<template>
  <div class="text-black mx-10">
    <h2 class="text-3xl text-slate-600 py-3">Beschlüsse zum Freigeben</h2>

    <div class="bg-slate-800 px-5">
      <UTable :rows="rows" :columns="columns" :empty-state="emptyState" :loading="pending"
        :loading-state="{ icon: 'i-heroicons-arrow-path-20-solid', label: 'Loading...' }" v-model:sort="sort">

        <template #createdBy-data="{ row }: { row: IResolution }">
          {{ row.createdBy instanceof Object ? capitalize((row.createdBy as IUser).username) : "System" }}
        </template>

        <!--* Resolution Date Column  -->
        <template #created-data="{ row }: { row: IResolution }">
          <span>{{ new Date(row.created).toLocaleDateString() }}</span>
        </template>

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
          <UPagination v-model="page" :page-count="pageCount" :total="data?.length ?? 0" />
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
import { PatchActions, type SortObject } from '~/types/Interfaces';
import type { IResolution } from '~/types/models/resolution.schema';
import { ResolutionState } from '~/types/Interfaces';
import capitalize from '~/utilities';
import type { IUser } from '~/types/models/user.schema';

const config = useRuntimeConfig();
const API_ENDPOINT = config.public.apiEndpoint;
const toast = useToast();
const resolutionHandler = useResolutionHandler();

const page = ref(1);
const pageCount = ref(10);

const sort = ref<SortObject>({
  column: "rcode",
  direction: "asc",
});

const rows = computed(() => {
  if (!data.value) return [];

  // Kopiere die Daten, um die Originaldaten nicht zu beeinträchtigen
  let sortedData = [...data.value];
  // Sortiere die Daten gemäß der aktuellen Sortierung
  sortedData.sort((a: Record<string, any>, b: Record<string, any>) => {
    const { column, direction } = sort.value;

    if (typeof a[column] === 'string' && typeof b[column] === 'string') {
      // Sortiere String-Felder
      if (direction === 'asc') {
        return a[column].localeCompare(b[column]);
      } else {
        return b[column].localeCompare(a[column]);
      }
    } else if (column === 'category' && a.body.category && b.body.category) {
      // Sortiere 'body.category' nach dem body.category.tag feld
      if (direction === 'asc') {
        return a.body.category.tag.localeCompare(b.body.category.tag);
      } else {
        return b.body.category.tag.localeCompare(a.body.category.tag);
      }
    } else if (column === "createdBy") {
      // Sortiere nach autor id
      if (!a.createdBy || !b.createdBy) return 0;
      if (direction === 'asc') {
        return a.createdBy.localeCompare(b.createdBy);
      } else {
        return b.createdBy.localeCompare(a.createdBy);
      }
    }
    else {
      // Andere Fälle (z.B. Zahlen, Datum), keine Sortierung
      return 0;
    }
  });

  // Paginiere die sortierten Daten
  const startIndex = (page.value - 1) * pageCount.value;
  const endIndex = page.value * pageCount.value;
  return sortedData.slice(startIndex, endIndex);
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
