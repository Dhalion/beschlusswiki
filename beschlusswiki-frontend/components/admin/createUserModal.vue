<template>
    <div>
        <UButton label="Neuen Benutzer erstellen" variant="solid" color="primary" @click="isOpen = true"
            icon="i-heroicons-user-plus" />

        <UModal v-model="isOpen" prevent-close="true">
            <UCard :ui="{ divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">

                <!--* Header -->
                <template #header>
                    <div class="flex items-end">
                        <UIcon name="i-heroicons-user-plus" class="text-3xl mr-3" />
                        <span class="text-xl font-bold">Neuen Nutzer erstellen</span>
                    </div>
                </template>

                <!--* Form -->
                <UForm :state="state" :validate="validate" class="flex flex-col gap-3" @submit="handleSubmit">
                    <UFormGroup label="Benutzername" name="username">
                        <UInput v-model="state.username" icon="i-heroicons-at-symbol" />
                    </UFormGroup>

                    <UFormGroup label="Passwort" name="password">
                        <UInput v-model="state.password" type="password" icon="i-heroicons-lock-closed" />
                    </UFormGroup>

                    <UFormGroup label="Passwort wiederholen" name="passwordRepeat">
                        <UInput v-model="state.passwordRepeat" type="password" icon="i-heroicons-lock-closed" />
                    </UFormGroup>

                    <UFormGroup label="Rollen" name="roles">
                        <div class="flex flex-row pt-1 pb-2">
                            <UDropdown :items="UserRolesItems" :popper="{ placement: 'bottom-start' }" class="pr-3 text-sm">
                                <UIcon name="i-heroicons-plus" class="text-xl font-sans font-thin" />
                                <template #item="{ item }">
                                    <span class="text-xs">{{ item.label }}</span>
                                </template>
                            </UDropdown>
                            <AdminRoleBadgeSelector v-model:roles="state.roles" />
                        </div>
                    </UFormGroup>

                    <UFormGroup label=" Nutzer aktivieren" name="enabled" class="flex flex-row-reverse self-start gap-2">
                        <UToggle v-model="state.enabled" on-icon="i-heroicons-check" off-icon="i-heroicons-x" />
                    </UFormGroup>

                    <hr class="h-px mt-3 bg-gray-200 border-0 dark:bg-gray-700">

                    <div class="flex flex-row justify-end gap-2">
                        <UButton label="Abbrechen" variant="solid" color="primary" @click="isOpen = false"
                            icon="i-heroicons-archive-box-x-mark" />
                        <UButton label="Erstellen" variant="solid" color="primary" icon="i-heroicons-check-badge"
                            type="submit" />
                    </div>

                    <UAlert icon="i-heroicons-information-circle" color="red" variant="subtle" v-if="errorMessage">
                        <span class="text-sm">
                            {{ errorMessage }}
                        </span>
                    </UAlert>
                </UForm>
            </UCard>
        </UModal>


        <UModal prevent-close="true" v-model="showLoadingModal">
            <UCard>
                <template #header>
                    <div class="flex items-end">
                        <UIcon name="i-heroicons-user-plus" class="text-3xl mr-3" />
                        <span class="text-xl font-bold"> Nutzer wird erstellt...</span>
                    </div>
                </template>
                <div class="flex justify-center">
                    <div class="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-current 
                    border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite] text-white"
                        role="status"></div>
                </div>
            </UCard>
        </UModal>
        <UNotifications />
    </div>
</template>

<script setup lang="ts">
import type { FormError, FormSubmitEvent } from '@nuxt/ui/dist/runtime/types';

const toast = useToast();
const config = useRuntimeConfig();
const emit = defineEmits(["userCreated"]);

const API_ENDPOINT = config.public.apiEndpoint;

enum UserRoles {
    Admin = "admin",
    Editor = "editor",
    Contributor = "contributor",
}

interface IUserInput {
    username: string | undefined;
    password: string | undefined;
    passwordRepeat: string | undefined;
    roles: UserRoles[];
    enabled: boolean;
}

const UserRolesItems = [[
    { label: 'Admin', value: UserRoles.Admin, click: () => addUserRole(UserRoles.Admin) },
    { label: 'Editor', value: UserRoles.Editor, click: () => addUserRole(UserRoles.Editor) },
    { label: 'Contributor', value: UserRoles.Contributor, click: () => addUserRole(UserRoles.Contributor) },
]];


const state: Ref<IUserInput> = ref({
    username: undefined,
    password: undefined,
    passwordRepeat: undefined,
    roles: [],
    enabled: true,
});

const isOpen = ref(false);
const showLoadingModal = ref(false);
const errorMessage = ref<string | undefined>(undefined);

const validate = (state: IUserInput): FormError[] => {
    const errors: FormError[] = [];
    if (!state.username) errors.push({ path: 'username', message: 'Pflichtfeld' });
    if (!state.password) errors.push({ path: 'password', message: 'Pflichtfeld' });
    if (!state.passwordRepeat) errors.push({ path: 'passwordRepeat', message: 'Pflichtfeld' });
    if (state.password && state.passwordRepeat) {
        if (state.password !== state.passwordRepeat) errors.push({ path: 'passwordRepeat', message: 'Passwörter stimmen nicht überein' });
    }
    if (state.roles.length === 0) errors.push({ path: 'roles', message: 'Mindestens eine Rolle auswählen' });
    return errors;
}

const addUserRole = (role: UserRoles) => {
    if (!state.value.roles.includes(role)) {
        state.value.roles.push(role);
    }
}

async function handleSubmit(event: FormSubmitEvent<IUserInput>) {
    event.preventDefault();
    showLoadingModal.value = true;
    const { data, error } = await useFetch("/auth/user", {
        baseURL: API_ENDPOINT,
        method: "POST",
        body: JSON.stringify({
            username: state.value.username,
            password: state.value.password,
            roles: state.value.roles,
            enabled: state.value.enabled,
        }),
    });
    showLoadingModal.value = false;
    if (error.value) {
        console.error(error.value);
        errorMessage.value = error.value.statusMessage;
        toast.add({
            title: "Fehler beim Erstellen des Benutzers",
            icon: "i-heroicons-exclamation-triangle",
        });
        return;
    }
    if (data) {
        console.log(data);
        toast.add({
            title: "Benutzer erstellt",
            description: `Benutzer ${state.value.username} wurde erstellt.`,
            icon: "i-heroicons-check",
        });
        isOpen.value = false;
        emit("userCreated");
    }
}
</script>