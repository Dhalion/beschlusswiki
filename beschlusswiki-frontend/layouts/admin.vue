<template>
  <div class="bg-white min-h-screen flex flex-col">
    <Header admin="true" />
    <div class="flex-grow snap-y">
      <slot />

      <div v-if="showScrollToTop"
        class="rounded-full bg-jusorot-700 w-12 h-12 flex justify-center items-center hover:cursor-pointer fixed bottom-20 right-20 border-white border-2"
        @click="scrollToTop">
        <UIcon name="i-heroicons-arrow-up" class="text-xl font-extrabold text-white" />
      </div>
    </div>

    <Footer ref="footerRef" />
  </div>
</template>

<script setup>
const showScrollToTop = ref(false);
const reachedFooter = ref(false);

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};

const onScroll = () => {
  showScrollToTop.value = window.scrollY > 100;
};

onMounted(() => {
  window.addEventListener("scroll", onScroll);
});

onUnmounted(() => {
  window.removeEventListener("scroll", onScroll);
});
</script>
