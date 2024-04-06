<template>
    <div class="m-5">
        <div class="flex gap-3">
            <UButton @click="cache.refresh()" color="primary" variant="solid" icon="i-heroicons-arrow-path">
                Refresh Cache Informationen
            </UButton>
            <UPopover>
                <UButton color="primary" variant="solid" icon="i-heroicons-trash">
                    Cache leeren
                </UButton>
                <template #panel="{ close }">
                    <div class="p-4">
                        Cache sicher leeren?
                        <div class="flex justify-around gap-3 mt-3">
                            <UButton color="primary" variant="solid" @click="close">
                                Nein
                            </UButton>
                            <UButton @click="clearCache(); close();" color="primary" variant="outline">
                                Ja
                            </UButton>
                        </div>
                    </div>
                </template>
            </UPopover>
        </div>
        <UCard class="p-3 mt-3">
            <UAlert v-show="cache.pending.value == true" title="Lade Cache Informationen" color="blue" variant="solid"
                icon="i-heroicons-archive-box-arrow-down" />

            <UAlert v-if="cache.error.value" title="Fehler beim Laden des Caches" color="red" variant="solid"
                icon="i-heroicons-exclamation-triangle" />
            <div class="text-lg" v-if="cache.data.value && !cache.pending.value">
                <h3 class="text-2xl font-semibold mb-3">
                    Cache Informationen:
                </h3>
                <p class="font-bold">Cache Größe: <span class="font-mono font-normal">{{ cache.data.value.size
                        }}</span>
                </p>
                <p class="font-bold">Cache Einträge:
                <ul class="font-mono font-normal" v-for="key in cache.data.value.keys" v-if="cache.data.value.keys">
                    <li> {{ key }} </li>
                </ul>
                <span v-else>-</span>
                </p>
            </div>
        </UCard>
    </div>
</template>

<script setup lang="ts">


definePageMeta({
    middleware: "authentication",
    layout: "admin",
});



const { status: authStatus,
    data: authData,
    lastRefreshedAt,
    getSession,
    signIn,
    token
} = useAuth();

const config = useRuntimeConfig();
const router = useRouter();
const toast = useToast();

const cache = await useFetch('/api/cache', {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
    },
});

async function clearCache() {
    // check if the user is authenticated
    if (authStatus.value !== 'authenticated') {
        // redirect to the login page
        toast.add({
            title: 'Nicht authentifiziert',
            description: 'Bitte melden Sie sich an, um fortzufahren.',
            color: 'red',
            icon: 'i-heroicons-exclamation-triangle',
        });
        router.push('/admin/login');
        return;
    }


    const response = await $fetch('/api/cache/flush', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            "Authorization": token.value || "",
        },
    });

    if (response) {
        toast.add({
            title: 'Cache geleert',
            description: 'Der Cache wurde erfolgreich geleert.',
            color: 'green',
            icon: 'i-heroicons-check-circle',
        });
        cache.refresh();
    } else {
        toast.add({
            title: 'Fehler beim Leeren des Caches',
            description: 'Der Cache konnte nicht geleert werden.',
            color: 'red',
            icon: 'i-heroicons-exclamation-triangle',
        });
    }
}


</script>
