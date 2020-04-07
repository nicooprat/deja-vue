<template>
  <div id="app" class="text-center max-w-lg mx-auto px-4 py-32">
    <Logo />

    <nav class="grid grid-flow-col gap-4 mb-4">
      <button
        class="flex items-center justify-center py-4 text-sm font-bold text-gray-600 hover:text-blue-500 focus:text-blue-500 focus:outline-none"
        :class="{ 'text-blue-500': tab === 'data' }"
        @click="tab = 'data'"
      >
        Data
      </button>
      <button
        class="flex items-center justify-center py-4 text-sm font-bold text-gray-600 hover:text-blue-500 focus:text-blue-500 focus:outline-none"
        :class="{ 'text-blue-500': tab === 'vuex' }"
        @click="tab = 'vuex'"
      >
        Vuex
      </button>
    </nav>

    <TodoList v-if="tab === 'data'" />
    <TodoListVuex v-if="tab === 'vuex'" />
  </div>
</template>

<script>
import Logo from '@/components/Logo';
import TodoList from '@/components/TodoList';
import TodoListVuex from '@/components/TodoListVuex';

export default {
  components: {
    Logo,
    TodoList,
    TodoListVuex,
  },
  data: () => ({
    tab: 'vuex',
  }),
};
</script>
