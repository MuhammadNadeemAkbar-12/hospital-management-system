const state = {
  token: localStorage.getItem('token') || '',
  role: localStorage.getItem('role') || '',
  users: JSON.parse(localStorage.getItem('users')) || []
}

const mutations = {
  registerUser(state, user) {
    state.users.push(user);
    localStorage.setItem('users', JSON.stringify(state.users));
  },
  setAuth(state, payload) {
    state.token = payload.token;
    state.role = payload.role;
    localStorage.setItem('token', payload.token);
    localStorage.setItem('role', payload.role);
  },
  logout(state) {
    state.token = '';
    state.role = '';
    localStorage.removeItem('token');
    localStorage.removeItem('role');
  }
}

const actions = {
  register({ commit, state }, user) {
    const exists = state.users.find(u => u.email === user.email && u.role === user.role);
    if (exists) {
      return false;
    }
    commit('registerUser', user);
    return true;
  },
  login({ commit, state }, payload) {
    // Find user in users array
    const found = state.users.find(
      u => u.email === payload.email && u.password === payload.password && u.role === payload.role
    );
    if (found) {
      commit('setAuth', { token: 'demo-token-123', role: found.role });
      return true;
    } else {
      return false;
    }
  },
  logout({ commit }) {
    commit('logout');
  }
}

const getters = {
  isAuthenticated: state => !!state.token,
  userRole: state => state.role
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}