<template>
    <!-- Text Heading with Back and Share Button -->
    <div class="flex flex-row justify-between m-2">
        <UButton icon="i-heroicons-backspace" size="xl" variant="link" @click="$router.go(-1)" />
        <UButton icon="i-heroicons-share" size="xl" variant="link" />
        <UButton icon="i-heroicons-pencil-square" size="xl" variant="link" />
        <!-- Navigate one back Button: -->

    </div>
    <div class="pl-20 pr-20 pre text-base leading-6 antialiased whitespace-pre-line break-normal juso-highlight">
        {{ resolution }}

    </div>
</template>

<script setup>
// Receive Resolution from prop
const { resolution } = defineProps({
    resolution: String,
})
</script>
