<template>
    <div class="text-black mx-10">
        <h2 class="text-3xl text-slate-600 py-3">Alle Beschlüsse</h2>
        <div class="bg-slate-800 px-5">
            <UTable :rows="rows" :columns="columns" :empty-state="emptyState" :loading="pending"
                :loading-state="{ icon: 'i-heroicons-arrow-path-20-solid', label: 'Loading...' }">

                <!--* Resolution Category Column  -->
                <template #category-data="{ row }">
                    <UBadge color="amber" v-if="row.body.category?.tag">
                        {{ row.body.category.tag }} - {{ row.body.category.name }}
                    </UBadge>
                    <span v-else>null</span>
                </template>

                <!--* Resolution Date Column  -->
                <template #created-data="{ row }">
                    <span>{{ new Date(row.created).toLocaleDateString() }}</span>
                </template>

                <!--* Resolution State Column  -->
                <template #state-data="{ row }: { row: IResolution }">
                    <!-- Dropdown to select staged/live -->
                    <UDropdown :items="stateOptions(row._id.toString(), row.state)" :popper="{ placement: 'bottom-start' }">
                        <UButton color="white" variant="solid" :label="capitalize(row.state)"
                            trailing-icon="i-heroicons-chevron-down-20-solid" size="xs">
                        </UButton>
                        <template #actions-item="{ item }">
                            <UButton color="white" variant="solid" :label="capitalize(item.label)" :icon="item.icon"
                                size="xs" @click="console.log('foo')" />
                        </template>
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
                            <UPopover v-model="confirmationPopup">
                                <UIcon name="i-heroicons-trash" />
                                <template #panel="{ close }">
                                    <AdminConfirmationPopup @confirm="handleDeleteResolution(row); close();"
                                        @cancel="close();" title="Beschluss löschen?" />
                                </template>
                            </UPopover>
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

import { ResolutionState, resolutionStateToPatchAction } from '~/types/Interfaces';
import type { ICategory } from '~/types/models/category.schema';
import type { IResolution } from '~/types/models/resolution.schema';


const config = useRuntimeConfig();
const API_ENDPOINT = config.public.apiEndpoint;
const toast = useToast();
const router = useRouter();
const route = useRoute();

const page = ref(1);
const pageCount = ref(10);
const confirmationPopup = ref(false);
const resolutionHandler = useResolutionHandler();

const { getSession, token } = useAuth();

// Ensure JWT is valid
const session = await getSession({ required: true });
if (!session) {
    toast.add({
        title: "Fehler beim Speichern",
        description: "Deine Sitzung ist abgelaufen. Bitte melde dich erneut an.",
        icon: "i-heroicons-exclamation-triangle",
        actions: [
            {
                label: "Anmelden",
                click: () => router.push(`/admin/login?redirect=${route.fullPath}`),
            }],
    });
}


const rows = computed(() => {
    if (!data.value) return [];
    return data.value.slice(
        (page.value - 1) * pageCount.value,
        page.value * pageCount.value,
    );
});

const columns = [
    { key: "rcode", label: "rcode", sortable: true },
    { key: "body.year", label: "Jahr", sortable: true },
    { key: "body.tag", label: "Tag", sortable: true },
    { key: "createdBy", label: "Autor", sortable: true },
    { key: "category", label: "Kategorie", sortable: true },
    { key: "created", label: "Erstellt", sortable: true },
    { key: "body.title", label: "Titel", sortable: true },
    { key: "state", label: "state", sortable: true },
    { key: "actions", label: "Aktionen", sortable: false },
];


const stateOptions = (id: string, state: ResolutionState) => {
    return [[
        {
            label: "Staged", icon: "i-heroicons-document-arrow-up",
            click: () => { handleChangeResolutionState(id, ResolutionState.Staged) },
            disabled: ResolutionState.Staged === state
        },
        {
            label: "Live", icon: "i-heroicons-clipboard-document-check",
            click: () => { handleChangeResolutionState(id, ResolutionState.Live) },
            disabled: ResolutionState.Live === state
        },
        {
            label: "Archived", icon: "i-heroicons-archive-box",
            click: () => { handleChangeResolutionState(id, ResolutionState.Archived) },
            disabled: ResolutionState.Archived === state
        },
        {
            label: "Rejected", icon: "i-heroicons-x-circle",
            click: () => { handleChangeResolutionState(id, ResolutionState.Rejected) },
            disabled: ResolutionState.Rejected === state
        },
    ]]
};

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
    if (error.value) return {
        icon: 'i-heroicons-exclamation-triangle',
        label: 'Fehler beim Laden.'
    };
    else return {
        icon: 'i-heroicons-circle-stack-20-solid',
        label: 'No items.'
    };
});



const capitalize = (str: string) => {
    if (typeof str !== "string") return "";
    if (str.length < 1) return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
};



const handleDeleteResolution = (async (resolution: IResolution) => {

    const { data: deleteData, error: deleteError } = await useLazyFetch("/resolution", {
        method: "DELETE",
        baseURL: API_ENDPOINT,
        headers: {
            "Authorization": `${token.value}`,
        },
        query: {
            id: resolution._id,
        },
    });

    if (deleteError.value) {
        toast.add({
            title: "Fehler beim Löschen des Beschlusses",
            description: `Fehler: ${deleteError.value?.statusCode} - ${deleteError.value?.statusMessage}`,
            timeout: 8000,
        });
    } else {
        toast.add({
            title: "Beschluss gelöscht",
            description: `Beschluss ${resolution._id} wurde erfolgreich gelöscht.`,
            timeout: 8000,
        });
    }
    refresh();

});

const handleChangeResolutionState = async (id: string, state: ResolutionState) => {
    console.log(`Changing state of ${id} to ${state}`);
    if (! await resolutionHandler.ensureSession()) return;
    resolutionHandler.handleResolutionState(id, resolutionStateToPatchAction[state]);
    refresh();
}

</script>
