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
          <UButton color="white" variant="solid" trail trailing-icon="i-heroicons-chevron-down-20-solid" size="xs">
            {{ row.status ? "Aktiv" : "Inaktiv" }}
          </UButton>
        </UDropdown>
      </template>

      <!--* Aktionen Spalte *-->
      <template #actions-data="{ row }">
        <UPopover v-model="confirmationPopup">
          <UButton icon="i-heroicons-trash" variant="link" color="gray" />
          <template #panel="{ close }">
            <AdminConfirmationPopup @confirm="handleUserDelete(row); close();" @cancel="close();"
              title="Nutzer löschen?" />
          </template>
        </UPopover>
      </template>
    </UTable>


    <div class="flex flex-row justify-between pt-5 items-center ">
      <div class="flex gap-3">
        <UButton label="Aktualisieren" variant="solid" color="primary" icon="i-heroicons-arrow-path" @click="refresh()" />
        <AdminCreateUserModal @user-created="refresh()" />
      </div>
      <div class="flex justify-center">
        <UPagination v-model="page" :page-count="pageCount" :total="data?.length || 0" />
      </div>
      <div class="flex justify-end p-3">
        <span class="text-gray-400 pr-3 text-sm pt-1">Einträge pro Seite:</span>
        <USelect v-model="pageCount" :options="[10, 20, 50, 100]" />
      </div>
    </div>
  </div>
  <UNotifications />
</template>

<script setup lang="ts">
import type { IUser } from '~/types/models/user.schema';
import { type ObjectId } from "mongoose";


const config = useRuntimeConfig();
const API_ENDPOINT = config.public.apiEndpoint;
const toast = useToast();
const router = useRouter();
const route = useRoute();

const page = ref(1);
const pageCount = ref(10);

const confirmationPopup = ref(null);

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
const headers = useRequestHeaders(['cookie']);




const { data, error, pending, refresh } = await useLazyFetch<IUser[]>("auth/users", {
  baseURL: API_ENDPOINT,
  headers: {
    "Authorization": `${token.value}`,
  },
  onRequestError: (error) => {
    toast.add({
      title: "Fehler beim Laden der Benutzer",
      description: error?.error?.message,
      icon: "i-heroicons-exclamation-triangle",
    });
  },
  onResponseError: (error) => {
    console.error(error);
    toast.add({
      title: "Fehler beim Laden der Benutzer",
      description: error?.response?.status + ": " + error?.response?.statusText,
      icon: "i-heroicons-exclamation-triangle",
    });
  },
})

const emptyState = computed(() => {
  if (error.value) return { icon: 'i-heroicons-exclamation-triangle', label: 'Fehler beim Laden.' };
  else return { icon: 'i-heroicons-circle-stack-20-solid', label: 'No items.' };
});

const tableRows = computed(() => {
  if (!data.value || data.value.length === 0) return [];

  if (error.value) {
    toast.add({
      title: "Fehler beim Laden der Benutzer",
      description: error.value.message,
    });
  }

  return data.value.slice(
    (page.value - 1) * pageCount.value,
    page.value * pageCount.value,
  );
});



const tableColumns = [
  { key: "_id", label: "ID", sortable: true },
  { key: "username", label: "Username", sortable: true },
  { key: "status", label: "Status", sortable: true },
  { key: "roles", label: "Rollen", sortable: false },
  { key: "actions", label: "Aktionen", sortable: false }
]

const statusOptions = (row: IUser) => [[
  { label: "Aktiv", onClick: () => handleUserStatusChange(row, true) },
  { label: "Inaktiv", onClick: () => handleUserStatusChange(row, false) }
]];

async function handleUserStatusChange(row: IUser, status: boolean) {
  const newStatus = status ? "active" : "inactive";
  console.log(`Setting user ${row.username} to ${newStatus}`);

  const { data, error } = await useFetch("/auth/users/", {
    method: "PATCH",
    baseURL: API_ENDPOINT,
    query: { id: row._id, field: "status", value: newStatus },
  });

  if (error.value) {
    toast.add({
      title: `Fehler beim Ändern des Benutzerstatus von  ${row.username}`,
      description: error.value.message,
      icon: "i-heroicons-exclamation-triangle",
    });
  } else {

    toast.add({
      title: "Benutzerstatus geändert",
      description: `Der Benutzer ${row.username} wurde erfolgreich auf ${newStatus} gesetzt.`,
      icon: "i-heroicons-check-circle",
    });
    refresh();
  }

}

async function handleUserDelete(row: IUser) {
  console.log(`Deleting user ${row.username}`);

  const { data, error } = await useFetch("/auth/users", {
    method: "DELETE",
    baseURL: API_ENDPOINT,
    query: { id: row._id },
    headers: {
      "Authorization": `${token.value}`,
    },
  });
  if (error.value) {
    toast.add({
      title: "Fehler beim Löschen des Benutzers",
      description: error.value.message,
      icon: "i-heroicons-exclamation-triangle",
    });
  } else {
    removeUserFromTable(row._id);
    toast.add({
      title: "Benutzer gelöscht",
      description: `Der Benutzer ${row.username} wurde erfolgreich gelöscht.`,
      icon: "i-heroicons-check-circle",
    });
  }
}

function removeUserFromTable(id: ObjectId) {
  if (!data.value) return;
  const index = data.value.findIndex((user) => user._id === id);
  if (index !== -1) {
    data.value.splice(index, 1);
  }
}



</script>
