import { uniqueId, partition } from 'lodash';

export default {
  namespaced: true,
  state: {
    todos: ['Milk', 'Eggs', 'Bread', 'Chocolate', 'Cake'].map((text, i) => ({
      text,
      done: i > 2,
      id: uniqueId(),
    })),
  },
  actions: {
    addTodo({ commit }, text) {
      commit('ADD_TODO', {
        text,
        done: false,
        id: uniqueId(),
      });
    },
    removeTodo({ commit, getters }, todo) {
      const index = getters.findTodoIndex(todo);
      commit('REMOVE_TODO', index);
    },
    checkTodo({ commit, getters }, { todo, done }) {
      const index = getters.findTodoIndex(todo);
      commit('CHECK_TODO', { index, done });
    },
    editTodo({ commit, getters }, { todo, text }) {
      const index = getters.findTodoIndex(todo);
      commit('EDIT_TODO', { index, text });
    },
  },
  mutations: {
    ADD_TODO(state, todo) {
      state.todos.unshift(todo);
    },
    REMOVE_TODO(state, index) {
      state.todos.splice(index, 1);
    },
    CHECK_TODO(state, { index, done }) {
      const todo = {
        ...state.todos[index],
        done,
      };
      state.todos.splice(index, 1, todo);
    },
    EDIT_TODO(state, { index, text }) {
      const todo = {
        ...state.todos[index],
        text,
      };
      state.todos.splice(index, 1, todo);
    },
  },
  getters: {
    getSortedTodos(state) {
      const [a, b] = partition(state.todos, 'done');
      return b.concat(a);
    },
    findTodoIndex(state) {
      return (todo) => state.todos.findIndex((t) => t.id === todo.id);
    },
  },
};
