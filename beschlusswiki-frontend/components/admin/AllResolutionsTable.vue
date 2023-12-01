<template>
  <div class="text-black">
    <div class="bg-slate-800 px-5 mx-10">
      <UTable :rows="rows" :columns="columns" :empty-state="emptyState" :loading="pending"
        :loading-state="{ icon: 'i-heroicons-arrow-path-20-solid', label: 'Loading...' }">
        <!--* Resolution State Column  -->
        <template #state-data="{ row }">
          <!-- Dropdown to select staged/live -->
          <UDropdown :items="stateOptions(row)" :popper="{ placement: 'bottom-start' }">
            <UButton color="white" variant="solid" :label="row.state" trailing-icon="i-heroicons-chevron-down-20-solid"
              size="xs">
            </UButton>
          </UDropdown>
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

<script setup>
const config = useRuntimeConfig();
const API_ENDPOINT = config.public.apiEndpoint;
const taost = useToast();

const resolutions = computed(() => {
  // Transform the date to a readable format
  if (pending.value || error.value) return [];
  return data.value.map((resolution) => {
    const transformedResolution = { ...resolution };
    transformedResolution.created = new Date(resolution.created).toLocaleString(
      "de-DE",
      {
        dateStyle: "short",
        timeStyle: "short",
      },
    );
    return transformedResolution;
  });
});

const page = ref(1);
const pageCount = ref(10);

const rows = computed(() => {
  return resolutions.value.slice(
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
  { key: "created", label: "Erstellt", sortable: true },
  { key: "body.title", label: "Titel", sortable: true },
  { key: "actions", label: "Aktionen", sortable: false },
];

const stateOptions = (row) => [[{ label: "Staged" }, { label: "Live" }]];

const { data, error, pending, refresh } = useLazyFetch("/resolution", {
  baseURL: API_ENDPOINT,
  onRequestError: (err) => {
    taost.add({
      timeout: 8000,
      title: "Fehler beim Laden der Beschlüsse",
      description: `Fehler: ${err.error.name} - ${err.error.message}`,
      variant: "danger",
    });
  },
});

const emptyState = computed(() => {
  if (error.value) return { icon: 'i-heroicons-exclamation-triangle', label: 'Fehler beim Laden.' };
  else return { icon: 'i-heroicons-circle-stack-20-solid', label: 'No items.' };
});

</script>
