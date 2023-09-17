<template>
    <!-- Text Heading with Back and Share Button -->
    <div class="flex flex-row justify-between m-2">
        <UButton icon="i-heroicons-backspace" size="xl" variant="link" />
        <UButton icon="i-heroicons-share" size="xl" variant="link" />
        <UButton icon="i-heroicons-pencil-square" size="xl" variant="link" />
    </div>
    <div class="pl-20 pr-20 text-base leading-6 antialiased whitespace-pre-line break-normal juso-highlight">
        {{ loremText.text }}

    </div>
</template>

<script setup>
const numParagraphs = 20
const loremApiUrl = `https://api.api-ninjas.com/v1/loremipsum?paragraphs=${numParagraphs}`
console.log(loremApiUrl)
const { data: loremText } = await useFetch(loremApiUrl, {
    headers: {
        'X-Api-Key': 'MYDJhTgabqFg3VT7H1+EOQ==RxF3Qet8zP1b0WAm'
    }
})
</script>
