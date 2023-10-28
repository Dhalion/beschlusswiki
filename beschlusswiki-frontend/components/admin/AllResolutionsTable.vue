<template>
  <div class="text-black">
    <div class="bg-slate-800 px-5 mx-10">
      <UTable :rows="rows" :columns="columns"
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

      <div class="flex flex-col pt-5">
        <div class="flex justify-center">
          <UPagination v-model="page" :page-count="pageCount" :total="resolutions.length" />
        </div>
        <div class="flex justify-end p-3">
          <span class="text-gray-400 pr-3 text-sm pt-1">Einträge pro Seite:</span>
          <USelect v-model="pageCount" :options="[10, 20, 50, 100]" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const config = useRuntimeConfig();
const API_ENDPOINT = config.public.apiEndpoint;

const resolutions = computed(() => {
  // Transform the date to a readable format
  return pending.value ? [] : data.value.map((resolution) => {
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

const { data, error, pending } = useFetch(API_ENDPOINT + "/resolution", {});
</script>
