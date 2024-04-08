<template>
  <div class="flex gap-5 p-3">
    <UCard class="w-1/3">
      <template #header>
        <div class="flex items-center">
          <h2 class="text-xl font-bold">Elasticsearch Status</h2>
          <UIcon name="i-heroicons-arrow-path"
            class="text-2xl text-slate-500 dark:text-slate-100 ml-2 hover:cursor-pointer" @click="esRefresh()" />
        </div>
      </template>
      <UAlert v-if="esError" title="Verbindungsfehler" color="amber" variant="solid"
        icon="i-heroicons-exclamation-triangle" :description="esError.message || 'N/A'" />
      <UTable :rows="esStatusRows" :empty-state="{ icon: 'i-heroicons-circle-stack-20-solid', label: 'No items.' }" />
    </UCard>

    <UCard class="w-2/3">
      <template #header>
        <div class="flex items-center">
          <h2 class="text-xl font-bold">{{ INDEX_NAME }} Index</h2>
          <UIcon name="i-heroicons-arrow-path"
            class="text-2xl text-slate-500 dark:text-slate-100 ml-2 hover:cursor-pointer" @click="indexRefresh()" />
        </div>
      </template>
      <UAlert v-if="indexError && indexError.statusCode != 404" title="Verbindungsfehler" color="amber" variant="solid"
        icon="i-heroicons-exclamation-triangle" :description="indexError.message || 'N/A'" />
      <AdminElasticCreateIndex v-if="indexError?.statusCode == 404" />
      <UAlert v-if="indexPending" title="Lade Daten" color="blue" variant="solid"
        icon="i-heroicons-information-circle" />
      <UAlert v-if="indexData?.statusCode == 204 && !indexPending" title="Index leer" color="amber" variant="solid"
        icon="i-heroicons-exclamation-triangle" />

      <UAlert v-if="indexData?.statusCode == 200 && !indexPending" title="Index verfügbar" color="green" variant="solid"
        icon="i-heroicons-check-circle" />
      <div class="text-lg mt-2" v-if="indexData && !indexPending">
        <p class="text-2xl font-semibold">Indizierte Dokumente: <span class="font-bold">
            {{ indexData?.data?.count }}
          </span>
        </p>
        <p>Shards Erfolgreich:
          <span class="font-bold">
            {{ indexData?.data._shards.successful }}
          </span>
        </p>
        <p>Shards Übersprugen:
          <span class="font-bold">
            {{ indexData?.data._shards.skipped }}
          </span>
        </p>
        <p>Shards Fehlgeschlagen:
          <span class="font-bold">
            {{ indexData?.data._shards.failed }}
          </span>
        </p>
      </div>

    </UCard>
  </div>
</template>

<script lang="ts" setup>
import type { ElasticStatusResponse, ElasticIndexInfoResponse } from '~/types/Interfaces';


definePageMeta({
  middleware: "authentication",
  layout: "admin",
});

const config = useRuntimeConfig();

const INDEX_NAME = config.public.elasticIndex;

const { data: esData, error: esError, refresh: esRefresh, pending: esPending, status: esStatus } =
  useFetch<ElasticStatusResponse>("/api/elastic/esStatus", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

const { data: indexData, error: indexError, pending: indexPending, refresh: indexRefresh } =
  useFetch<ElasticIndexInfoResponse>("/api/elastic/indexInfo", {
    method: "GET",
    params: {
      index: INDEX_NAME,
    },
    headers: {
      "Content-Type": "application/json",
    },
  });

const esStatusRows = computed(() => [
  {
    parameter: "Cluster Name",
    value: esData.value?.cluster_name ?? "N/A",
  },
  {
    parameter: "Status",
    value: esData.value?.status ?? "N/A",
  },
  {
    parameter: "Number of Nodes",
    value: esData.value?.number_of_nodes ?? "N/A",
  },
  {
    parameter: "Number of Data Nodes",
    value: esData.value?.number_of_data_nodes ?? "N/A",
  },
  {
    parameter: "Active Primary Shards",
    value: esData.value?.active_primary_shards ?? "N/A",
  },
  {
    parameter: "Active Shards",
    value: esData.value?.active_shards ?? "N/A",
  },
  {
    parameter: "Relocating Shards",
    value: esData.value?.relocating_shards ?? "N/A",
  },
  {
    parameter: "Initializing Shards",
    value: esData.value?.initializing_shards ?? "N/A",
  },
  {
    parameter: "Unassigned Shards",
    value: esData.value?.unassigned_shards ?? "N/A",
  },
  {
    parameter: "Delayed Unassigned Shards",
    value: esData.value?.delayed_unassigned_shards ?? "N/A",
  },
  {
    parameter: "Number of Pending Tasks",
    value: esData.value?.number_of_pending_tasks ?? "N/A",
  },
  {
    parameter: "Number of In Flight Fetch",
    value: esData.value?.number_of_in_flight_fetch ?? "N/A",
  },
  {
    parameter: "Task Max Waiting in Queue",
    value: esData.value?.task_max_waiting_in_queue_millis ?? "N/A",
  },
  {
    parameter: "Active Shards Percent",
    value: esData.value?.active_shards_percent_as_number ?? "N/A",
  },
]);


</script>
