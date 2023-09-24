<template>
    <div class="bg-jusorot-700 w-full h-full mt-10 p-10 flex flex-col">
        <div class="h-1/3 grid grid-cols-3 gap-4
            justify-center justify-items-center">
            <NuxtLink href="/about">
                Über das Beschlusswiki
            </NuxtLink>
            <NuxtLink href="/privacy">
                Datenschutz
            </NuxtLink>
            <NuxtLink href="/impressum">
                Impressum
            </NuxtLink>
        </div>
        <span class="bg-jusorot-700 w-full flex justify-center text-center bottom mt-10"> Beschlusswiki {{
            runtimeConfig.public.version }} <br>
            &copy; 2023 Christopher Falkner</span>
    </div>
</template>

<script setup>
const runtimeConfig = useRuntimeConfig();

</script>
