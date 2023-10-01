<template>
    <div class="flex flex-col items-center mt-10">
        <!-- Category Cards Container -->
        <div class="bg-white h-full text-black w-3/4 items-center
            grid gap-4 grid-cols-2 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5
        ">
            <!-- Category Cards -->
            <MainCategoryCard v-for="category in categories" :key="category.id" :categoryTitle="category.title"
                :categoryImage="category.image" />

        </div>
    </div>
</template>

<script setup>
const search = useSearch();

const categories = [
    {
        title: "Bildung",
        image: "Bildung.svg",
        id: 1
    },
    {
        title: "Europa und Internationales",
        image: "EuropaUndInternationales.svg",
        id: 2
    },
    {
        title: "Gegen Rechts",
        image: "GegenRechts.svg",
        id: 3
    },
    {
        title: "Arbeitsprogramme",
        image: "Arbeitsprogramme.svg",
        id: 4
    },
    {
        title: "Digitales",
        image: "Digitales.svg",
        id: 5
    },
    {
        title: "Einwanderung",
        image: "Einwanderung.svg",
        id: 6
    },
    {
        title: "Familie",
        image: "Familie.svg",
        id: 7
    },
    {
        title: "Feminismus",
        image: "Feminismus.svg",
        id: 8
    },
    {
        title: "Gesundheit",
        image: "Gesundheit.svg",
        id: 9
    },
    {
        title: "Justiz und Inneres",
        image: "JustizUndInneres.svg",
        id: 10
    },
    {
        title: "Kommunales und Landespolitik",
        image: "KommunalesUndLandespolitik.svg",
        id: 11
    },
    {
        title: "LGBTIQ",
        image: "LGBTIQ.svg",
        id: 12
    },
    {
        title: "Partei und Jusos",
        image: "ParteiUndJusos.svg",
        id: 13
    },
    {
        title: "Satzungsänderungen",
        image: "Satzungsänderungen.svg",
        id: 14
    },
    {
        title: "Umwelt und Energie",
        image: "UmweltUndEnergie.svg",
        id: 15
    },
    {
        title: "Verkehr und Infrastruktur",
        image: "VerkehrUndInfrastruktur.svg",
        id: 16
    },
    {
        title: "Wirtschaft und Soziales",
        image: "WirtschaftUndSoziales.svg",
        id: 17
    },
]



</script>
