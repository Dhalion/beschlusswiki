<template>
  <UForm :state="resolution" :validate="validate" @submit="submit" v-if="resolution?.body.text"
    class="bg-slate-800 w-4/5 mx-auto">
    <div class="flex justify-between px-4 pt-4 items-center">
      <span class="text-lg font-semibold">Beschluss {{ resolution._id }}</span>
      <div>
        <UButton type="submit" class="" :disabled="pending" icon="i-heroicons-document-check" block>Speichern</UButton>
        <UCheckbox v-model="overrideCheck" label="Beschluss überschreiben" class="mt-2" />
      </div>
    </div>
    <div class="flex flex-col content-center p-4 gap-y-3">

      <UFormGroup label="Titel" class="row-span-2 self-center w-full" name="title">
        <UInput v-model="resolution.body.title" placeholder="Resolution Title" />
      </UFormGroup>

      <div class="flex gap-x-4">
        <UFormGroup label="Tag" class="row-start-2" name="tag">
          <UInput v-model="resolution.body.tag" placeholder="Resolution Tag" />
        </UFormGroup>
        <UFormGroup label="Jahr" class="row-start-1" name="year">
          <UInput v-model="resolution.body.year" placeholder="Resolution Year" />
        </UFormGroup>
      </div>

      <UFormGroup label="Kategorien" name="categories" class="min-w-min md:w-1/2 lg:w-1/3">
        <USelectMenu v-model="resolution.body.category" :options="categories">
          <template #label>
            {{ resolutionCategoryString }}
          </template>

          <template #option="{ option }">
            {{ option.tag }} - {{ option.name }}
          </template>
        </USelectMenu>

      </UFormGroup>

      <UFormGroup label="Antragsteller*innen" name="applicants">
        <div class="flex gap-x-2">
          <!-- <UInput v-model="" placeholder="Resolution Applicants" class="w-1/4"
            name="applicantInput" /> -->
          <UButton icon="i-heroicons-plus" size="xs" @click="addApplicant">Hinzufügen</UButton>
        </div>
        <UBadge v-for=" applicant  in  resolution.body.applicants " :key="applicant" size="sm" class="mr-2 mt-2">
          <span class="pr-1 text-xs">
            {{ applicant }}
          </span>
          <UIcon name="i-heroicons-x-mark" class="text-lg hover:cursor-pointer hover:bg-gray-50"
            @click="removeApplicant(applicant)" />
        </UBadge>
      </UFormGroup>


      <UFormGroup label="Beschlusstext" name="text">
        <div>
          <span class="text-slate-400 text-xs flex gap-x-3 my-2">
            Formatierten Text anzeigen
            <UTooltip text="Funktion noch nicht verfügbar" :popper="{ placement: 'top' }">
              <UToggle disabled />
            </UTooltip>
          </span>
          <div class="flex flex-row justify-center gap-2">
            <UTextarea v-model="resolution.body.text" placeholder="Resolution Text" autoresize class="w-1/2 md:p-3"
              size="xl" />
            <div v-html="$mdRenderer.render(resolution.body.text)"
              class="w-1/2 xl:w-3/5 p-2 md:p-5 prose bg-white leading-6" />
          </div>
        </div>
      </UFormGroup>

      <UAlert icon="i-heroicons-exclamation-circle" variant="solid" title="Fehler beim Einsenden" :description="postError"
        class="mt-5 bg-jusorot-600" v-if="postError" />

    </div>
  </UForm>


  <!--* Error Boxes & Loading -->
  <div class="flex my-10 w-full flex-col">
    <SharedLoadingSpinner v-if="pending" text="Lade Beschluss" />

    <UAlert icon="i-heroicons-exclamation-triangle" class="sm:w-2/3 mx-3 sm:mx-auto"
      title="Fehler: Beschluss nicht gefunden" :description="error.message" variant="solid" color="primary"
      v-if="error && error?.statusCode == 404" />

    <UAlert icon="i-heroicons-exclamation-triangle" class="sm:w-2/3 mx-3 sm:mx-auto"
      title="Fehler beim Laden des Beschlusses" :description="error?.message" variant="solid" color="primary"
      v-else-if="error || !resolution?.body.text" />
  </div>

  <!-- Toasts are here. -->
  <UNotifications />
</template>

<script setup lang="ts">

import type { FormError } from '@nuxt/ui/dist/runtime/types';
import { type IResolution, type ICategory, type IResolutionToSend } from '~/types/Interfaces';
const { status: authStatus,
  data: authData,
  lastRefreshedAt,
  getSession,
  signIn,
} = useAuth();

const config = useRuntimeConfig();
const route = useRoute();
const router = useRouter();
const overrideCheck = ref(true);
const toast = useToast();


// Fetch resolution
const { data: resolution, error, pending, refresh } = await useLazyFetch<IResolution>("/resolution", {
  query: {
    id: route.query.id,
    text: true,
    category: true,
  },
  baseURL: config.public.apiEndpoint,
  method: "GET",
});

// Fetch categories
const { data: categories } = await useLazyFetch<ICategory[]>("/category", {
  baseURL: config.public.apiEndpoint,
  method: "GET",
});

const validate = (resolution: IResolution): FormError[] => {
  const errors: FormError[] = [];
  return errors;
}

async function submit() {
  const resolutionToSend = resolution.value;
  if (!resolutionToSend) {
    toast.add({
      title: "Fehler beim Speichern",
      description: "Der Beschluss ist leer.",
      icon: "i-heroicons-exclamation-triangle",
    });
    return;
  }

  // Ensure JWT is valid
  const session = await getSession({ required: true });
  if (!session) {
    toast.add({
      title: "Fehler beim Speichern",
      description: "Deine Sitzung ist abgelaufen. Bitte melde dich erneut an.",
      icon: "i-heroicons-exclamation-triangle",
      actions: [
        {
          label: "Anmelden",
          click: () => router.push(`/admin/login?redirect=${route.fullPath}`),
        }],
    });
    return;
  }
  const headers = useRequestHeaders(['cookie']) as HeadersInit

  const { data, error } = await useLazyFetch("/resolution", {
    query: {
      id: route.query.id,
      override: overrideCheck.value,
    },
    headers: {
      "Authorization": `Bearer ${session}`,
    },
    baseURL: config.public.apiEndpoint,
    method: "PUT",
    body: JSON.stringify({ "resolution": resolution.value }),
    onResponse: (response) => {
      if (response.response.status == 200) {
        toast.add({
          title: "Beschluss gespeichert",
          description: "Der Beschluss wurde erfolgreich gespeichert.",
          icon: "i-heroicons-check-circle",
        });
        refresh();
      }
    },
  });
  if (error.value) {
    console.error(error);
    toast.add({
      title: "Fehler beim Speichern",
      description: error.value?.message || "Ein unbekannter Fehler ist aufgetreten.",
      icon: "i-heroicons-exclamation-triangle",
    });
    return;
  }
}



const resolutionCategoryString = computed(() => {
  if (resolution.value?.body?.tag && resolution.value?.body.category?.name) return resolution.value.body.category?.tag + " - " + resolution.value.body.category?.name;
  return "Nicht zugewiesen";
});


</script>
