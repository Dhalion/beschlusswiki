<template>
    <!-- Text Heading with Back and Share Button -->
    <div class="flex flex-row justify-between m-2">
        <!-- Navigate one back Button: -->
        <UButton icon="i-heroicons-backspace" size="xl" variant="link" @click="$router.go(-1)" />
        <!-- Share Button: -->
        <UButton icon="i-heroicons-share" size="xl" variant="link" />
        <!-- Edit Resolution Button -->
        <UButton icon="i-heroicons-pencil-square" size="xl" variant="link" :to="`/edit?id=${resolutionId}`" />

    </div>
    <div
        class="pl-20 pr-20 pb-10 pre text-base leading-6 antialiased whitespace-pre-line break-normal juso-highlight flex justify-center">
        {{ resolutionText }}
    </div>
</template>

<script setup>
// Receive Resolution from prop
const { resolutionText, resolutionId } = defineProps({
    resolutionText: String,
    resolutionId: String,
})
</script>
