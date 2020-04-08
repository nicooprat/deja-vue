import Vue from 'vue';
import { cloneDeep, uniqueId, omitBy } from 'lodash';
import { diff, patch as diffPatch, reverse } from 'jsondiffpatch';

const createStore = ({ limit = 20 } = {}) => {
  return {
    namespaced: true,
    state: {
      patches: {},
      history: [],
      cursor: -1,
    },
    actions: {
      write({ state, commit }, patch) {
        const id = uniqueId();
        commit('ERASE_FUTURE');
        commit('ADD_PATCH', { id, patch });
        commit('WRITE', id);
        commit('SET_CURSOR', state.history.length - 1);
        return id;
      },
      revert({ commit, getters }, id) {
        commit('REVERT', getters.getPatchById(id));
        commit('SET_CURSOR', getters.getIndexForPatchId(id) - 1);
      },
      apply({ commit, getters }, id) {
        commit('APPLY', getters.getPatchById(id));
        commit('SET_CURSOR', getters.getIndexForPatchId(id));
      },
      reapply({ dispatch, getters }, id) {
        // Clone and override `index` to add todos at the end of the list
        const newPatch = cloneDeep(getters.getPatchById(id)).map((patch) => ({
          ...patch,
          ...(!Number(patch.index) && { index: this.state[patch.path[0]].length }),
        }));
        dispatch('write', newPatch).then((newId) => dispatch('apply', newId));
      },
      undo({ dispatch, getters }) {
        if (getters.canUndo) {
          dispatch('revert', getters.getCurrentPatchId);
        }
      },
      redo({ dispatch, getters }) {
        if (getters.canRedo) {
          dispatch('apply', getters.getNextPatchId);
        }
      },
      travel({ state, dispatch, getters }, id) {
        if (!id) {
          [...state.history].reverse().forEach((i) => dispatch('revert', i));
          return;
        }
        const index = getters.getIndexForPatchId(id);
        // Rewind
        if (index < state.cursor) {
          [...state.history]
            .slice(index + 1)
            .reverse()
            .forEach((i) => dispatch('revert', i));
        }
        // Fast forward
        if (index > state.cursor) {
          [...state.history].slice(state.cursor + 1, index + 1).forEach((i) => dispatch('apply', i));
        }
      },
    },
    mutations: {
      SET_CURSOR(state, index) {
        state.cursor = index;
      },
      ADD_PATCH(state, { id, patch }) {
        Vue.set(state.patches, id, patch);
      },
      ERASE_FUTURE(state) {
        state.history.splice(state.cursor + 1);
      },
      WRITE(state, id) {
        state.history.push(id);
        if (state.history.length > limit) {
          state.history.shift();
        }
      },
      REVERT(state, patch) {
        // Apply changes to a clone to mutate state only once
        const newState = cloneDeep(this.state);
        patch.forEach((change) => reverse(newState, true, change));
        this.replaceState(newState);
      },
      APPLY(state, patch) {
        // Apply changes to a clone to mutate state only once
        const newState = cloneDeep(this.state);
        patch.forEach((change) => diffPatch(newState, true, change));
        this.replaceState(newState);
      },
    },
    getters: {
      getIndexForPatchId(state) {
        return (id) => state.history.indexOf(id);
      },
      getCurrentPatchId(state) {
        return state.history[state.cursor];
      },
      getPatchById(state) {
        return (id) => state.patches[id];
      },
      getNextPatchId(state) {
        return state.history[state.cursor + 1];
      },
      canUndo(state, getters) {
        return !!getters.getCurrentPatchId;
      },
      canRedo(state, getters) {
        return !!getters.getNextPatchId;
      },
    },
  };
};

const omitSelfNamespace = (v, k) => k.startsWith('history-');

const subscribe = (store, namespace, shouldInclude = () => true) => {
  // Watch for state changes
  let oldState = cloneDeep(omitBy(store.state, omitSelfNamespace));
  return store.subscribe((mutation, state) => {
    if (!mutation.type.startsWith(namespace) && shouldInclude(mutation)) {
      const newState = omitBy(state, omitSelfNamespace);
      const patch = diff(oldState, newState);
      if (patch) {
        store.dispatch(`${namespace}/write`, patch);
      }
      oldState = cloneDeep(newState);
    }
  });
};

export const createPlugin = (opts) => (store) => {
  const namespace = `history-${opts.namespace || Date.now()}`;
  subscribe(store, namespace, opts.shouldInclude);
  store.registerModule(namespace, createStore(opts));
};
