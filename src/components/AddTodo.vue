<template>
  <input
    type="text"
    placeholder="Don't forget the..."
    class="w-full bg-transparent rounded-lg border-2 border-gray-300 py-4 px-6 focus:outline-none focus:border-greenvue"
    autofocus
    @keyup.enter="addTodo"
  />
</template>

<script>
export default {
  methods: {
    addTodo(e) {
      if (!e.target.value.trim()) {
        return;
      }
      this.$emit('add', e.target.value);
      e.target.value = '';
    },
  },
};
</script>
