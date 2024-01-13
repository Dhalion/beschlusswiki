<template>
    <UAlert>
        <template #title>
            <h3 class="text-xl font-bold">Index nicht gefunden</h3>
        </template>
        <template #description>
            <p>Der Index <strong>{{ indexName }}</strong> ist nicht vorhanden. Soll dieser erstellt werden?</p>
            <UButton @click="req.execute()" color="primary" icon="i-heroicons-plus-circle" class="mt-3" disabled>
                Erstellen
            </UButton>
            <UAlert v-if="req.error.value" title="Fehler" color="red" variant="solid"
                icon="i-heroicons-exclamation-triangle" class="mt-2"
                :description="req.error.value.statusCode + req.error?.value?.message || 'N/A'" />
        </template>

    </UAlert>
</template>

<script setup lang="ts">
const config = useRuntimeConfig();
const indexName = ref(config.public.elasticIndex);


const req = await useFetch("/api/elastic/createIndex", {
    method: "POST",
    immediate: false,
    params: {
        index: indexName,
    },
    headers: {
        "Content-Type": "application/json",
    },
});



</script>
