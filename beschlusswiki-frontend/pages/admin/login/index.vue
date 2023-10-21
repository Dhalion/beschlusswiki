<template>
    <div class="bg-slate-800 w-1/3 mx-auto mt-16 p-8 rounded-3xl">
        <UForm :state="state" class="text-slate-800 gap-y-3 flex flex-col" @submit="submit" :validate="validate">
            <span class="text-gray-300 font-bold text-2xl">Anmelden</span>

            <span class="text-red-500 text-sm" v-if="state.error">
                {{ state.error.message }}
            </span>

            <UFormGroup name="email" label="Email oder Nutzername" required>
                <UInput type="text" placeholder="E-Mail" v-model="state.email" icon="i-heroicons-envelope" />
            </UFormGroup>

            <UFormGroup label="Passwort" name="password" required>
                <UInput type="password" placeholder="Passwort" v-model="state.password" icon="i-heroicons-lock-closed" />
            </UFormGroup>

            <UButton type="submit" class="mt-2" block>
                Anmelden
            </UButton>
        </UForm>
    </div>
</template>

<script setup>

const { signIn, signOut } = useAuth();

const state = ref({
    email: "abc@example.com",
    password: "undefined",
    error: undefined,
});

const validate = (state) => {
    const errors = [];
    if (!state.email) errors.push({ path: "email", message: "Pflichtfeld" })
    if (!state.password) errors.push({ path: "password", message: "Pflichtfeld" })
    // Check email format per regex if field contains @
    if (state.email && state.email.includes("@") && !state.email.match(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/)) {
        errors.push({ path: "email", message: "Ungültige E-Mail Adresse" })
    }
    return errors;
}

async function submit(event) {
    console.log("submit");
    try {
        const res = await signIn(state.email, state.password);
        console.log(res);
    } catch (error) {
        state.value.error = error;
    }

}

</script>
