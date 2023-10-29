
<template>
    <div class="flex content-center">
        <UDropdown :items="selectionDropdownItems" :popper="{ placement: 'bottom-start' }" class="pr-3 text-sm">
            <UIcon name="i-heroicons-plus" class="text-3xl font-sans font-bold text-white" />
            <template #item="{ item }">
                <span class="text-xs">{{ item.label }}</span>
            </template>
        </UDropdown>
        <div class="flex gap-x-2">
            <UBadge v-for="selection in props.selected" :key="selection" size="xs">
                <span class="pr-1">
                    {{ capitalize(selection) }}
                </span>
                <UIcon name="i-heroicons-x-mark" class="text-lg hover:cursor-pointer hover:bg-gray-50"
                    @click="removeCategory(selection)" />
            </UBadge>
        </div>
    </div>
</template>

<script setup lang="ts">

const props = defineProps(
    {
        selected: {
            type: Array<string>,
            required: true,
        },
        options: {
            type: Array<string>,
            required: true,
        },
    },
);


const emits = defineEmits(["update:selected"]);

const selectionDropdownItems = computed(() => {
    // Return all categories from FETCHED_CATEGORIES with schema [[{ label: "kategorie1" }], [{ label: "kategorie2" }], ...]
    return props.options.map((selection) => ([{
        label: selection,
        onclick: () => handleAddCategory(selection),
    }]));
});


const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);


const handleAddCategory = (selection: string) => {
    const updatedSelection = [...props.selected, selection];
    emits("update:selected", updatedSelection);
};

const removeCategory = (selection: string) => {
    const updatedSelection = props.selected.filter((c) => c !== selection);
    emits("update:selected", updatedSelection);
};

</script>
