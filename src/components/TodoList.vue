<template>
  <section>
    <input
      type="text"
      placeholder="Don't forget the..."
      class="w-full bg-transparent rounded-lg border-2 border-gray-300 py-4 px-6 focus:outline-none focus:border-blue-400"
      autofocus
      @keyup.enter="addTodo"
    />
    <nav class="grid grid-flow-col gap-4 mt-4">
      <button
        :disabled="!lastUndo"
        class="flex items-center justify-center rounded py-4 px-6 text-sm font-bold text-gray-600 focus:outline-none"
        :class="{
          'opacity-50': !lastUndo,
          'bg-gray-300 hover:bg-gray-400 focus:bg-gray-400 active:bg-gray-400': lastUndo,
        }"
        @click="undo"
      >
        <svg class="mr-4" width="14" height="14" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            transform="translate(24 0) scale(-1 1) "
            d="M14 12l-14 9v-18l14 9zm-4-9v4l8.022 5-8.022 5v4l14-9-14-9z"
          />
        </svg>
        Get back removed todo
      </button>
      <button
        :disabled="!lastRedo"
        class="flex items-center justify-center rounded py-4 px-6 text-sm font-bold text-gray-600 focus:outline-none"
        :class="{
          'opacity-50': !lastRedo,
          'bg-gray-300 hover:bg-gray-400 focus:bg-gray-400 active:bg-gray-400': lastRedo,
        }"
        @click="redo"
      >
        Insert last todo again
        <svg class="ml-4" width="14" height="14" viewBox="0 0 24 24">
          <path fill="currentColor" d="M14 12l-14 9v-18l14 9zm-4-9v4l8.022 5-8.022 5v4l14-9-14-9z" />
        </svg>
      </button>
    </nav>
    <transition-group
      v-if="getSortedTodos"
      name="list"
      tag="ul"
      class="mt-8 relative"
      :style="`--t: ${getSortedTodos.length}`"
    >
      <TodoItem
        v-for="(todo, index) in getSortedTodos"
        :key="todo.id"
        class="todo"
        :style="`--i: ${index}`"
        :class="{ 'mt-4': index > 0 }"
        :todo="todo"
        @check="todo.done = $event"
        @update="todo.text = $event"
        @remove="removeTodo(todo)"
      />
    </transition-group>
  </section>
</template>

<script>
import { uniqueId, partition } from 'lodash';

import { record, revert, reapply } from '@/libs/deja-vue';
import TodoItem from '@/components/TodoItem';

export default {
  components: {
    TodoItem,
  },
  data: () => ({
    todos: ['Milk', 'Eggs', 'Bread', 'Chocolat', 'Cake'].map((text, i) => ({
      text,
      done: i > 2,
      id: uniqueId(),
    })),
    lastUndo: null,
    lastRedo: null,
  }),
  computed: {
    getSortedTodos() {
      const [a, b] = partition(this.todos, 'done');
      return b.concat(a);
    },
  },
  methods: {
    addTodo(e) {
      if (!e.target.value.trim()) {
        return;
      }
      record(this.$data, 'todos', (done) => {
        this.todos.unshift({
          text: e.target.value,
          done: false,
          id: uniqueId(),
        });
        e.target.value = '';
        done();
      }).then((patch) => {
        this.lastRedo = patch;
      });
    },
    removeTodo(todo) {
      record(this.$data, 'todos', (done) => {
        const index = this.todos.findIndex((t) => t.id === todo.id);
        this.todos.splice(index, 1);
        done();
      }).then((patch) => {
        this.lastUndo = patch;
      });
    },
    undo() {
      this.todos = revert(this.lastUndo);
      this.lastUndo = null;
    },
    redo() {
      // Deduplicate ids
      this.todos = reapply(this.lastRedo).reduce(
        (acc, todo) => acc.concat([{ ...todo, id: acc.some((t) => t.id === todo.id) ? uniqueId() : todo.id }]),
        [],
      );
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

/* Staggering technique from https://codepen.io/shshaw/pen/YLmdxz?editors=0100 */
.list-move {
  transition-delay: calc(50ms * var(--i));
}

.list-enter,
.list-leave-to {
  opacity: 0;
  transform: translateY(-50%);
  z-index: 0;
}

.list-enter-active {
  /* transition-delay: calc(50ms * (var(--t) - var(--i))); */
}

.list-leave-active {
  position: absolute;
  width: 100%;
  transition-delay: calc(50ms * var(--i));
}
</style>
