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
    <div class="text-base leading-6 antialiased w-3/4 mx-auto pb-10">
        <span v-html="parsedResolution" class="prose" />
    </div>
</template>

<script setup>
import MarkdownIt from 'markdown-it'

// Receive Resolution from prop
const { resolutionText, resolutionId } = defineProps({
    resolutionText: String,
    resolutionId: String,
})
const md = new MarkdownIt();

const parsedResolution = computed(() => {
    return md.render(resolutionText);
})

</script>
