<template>
    <div class="flex gap-x-2">
        <UBadge v-for="role in props.roles" :key="role" size="xs">
            <span class="pr-0.5">
                {{ capitalize(role) }}
            </span>
            <UIcon name="i-heroicons-x-mark" class="text-base hover:cursor-pointer hover:bg-gray-50"
                @click="removeRole(role)" />
        </UBadge>
    </div>
</template>

<script setup lang="ts">

const props = defineProps(
    {
        roles: {
            type: Array<string>,
            required: true,
        },
    }
);
const emits = defineEmits(["update:roles"]);

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

function removeRole(roleToRemove: string) {
    const updatedRoles = props.roles.filter((role) => role !== roleToRemove);
    emits("update:roles", updatedRoles);
}

</script>
