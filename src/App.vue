<template>
  <div id="app" class="text-center max-w-xl mx-auto px-16">
    <img alt="Vue logo" src="./assets/logo.png" class="mx-auto mb-10 mt-32" />
    <input
      type="text"
      placeholder="Don't forget the..."
      class="w-full bg-transparent rounded border border-gray-400 py-4 px-8"
    />
    <ul v-if="todos" class="mt-8">
      <TodoItem v-for="todo in todos" :key="todo.id" :todo="todo" />
    </ul>
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
};
</script>
