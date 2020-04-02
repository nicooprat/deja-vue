<template>
  <li
    class="flex items-center relative bg-white rounded-lg"
    :class="{ 'shadow-md': !todo.done, 'text-gray-500': todo.done }"
  >
    <label class="p-4 text-gray-500 opacity-50 hover:opacity-100 focus:opacity-100 active:opacity-100 cursor-pointer">
      <input
        type="checkbox"
        :checked="todo.done"
        class="absolute opacity-0 pointer-events-none"
        @change="$emit('check', !todo.done)"
      />
      <svg width="18" height="18" viewBox="0 0 24 24">
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
      class="w-full flex items-center py-4 bg-transparent focus:outline-none"
      :class="{ 'text-gray-500': todo.done }"
      @change="$emit('update', $event.target.value)"
    />
    <button
      class="px-6 text-gray-500 opacity-50 hover:opacity-100 focus:opacity-100 active:opacity-100"
      @click="$emit('remove')"
    >
      <svg width="12" height="12" viewBox="0 0 24 24">
        <path
          fill="currentColor"
          d="M24 20.188l-8.315-8.209 8.2-8.282-3.697-3.697-8.212 8.318-8.31-8.203-3.666 3.666 8.321 8.24-8.206 8.313 3.666 3.666 8.237-8.318 8.285 8.203z"
        />
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
