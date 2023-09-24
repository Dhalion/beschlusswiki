<template>
    <div class="bg-white min-h-screen">
        <Header />
        <slot />

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