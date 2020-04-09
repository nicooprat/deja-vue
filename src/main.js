import Vue from 'vue';
import Vuex from 'vuex';
import VueRouter from 'vue-router';

import '@/assets/tailwind.css';

import store from '@/store';
import App from '@/App.vue';
import TodoList from '@/components/TodoList';
import TodoListVuex from '@/components/TodoListVuex';
import TodoListVuexRenderless from '@/components/TodoListVuexRenderless';

Vue.use(Vuex);
Vue.use(VueRouter);

const router = new VueRouter({
  mode: 'history',
  routes: [
    { path: '/', component: TodoList },
    { path: '/vuex', component: TodoListVuex },
    { path: '/renderless', component: TodoListVuexRenderless },
  ],
});

Vue.config.productionTip = false;

new Vue({
  store,
  router,
  render: (h) => h(App),
}).$mount('#app');
