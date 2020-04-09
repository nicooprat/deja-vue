<template>
  <div id="app" class="text-center max-w-lg mx-auto px-4 py-32">
    <Logo />

    <nav class="grid grid-flow-col gap-4 mb-4">
      <router-link to="/">
        Data
      </router-link>
      <router-link to="/vuex">
        Vuex
      </router-link>
      <router-link to="/renderless">
        Renderless
      </router-link>
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
a {
  @apply flex items-center justify-center py-4 text-sm font-bold text-gray-600;
}

a:hover,
a:focus,
a.router-link-exact-active {
  @apply text-blue-500 outline-none;
}
</style>
