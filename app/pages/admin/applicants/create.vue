<template>
    <div class="text-black bg-slate-800 w-5/6 mx-auto">
        <UForm ref="form" :state="formState" :validate="validateForm" @submit="submitForm">
            <div class="flex flex-col content-center p-4 gap-y-3">
                <UFormGroup label="Name" name="name" required>
                    <UInput v-model="formState.name" placeholder="Unterbezirk XY" />
                </UFormGroup>


                <UFormGroup label="Beschlüsse" name="resolutions">
                    <USelectMenu v-model="formState.resolutions" searchable :search-attributes="['year', 'tag', 'title']"
                        label="Beschlüsse auswählen" placeholder="Beschlüsse auswählen"
                        loading-icon="i-heroicons-exclamation-triangle" :options="resolutionsOptions"
                        :error="resolutionsError" multiple>
                        <template #option="{ option: resolution }">
                            <div class="flex items-center">
                                {{ resolution.year }} [{{ resolution.tag }}]: {{ resolution.title }}
                            </div>
                        </template>
                        <template #label>
                            <span v-if="formState.resolutions.length">
                                {{ formState.resolutions.length }} Beschlüsse ausgewählt
                            </span>
                            <span v-else>
                                Keine Beschlüsse ausgewählt
                            </span>
                        </template>
                    </USelectMenu>
                </UFormGroup>
            </div>
            <div class="flex m-3">
                <UAlert v-if="postError" icon="i-heroicons-exclamation-triangle" color="primary"
                    title="Fehler beim Speichern" :description="postError" />
            </div>

            <div class="p-4">
                <UButton label="Speichern" class="m3" variant="solid" color="primary" type="submit" />
            </div>
        </UForm>
    </div>
</template>

<script setup lang="ts">
import type { FormError, FormSubmitEvent } from '#ui/types';
import { type INewApplicant, type IReducedResolution, type ISimpleResolution } from "~/types/Interfaces";

definePageMeta({
    middleware: "authentication"
});

const config = useRuntimeConfig();
const toast = useToast();
const router = useRouter();
const route = useRoute();

const form = ref();

const formState = ref({
    name: "",
    resolutions: <ISimpleResolution[]>[],
});

const postError = ref();

const { status: authStatus,
    data: authData,
    lastRefreshedAt,
    getSession,
    signIn,
    token,
} = useAuth();

const {
    data: resolutionsData,
    pending: resolutionsPending,
    error: resolutionsError,
    refresh: refreshResolutions,
} = await useFetch('/api/resolution', {
    baseURL: config.public.apiEndpoint,
    query: {
        simple: true,
    },
    method: 'GET',
    transform: (data: IReducedResolution[]) => {
        return data.map((resolution) => {
            return {
                _id: resolution._id,
                title: resolution.body.title,
                tag: resolution.body.tag,
                year: resolution.body.year,
            } as ISimpleResolution;
        }) as ISimpleResolution[];
    },
});

const validateForm = (formState: INewApplicant): FormError[] => {
    const errors: FormError[] = [];
    if (!formState.name) errors.push({ path: "name", message: "Bitte gib einen Namen ein." });
    return errors;
};




async function submitForm() {

    try {

        const postApplicant = await useLazyFetch('/api/applicants', {
            baseURL: config.public.apiEndpoint,
            headers: {
                Authorization: token.value || "",
            },
            method: 'POST',
            body: JSON.stringify({ applicant: formState.value }),
        });
        postApplicant.execute();
        console.log(postApplicant.error.value);
        console.log(postApplicant.pending.value);

        if (!postApplicant.error.value) {
            toast.add({
                title: "Erfolgreich gespeichert",
                description: "Der Antrag wurde erfolgreich gespeichert.",
                icon: "i-heroicons-check-circle",
            });

            router.push("/admin/applicants/list");
            console.log("success");
            return;

        } else {
            if (postApplicant.error.value?.statusCode === 409) {
                postError.value = "Ein Antragsteller mit diesem Namen existiert bereits.";
                toast.add({
                    title: "Fehler beim Speichern",
                    description: "Ein Antragsteller mit diesem Namen existiert bereits.",
                    icon: "i-heroicons-exclamation-triangle",
                });
                return;
            } else {
                postError.value = "Es ist ein Fehler beim Speichern aufgetreten. Code: " + postApplicant.error.value?.statusCode;
            }
        }

    } catch (e) {
        toast.add({
            title: "Fehler beim Speichern",
            description: "Es ist ein Fehler beim Speichern aufgetreten. Bitte versuche es erneut.",
            icon: "i-heroicons-exclamation-triangle",
        });
        console.error(e);
        return;
    }
}

const resolutionsOptions = computed(() => {
    if (!resolutionsData.value || resolutionsData.value.length === 0) return [];
    // sorted by year and selected items first;
    const sorted = resolutionsData.value.sort((a, b) => {
        if (formState.value.resolutions.find((r) => r._id === a._id)) return -1;
        if (formState.value.resolutions.find((r) => r._id === b._id)) return 1;
        return a.year - b.year;
    });
    return sorted;
});
</script>
