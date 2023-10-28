<template>
  <div class="text-black">
    <h1>Dashboard</h1>
    Hallo "{{ user?.email }}"
    <br />
    <span class="text-black"
      >Status:
      {{ status }}
    </span>
    <br />
    <span class="text-black"
      >Data:
      {{ data }}
    </span>
    <br />
    <UButton @click="logout">logout</UButton>
  </div>
</template>

<script setup>
const { status, data, signOut } = useAuth();

function logout() {
  signOut();
}
</script>
