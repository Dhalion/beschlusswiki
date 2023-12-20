<template>
    <UDropdown :items="items" :popper="{ placement: 'bottom-end' }" class="pl-4">

    </UDropdown>
    <UNotifications />
</template>

<script setup>
const { status, signOut } = useAuth();
const toast = useToast();

const items = computed(() => {
    return status.value === "authenticated" ? itemsLoggedIn : itemsLoggedOut;
});

const itemsLoggedIn = [[
    {
        label: 'Profile',
        icon: 'i-heroicons-user',
        onClick: () => navigateTo("/admin/dashboard")
    },
    {
        label: 'Logout',
        icon: 'i-heroicons-arrow-left-on-rectangle',
        onClick: () => logOut()
    }
]];

const itemsLoggedOut = [[
    {
        label: 'Login',
        icon: 'i-heroicons-arrow-right-on-rectangle',
        onClick: () => navigateTo("/admin/login")
    }
]];

function logOut() {
    signOut();
    toast.add({
        title: "Logged out",
        description: "You have been logged out.",
        closeButton: true,
        icon: "i-heroicons-check-circle",
    });
}


</script>
