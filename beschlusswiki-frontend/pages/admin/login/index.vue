<template>
  <div class="bg-slate-800 w-1/3 mx-auto mt-16 p-8 rounded-3xl">
    <UForm
      :state="state"
      class="text-slate-800 gap-y-3 flex flex-col"
      :validate="validate"
      @submit.prevent="submit"
    >
      <span class="text-gray-300 font-bold text-2xl">Anmelden</span>

      <span v-if="state.error" class="text-red-500 text-sm">
        {{ state.error.message }}
      </span>

      <UFormGroup name="email" label="Email oder Nutzername" required>
        <UInput
          v-model="state.email"
          type="text"
          placeholder="E-Mail"
          icon="i-heroicons-envelope"
        />
      </UFormGroup>

      <UFormGroup label="Passwort" name="password" required>
        <UInput
          v-model="state.password"
          type="password"
          placeholder="Passwort"
          icon="i-heroicons-lock-closed"
        />
      </UFormGroup>

      <UButton type="submit" class="mt-2" block> Anmelden </UButton>
    </UForm>
    Status: {{ status }}
    <br />
    data: {{ data }}
  </div>
</template>

<script setup>
import { useRoute } from "nuxt/app";

definePageMeta({
  auth: {
    unauthenticatedOnly: true,
    navigateAuthenticatedTo: "/",
  },
});

const { status, data, signIn, signOut } = useAuth();

const config = useRuntimeConfig();
const route = useRoute();

const state = ref({
  email: "user",
  password: "password",
  error: undefined,
});

const redirect = route.query.redirect;

const validate = (state) => {
  const errors = [];
  if (!state.email) errors.push({ path: "email", message: "Pflichtfeld" });
  if (!state.password)
    errors.push({ path: "password", message: "Pflichtfeld" });
  // Check email format per regex if field contains @
  if (
    state.email &&
    state.email.includes("@") &&
    !state.email.match(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/)
  ) {
    errors.push({ path: "email", message: "Ungültige E-Mail Adresse" });
  }
  return errors;
};

async function submit(event) {
  try {
    event.preventDefault();
    await signIn({
      username: state.value.email,
      password: state.value.password,
    });
  } catch (error) {
    console.error(error);
    state.value.error = error;
  }
  console.log("Auth Status: " + status.value);
  if (status.value === "authenticated") {
    // Leite den Benutzer zur gespeicherten URL zurück
    navigateTo(redirect || "/admin/dashboard");
  }
}
</script>
