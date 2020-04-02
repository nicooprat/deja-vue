<template>
  <div id="app" class="text-center max-w-xl mx-auto px-16">
    <img alt="Vue logo" src="./assets/logo.png" class="mx-auto mb-10 mt-32" />
    <input
      type="text"
      placeholder="Don't forget the..."
      class="w-full bg-transparent rounded-lg border-2 border-gray-300 py-4 px-8 focus:outline-none focus:border-blue-400"
      autofocus
      @keyup.enter="addTodo"
    />
    <transition-group v-if="todos" ref="list" name="list" tag="ul" class="mt-8">
      <TodoItem v-for="todo in todos" :key="todo.id" :todo="todo" />
    </transition-group>
  </div>
</template>

<script>
import { uniqueId } from 'lodash';

import TodoItem from '@/components/TodoItem';

export default {
  components: {
    TodoItem,
  },
  data: () => ({
    todos: [
      { text: 'Milk', done: false, id: uniqueId() },
      { text: 'Eggs', done: true, id: uniqueId() },
    ],
  }),
  methods: {
    addTodo(e) {
      this.todos.unshift({
        text: e.target.value,
        done: false,
        id: uniqueId(),
      });
      e.target.value = '';
    },
  },
};
</script>

<style scoped>
.list-enter-active,
.list-leave-active {
  transition: all 300ms;
}
</style>
