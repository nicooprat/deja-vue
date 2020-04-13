<template>
  <div id="app" class="text-center max-w-lg mx-auto px-4 py-32">
    <Logo />

    <nav class="grid grid-flow-col gap-4 mb-4">
      <router-link to="/">Data</router-link>
      <router-link to="/renderless">Data Renderless</router-link>
      <router-link to="/vuex">Vuex</router-link>
      <router-link to="/vuex-renderless">Vuex Renderless</router-link>
    </nav>

    <router-view />
  </div>
</template>

<script>
import Logo from '@/components/Logo';

export default {
  components: {
    Logo,
  },
};
</script>

<style scoped>
nav a {
  @apply flex items-center justify-center py-2 text-sm font-bold text-gray-600;
}

nav a:hover,
nav a:focus,
nav a.router-link-exact-active {
  @apply text-greenvue outline-none no-underline;
}
</style>
