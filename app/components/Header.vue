<template>
  <nav class="bg-jusorot-700 w-full z-20 top-0 left-0  flex ">
    <div class="flex items-center justify-center">
      <AdminSideMenu v-if="authenticated" class="self-center items-center" />
    </div>
    <div class="flex items-center p-1 mx-auto">
      <NuxtLink href="/">
        <img src="../assets/img/jusos_logo_WEISS.png" class="xl:h-16 xl:mr-5 h-14 mr-5" alt="Jusos Logo"
          @click="handleLogoClick" />
      </NuxtLink>
      <!-- Navbar Heading "Jusos Beschlusswiki" centered, semi-bold -->
      <NuxtLink href="/" @click="handleLogoClick" class="xl:text-2xl text-xl font-extrabold flex-nowrap text-white">
        Jusos Beschlusswiki
      </NuxtLink>
    </div>

    <UIcon :name="isDark ? 'i-heroicons-moon' : 'i-heroicons-sun'" color="gray" variant="ghost" aria-label="Theme"
      @click="isDark = !isDark" class="text-2xl self-center m-3 hover:cursor-pointer text-white" />
  </nav>
</template>

<script setup lang="ts">

const auth = useAuth();
const colorMode = useColorMode();

const authenticated = computed(() => auth.status.value === "authenticated");

const isDark = computed({
  get() {
    return colorMode.value === 'dark'
  },
  set() {
    colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
  }
})

const handleLogoClick = () => {
  // Fire Logo Clicked Event
  useEvent("logoClicked");
}



</script>
