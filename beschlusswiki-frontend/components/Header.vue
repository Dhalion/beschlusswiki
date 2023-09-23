<template>
    <nav class=" bg-jusorot-700
                w-full z-20 top-0 left-0 justify-center items-center flex 
                border-b shadow">
        <div class="flex items-center p-1">
            <NuxtLink href="/" class="">
                <img src="../assets/img/jusos_logo_WEISS.png" class="h-16 mr-5" alt="Jusos Logo">
            </NuxtLink>

            <!-- Navbar Heading "Jusos Beschlusswiki" centered, semi-bold -->
            <NuxtLink href="#" class="text-2xl font-extrabold flex-nowrap text-white">
                Jusos Beschlusswiki
            </NuxtLink>
        </div>
    </nav>
</template>

<script>
export default {
    name: 'Header',
}

</script>
