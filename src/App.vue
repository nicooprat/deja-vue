<template>
  <div id="app" class="text-center max-w-lg mx-auto px-4 py-32">
    <Logo />
    <TodoList />
  </div>
</template>

<script>
import Logo from '@/components/Logo';
import TodoList from '@/components/TodoList';

export default {
  components: {
    Logo,
    TodoList,
  },
};
</script>
