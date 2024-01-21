<template>
  <div class="text-black p-5">
    <h2 class="text-4xl font-bold text-slate-500">
      Hallo {{ data?.user?.username }}!
    </h2>
    <AdminDashboardSystemStatusCard />

    <div class="grid grid-cols-3 gap-x-3">
      <AdminDashboardResolutionsCard :display="AdminDashboardResolutionsDisplay.NEW" />
      <AdminDashboardResolutionsCard :display="AdminDashboardResolutionsDisplay.MY" />
      <AdminDashboardResolutionsCard :display="AdminDashboardResolutionsDisplay.STAGED" />
    </div>

  </div>
</template>

<script lang="ts" setup>
import { AdminDashboardResolutionsDisplay } from "~/types/Interfaces";

definePageMeta({
  middleware: "authentication",
  layout: "admin",
});

const colorMode = useColorMode();

const { status, data, signOut, getSession, token } = useAuth();

function logout() {
  signOut();
}
</script>
