<template>
  <div class="bg-slate-800 w-1/3 mx-auto mt-16 p-8 rounded-3xl">
    <UForm :state="state" class="text-slate-800 gap-y-5 flex flex-col" :validate="validate" @submit="submit">
      <span class="text-gray-300 font-bold text-2xl">Registrieren</span>

      <UFormGroup name="key" label="* Registrierungsschlüssel" help="">
        <UInput v-model="state.key" type="text" placeholder="Registrierungsschlüssel" icon="i-heroicons-key" />
      </UFormGroup>

      <UFormGroup name="email" label="Email oder Nutzername" required>
        <UInput v-model="state.email" type="text" placeholder="E-Mail" icon="i-heroicons-envelope" />
      </UFormGroup>

      <UFormGroup label="Passwort" name="password" required>
        <UInput v-model="state.password" type="password" placeholder="Passwort" icon="i-heroicons-lock-closed" />
      </UFormGroup>

      <UButton type="submit" class="mt-2" block> Anmelden </UButton>

      <span v-if="!state.key" class="text-slate-500 text-sm">
        * Ohne Registrierungsschlüssel muss der Account erst freigeschaltet
        werden.
      </span>
    </UForm>
  </div>
</template>

<script setup>
const state = ref({
  key: undefined,
  email: undefined,
  password: undefined,
});

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
  event.preventDefault();
  if (validate(state).length > 0) return;
  console.log(event.data);
}
</script>
