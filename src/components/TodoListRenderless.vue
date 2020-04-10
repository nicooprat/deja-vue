<template>
  <section>
    <DejaVue
      v-slot="{ getHistory, getCursor, undo, redo, canUndo, canRedo }"
      :record.sync="todos"
      :objectHash="(obj) => obj.id"
    >
      <AddTodo @add="addTodo" />
      <nav class="grid grid-flow-col gap-4 mt-4">
        <button
          :disabled="!canUndo"
          class="flex items-center justify-center rounded py-4 px-6 text-sm font-bold text-gray-600 focus:outline-none"
          :class="{
            'opacity-50': !canUndo,
            'bg-gray-300 hover:bg-gray-400 focus:bg-gray-400 active:bg-gray-400': canUndo,
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
          Undo
        </button>
        <button
          :disabled="!canRedo"
          class="flex items-center justify-center rounded py-4 px-6 text-sm font-bold text-gray-600 focus:outline-none"
          :class="{
            'opacity-50': !canRedo,
            'bg-gray-300 hover:bg-gray-400 focus:bg-gray-400 active:bg-gray-400': canRedo,
          }"
          @click="redo"
        >
          Redo
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
    </DejaVue>
  </section>
</template>

<script>
import { uniqueId, partition } from 'lodash';

import DejaVue from '@/libs/DejaVue';
import AddTodo from '@/components/AddTodo';
import TodoItem from '@/components/TodoItem';

export default {
  components: {
    AddTodo,
    TodoItem,
    DejaVue,
  },
  data: () => ({
    todos: ['Milk', 'Eggs', 'Bread', 'Chocolate', 'Cake'].map((text, i) => ({
      text,
      done: i > 2,
      id: uniqueId(),
    })),
  }),
  computed: {
    getSortedTodos() {
      const [a, b] = partition(this.todos, 'done');
      return b.concat(a);
    },
  },
  methods: {
    addTodo(text) {
      this.todos.unshift({
        text,
        done: false,
        id: uniqueId(),
      });
    },
    removeTodo(todo) {
      const index = this.todos.findIndex((t) => t.id === todo.id);
      this.todos.splice(index, 1);
    },
  },
};
</script>
