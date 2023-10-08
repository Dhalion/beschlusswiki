<template>
    <div class="text-black">
        <div class="bg-slate-800 w-2/3 mx-auto">
            <UTable :rows="rows" :columns="columns">
                <template #actions-data="{ row }">
                    <div class="flex justify-center">
                        <NuxtLink :to="`/resolution/${row._id}`" class="text-slate-500 hover:text-slate-700">Details
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
    return data.value.map((resolution) => {
        const transformedResolution = { ...resolution };
        transformedResolution.created = new Date(resolution.created)
            .toLocaleString("de-DE", {
                dateStyle: "short",
                timeStyle: "short",
            });
        return transformedResolution;
    });
});

const page = ref(1);
const pageCount = ref(10);

const rows = computed(() => {
    return resolutions.value.slice(
        (page.value - 1) * pageCount.value, page.value * pageCount.value);
});

const columns = [
    { key: 'rid', label: 'rid' },
    { key: "state", label: "Status" },
    { key: "rcode", label: "rcode" },
    { key: "body.year", label: "Jahr" },
    { key: "body.tag", label: "Tag" },
    { key: "createdBy", label: "Autor" },
    { key: "created", label: "Erstellt" },
    { key: "body.title", label: "Titel" },
    { key: "actions" }
]

const people = [{ id: 1, name: 'Lindsay Walton', title: 'Front-end Developer', email: 'lindsay.walton@example.com', role: 'Member' }, { id: 2, name: 'Courtney Henry', title: 'Designer', email: 'courtney.henry@example.com', role: 'Admin' }, { id: 3, name: 'Tom Cook', title: 'Director of Product', email: 'tom.cook@example.com', role: 'Member' }, { id: 4, name: 'Whitney Francis', title: 'Copywriter', email: 'whitney.francis@example.com', role: 'Admin' }, { id: 5, name: 'Leonard Krasner', title: 'Senior Designer', email: 'leonard.krasner@example.com', role: 'Owner' }, { id: 6, name: 'Floyd Miles', title: 'Principal Designer', email: 'floyd.miles@example.com', role: 'Member' }]

const { data, error, pending } = useFetch(API_ENDPOINT + '/resolution', {

});
</script>
