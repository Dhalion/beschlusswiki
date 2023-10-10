<template>
    <div class="bg-hellrosa p-5 flex">
        <div class="w-5/6">
            <span class="text-5xl text-altrot font-extrabold">Beschluss bearbeiten</span>
            <div class="flex items-center">
                {{ loadedResolution.value }}
                <span class="text-beere text-2xl font-bold">{{ fullTitle }}</span>
                <EditResolutionHeadModal class="p-2" />

            </div>
        </div>
        <div class="w-1/6 flex justify-end items-center">
            <EditSaveEditedResolutionModal />
        </div>
    </div>
</template>

<script setup>
const loadedResolution = useLoadedResolution();


const resolution = computed(() => {
    return {
        title: loadedResolution.value.body.title,
        tag: loadedResolution.value.body.tag,
        year: loadedResolution.value.body.year,
        text: loadedResolution.value.body.text,
    }
});



const fullTitle = computed(() => {
    return `${resolution.value.title} (${resolution.value.year}) - ${resolution.value.tag}`;
});



</script>