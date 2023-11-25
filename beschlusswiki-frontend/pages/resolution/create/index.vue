<template>
    <div class="text-black bg-slate-800 w-5/6 mx-auto">
        <UForm :state="formState" :validate="validateForm" @submit="submitForm">
            <div class="flex flex-col content-center p-4 gap-y-3">

                <UFormGroup label="Titel" class="row-span-2 self-center w-full" name="title">
                    <UInput v-model="formState.body.title" placeholder="Resolution Title" />
                </UFormGroup>

                <div class="flex gap-x-4">
                    <UFormGroup label="Tag" class="row-start-2" name="tag">
                        <UInput v-model="formState.body.tag" placeholder="Resolution Tag" />
                    </UFormGroup>
                    <UFormGroup label="Jahr" class="row-start-1" name="year">
                        <UInput v-model="formState.body.year" placeholder="Resolution Year" />
                    </UFormGroup>
                </div>

                <UFormGroup label="Kategorien" name="categories">
                    <!-- <ResolutionCreateBadgeSelector v-model:selected="formState.body.category"
                        :options="FETCHED_CATEGORIES" class="mt-2" /> -->
                </UFormGroup>

                <UFormGroup label="Antragsteller*innen" name="applicants">
                    <div class="flex gap-x-2">
                        <UInput v-model="formState.applicantsInput" placeholder="Resolution Applicants" class="w-1/4"
                            name="applicantInput" />
                        <UButton icon="i-heroicons-plus" size="xs" @click="addApplicant">Hinzufügen</UButton>
                    </div>
                    <UBadge v-for="applicant in formState.body.applicants" :key="applicant" size="sm" class="mr-2 mt-2">
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
                        <UTextarea v-model="formState.body.text" placeholder="Resolution Text" />
                    </div>
                </UFormGroup>

                <UAlert icon="i-heroicons-exclamation-circle" variant="solid" title="Fehler beim Einsenden"
                    :description="postError" class="mt-5 bg-jusorot-600" v-if="postError" />
                <UButton type="submit" size="xl" block icon="i-heroicons-document-arrow-up" v-on:mouseover="startCountdown"
                    v-on:mouseleave="stopCountdown" :disabled="!confirmButtonActive">
                    {{ confirmButtonText || CONFIRM_BUTTON_TEXT }}
                </UButton>
            </div>
        </UForm>

        <UModal :prevent-close="true" v-model="showLoadingModal">
            <UCard>
                <template #header>
                    <div class="flex items-end">
                        <UIcon name="i-heroicons-document-arrow-up" class="text-3xl mr-3" />
                        <span class="text-xl font-bold"> Beschluss wird eingereicht...</span>
                    </div>
                </template>
                <div class="flex justify-center">
                    <div class="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-current 
                    border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite] text-white"
                        role="status"></div>
                </div>
            </UCard>
        </UModal>

    </div>
    <UNotifications />
</template>

<script setup lang="ts">
import type { FormError } from '@nuxt/ui/dist/runtime/types';
import { type INewResolution } from '~/types/Interfaces';

const config = useRuntimeConfig();
const toast = useToast();

const API_ENDPOINT = config.public.apiEndpoint;
const FETCHED_CATEGORIES = ["kategorie1", "kategorie2", "kategorie3"];
const CONFIRM_COUNTDOWN = 1.0;
const CONFIRM_BUTTON_TEXT = "Beschluss einreichen";

const applicantInput = ref(CONFIRM_BUTTON_TEXT);
const confirmButtonActive = ref(false);
const confirmButtonText = ref();
const showLoadingModal = ref(false);
const postError: Ref<String | undefined> = ref();


let countdown: any;


function startCountdown() {
    let seconds = CONFIRM_COUNTDOWN; // Countdown-Zeit in Sekunden

    confirmButtonActive.value = false;
    confirmButtonText.value = `${CONFIRM_BUTTON_TEXT} (${seconds}s)`;

    countdown = setInterval(() => {
        seconds -= 0.1;
        confirmButtonText.value = `${CONFIRM_BUTTON_TEXT} (${seconds.toFixed(1)}s)`;

        if (seconds <= 0) {
            clearInterval(countdown);
            confirmButtonActive.value = true;
            confirmButtonText.value = CONFIRM_BUTTON_TEXT;
        }
    }, 100);
}

function stopCountdown() {
    clearInterval(countdown);
    confirmButtonActive.value = false;
    confirmButtonText.value = CONFIRM_BUTTON_TEXT;
}

const formState: Ref<INewResolution> = ref({
    rid: "",
    rcode: "",
    created: new Date(),
    state: "",
    body: {
        title: "Testtitel",
        tag: "tag1",
        applicants: ["Admin"],
        year: 2023,
        category: null,
        text: "Testtext",
    },
    applicantsInput: "",
});

const addApplicant = () => {
    if (formState.value.body.applicants.includes(formState.value.applicantsInput.trim()) || formState.value.applicantsInput.trim() == "") {
        return;
    }
    formState.value.body.applicants.push(formState.value.applicantsInput.trim());
    applicantInput.value = "";
};

const removeApplicant = (applicant: String) => {
    formState.value.body.applicants = formState.value.body.applicants.filter((a) => a !== applicant);
};

const validateForm = (formState: INewResolution): FormError[] => {
    const errors = [];

    if (!formState.body?.title) {
        errors.push({
            path: "title",
            message: "Titel darf nicht leer sein",
        });
    }
    if (!formState.body?.tag) {
        errors.push({
            path: "tag",
            message: "Tag darf nicht leer sein",
        });
    }
    if (!formState.body?.year) {
        errors.push({
            path: "year",
            message: "Jahr darf nicht leer sein",
        });
    }
    if (!formState.body?.category) {
        errors.push({
            path: "categories",
            message: "Kategorien dürfen nicht leer sein",
        });
    }
    if (!formState.body?.applicants) {
        errors.push({
            path: "applicants",
            message: "Antragsteller*innen dürfen nicht leer sein",
        });
    }
    if (!formState.body?.text) {
        errors.push({
            path: "text",
            message: "Beschlusstext darf nicht leer sein",
        });
    }
    return errors;
}

async function submitForm() {
    console.log("submitting form");
    showLoadingModal.value = true;
    // wait at least 1s
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const { data, error } = await useLazyFetch("/resolution", {
        baseURL: API_ENDPOINT,
        method: "POST",
        body: JSON.stringify({
            resolution: {
                created: Date.now(),
                body: {
                    title: formState.value.body.title,
                    tag: formState.value.body.tag,
                    applicants: formState.value.body.applicants,
                    year: formState.value.body.year,
                    category: formState.value.body.category,
                    text: formState.value.body.text,
                }
            }
        }),
        onRequestError: (error) => {
            console.error(error);
            toast.add({
                title: "Fehler beim Erstellen des Beschlusses",
                description: error.error.message,
                icon: "i-heroicons-exclamation-triangle",
            });
        },
        onResponseError: (error) => {
            console.error(error);
            toast.add({
                title: "Fehler beim Erstellen des Beschlusses",
                description: error.error?.message,
                icon: "i-heroicons-exclamation-triangle",
            });
        },
    });
    if (error.value) {
        postError.value = error.value.message;
        showLoadingModal.value = false;
        toast.add({
            title: "Fehler beim Erstellen des Beschlusses",
            description: error.value.message,
            icon: "i-heroicons-exclamation-triangle",
            timeout: 8000,
        });
        return;
    }
}

</script>
