<template>
  <section>
    <AddTodo @add="addTodo" />
    <nav>
      <button :disabled="!canUndo" class="border-r-2 border-gray-300" @click="undo">
        <svg width="14" height="14" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            transform="translate(24 0) scale(-1 1) "
            d="M14 12l-14 9v-18l14 9zm-4-9v4l8.022 5-8.022 5v4l14-9-14-9z"
          />
        </svg>
      </button>
      <div ref="cursor" class="flex flex-grow overflow-x-auto">
        <button :class="getCursor === -1 && 'is-active'" @click="travel(null)">
          0
        </button>
        <button
          v-for="(patchId, index) in getHistory"
          :key="patchId"
          class="border-l-2 border-r-2 border-gray-300"
          :class="index === getCursor && 'is-active'"
          @click.exact="travel(patchId)"
        >
          {{ patchId }}
        </button>
      </div>
      <button :disabled="!canRedo" class="border-l-2 border-gray-300" @click="redo">
        <svg width="14" height="14" viewBox="0 0 24 24">
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
        @check="checkTodo({ todo, done: $event })"
        @update="editTodo({ todo, text: $event })"
        @remove="removeTodo(todo)"
      />
    </transition-group>
  </section>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

import AddTodo from '@/components/AddTodo';
import TodoItem from '@/components/TodoItem';

export default {
  components: {
    AddTodo,
    TodoItem,
  },
  data: () => ({
    lastUndo: null,
    lastRedo: null,
  }),
  computed: {
    ...mapGetters('todos', ['getSortedTodos']),
    ...mapGetters('history-todos', ['getHistory', 'getCursor', 'canUndo', 'canRedo']),
  },
  watch: {
    getCursor() {
      this.$nextTick(() => {
        const parent = this.$refs.cursor;
        const active = parent.querySelector('.is-active');
        parent.scrollLeft = active.offsetLeft - parent.offsetLeft - parent.offsetWidth / 2 + active.offsetWidth / 2;
      });
    },
  },
  created() {
    this.cleanupTodos();
    this.cleanup();
    this.record();
  },
  mounted() {
    ['Milk', 'Eggs', 'Bread', 'Chocolate', 'Cake'].forEach((text) => this.addTodo(text));
  },
  destroyed() {
    this.stop();
  },
  methods: {
    ...mapActions('todos', ['cleanupTodos', 'addTodo', 'removeTodo', 'checkTodo', 'editTodo']),
    ...mapActions('history-todos', ['record', 'stop', 'cleanup', 'undo', 'redo', 'travel']),
  },
};
</script>

<style scoped>
nav {
  @apply flex w-full text-xs mt-8 text-gray-500 border-2 border-gray-300 rounded-md overflow-hidden;
}

nav button {
  @apply flex items-center py-4 px-6 relative font-bold font-mono;
  margin-left: -2px;
}

nav button:not(:disabled):hover,
nav button:not(:disabled):focus {
  @apply bg-gray-200 outline-none;
}

nav div button {
  margin-left: -2px;
}

nav div {
  scroll-behavior: smooth;
}
nav div::-webkit-scrollbar {
  display: none;
}

nav button:disabled {
  @apply text-gray-300 cursor-default;
}

nav button.is-active {
  @apply text-greenvue bg-gray-200;
}
</style>
