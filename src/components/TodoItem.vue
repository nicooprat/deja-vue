<template>
  <li class="flex items-center relative mt-4">
    <label
      class="absolute left-0 transform -translate-x-full p-4 cursor-pointer"
      :class="{ 'text-gray-700': !todo.done, 'text-gray-300': todo.done }"
    >
      <input type="checkbox" :checked="todo.done" class="absolute opacity-0" />
      <svg width="24" height="24" viewBox="0 0 24 24">
        <path
          v-if="todo.done"
          fill="currentColor"
          d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-1.25 16.518l-4.5-4.319 1.396-1.435 3.078 2.937 6.105-6.218 1.421 1.409-7.5 7.626z"
        />
        <path
          v-else
          fill="currentColor"
          d="M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0-2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm6.25 8.891l-1.421-1.409-6.105 6.218-3.078-2.937-1.396 1.436 4.5 4.319 7.5-7.627z"
        />
      </svg>
    </label>
    <input
      type="text"
      :value="todo.text"
      :readonly="todo.done"
      class="w-full flex items-center bg-white py-4 px-8 rounded-lg bg-transparent"
      :class="{ 'shadow-md': !todo.done, 'text-gray-500': todo.done }"
    />
    <button
      v-if="!todo.done"
      class="absolute right-0 transform translate-x-full p-4 text-gray-300 hover:text-gray-500 focus:text-gray-500 active:text-gray-500"
    >
      <svg width="24" height="24" viewBox="0 0 24 24">
        <path fill="currentColor" d="M24 6h-24v-4h24v4zm0 4h-24v4h24v-4zm0 8h-24v4h24v-4z" />
      </svg>
    </button>
  </li>
</template>

<script>
export default {
  props: {
    todo: {
      type: Object,
      required: true,
    },
  },
};
</script>
