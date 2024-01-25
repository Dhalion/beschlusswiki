<template>
    <div class="text-black bg-slate-800 w-5/6 mx-auto">
        <UForm ref="form" :state="formState" :validate="validateForm" @submit="submitForm(ResolutionState.Staged)">
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

                <UFormGroup label="Kategorien" name="categories" class="min-w-min md:w-1/2 lg:w-1/3">
                    <USelectMenu v-model="formState.body.category" :options="categories">
                        <template #label>
                            {{ resolutionCategoryString }}
                        </template>

                        <template #option="{ option }: { option: ICategory }">
                            {{ option.tag }} - {{ option.name }}
                        </template>
                    </USelectMenu>

                </UFormGroup>

                <UFormGroup label="Antragsteller*innen" name="applicants">
                    <div class="flex gap-x-2">
                        <UInput v-model="formState.applicantsInput" placeholder="Resolution Applicants" class="w-1/4"
                            name="applicantInput" />
                        <UButton icon="i-heroicons-plus" size="xs" @click="addApplicant">Hinzufügen</UButton>
                    </div>
                    <UBadge v-for="applicant in formState.body.applicants" :key="applicant.toString()" size="sm"
                        class="mr-2 mt-2">
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
                    :description="postError.toString()" class="my-5 bg-orange" v-if="postError" />
                <UButtonGroup class="flex justify-center">
                    <UButton size="xl" type="submit" icon="i-heroicons-document-arrow-up" v-on:mouseover="startCountdown"
                        v-on:mouseleave="stopCountdown" :disabled="!confirmButtonActive" class="w-2/3" @click="">
                        {{ confirmButtonText || CONFIRM_BUTTON_TEXT }}
                    </UButton>
                    <UDropdown :items="submitOptionsItems" :popper="{ placement: 'bottom-start' }">
                        <UButton icon="i-heroicons-chevron-down" class="" />
                    </UDropdown>
                </UButtonGroup>
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
import { type INewResolution, type ICategory, type IResolutionCreatedResponse, ResolutionState } from '~/types/Interfaces';

definePageMeta({
    middleware: "authentication"
});

const config = useRuntimeConfig();
const toast = useToast();
const router = useRouter();
const route = useRoute();

const { status: authStatus,
    data: authData,
    lastRefreshedAt,
    getSession,
    signIn,
    token,
} = useAuth();


const API_ENDPOINT = config.public.apiEndpoint;
const FETCHED_CATEGORIES = ["kategorie1", "kategorie2", "kategorie3"];
const CONFIRM_COUNTDOWN = 1.0;
const CONFIRM_BUTTON_TEXT = "Beschluss einreichen";

const applicantInput = ref(CONFIRM_BUTTON_TEXT);
const confirmButtonActive = ref(false);
const confirmButtonText = ref();
const showLoadingModal = ref(false);
const postError: Ref<String | undefined> = ref();

const form = ref();
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
        category: undefined,
        text: "Testtext",
    },
    applicantsInput: "",
});


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

const addApplicant = () => {
    if (formState.value.body.applicants.includes(formState.value.applicantsInput.trim()) || formState.value.applicantsInput.trim() == "") {
        return;
    }
    formState.value.body.applicants.push(formState.value.applicantsInput.trim());
    applicantInput.value = "";
};

// Fetch categories
const { data: fetchedCategories } = await useLazyFetch<ICategory[]>("/category", {
    baseURL: config.public.apiEndpoint,
    method: "GET",
});

const categories = computed(() => {
    if (fetchedCategories.value) {
        return fetchedCategories.value.map((category) => {
            return {
                _id: category._id,
                tag: category.tag,
                name: category.name,
            };
        });
    }
    return [];
});


const resolutionCategoryString = computed(() => {
    if (formState.value?.body?.tag && formState.value?.body.category?.name) return formState.value.body.category?.tag + " - " + formState.value.body.category?.name;
    return "Nicht zugewiesen";
});

const removeApplicant = (applicant: String) => {
    formState.value.body.applicants = formState.value.body.applicants.filter((a) => a !== applicant);
};

const submitOptionsItems = [
    [{
        label: "Direkt veröffentlichen",
        icon: "i-heroicons-document-arrow-up",
        click: () => submitForm(ResolutionState.Live),
    },
    {
        label: "Beschluss als Entwurf speichern",
        icon: "i-heroicons-document-duplicate",
        click: () => submitForm(ResolutionState.Draft),
    },]
];

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
    const tagLetters = formState.body?.tag?.match(/^[a-zA-Z]+/g)?.[0];
    if (formState.body.category?.tag != tagLetters) {
        errors.push({
            path: "tag",
            message: "Tag muss mit der Kategorie übereinstimmen",
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
            message: "Kategorie darf nicht leer sein",
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

async function submitForm(state: ResolutionState = ResolutionState.Staged) {
    // Trigger form validation
    const errors = await form.value.validate();
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
    showLoadingModal.value = true;
    console.log(`Session Token: ${session.token}\nToken: ${token.value}`);
    // wait at least 1s
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const { data, error } = await useLazyFetch<IResolutionCreatedResponse>("/resolution", {
        baseURL: API_ENDPOINT,
        method: "POST",
        headers: {
            "Authorization": token.value || "no token found",
        },
        body: JSON.stringify({
            resolution: {
                created: Date.now(),
                state: state,
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
    if (data.value && data.value.success) {
        toast.add({
            title: "Beschluss erfolgreich erstellt",
            description: "Der Beschluss wurde erfolgreich erstellt.",
            icon: "i-heroicons-check-circle",
            timeout: 8000,
        });
        showLoadingModal.value = false;
        router.push(`/resolution/${data.value.id}`);
    }
}

</script>
