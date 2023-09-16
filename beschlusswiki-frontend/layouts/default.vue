<template>
    <div class="bg-white">
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