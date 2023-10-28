<template>
  <div class="w-screen">
    <EditResolutionHead v-if="!isLoading" class="md:w-5/6 mx-auto" />
    <div v-if="plainMarkdown">
      <div class="md:w-5/6 mx-auto flex mt-2 justify-center">
        <span class="text-gray-400 md:text-lg text-sm w-1/2 text-center"
          >Beschluss bearbeiten
        </span>
        <span class="text-gray-400 md:text-lg text-sm w-1/2 text-center"
          >Vorschau</span
        >
      </div>
      <div
        class="text-black markdown mx-auto md:w-5/6 flex justify-center divide-x pt-3"
      >
        <div class="w-1/2 h-screen p-3">
          <UTextarea
            v-model="plainMarkdown"
            variant="none"
            autoresize
            size="xs"
            class="font-mono md:text-base text-xs outline outline-1 outline-gray-300 outline-offset-1 bg-white"
          />
        </div>
        <div class="w-1/2 md:p-3 p-1">
          <div class="prose w-full text-sm pr-3" v-html="parsedMarkdown"></div>
          <!-- {{ plainMarkdown }} -->
        </div>
      </div>
    </div>

    <div
      v-if="!plainMarkdown && !error"
      class="flex justify-center items-center h-screen flex-col"
    >
      <!-- Loading spinner -->
      <div
        class="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite] text-jusorot-600"
        role="status"
      ></div>
      <span class="text-slate-500 pt-4"> Lade Beschluss... </span>
    </div>

    <div
      v-if="error"
      class="bg-jusorot-700 w-2/3 mx-auto p-10 rounded-lg flex flex-col"
    >
      <span class="text-white text-4xl font-semibold">Fehler!</span>
      <br />
      <span class="text-white mt-5"
        >Beschluss konnte nicht geladen werden! Fehlercode: {{ error }}</span
      >
    </div>
  </div>
  <!-- Toasts are here. -->
  <UNotifications>
    <template #title="{ title }">
      <span v-html="title" />
    </template>
    <template #description="{ description }">
      <span v-html="description" />
    </template>
  </UNotifications>
</template>

<script setup>
import MarkdownIt from "markdown-it";
import { navigateTo } from "nuxt/app";

const md = new MarkdownIt();
const { $bus } = useNuxtApp();
const config = useRuntimeConfig();
const router = useRouter();
const resolution = useLoadedResolution();
const toast = useToast();

const { status, data } = useAuth();

const API_ENDPOINT = config.public.apiEndpoint;
const resolutionId = router.currentRoute.value.query.id;

const plainMarkdown = ref("");
const error = ref(null);
const isLoading = ref(true);

const parsedMarkdown = computed(() => {
  return md.render(plainMarkdown.value);
});
// Requires login
definePageMeta({ middleware: ["authentication"] });

onMounted(async () => {
  $bus.$on("save", () => {
    resolution.value.body.text = plainMarkdown.value;
    saveResolution(resolution.value).then((res) => {
      showToastSavedDone(res);
    });
  });

  try {
    const response = await fetch(
      `${API_ENDPOINT}/resolution?id=${resolutionId}`,
    );
    if (!response.ok) {
      throw new Error(response.status);
    }
    const data = await response.json();
    plainMarkdown.value = data.body.text;
    resolution.value = data;
    isLoading.value = false;
  } catch (err) {
    error.value = err;
    isLoading.value = false;
  }
});

async function saveResolution(resolution) {
  // Remove "user" property from resolution object.
  delete resolution.user;
  // Remove "_id" property from resolution object. For reasons.
  delete resolution._id;

  const response = await fetch(
    `${API_ENDPOINT}/resolution?id=${resolutionId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ resolution }),
    },
  );
  return response.status;
}

function showToastSavedDone(statusCode) {
  let title, description, icon, status;

  if (statusCode == 200) {
    title = "Beschluss gespeichert!";
    description = "Änderungen wurden zur Freigabe eingereicht.";
    icon = "i-heroicons-check-circle";
    status = "success";
  } else if (statusCode == 400) {
    title = "Fehler beim Speichern!";
    description = `Keine Änderungen vorgenommen oder es existiert schon eine Version mit demselben Text. Statuscode: ${statusCode}`;
    icon = "i-heroicons-x-circle";
    status = "error";
  } else {
    title = "Fehler beim Speichern!";
    description = `Statuscode: ${statusCode}`;
    icon = "i-heroicons-x-circle";
    status = "error";
  }

  toast.add({
    title,
    description,
    status,
    duration: 5000,
    isClosable: true,
    icon,
    closeButton: {
      color: "white",
      size: "sm",
    },
  });
}

watch(status, (newStatus) => {
  if (newStatus !== "authenticated") {
    // Throw user out of here.
    navigateTo("/");
  }
});
</script>
