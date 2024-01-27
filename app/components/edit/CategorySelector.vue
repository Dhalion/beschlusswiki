
<template>
    <div class="flex content-center">
        <USelectMenu :items="selectionDropdownItems" :popper="{ placement: 'bottom-start' }" class="pr-3 text-sm ">
            <UIcon name="i-heroicons-plus" class="text-3xl font-sans font-bold text-white" />
            <template #label="{ item }">
                <span class="text-xs text-left">{{ item.tag }} - {{ item.label }}</span>
            </template>
        </USelectMenu>
        <div class="flex gap-x-2">
            <UBadge v-for="selection in props.selected" :key="selection._id.toString()" size="xs">
                <span class="pr-1">
                    {{ capitalize(selection.name) }}
                </span>
                <UIcon name="i-heroicons-x-mark" class="text-lg hover:cursor-pointer hover:bg-gray-50"
                    @click="removeCategory(selection)" />
            </UBadge>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { ICategory } from '~/types/Interfaces';


const props = defineProps(
    {
        selected: {
            type: Array<ICategory>,
            required: true,
        },
        options: {
            type: Array<ICategory>,
            required: true,
        },
    },
);


const emits = defineEmits(["update:selected"]);

const selectionDropdownItems = computed(() => {
    return props.options ? props.options.map((selection) => ([{
        label: selection.name,
        tag: selection.tag,
        onclick: () => handleAddCategory(selection),
    }])) : [];
});


const capitalize = (s: String) => s.charAt(0).toUpperCase() + s.slice(1);


const handleAddCategory = (selection: ICategory) => {
    const updatedSelection = [...props.selected, selection];
    emits("update:selected", updatedSelection);
};

const removeCategory = (selection: ICategory) => {
    const updatedSelection = props.selected.filter((c) => c !== selection);
    emits("update:selected", updatedSelection);
};

</script>
