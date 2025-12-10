export default {
  namespaced: true,

  state: {
    isLoggedIn: localStorage.getItem("auth") === "true"
  },

  mutations: {
    login(state) {
      state.isLoggedIn = true;
      localStorage.setItem("auth", "true");
    },

    logout(state) {
      state.isLoggedIn = false;
      localStorage.removeItem("auth");
    }
  },

  getters: {
    isAuthenticated(state) {
      return state.isLoggedIn;
    }
  }
};
