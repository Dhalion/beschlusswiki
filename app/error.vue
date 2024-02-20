<template>
    <div class="flex flex-col w-1/2 mx-auto mt-20 p-5 rounded-3xl bg-primary">
        <img src="./assets/work-in-progress.png" class="w-1/3 p-3 mx-auto" alt="work in progress" />
        <h1 class="font-bold tracking-wide text-4xl text-center">Oopsies</h1>
        <p class="text-center mt-2">Hier ist wohl etwas schief gelaufen!</p>
        <div class="bg-primary-300 rounded-md my-5">
            <p class="p-5 font-mono text-sm">{{ props.error?.message }}</p>
        </div>
        <span @click="handleError"
            class="hover:cursor-pointer bg-primary-500 text-center text-2xl p-3 rounded-xl flex justify-center">
            <UIcon name="i-heroicons-arrow-uturn-left" class="inline-block self-center mr-3" />
            Zurück zur Startseite
        </span>
    </div>
</template>

<script setup lang="ts">
import type { NuxtError } from '#app';


const props = defineProps({
    error: Object as () => NuxtError
})

const handleError = () => clearError({ redirect: '/' })


</script>