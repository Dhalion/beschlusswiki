<template>
    <div>
        <Header />
        <nuxt />
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