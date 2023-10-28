<template>
  <div>
    <UTooltip text="Beschlusskopf bearbeiten">
      <UIcon
        name="i-heroicons-pencil-square-solid"
        class="text-gray-600 md:text-2xl text-lg m-3 cursor-pointer"
        @click="isOpen = true"
      />
    </UTooltip>

    <span>{{ loadedResolution.value }}</span>

    <UModal v-model="isOpen">
      <UCard
        :ui="{
          ring: '',
          divide: 'divide-y divide-gray-100 dark:divide-gray-800',
        }"
      >
        <template #header>
          <div class="flex items-center justify-between">
            <h3
              class="text-base font-semibold leading-6 text-gray-900 dark:text-white"
            >
              Beschlusskopf bearbeiten
            </h3>
            <UButton
              color="gray"
              variant="ghost"
              icon="i-heroicons-x-mark-20-solid"
              class="-my-1"
              @click="isOpen = false"
            />
          </div>
        </template>

        <!--* BODY *-->
        <UForm
          class="grid grid-rows-3 grid-cols-2 items-start gap-x-10 gap-y-3"
          :state="state"
          :validate="validate"
          @submit="submit"
        >
          <UFormGroup label="Titel" name="title" class="col-span-2">
            <UInput v-model="state.title" placeholder="Titel" />
          </UFormGroup>
          <UFormGroup label="Tag" name="tag">
            <UInput v-model="state.tag" placeholder="Tag" />
          </UFormGroup>
          <UFormGroup label="Jahr" name="year">
            <UInput v-model="state.year" placeholder="Jahr" />
          </UFormGroup>

          <UButton
            type="submit"
            class="col-start-2 h-2/3 place-self-end self-center"
            :disabled="!isInputValid"
          >
            Speichern</UButton
          >
        </UForm>
      </UCard>
    </UModal>
  </div>
</template>

<script setup>
const isOpen = ref(false);
const isInputValid = ref(false);
const loadedResolution = useLoadedResolution();

const state = computed(() => {
  return {
    title: loadedResolution.value.body.title,
    tag: loadedResolution.value.body.tag,
    year: loadedResolution.value.body.year,
  };
});

const validate = (state) => {
  const errors = [];
  if (!state.title) errors.push({ path: "title", message: "Titel fehlt" });
  if (!state.tag) errors.push({ path: "tag", message: "Tag fehlt" });
  if (!state.year) errors.push({ path: "year", message: "Jahr fehlt" });
  // try to Parse year to int, check if its a valid number
  if (state.year && isNaN(parseInt(state.year)))
    errors.push({ path: "year", message: "Jahr ist keine Zahl" });

  if (errors.length === 0) isInputValid.value = true;
  else isInputValid.value = false;
  return errors;
};

async function submit() {
  loadedResolution.value.body.title = state.value.title;
  loadedResolution.value.body.tag = state.value.tag;
  loadedResolution.value.body.year = state.value.year;
  isOpen.value = false;
}
</script>
