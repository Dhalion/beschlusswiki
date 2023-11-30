<template>
  <div class="bg-jusorot-700 w-full h-full mt-10 p-10 flex flex-col">
    <div class="h-1/3 flex gap-4 justify-around justify-center justify-items-center">
      <NuxtLink href="/about"> Über das Beschlusswiki </NuxtLink>
      <NuxtLink href="/privacy"> Datenschutz </NuxtLink>
      <NuxtLink href="/impressum"> Impressum </NuxtLink>
      <div class="flex flex-col justify-center items-center">
        <NuxtLink :href="loginLinkHref" v-if="status == 'unauthenticated'"> Login </NuxtLink>
        <NuxtLink href="/admin" v-if="status == 'authenticated'"> Admin </NuxtLink>
        <NuxtLink v-if="status == 'authenticated'" @click="signOut"> Logout </NuxtLink>
      </div>
    </div>
    <span class="bg-jusorot-700 w-full flex justify-center text-center bottom mt-10">
      Beschlusswiki {{ version }} <br />
      &copy; 2023 Christopher Falkner</span>
  </div>
</template>

<script setup>
const runtimeConfig = useRuntimeConfig();
const route = useRoute();
const { status, signOut } = useAuth();

const version = ref("version");

const loginLinkHref = computed(() => {
  return `/admin/login?redirect=${route.fullPath}`;
});

onMounted(async () => {
  version.value = await getVersion();
});
</script>
