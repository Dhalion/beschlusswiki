<template>
    <div class="text-black bg-slate-800 w-5/6 mx-auto">
        <UForm :validate="validateForm" @submit="submitForm">
            <div class="flex flex-col content-center p-4 gap-y-3">
                <UFormGroup label="Titel" class="row-span-2 self-center w-full">
                    <UInput v-model="formState.body.title" placeholder="Resolution Title" />
                </UFormGroup>
                <div class="flex gap-x-4">
                    <UFormGroup label="Tag" class="row-start-2">
                        <UInput v-model="formState.body.tag" placeholder="Resolution Tag" />
                    </UFormGroup>
                    <UFormGroup label="Jahr" class="row-start-1">
                        <UInput v-model="formState.body.year" placeholder="Resolution Year" />
                    </UFormGroup>
                </div>
                <UFormGroup label="Kategorien">
                    <ResolutionCreateBadgeSelector v-model:selected="formState.body.categories"
                        :options="FETCHED_CATEGORIES" class="mt-2" />
                </UFormGroup>
                <UFormGroup label="Antragsteller*innen">
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

                <UFormGroup label="Beschlusstext">
                    <div>
                        <span class="text-slate-400 text-xs flex gap-x-3 my-2">
                            Formatierten Text anzeigen
                            <UToggle disabled />
                        </span>
                        <UTextarea v-model="formState.body.text" placeholder="Resolution Text" />
                    </div>
                </UFormGroup>

                <UButton type="submit" size="xl" class="mt-5" block>Beschluss einreichen</UButton>
            </div>
        </UForm>
    </div>
</template>

<script setup lang="ts">
import type { FormError } from '@nuxt/ui/dist/runtime/types';


interface IResolution {
    rid: String;
    rcode: String;
    created: Date;
    state: String;
    body: {
        title: String;
        tag: String;
        applicants: Array<String>;
        year: Number;
        categories: Array<String>;
        text: String;
    };
    applicantsInput: String;
}

const config = useRuntimeConfig();
const FETCHED_CATEGORIES = ["kategorie1", "kategorie2", "kategorie3"];

const applicantInput = ref("");

const formState: Ref<IResolution> = ref({
    rid: "",
    rcode: "",
    created: new Date(),
    state: "",
    body: {
        title: "",
        tag: "",
        applicants: [],
        year: 0,
        categories: [],
        text: "",
    },
    applicantsInput: "",
});

const addApplicant = () => {
    if (formState.value.body.applicants.includes(formState.value.applicantsInput.trim())) {
        return;
    }
    formState.value.body.applicants.push(formState.value.applicantsInput.trim());
    applicantInput.value = "";
};

const removeApplicant = (applicant: String) => {
    formState.value.body.applicants = formState.value.body.applicants.filter((a) => a !== applicant);
};

const validateForm = (formState: IResolution): FormError[] => {
    const errors = [];
    if (!formState.body.title) {
        errors.push({
            path: "title",
            message: "Titel darf nicht leer sein",
        });
    }
    if (!formState.body.tag) {
        errors.push({
            path: "tag",
            message: "Tag darf nicht leer sein",
        });
    }
    if (!formState.body.year) {
        errors.push({
            path: "year",
            message: "Jahr darf nicht leer sein",
        });
    }
    if (!formState.body.categories) {
        errors.push({
            path: "categories",
            message: "Kategorien dürfen nicht leer sein",
        });
    }
    if (!formState.body.applicants) {
        errors.push({
            path: "applicants",
            message: "Antragsteller*innen dürfen nicht leer sein",
        });
    }
    if (formState.applicantsInput && formState.applicantsInput.match(/[!@#$%^&*()_+|~=`{}\[\]:;<>?,\/]/)) {
        errors.push({
            path: "applicantsInput",
            message: "Antragsteller*innen dürfen keine Sonderzeichen enthalten",
        });
    }
    return errors;
}

</script>
