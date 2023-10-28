<template>
    <div class="bg-slate-800 px-5 mx-10 text-black">
        <UTable :rows="tableRows" :columns="tableColumns" :loading="pending"
            :loading-state="{ icon: 'i-heroicons-arrow-path-20-solid', label: 'Loading...' }" :empty-state="emptyState">

            <!--* Rollen Spalte *-->
            <template #roles-data="{ row }">
                <div class="flex flex-row gap-2">
                    <div v-for="role in row.roles" :key="role">
                        <UBadge size="sm"> {{ role }} </UBadge>
                    </div>
                </div>
            </template>

            <!--* User Status Spalte *-->
            <template #status-data="{ row }">
                <!-- Dropdown to select staged/live -->
                <UDropdown :items="statusOptions(row)" :popper="{ placement: 'bottom-start' }">
                    <UButton color="white" variant="solid" trail trailing-icon="i-heroicons-chevron-down-20-solid"
                        size="xs">
                        {{ row.status ? "Aktiv" : "Inaktiv" }}
                    </UButton>
                </UDropdown>
            </template>

            <!--* Aktionen Spalte *-->
            <template #actions-data="{ row }">
                <UPopover v-model="confirmationPopup">
                    <UButton icon="i-heroicons-trash" variant="link" color="grey" />
                    <template #panel="{ close }">
                        <AdminConfirmationPopup @confirm="handleUserDelete(row); close();" @cancel="close();"
                            title="Nutzer löschen?" />
                    </template>
                </UPopover>
            </template>
        </UTable>


        <div class="flex flex-col pt-5">
            <div class="flex justify-center">
                <UPagination v-model="tablePage" :page-count="tablePageCount" :total="data?.length" />
            </div>
            <div class="flex justify-end p-3">
                <span class="text-gray-400 pr-3 text-sm pt-1">Einträge pro Seite:</span>
                <USelect v-model="tablePageCount" :options="[10, 20, 50, 100]" />
            </div>
        </div>
    </div>
    <UNotifications />
</template>

<script setup>
const config = useRuntimeConfig();
const API_ENDPOINT = config.public.apiEndpoint;
const toast = useToast();

const tablePage = ref(1);
const tablePageCount = ref(10);

const confirmationPopup = ref(null);

const { data, error, pending, refresh } = await useLazyFetch(API_ENDPOINT + "/auth/user", {
    transform: (data) => {
        return data.users;
    },
    onRequestError: (error) => {
        toast.add({
            title: "Fehler beim Laden der Benutzer",
            message: error.message,
            type: "error",
        });
    },
    onResponseError: (error) => {
        toast.add({
            title: "Fehler beim Laden der Benutzer",
            message: error.message,
            type: "error",
        });
    },
})

const emptyState = computed(() => {
    if (error.value) return { icon: 'i-heroicons-exclamation-triangle', label: 'Fehler beim Laden.' };
    else return { icon: 'i-heroicons-circle-stack-20-solid', label: 'No items.' };
});

const tableRows = computed(() => {
    if (!data.value) return [];
    if (data.value.length === 0) return [];
    if (error.value) {
        toast.add({
            title: "Fehler beim Laden der Benutzer",
            message: error.value.message,
            type: "error",
        });
    }

    return data.value.slice(
        (tablePage.value - 1) * tablePageCount.value,
        tablePage.value * tablePageCount.value,
    );
});



const tableColumns = [
    { key: "_id", label: "ID", sortable: true },
    { key: "username", label: "Username", sortable: true },
    { key: "status", label: "Status", sortable: true },
    { key: "roles", label: "Rollen", sortable: false },
    { key: "actions", label: "Aktionen", sortable: false }
]

const statusOptions = (row) => [[
    { label: "Aktiv", onClick: () => handleUserStatusChange(row, true) },
    { label: "Inaktiv", onClick: () => handleUserStatusChange(row, false) }
]];

function handleUserStatusChange(row, newStatus) {
    console.log(`Setting userr ${row.username} to ${newStatus ? "active" : "inactive"}`);
}

async function handleUserDelete(row) {
    console.log(`Deleting user ${row.username}`);

    const { data, error } = await useFetch("/auth/user/", {
        method: "DELETE",
        baseURL: API_ENDPOINT,
        query: { id: row._id },
    });
    if (error.value) {
        toast.add({
            title: "Fehler beim Löschen des Benutzers",
            description: error.message,
            icon: "i-heroicons-exclamation-triangle",
            type: "error",
        });
    } else {
        removeUserFromTable(row._id);
        toast.add({
            title: "Benutzer gelöscht",
            description: `Der Benutzer ${row.username} wurde erfolgreich gelöscht.`,
            icon: "i-heroicons-check-circle",
            type: "success",
        });
    }
}

function removeUserFromTable(id) {
    const index = data.value.findIndex((user) => user._id === id);
    if (index !== -1) {
        data.value.splice(index, 1);
    }
}

</script>
