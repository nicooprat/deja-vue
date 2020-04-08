import Vue from 'vue';
import Vuex from 'vuex';

import todos from '@/store/todos';
import { createPlugin as DejaVuex } from '@/libs/deja-vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  plugins: [
    DejaVuex({
      namespace: 'todos',
      shouldInclude: ({ type }) => type.match('todos/'),
    }),
  ],
  modules: {
    todos,
  },
});
