import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    ip: [],
    mask: [],
    saveInput: false
  },
  mutations: {
    remove(state) {
      state.ip = [];
      state.mask = [];
    },
    save(state, {ip, mask}) {
      state.ip = ip;
      state.mask = mask;
    },
    change(state) {
      state.saveInput = !state.saveInput; 
    }
  },
  actions: {
    remove(context) {
      context.commit('remove');
    },
    save(context, {ip, mask}) {
      context.commit('save', {ip, mask});
    },
    changeState(context) {
      context.commit('change');
    }
  },
  modules: {}
});
