<template>
  <div class="text-black">
    <h2>foo</h2>
  </div>
</template>

<script lang="ts" setup>

definePageMeta({
  middleware: "authentication",
  layout: "admin",
});

const colorMode = useColorMode();

const { status, data, signOut, getSession, token } = useAuth();

function logout() {
  signOut();
}
</script>
