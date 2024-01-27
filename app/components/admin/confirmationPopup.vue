<template>
    <div>
        <UCard>
            <template #header>
                <div class="flex items-baseline">
                    <UIcon name="i-heroicons-exclamation-triangle" class="text-2xl mr-2" />
                    <span class="font-semibold text-base self-center">{{ title || "Sicher?" }}</span>
                </div>
            </template>
            <div class="flex flex-row gap-2 justify-end">
                <UButton label="Ja" size="sm" @click="$emit('confirm')" variant="outline" block class="w-1/2" />
                <UButton label="Nein" size="sm" @click="$emit('cancel')" block class="w-1/2" />
            </div>
        </UCard>
    </div>
</template>

<script setup>

const { title, body } = defineProps({
    title: String,
    body: String,
});

</script>