<template>
  <div id="app" class="text-center max-w-lg mx-auto px-4">
    <svg width="408" height="264" viewBox="0 0 408 264" class="logo mx-auto mb-10 mt-32">
      <g fill-rule="nonzero" fill="none">
        <g fill="#41B883" opacity=".2">
          <path class="logo-left" d="M.5 101.6L53 131.8.5 162v100.7l226.7-131L.5 1z" />
          <path class="logo-right" d="M180.5 101.1l52.4 30.2-52.4 30.3v100.6l226.7-130.9L180.5.5z" />
        </g>
        <g class="logo-center">
          <path fill="#41B883" d="M91.5 102.1l52.4 30.2-52.4 30.3v100.6l226.7-130.9L91.5 1.5z" />
          <path fill="#34495E" d="M92.2 101.5l52.3 30.3L92.2 162v48.3l136-78.5-136-78.6z" />
        </g>
      </g>
    </svg>
    <input
      type="text"
      placeholder="Don't forget the..."
      class="w-full bg-transparent rounded-lg border-2 border-gray-300 py-4 px-6 focus:outline-none focus:border-blue-400"
      autofocus
      @keyup.enter="addTodo"
    />
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
  </div>
</template>

<script>
/* eslint-disable no-unused-vars */
import { uniqueId, partition } from 'lodash';

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
.logo {
  max-width: 260px;
  height: auto;
  overflow: visible;
}
.logo-center {
  animation: logo-center 800ms 500ms 1 both;
}

.logo-right {
  animation: logo-right 800ms 600ms 1 both;
}

.logo-left {
  animation: logo-left 800ms 900ms 1 both;
}

@keyframes logo-center {
  0% {
    transform: translateX(-50%);
    opacity: 0;
  }
  40% {
    transform: translateX(15%);
    opacity: 1;
  }
  65% {
    transform: translateX(-10%);
  }
  100% {
    transform: translateX(0);
  }
}

@keyframes logo-right {
  0% {
    transform: translateX(-20%);
    opacity: 0;
  }
  40% {
    transform: translateX(8%);
  }
  60% {
    transform: translateX(-10%);
  }
  100% {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes logo-left {
  0% {
    transform: translateX(20%);
    opacity: 0;
  }
  40% {
    transform: translateX(-3%);
  }
  80% {
    transform: translateX(0);
    opacity: 1;
  }
}

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
  transition-delay: calc(50ms * (var(--total) - var(--i)));
}

.list-leave-active {
  transition-delay: calc(50ms * var(--i));
}

.list-leave-active {
  position: absolute;
  width: 100%;
  transition-delay: calc(50ms * var(--i));
}
</style>
