<template>
  <div class="flex flex-col justify-center mx-auto">
    <div
      class="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite] text-jusorot-600"
      role="status"></div>
    <span class="text-slate-500 pt-4 text-center"> {{ props.text }} </span>
  </div>
</template>

<script lang="ts" setup>

// Define "title" prop
const props = defineProps({
  text: {
    type: String,
    required: true,
  },
});

</script>


