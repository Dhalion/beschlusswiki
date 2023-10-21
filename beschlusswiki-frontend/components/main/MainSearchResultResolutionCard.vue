<template>
    <NuxtLink :href="resolutionUrl" class="w-full bg-slate-100 rounded-2xl p-2 m-4 
                flex flex-row divide-x divide-gray-400 text-black 
                shadow-inner hover:shadow-xl hover:bg-slate-150
                hover:text-red transition-all transform-gpu hover:scale-x-105 duration-500 ease-out 
                ">

        <!-- Resolution Tag and Year -->
        <div class="w-1/12 flex flex-col text-center">
            <span>{{ resolution.body.tag }}</span>
            <span>{{ resolution.body.year }}</span>
        </div>
        <!-- Resolution Title -->
        <div class="flex w-full items-center pl-5 mr-2">
            {{ resolution.body.title }}
        </div>
    </NuxtLink>
</template>

<script setup>
const { resolution } = defineProps({
    resolution: String,
});
const resolutionUrl = computed(() => `/resolution/${resolution._id}`);

</script>