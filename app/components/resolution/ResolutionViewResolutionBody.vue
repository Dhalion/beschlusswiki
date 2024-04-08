<template>
  <!-- Text Heading with Back and Share Button -->
  <div class="flex flex-row justify-between m-2">
    <!-- Navigate one back Button: -->
    <UButton icon="i-heroicons-backspace" size="xl" variant="link" @click="$router.go(-1)" />
    <!-- Share Button: -->
    <UButton icon="i-heroicons-share" size="xl" variant="link" @click="share()" />
    <!-- Edit Resolution Button -->
    <UButton icon="i-heroicons-pencil-square" size="xl" variant="link" :to="`/edit?id=${resolutionId}`" />
  </div>
  <div class="leading-6 antialiased sm:w-3/4 w-5/6 mx-auto pb-10 mt-3">
    <span class="prose text-base text-gray-800 dark:text-slate-400" v-html="parsedResolution" />
  </div>
  <UNotifications />
</template>

<script setup>
import MarkdownIt from "markdown-it";

const toast = useToast();

// Receive Resolution from prop
const { resolutionText, resolutionId } = defineProps({
  resolutionText: String,
  resolutionId: String,
});
const md = new MarkdownIt();

const parsedResolution = computed(() => {
  return md.render(resolutionText);
});

const share = () => {
  // Copy link to resolution to clipboard
  navigator.clipboard.writeText(`${window.location.origin}/resolution/${resolutionId}`);
  // Show toast
  toast.add({
    title: "Link kopiert",
    status: "success",
    duration: 3000,
    isClosable: true,
  });
};
</script>