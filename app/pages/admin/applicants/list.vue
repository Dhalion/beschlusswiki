<template>
    <div class="text-black mx-10">
        <h2 class="text-3xl text-slate-600 py-3">Antragsteller*innen</h2>
        <div class="bg-slate-800 px-5  text-black">
            <UTable :rows="tableRows" :columns="tableColumns" :loading="pending"
                :loading-state="{ icon: 'i-heroicons-arrow-path-20-solid', label: 'Loading...' }" :empty-state="emptyState">

                <template #actions-data="{ row }">
                    <div class="flex justify-start gap-x-5 text-lg">
                        <NuxtLink class="hover:cursor-pointer" v-if="isAdmin || isEditor">
                            <UPopover v-model="confirmationPopup">
                                <UIcon name="i-heroicons-trash" />
                                <template #panel="{ close }">
                                    <AdminConfirmationPopup @confirm="deleteApplicant(row); close();" @cancel="close();"
                                        title="Antragsteller*in löschen?" />
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
                    <UButton label="Neue*r Antragsteller*in" variant="solid" color="primary" icon="i-heroicons-plus"
                        to="/admin/applicants/create" />
                </div>
                <div class="flex justify-center">
                    <UPagination v-model="tablePage" :page-count="tablePageCount" :total="data?.length || 0" />
                </div>
                <div class="flex justify-end p-3">
                    <span class="text-gray-400 pr-3 text-sm pt-1">Einträge pro Seite:</span>
                    <USelect v-model="tablePageCount" :options="[10, 20, 50, 100]" />
                </div>
            </div>
        </div>
    </div>
    <UNotifications />
</template>

<script setup lang="ts">
import type { IApplicant } from '~/types/models/applicant.schema';

const config = useRuntimeConfig();
const API_ENDPOINT = config.public.apiEndpoint;
const toast = useToast();
const router = useRouter();
const route = useRoute();

const tablePage = ref(1);
const tablePageCount = ref(10);
const confirmationPopup = ref(false);


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


const { data, error, pending, refresh } = useLazyFetch<IApplicant[]>("/api/applicants", {
    baseURL: API_ENDPOINT,
    onRequestError: (error) => {
        toast.add({
            title: "Fehler beim Laden der Antragsteller*innen",
            description: error.error.message,
            icon: "i-heroicons-exclamation-triangle",
        });
    },
    params: {
        page: tablePage,
        limit: tablePageCount,
    },
});

const isAdmin = computed(() => {
    if (!session) return false;
    return session.user.roles.includes("admin");
});

const isEditor = computed(() => {
    if (!session) return false;
    return session.user.roles.includes("editor");
});

const isContributor = computed(() => {
    if (!session) return false;
    return session.user.roles.includes("contributor");
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

const tableRows = computed(() => {
    if (!data.value) return [];
    if (data.value?.length === 0) return [];
    if (error.value) {
        toast.add({
            title: "Fehler beim Laden der Antragsteller*innen",
            description: error.value.message,
            icon: "i-heroicons-exclamation-triangle",
        });
    }

    return data.value.slice(
        (tablePage.value - 1) * tablePageCount.value,
        tablePage.value * tablePageCount.value,
    );
});

const tableColumns = [
    { key: "name", label: "Name", sortable: true },
    { key: "length", label: "Beschlüsse", sortable: true },
    { key: "actions", label: "Aktionen", sortable: false },
]

const deleteApplicant = async (applicant: IApplicant) => {
    try {
        const response = await $fetch("/api/applicants/", {
            baseURL: config.public.apiEndpoint,
            method: "DELETE",
            headers: {
                "Authorization": `${token.value}`,
            },
            query: {
                id: applicant._id,
            },
        });

        toast.add({
            title: "Antragsteller*in gelöscht",
            description: "Antragsteller*in wurde erfolgreich gelöscht.",
            icon: "i-heroicons-check-circle",
        });
        refresh();
    } catch (e) {

        toast.add({
            title: "Fehler beim Löschen",
            description: "Antragsteller*in konnte nicht gelöscht werden.",
            icon: "i-heroicons-exclamation-triangle",
        });
    }
}
</script>