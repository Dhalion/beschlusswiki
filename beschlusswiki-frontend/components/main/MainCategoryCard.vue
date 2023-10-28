<template>
  <div class="bg-creme rounded-3xl shadow-lg p-4 flex flex-col text-center">
    <!-- Logo der Kategorie (2/3 Platz) -->
    <div class="h-1/2 flex justify-center align-top p-2">
      <!-- Load image from props src -->
      <img
        src="../../assets/img/categoryImages/GegenRechts.svg"
        class="w-1/2"
      />
      <!-- <img :src="require(`../../assets/img/categoryImages/${categoryImage}`)" class="w-fit" -->
    </div>

    <!-- Großer Titel der Kategorie (1/3 Platz) -->
    <div class="h-1/2">
      <!-- <h2 class="text-2xl sm:text:xl md:text-3xl lg:text-4xl font-semibold"> -->
      <h2 class="text-gray-800 font-bold mb-2">
        {{ categoryTitle }}
      </h2>
      <!-- </h2> -->
      <span class="text-gray-600">
        <!-- Anzahl der Einträge -->
        123 Einträge
      </span>
    </div>
  </div>
</template>

<script setup>
// Props: Title and Img Source and no. of entries and ID
defineProps({
  categoryTitle: {
    type: String,
  },
  categoryImage: {
    type: String,
  },
});
// console.log(`[Card] ${categoryTitle} - File: ${categoryImage}`);
</script>
