<template>
  <section>
    <AddTodo @add="addTodo" />
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
  },
  mounted() {
    ['Milk', 'Eggs', 'Bread', 'Chocolate', 'Cake'].forEach((text) => this.addTodo(text));
  },
  methods: {
    ...mapActions('todos', ['addTodo', 'removeTodo', 'checkTodo', 'editTodo']),
  },
};
</script>
