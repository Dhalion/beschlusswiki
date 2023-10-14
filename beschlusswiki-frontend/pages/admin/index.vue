<template>
    <div class="text-black px-2 mx-2">
        <UTabs :items="tabItems" @change="onSelectedTabChange" class=" w-1/2 pt-5 mx-auto">
            <template #default="{ item, index, selected }">
                <div class="flex gap-3 relative truncate text-base">
                    <UIcon :name="item.icon" class="flex-shrink-0 text-xl self-center" />
                    <span>{{ item.label }}</span>
                    <span v-if="selected" class="absolute -right-4 w-2 h-2
                            rounded-full bg-primary-500 dark:bg-primary-400" />
                </div>
            </template>
        </UTabs>

        <AdminAllResolutionsTable v-if="selectedTab == 0" />
        <AdminResolutionsForApprovalTable v-if="selectedTab == 1" />

    </div>
</template>

<script setup>


const selectedTab = ref(0);

function onSelectedTabChange(index) {
    selectedTab.value = index;
}

const tabItems = [
    {
        label: "Alle Beschlüsse",
        icon: "i-heroicons-clipboard-document-list",
        slot: "all-resolutions",
    },
    {
        label: "Beschlüsse zum Freigeben",
        icon: "i-heroicons-clipboard-document-check",
        slot: "resolutions-to-approve",
    },
    {
        label: "Benutzer",
        icon: "i-heroicons-user-group",
        slot: "users",
    }
];

</script>
