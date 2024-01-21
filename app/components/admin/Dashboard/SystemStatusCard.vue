<template>
    <UCard class="mt-5">
        <template #header>
            <div class="flex items-center">
                <h3 class="font-bold text-2xl dark:text-slate-100 text-slate-500">Beschlusswiki Status</h3>
                <UIcon name="i-heroicons-arrow-path" class="text-2xl text-slate-100 ml-2 hover:cursor-pointer"
                    @click="refresh()" />
            </div>
        </template>
        <div class="grid grid-cols-4 text-slate-50">
            <div>
                <h4 class="text-xl font-semibold">Status Wiki</h4>
                <p class="text-sm font-light">Version: {{ config.public.version }}</p>
                <UBadge size="xs" color="green">Online</UBadge>
            </div>
            <div>
                <h4 class="text-xl font-semibold">Status Backend</h4>
                <p class="text-sm font-light">Version: {{ config.public.version }}</p>
                <UBadge size="xs" :color="apiStatus.color">{{ apiStatus.text }}</UBadge>
            </div>
            <div>
                <h4 class="text-xl font-semibold">Status Datenbank</h4>
                <UBadge size="xs" :color="dbStatus.color">{{ dbStatus.text }}</UBadge>
            </div>
            <div>
                <h4 class="text-xl font-semibold">Status Elasticsearch</h4>
                <UBadge size="xs" :color="esStatus.color">{{ esStatus.text }}</UBadge>
            </div>
        </div>
    </UCard>
</template>

<script setup lang="ts">
import { type ApiStatusData, ElasticStatus } from "~/types/Interfaces";
import { ConnectionStates } from "mongoose";

const config = useRuntimeConfig();

const POLLING_INTERVAL = 1000 * 10; // 10 seconds

const { data, error, status, refresh } = useFetch<ApiStatusData>("/status", {
    baseURL: config.public.apiEndpoint,
    method: "GET",
    headers: {
        "Content-Type": "application/json",
    },
});

const apiStatus = computed(() => {
    switch (status.value) {
        case 'pending':
            return {
                color: "yellow",
                text: "loading"
            };
        case 'error':
            return {
                color: "red",
                text: "error"
            };
        case 'success':
            return {
                color: "green",
                text: "online"
            };
        default:
            return {
                color: "gray",
                text: "unknown"
            };
    }
});

const dbStatus = computed(() => {
    if (!data.value || !data.value?.db) {
        return {
            color: "gray",
            text: "unknown"
        };
    }
    switch (data.value.db) {
        case ConnectionStates.connected:
            return {
                color: "green",
                text: "connected"
            };
        case ConnectionStates.connecting:
            return {
                color: "yellow",
                text: "connecting"
            };
        case ConnectionStates.disconnecting:
            return {
                color: "red",
                text: "disconnected"
            };
        default:
            return {
                color: "gray",
                text: "unknown"
            };
    }
});

const esStatus = computed(() => {
    if (!data.value) {
        return {
            color: "gray",
            text: "unknown"
        };
    }
    switch (data.value.es?.status) {
        case ElasticStatus.AVAILABLE:
            return {
                color: "green",
                text: "available"
            };

        case ElasticStatus.UNAVAILABLE:
            return {
                color: "red",
                text: "unavailable"
            };
        default:
            return {
                color: "yellow",
                text: "unknown"
            };
    }
});

</script>
