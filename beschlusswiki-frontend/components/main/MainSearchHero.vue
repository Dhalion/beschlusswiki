<template>
  <div class="flex justify-center flex-col">
    <div
      class="shadow-lg xl:h-60 h-48 bg-rosa flex justify-center items-center flex-col mt-3 rounded-3xl mx-5"
    >
      <h1 class="text-beere xl:text-5xl text-3xl font-bold">Anträge suchen</h1>
      <!-- Searchbar -->
      <input
        v-model="search.searchQuery"
        color="jusorot"
        class="mt-8 xl:mt-10 xl:w-1/2 w-3/4 bg-white text-black p-3 rounded-xl shadow-xl border-cool-200 border-2 text-sm focus:outline-none hover:ring hover:ring-beere focus:ring focus:ring-beere focus:scale-105 transition-transform hover:scale-105 duration-300 ease-in-out"
        placeholder="Titel oder Stichwort"
        @input="onSearchChange"
      />
    </div>
  </div>
</template>

<script setup>
const search = useSearch();

const onSearchChange = (event) => {
  search.value.searchQuery = event.target.value;
  // console.log(search.value.searchQuery)
};
</script>
