<template>
    <div class="bg-white h-screen">
        <Header />
        <slot />
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