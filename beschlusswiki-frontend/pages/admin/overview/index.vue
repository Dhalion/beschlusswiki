<template>
  <div class="text-black px-2 mx-2">
    <UTabs :items="tabItems" class=" pt-5 px-5 w-5/6 mx-auto" @change="onSelectedTabChange" v-model="selectedTab">
      <template #default="{ item, index, selected }">
        <div class="flex min-w-min gap-3 relative truncate text-base mx-3">
          <UIcon :name="item.icon" class="flex-shrink-0 text-xl self-center" />
          <span>{{ item.label }}</span>
          <span v-if="selected" class="absolute -right-4 w-2 h-2 rounded-full bg-primary-500 dark:bg-primary-400" />
        </div>
      </template>
    </UTabs>

    <AdminAllResolutionsTable v-if="selectedTab == 0" />
    <AdminResolutionsForApprovalTable v-if="selectedTab == 1" />
    <AdminUsersTable v-if="selectedTab == 2" class="h-full" />
    <AdminCategoriesTable v-if="selectedTab == 3" />
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const router = useRouter();

definePageMeta({
  middleware: "authentication"
});

const selectedTab = ref(0);


function onSelectedTabChange(index: number) {
  selectedTab.value = index;
  router.push({ query: { tab: index } });
}

onMounted(() => {
  const tab = route.query.tab as string;
  if (tab) {
    selectedTab.value = parseInt(tab);
  }
});

watch(route.query, (query) => {
  if (query.tab) {
    selectedTab.value = parseInt(query.tab as string);
  }
});

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
  },
  {
    label: "Kateogrien",
    icon: "i-heroicons-tag",
    slot: "categories",
  }
];


</script>
