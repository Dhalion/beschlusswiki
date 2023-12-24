<template>
  <div class="bg-rosa text-black w-1/3 mx-auto mt-16 p-8 rounded-3xl">
    <UForm :state="state" class="text-black gap-y-3 flex flex-col" :validate="validate" @submit="submit">
      <span class="text-altrot font-bold text-2xl">Anmelden</span>

      <span v-if="state.error" class="text-red-500 text-sm">
        {{ state.error.message }}
      </span>

      <UFormGroup name="email" label="Email oder Nutzername" required style="color: altrot;">
        <UInput v-model="state.email" type="text" placeholder="E-Mail" icon="i-heroicons-envelope" />
      </UFormGroup>

      <UFormGroup label="Passwort" name="password" required>
        <UInput v-model="state.password" type="password" placeholder="Passwort" icon="i-heroicons-lock-closed" />
      </UFormGroup>

      <UButton type="submit" class="mt-2" block> Anmelden </UButton>
    </UForm>
  </div>
</template>

<script setup>
import { useRoute } from "nuxt/app";

definePageMeta({
  auth: {
    unauthenticatedOnly: true,
    navigateAuthenticatedTo: "/admin",
  },
});

const { status, data, signIn, signOut } = useAuth();

const route = useRoute();

const state = ref({
  email: "",
  password: "",
  error: undefined,
});

const redirect = route.query.redirect;

if (status.value === "authenticated") {
  navigateTo(redirect || "/admin");
}


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
    await signIn({
      username: state.value.email,
      password: state.value.password,
    }, {
      callbackUrl: redirect || "/admin",
    });
  } catch (error) {
    console.error(error);
    state.value.error = error;
  }
  if (status.value === "authenticated") {
    // Leite den Benutzer zur gespeicherten URL zurück
    navigateTo(redirect || "/admin", { external: true });
  }
}
</script>
