import { createStore } from 'vuex';

export default createStore({
  state: {
    userRole: null
  },
  mutations: {
    setUserRole(state, role) {
      state.userRole = role;
    }
  },
  actions: {
    setUserRole({ commit }, role) {
      commit('setUserRole', role);
    }
  }
});
