<template>
  <div>
    <UIcon name="i-heroicons-bars-3" class="font-extrabold text-4xl my-auto ml-4 hover:cursor-pointer text-white"
      @click="isOpen = true" />
    <USlideover v-model="isOpen" title="Side Menu" :overlay="false" side="left">
      <!--* USER INFORMATION  -->
      <div class="p-4 flex flex-row gap-3">
        <UAvatar :alt="data?.user.username.toLocaleUpperCase()" size="xl" />
        <div class="flex flex-col">
          <span class="text-xl">{{ data?.user.username }}</span>
          <span class="text-slate-600">{{ data?.user.roles }}</span>
          <span class="text-slate-600">{{ data?.user.email || "-" }}</span>
        </div>
      </div>
      <UDivider />

      <!--* MENU ITEMS  -->
      <div class="flex flex-col gap-4 w-2/3 mx-auto pt-5">

        <UButton v-for="item in visibleMenuItems" :key="item.name" :to="item.to" :icon="item.icon" :label="item.name"
          size="xl" @click="isOpen = false" />

      </div>
    </USlideover>
  </div>
</template>

<script lang="ts" setup>

const { data } = useAuth();

enum UserRoles {
  Admin = "admin",
  Editor = "editor",
  Contributor = "contributor",
}


const isOpen = ref(false);

import { computed } from 'vue';

const visibleMenuItems = computed(() => {
  return menuItems.filter((item) => {
    if ((item as { role?: string[] }).role) {
      // Prüfen, ob item.role ein einzelner Wert ist
      if (Array.isArray(item.role)) {
        // Prüfen, ob irgendeine der Rollen in item.role in data?.value?.user.roles enthalten ist
        return item.role.some(role => data?.value?.user.roles.includes(role));
      } else {
        // Prüfen, ob der einzelne Wert in data?.value?.user.roles enthalten ist
        return data?.value?.user.roles.includes(item?.role);
      }
    }
    return true;
  });
});

const menuItems = [
  {
    name: "Beschlusswiki Startseite",
    icon: "i-heroicons-newspaper",
    to: "/"
  },
  {
    name: "Dashboard",
    icon: "i-heroicons-home",
    to: "/admin"
  },
  {
    name: "Beschlüsse",
    icon: "i-heroicons-document-text",
    to: "/admin/allResolutions"
  },
  {
    name: "Neuen Beschluss erstellen",
    icon: "i-heroicons-document-plus",
    to: "/resolution/create",
  },
  {
    name: "Beschlüsse zum Freigeben",
    icon: "i-heroicons-document-check",
    to: "/admin/resolutionsForApproval",
    role: [UserRoles.Editor, UserRoles.Admin]
  },
  {
    name: "Benutzer",
    icon: "i-heroicons-user-group",
    to: "/admin/users",
    role: [UserRoles.Admin]
  },
  {
    name: "Kategorien",
    icon: "i-heroicons-tag",
    to: "/admin/categories",
    role: [UserRoles.Editor, UserRoles.Admin]
  },
  {
    name: "Antragsteller*innen",
    icon: "i-heroicons-users",
    to: "/admin/applicants/list",
    role: [UserRoles.Editor, UserRoles.Admin]
  },
  {
    name: "Profil",
    icon: "i-heroicons-user-circle",
    to: "/admin/dashboard",
    role: [] // effectively disabled
  },
  {
    name: "Elasticsearch",
    icon: "i-heroicons-magnifying-glass-circle",
    to: "/admin/elasticsearch",
    role: [UserRoles.Admin]
  },
  {
    name: "Einstellungen",
    icon: "i-heroicons-cog",
    to: "/admin/dashboard",
    role: [] // effectively disabled
  }
];




</script>
