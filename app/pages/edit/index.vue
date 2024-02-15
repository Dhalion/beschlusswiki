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
        <USelectMenu v-if="fetchedCategories" v-model="resolution.body.category" :options="fetchedCategories">
          <template #label>
            {{ resolutionCategoryString }}
          </template>

          <template #option="{ option }">
            {{ option.tag }} - {{ option.name }}
          </template>
        </USelectMenu>

      </UFormGroup>

      <UFormGroup label="Antragsteller*innen" name="applicants">
        <USelectMenu multiple searchable v-model="resolution.body.applicants" :options="applicantsOptions" by="_id">
          <template #label>
            <span v-if="resolution.body.applicants?.length">
              {{ resolution.body.applicants.length }} Antragsteller*innen ausgewählt
            </span>
            <span v-else>
              Keine Antragsteller*innen ausgewählt
            </span>
          </template>
          <template #option="{ option }: { option: IApplicant }">
            {{ option.name }}
          </template>
        </USelectMenu>
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

import type { FormError, FormSubmitEvent } from '#ui/types';
import { type IResolution, type ICategory, type IResolutionToSend } from '~/types/Interfaces';
import type { IApplicant } from '~/types/models/applicants.schema';

definePageMeta({
  middleware: ['authentication'],
})

const { status: authStatus,
  data: authData,
  lastRefreshedAt,
  getSession,
  signIn,
  token
} = useAuth();

const config = useRuntimeConfig();
const route = useRoute();
const router = useRouter();
const overrideCheck = ref(true);
const toast = useToast();

const postError = ref<string | null>(null);


// Fetch resolution
const { data: resolution, error, pending, refresh } = await useLazyFetch<IResolution>("/api/resolution", {
  baseURL: config.public.apiEndpoint,
  method: "GET",
  query: {
    id: route.query.id,
    text: true,
    category: true,
    applicants: true,
  },
});

// Fetch categories
const { data: fetchedCategories } = await useLazyFetch<ICategory[]>("/category", {
  baseURL: config.public.apiEndpoint,
  method: "GET",
});

const { data: fetchedApplicants } = await useLazyFetch<IApplicant[]>("/api/applicants", {
  baseURL: config.public.apiEndpoint,
  method: "GET",
});


const applicantsOptions = computed(() => {
  if (fetchedApplicants.value && fetchedApplicants.value.length > 0) {
    return fetchedApplicants.value.sort((a, b) => {
      return a.name.localeCompare(b.name);
    });
  }
  return [];
});

const validate = (resolution: IResolution): FormError[] => {
  const errors: FormError[] = [];
  if (!resolution.body.title) {
    errors.push({ path: "title", message: "Der Titel darf nicht leer sein." });
  }
  if (!resolution.body.tag) {
    errors.push({ path: "tag", message: "Der Tag darf nicht leer sein." });
  }
  if (!resolution.body.year) {
    errors.push({ path: "year", message: "Das Jahr darf nicht leer sein." });
  }

  if (resolution.body?.category instanceof Object) {
    const category = resolution.body.category as ICategory;
    // resolutionTag = resolution.body.tag but remove numbers
    const resolutionTag = resolution.body.tag.replace(/\d/g, '');
    if (category.tag !== resolutionTag) {
      errors.push({ path: "categories", message: "Der Tag und die Kategorie stimmen nicht überein." });
    }
  }
  return errors;
}

async function submit() {
  if (!resolution.value) {
    toast.add({
      title: "Fehler beim Speichern",
      description: "Der Beschluss ist leer.",
      icon: "i-heroicons-exclamation-triangle",
    });
    return;
  }

  const response: Response = await $fetch("/resolution", {
    baseURL: config.public.apiEndpoint,
    method: "PUT",
    headers: {
      "Authorization": token.value || "",
    },
    query: {
      id: route.query.id,
      override: overrideCheck.value,
    },
    body: { resolution: resolution.value },
  });



  if (response.status !== 200) {
    postError.value = response.status + " - " + response.statusText;
    toast.add({
      title: "Fehler beim Speichern",
      description: response.statusText || "Ein unbekannter Fehler ist aufgetreten.",
      icon: "i-heroicons-exclamation-triangle",
    });
    return;
  }
  toast.add({
    title: "Beschluss gespeichert",
    description: "Der geänderte Beschluss wurde erfolgreich gespeichert.",
    icon: "i-heroicons-check-circle",
  });
}


const resolutionCategoryString = computed(() => {
  if (resolution.value?.body.category instanceof Object) {
    const category = resolution.value.body.category as ICategory;
    return category.tag + " - " + category.name;
  }
  return "Nicht zugewiesen";
});



</script>
