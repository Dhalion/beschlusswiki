<template>
    <div>
        <UTooltip text="Beschluss speichern">
            <UIcon name="i-heroicons-arrow-down-tray" class="text-beere text-5xl m-3 cursor-pointer"
                @click="isOpen = true" />
        </UTooltip>

        <UModal v-model="isOpen">
            <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
                <template #header>
                    <div class="flex items-center justify-between">
                        <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
                            Beschluss speichern und veröffentlichen?
                        </h3>
                        <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" @click="isOpen = false" />
                    </div>
                </template>


                <div class="flex justify-end space-x-2">
                    <UButton>Abbrechen</UButton>
                    <UButton>Speichern</UButton>
                </div>
            </UCard>
        </UModal>
    </div>
</template>

<script setup>

const isOpen = ref(false);
</script>