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
    <transition-group v-if="getSortedTodos" ref="list" name="list" tag="ul" class="mt-8">
      <TodoItem
        v-for="todo in getSortedTodos"
        :key="todo.id"
        :todo="todo"
        @check="todo.done = $event"
        @remove="removeTodo(todo)"
      />
    </transition-group>
  </div>
</template>

<script>
import { uniqueId, partition } from 'lodash';

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
  computed: {
    getSortedTodos() {
      const [a, b] = partition(this.todos, 'done');
      return b.concat(a);
    },
  },
  methods: {
    addTodo(e) {
      this.todos.unshift({
        text: e.target.value,
        done: false,
        id: uniqueId(),
      });
      e.target.value = '';
    },
    removeTodo(todo) {
      const index = this.todos.findIndex((t) => t.id === todo.id);
      this.todos.splice(index, 1);
    },
  },
};
</script>

<style scoped>
.list-move {
  transition: all 300ms;
}
</style>
