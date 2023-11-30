<template>
  <div class="bg-white h-full w-full">
    <ResolutionView />
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: "authentication"
})
</script>
