<template>
    <div class="bg-hellrosa text-beere flex justify-center 
        justify-self-center place-items-center">
        <div class="flex flex-col items-center p-10">
            <span class="font-black text-8xl pb-4">{{ resolution.tag }}</span>
            <span class="font-black text-6xl">{{ resolution.jahr }}</span>
        </div>
        <div class="w-3/4 p-1 font-bold text-4xl 
        line-clamp-3 text-clip pr-4">
            {{ resolution.titel }}
        </div>
    </div>
    <!-- Category and Origin Bar -->
    <div class="bg-beere flex justify-between items-center p-1 px-3">
        <span class="text-xs font-sans text-white antialiased"> Kategorie / Unterkategorie </span>
        <span class="px-3 my-1 py-1 bg-hellrosa text-beere rounded-full text-sm tracking-wide"
            v-for="applicant in resolution.antragsteller">Bayern</span>
    </div>
</template>

<script setup>
const { resolution } = defineProps({
    resolution: Object,
})


const applicants = () => {
    resolution.antragsteller.forEach((applicant) => {
        return applicant;
    })
};

</script>