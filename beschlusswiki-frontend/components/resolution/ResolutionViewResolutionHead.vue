<template>
    <div class="bg-hellrosa text-beere flex justify-center 
        justify-self-center place-items-center w-full">
        <div class="flex flex-col items-center p-10">
            <span class="font-black text-8xl pb-4">{{ resolution.body.tag }}</span>
            <span class="font-black text-6xl">{{ resolution.body.year }}</span>
        </div>
        <div class="w-3/4 p-1 font-bold text-4xl 
        line-clamp-3 text-clip pr-4">
            {{ resolution.body.title }}
        </div>
    </div>

    <!-- Category and Origin Bar -->
    <div class="bg-beere flex justify-between items-center p-1 px-3">
        <span class="text-xs font-sans text-white antialiased"> Kategorie / Unterkategorie </span>
        <span class="px-3 my-1 py-1 bg-hellrosa text-beere rounded-full text-sm tracking-wide"
            v-for="applicant in resolution.body.applicants">Bayern</span>
    </div>

    <!-- Resolution not live Warning -->
    <div class="bg-red-600 flex p-3 my-5  border-slate-400  text-white font-semibold tracking-widest justify-center"
        v-if="warningMessage">
        {{ warningMessage }}
    </div>
</template>

<script setup>
const { resolution } = defineProps({
    resolution: Object,
})

onMounted(() => {
    console.log(resolution);
})

const warningMessage = computed(() => {
    switch (resolution.state) {
        case "staged":
            return "Dieser Beschluss wurde noch nicht freigegeben!";
        case "archived":
            return "Dieser Beschluss ist archiviert!";
        case "live":
            return "";
        default:
            return "";
    }
})

const applicants = () => {
    resolution.body.applicants.forEach((applicant) => {
        return applicant;
    })
};

</script>