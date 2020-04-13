import Vue from 'vue';
import { cloneDeep, uniqueId, omitBy } from 'lodash';
import { patch as diffPatch, reverse as diffReverse, create as diffCreate } from 'jsondiffpatch';

const defaultState = {
  patches: {},
  history: [],
  cursor: -1,
};

const createStore = ({ limit, sub } = {}) => {
  let unsub;
  return {
    namespaced: true,
    state: { ...defaultState },
    actions: {
      record() {
        unsub = sub();
      },
      stop() {
        if (unsub) {
          unsub();
        }
      },
      cleanup({ commit }) {
        commit('CLEANUP');
      },
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
          state.history
            .slice(index + 1, state.cursor + 1)
            .reverse()
            .forEach((i) => dispatch('revert', i));
        }
        // Fast forward
        if (index > state.cursor) {
          state.history.slice(state.cursor + 1, index + 1).forEach((i) => dispatch('apply', i));
        }
      },
    },
    mutations: {
      CLEANUP(state) {
        Object.keys(defaultState).forEach((key) => {
          state[key] = defaultState[key];
        });
      },
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
        // Remove too old history according to limit option, if any
        if (limit && state.history.length > limit) {
          state.history.shift();
        }
        // Remove unreferenced patches
        Object.keys(state.patches).forEach((key) => {
          if (!state.history.some((k) => k === key)) {
            delete state.patches[key];
          }
        });
      },
      REVERT(state, patch) {
        this.replaceState(diffPatch(cloneDeep(this.state), diffReverse(patch)));
      },
      APPLY(state, patch) {
        this.replaceState(diffPatch(cloneDeep(this.state), patch));
      },
    },
    getters: {
      getCursor(state) {
        return state.cursor;
      },
      getHistory(state) {
        return state.history;
      },
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

const subscribe = ({ store, namespace, shouldInclude = () => true, differ }) => {
  // Watch for state changes
  let oldState = cloneDeep(omitBy(store.state, omitSelfNamespace));
  return store.subscribe((mutation, state) => {
    if (!mutation.type.startsWith(namespace) && shouldInclude(mutation)) {
      const newState = omitBy(cloneDeep(state), omitSelfNamespace);
      const patch = differ.diff(oldState, newState);
      if (patch) {
        store.dispatch(`${namespace}/write`, patch);
      }
    }
    oldState = omitBy(cloneDeep(state), omitSelfNamespace);
  });
};

export const createPlugin = ({ objectHash, namespace, shouldInclude, limit }) => (store) => {
  const newNamespace = `history-${namespace || Date.now()}`;
  const differ = diffCreate({ objectHash });
  const sub = () => subscribe({ store, namespace: newNamespace, shouldInclude, differ });
  store.registerModule(newNamespace, createStore({ limit, sub }));
};

export const createAll = ({ store, limit, shouldInclude, objectHash }) => {
  const namespace = `history-${Date.now()}`;
  const differ = diffCreate({ objectHash });
  const sub = () => subscribe({ store, namespace, shouldInclude, differ });
  const module = createStore({ limit, differ, sub });
  return {
    namespace,
    register: () => store.registerModule(namespace, module),
  };
};
