<template>
    <div class="bg-white min-h-screen flex flex-col">
        <Header />

        <div class="flex-grow">
            <slot />

        </div>


        <Footer />
    </div>
</template>

<script>
import Header from '~/components/Header.vue'
export default {
    components: {
        Header
    }
}
</script>