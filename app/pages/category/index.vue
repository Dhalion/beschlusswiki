<template>
  <div class="flex flex-col sm:w-3/4 mx-3 sm:mx-auto mt-5 text-black">

    <!--* Header -->
    <div v-if="!pending && !error" class="flex justify-start mb-5">
      <img src="../../assets/work-in-progress.png" class="h-14 mr-2 sm:mr-5 p-1" :alt="category?.name" />
      <div>
        <h1 class="text-gray-700 font-bold text-2xl">{{ category?.name }}</h1>
        <span class="text-gray-500 text-sm font-light">
          {{ category?.resolutions.length }}
          {{ category?.resolutions.length === 1 ? "Beschluss" : "Beschlüsse" }}
        </span>
      </div>
    </div>

    <!--* Status Helpers -->
    <SharedLoadingSpinner v-if="pending" text="Lade Kategorie" />
    <UAlert v-if="error" title="Kategorie konnte nicht geladen werden!" :description="error.message" color="primary"
      icon="i-heroicons-exclamation-circle" variant="solid" />

    <!--* Content  -->
    <div v-for="resolution in category?.resolutions" :key="resolution">
      <MainCategoryResolutionCard :id="resolution" />
    </div>
  </div>
  <UNotifications />
</template>

<script setup lang="ts">

const config = useRuntimeConfig();
const router = useRouter();
const toast = useToast();

const errorCode = ref<string | null>(null);

const categoryId = router.currentRoute.value.query.id;

interface ICategory {
  _id: string;
  name: string;
  tag: string;
  resolutions: string[];
}

const { data: category, pending, error, refresh } = useLazyFetch("/category", {
  baseURL: config.public.apiEndpoint,
  params: {
    id: categoryId
  },
  transform: (data) => data as ICategory,
  onRequestError: (err) => {
    console.error(err);
    errorCode.value = err.error.message || "Unknown";
    toast.add({
      title: "Fehler",
      description: err.error.message,
      icon: "i-heroicons-x-circle",
      timeout: 5000,
    });
  },
  onResponseError: (err) => {
    console.error(err);
    errorCode.value = err.error?.name || "Unknown";
    toast.add({
      title: "Fehler",
      description: err.error?.message || "Unbekannter Fehler",
      icon: "i-heroicons-x-circle",
      timeout: 5000,
    });
  },
});

</script>
