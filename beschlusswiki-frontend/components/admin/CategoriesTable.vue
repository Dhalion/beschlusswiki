<template>
    <div class="bg-slate-800 px-5 mx-10 text-black">
        <UTable :rows="tableRows" :columns="tableColumns" :loading="pending"
            :loading-state="{ icon: 'i-heroicons-arrow-path-20-solid', label: 'Loading...' }" :empty-state="emptyState">

        </UTable>

        <div class="flex flex-row justify-between pt-5 items-center ">
            <div class="flex gap-3">
                <UButton label="Aktualisieren" variant="solid" color="primary" icon="i-heroicons-arrow-path"
                    @click="refresh()" />
            </div>
            <div class="flex justify-center">
                <UPagination v-model="tablePage" :page-count="tablePageCount" :total="data?.categories.length" />
            </div>
            <div class="flex justify-end p-3">
                <span class="text-gray-400 pr-3 text-sm pt-1">Einträge pro Seite:</span>
                <USelect v-model="tablePageCount" :options="[10, 20, 50, 100]" />
            </div>
        </div>
    </div>
    <UNotifications />
</template>

<script setup lang="ts">

const config = useRuntimeConfig();
const API_ENDPOINT = config.public.apiEndpoint;
const toast = useToast();

const tablePage = ref(1);
const tablePageCount = ref(10);

interface Category {
    _id: string;
    name: string;
    tag: string;
    resolutions: string[];
}

interface ICategoriesData {
    categories: Category[];
}

const { data, error, pending, refresh } = useLazyFetch<ICategoriesData>("/category", {
    baseURL: API_ENDPOINT,
    onRequestError: (error) => {
        toast.add({
            title: "Fehler beim Laden der Benutzer",
            description: error.error.message,
            icon: "i-heroicons-exclamation-triangle",
        });
    },
    onResponseError: (error) => {
        toast.add({
            title: "Fehler beim Laden der Benutzer",
            description: error.error?.message,
            icon: "i-heroicons-exclamation-triangle",
        });
    },
})

const emptyState = computed(() => {
    if (error.value) return {
        icon: 'i-heroicons-exclamation-triangle',
        label: 'Fehler beim Laden.'
    };
    else return {
        icon: 'i-heroicons-circle-stack-20-solid',
        label: 'No items.'
    };
});

const tableRows = computed(() => {
    if (!data.value?.categories) return [];
    if (data.value?.categories.length === 0) return [];
    if (error.value) {
        toast.add({
            title: "Fehler beim Laden der Kategorien",
            description: error.value.message,
            icon: "i-heroicons-exclamation-triangle",
        });
    }

    return data.value.categories.slice(
        (tablePage.value - 1) * tablePageCount.value,
        tablePage.value * tablePageCount.value,
    );
});

const tableColumns = [
    { key: "_id", label: "ID", sortable: true },
    { key: "name", label: "Name", sortable: true },
    { key: "tag", label: "Tag", sortable: true },
    { key: "actions", label: "Aktionen", sortable: false },
]

</script>