<template>
  <section>
    <input
      type="text"
      placeholder="Don't forget the..."
      class="w-full bg-transparent rounded-lg border-2 border-gray-300 py-4 px-6 focus:outline-none focus:border-blue-400"
      autofocus
      @keyup.enter="addNewTodo"
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
        @check="checkTodo({ todo, done: $event })"
        @update="editTodo({ todo, text: $event })"
        @remove="removeTodo(todo)"
      />
    </transition-group>
  </section>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

import TodoItem from '@/components/TodoItem';

export default {
  components: {
    TodoItem,
  },
  data: () => ({
    lastUndo: null,
    lastRedo: null,
  }),
  computed: {
    ...mapGetters('todos', ['getSortedTodos']),
  },
  methods: {
    ...mapActions('todos', ['addTodo', 'removeTodo', 'checkTodo', 'editTodo']),
    addNewTodo(e) {
      if (!e.target.value.trim()) {
        return;
      }
      this.addTodo(e.target.value);
      e.target.value = '';
    },
  },
};
</script>
