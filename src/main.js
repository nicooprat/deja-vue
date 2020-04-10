import Vue from 'vue';
import Vuex from 'vuex';
import VueRouter from 'vue-router';

import '@/assets/tailwind.css';

import store from '@/store';
import App from '@/App.vue';
import TodoList from '@/components/TodoList';
import TodoListRenderless from '@/components/TodoListRenderless';
import TodoListVuex from '@/components/TodoListVuex';
import TodoListVuexRenderless from '@/components/TodoListVuexRenderless';

Vue.use(Vuex);
Vue.use(VueRouter);

const router = new VueRouter({
  mode: 'history',
  routes: [
    { path: '/', component: TodoList },
    { path: '/renderless', component: TodoListRenderless },
    { path: '/vuex', component: TodoListVuex },
    { path: '/vuex-renderless', component: TodoListVuexRenderless },
  ],
});

Vue.config.productionTip = false;

new Vue({
  store,
  router,
  render: (h) => h(App),
}).$mount('#app');
