<template>
    <nav class="bg-jusorot-700
                w-full z-20 top-0 left-0 justify-center items-center flex 
                border-b shadow">
        <div class="flex items-center p-1">
            <NuxtLink href="/">
                <img src="../assets/img/jusos_logo_WEISS.png" class="xl:h-16 xl:mr-5 h-14 mr-5" alt="Jusos Logo"
                    @click="handleLogoClick">
            </NuxtLink>

            <!-- Navbar Heading "Jusos Beschlusswiki" centered, semi-bold -->
            <NuxtLink href="#" class="xl:text-2xl text-xl font-extrabold flex-nowrap text-white">
                Jusos Beschlusswiki
            </NuxtLink>
            <UButton class="ml-5" variant="primary" @click="signOut" v-if="status == 'authenticated'">
                Abmelden
            </UButton>
            {{ status }}
        </div>
    </nav>
</template>

<script setup>
const search = useSearch();

const { status, signOut } = useAuth();

function handleLogoClick() {
    search.value.searchQuery = "";
}
</script>