<template>
    <div class="bg-slate-800 px-5 mx-10 text-black">
        <UTable :rows="tableRows" :columns="tableColumns" :loading="pending"
            :loading-state="{ icon: 'i-heroicons-arrow-path-20-solid', label: 'Loading...' }">

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
                <UButton icon="i-heroicons-trash" variant="link" color="grey" />
            </template>
        </UTable>


        <div class="flex flex-col pt-5">
            <div class="flex justify-center">
                <UPagination v-model="tablePage" :page-count="tablePageCount" :total="data.users.length" />
            </div>
            <div class="flex justify-end p-3">
                <span class="text-gray-400 pr-3 text-sm pt-1">Einträge pro Seite:</span>
                <USelect v-model="tablePageCount" :options="[10, 20, 50, 100]" />
            </div>
        </div>
    </div>
</template>

<script setup>
const config = useRuntimeConfig();
const API_ENDPOINT = config.public.apiEndpoint;

const tablePage = ref(1);
const tablePageCount = ref(10);

const { data, error, pending } = await useLazyFetch(API_ENDPOINT + "/auth/users", {
})


const tableRows = computed(() => {
    return pending.value ? [] : data.value.users.slice(
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


</script>
