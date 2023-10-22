<template>
    <NuxtLink :href="resolutionUrl" class="w-full bg-slate-100 rounded-2xl p-2 xl:my-4 my-1
                flex flex-row divide-x divide-gray-400 text-black 
                shadow-inner hover:shadow-xl hover:bg-slate-150
                hover:text-red transition-all transform-gpu hover:scale-x-105 duration-500 ease-out 
                ">

        <!-- Resolution Tag and Year -->
        <div class="xl:w-1/12 w-3/12 flex flex-col text-center xl:text-base text-sm">
            <span>{{ resolution.body.tag }}</span>
            <span>{{ resolution.body.year }}</span>
        </div>
        <!-- Resolution Title -->
        <div class="flex w-full items-center xl:pl-5 pl-2 xl:mr-2 text-sm xl:text-base">
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