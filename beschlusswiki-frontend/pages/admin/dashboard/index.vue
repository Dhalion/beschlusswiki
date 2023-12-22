<template>
  <div class="text-black">
    <h1>Dashboard</h1>
    Hallo {{ data?.user?.username }}
    <br />
    <span class="text-black">Status:
      {{ status }}
    </span>
    <br />
    <span class="text-black">Data:
      {{ data }}
    </span>
    <span class="text-black">Token:
      {{ token }}
    </span>
    <br />
    <UButton @click="logout">logout</UButton>
    <UButton @click="getSession()">refresh</UButton>
  </div>
</template>

<script setup lang="ts">


definePageMeta({
  middleware: "authentication"
})

const { status, data, signOut, getSession, token } = useAuth();



function logout() {
  signOut();
}
</script>
