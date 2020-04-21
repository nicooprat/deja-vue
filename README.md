<img src="./src/assets/logo.svg" />

# deja-vue

This is an early attempt to create a simple and comprehensible way to record history of datas or state in Vue applications. It allows to easily undo, redo and travel in time in component or Vuex states.

The goal is to easily provide a way for users to use mistake-friendly web apps (as they're used to use classic softwares), and also to offer them what's so called "optimistic UI" for a better UX.

See below 4 different usage examples.

## Examples

### 1. Manually recording and patching any `data`

[Demo](https://deja-vue.netlify.app/)

[Code (lib)](https://github.com/nicooprat/deja-vue/blob/master/src/libs/deja-vue.js)

[Code (example)](https://github.com/nicooprat/deja-vue/blob/master/src/components/TodoList.vue)

This is the simplest usage. Eg. in a component, wrap your data mutation in the `record` function:

```js
const patch = await record(this.todos, () => {
  this.todos.shift(); // Any sync mutation
});
```

```js
const patch = await record(this.todos, async () => {
  this.todos = await api.removeFirstTodo(); // Any async mutation
});
```

Then `revert` this patch:

```js
this.todos = revert(this.todos, patch);
```

Or `reapply` it:

```js
this.todos = reapply(this.todos, patch);
```

Beware in this case that you may have to manually manage new datas, as todo ids could conflict for example. It's up to the developer to manage it from here. This usage is not limited to reactive datas.

✅ Allow to fine tune the process, flexible enough to use it in complex cases.

🚫 Could be too verbose for simple cases.

---

### 2. Using the renderless component

[Demo](https://deja-vue.netlify.app/renderless)

[Code (lib)](https://github.com/nicooprat/deja-vue/blob/master/src/libs/DejaVue.vue)

[Code (example)](https://github.com/nicooprat/deja-vue/blob/master/src/components/TodoListRenderless.vue)

Simply import the `DejaVue` component and wrap your code in its slot.

```html
<DejaVue v-slot="{ getHistory, getCursor, undo, redo, canUndo, canRedo }" :record.sync="todos" @cursorChanged="anything">
  <!-- Use computed and methods as you wish -->
</DejaVue>
```

✅ Simplest way to manage the history.

🚫 Can't manage how the recorded state is recorded, undone or redone.

---

### 3. Using the Vuex plugin

[Demo](https://deja-vue.netlify.app/vuex)

[Code (lib)](https://github.com/nicooprat/deja-vue/blob/master/src/libs/deja-vuex.js)

[Code (example store)](https://github.com/nicooprat/deja-vue/blob/master/src/store/index.js) & [Code (example component)](https://github.com/nicooprat/deja-vue/blob/master/src/components/TodoListVuex.vue)

The `DejaVuex` plugin creates a store that subscribes to mutations. It's possible to filter those with the `shouldInclude` callback which returns `true` or `false` given the actual mutation. The `namespace` can be used to suffix the created module identifier, like `history-todos`. The `objectHash` helps the differ to identify objects instead of relying on their index.

```js
export default new Vuex.Store({
  plugins: [
    DejaVuex({
      namespace: 'todos',
      limit: 10,
      shouldInclude: ({ type }) => type.match('todos/'),
      objectHash: (obj) => obj.id,
    }),
  ],
});
```

✅ Better option if Vuex is already used in the app, flexible enough to record only some mutation

🚫 May be a performance bottleneck on huge states, but can be avoided by using the `stop` action and the `limit` option.

---

### 4. Using the Vuex renderless component

[Demo](https://deja-vue.netlify.app/vuex-renderless)

[Code (lib)](https://github.com/nicooprat/deja-vue/blob/master/src/libs/DejaVuex.vue)

[Code (example)](https://github.com/nicooprat/deja-vue/blob/master/src/components/TodoListVuexRenderless.vue)

This component uses DejaVuex internally, but eases its use by automatically creating, registering in the store when created, and unregistering it when destroyed.

```js
<DejaVuex
  v-slot="{ getHistory, getCursor, undo, redo, canUndo, canRedo, travel }"
  :objectHash="(obj) => obj.id"
  :include="({ type }) => type.match('addTodo|removeTodo')"
  @cursorChanged="anything"
>
  <!-- Use getters and actions as you wish -->
</DejaVuex>
```

✅ Useful when history is needed only in one place

🚫 As every component it may not be as flexible as using the lib directly

# Contributing

## Project setup

```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```
