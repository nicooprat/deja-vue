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
    <transition-group v-if="getSortedTodos" name="list" tag="ul" class="mt-8 relative" appear>
      <TodoItem
        v-for="(todo, index) in getSortedTodos"
        :key="todo.id"
        class="todo"
        :class="{ 'mt-4': index > 0 }"
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
.todo {
  transition: all 300ms;
  position: relative;
  z-index: 1;
}

.list-enter,
.list-leave-to {
  opacity: 0;
  transform: translateY(-100%);
  z-index: 0;
}

.list-leave-active {
  position: absolute;
  width: 100%;
}
</style>
