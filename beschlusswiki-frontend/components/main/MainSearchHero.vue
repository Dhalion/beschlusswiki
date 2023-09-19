<template>
    <div class="shadow-lg w-full h-60 bg-rosa
                flex justify-center items-center flex-col
                mt-3 rounded-3xl
                ">
        <h1 class="text-beere text-5xl font-bold">
            Anträge suchen
        </h1>

        <!-- Searchbar -->
        <input color="jusorot" class="mt-8 w-1/2 bg-white text-black p-3 rounded-xl shadow-xl border-cool-200 border-2 
        focus:outline-none hover:ring hover:ring-beere focus:ring focus:ring-beere focus:scale-105
        transition-transform hover:scale-105 duration-300 ease-in-out" placeholder="Titel oder Stichwort"
            @input="onSearchChange" />

    </div>
</template>

<script setup>
const search = useSearch();

const onSearchChange = (event) => {
    search.value.searchQuery = event.target.value;
    console.log(search.value.searchQuery)
}


</script>
