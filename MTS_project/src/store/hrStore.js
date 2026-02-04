import { createStore } from "vuex";
import api from "../api";

export default createStore({
  state() {
    return {
      employees: [],
      payroll: [],
      attendanceRecords: [],
      leaveRequests: [],
      loading: false,
      error: null
    };
  },

  getters: {
    getEmployees: state => state.employees,
    getPayroll: state => state.payroll,
    getAttendanceRecords: state => state.attendanceRecords,
    getLeaveRequests: state => state.leaveRequests,
    isLoading: state => state.loading,
    getError: state => state.error
  },

  mutations: {
    SET_EMPLOYEES(state, data) { state.employees = data; },
    SET_PAYROLL(state, data) { state.payroll = data; },
    SET_ATTENDANCE_RECORDS(state, data) { state.attendanceRecords = data; },
    SET_LEAVE_REQUESTS(state, data) { state.leaveRequests = data; },

    ADD_EMPLOYEE(state, employee) { state.employees.push(employee); },
    DELETE_EMPLOYEE(state, id) {
      state.employees = state.employees.filter(emp => emp.id !== id);
    },

    ADD_ATTENDANCE(state, record) { state.attendanceRecords.push(record); },

    ADD_LEAVE_REQUEST(state, request) { state.leaveRequests.push(request); },
    UPDATE_LEAVE_REQUEST(state, payload) {
      const req = state.leaveRequests.find(r => r.id === payload.id);
      if (req) req.status = payload.status;
    },

    SET_LOADING(state, status) { state.loading = status; },
    SET_ERROR(state, error) { state.error = error; }
  },

  actions: {
    async fetchEmployees({ commit }) {
      commit("SET_LOADING", true);
      try {
        const res = await api.get("/employees");
        commit("SET_EMPLOYEES", res.data);
      } catch (err) {
        commit("SET_ERROR", "Failed to load employees");
        console.error(err);
      } finally {
        commit("SET_LOADING", false);
      }
    },

    async fetchPayroll({ commit }) {
      commit("SET_LOADING", true);
      try {
        const res = await api.get("/payroll");
        commit("SET_PAYROLL", res.data);
      } catch (err) {
        commit("SET_ERROR", "Failed to load payroll");
        console.error(err);
      } finally {
        commit("SET_LOADING", false);
      }
    },

    async fetchAttendance({ commit }) {
      commit("SET_LOADING", true);
      try {
        const res = await api.get("/attendance");
        commit("SET_ATTENDANCE_RECORDS", res.data);
      } catch (err) {
        commit("SET_ERROR", "Failed to load attendance");
        console.error(err);
      } finally {
        commit("SET_LOADING", false);
      }
    },

    async fetchLeaveRequests({ commit }) {
      commit("SET_LOADING", true);
      try {
        const res = await api.get("/leave-requests"); // ✅ fixed
        commit("SET_LEAVE_REQUESTS", res.data);
      } catch (err) {
        commit("SET_ERROR", "Failed to load leave requests");
        console.error(err);
      } finally {
        commit("SET_LOADING", false);
      }
    },

    async addEmployee({ commit }, employee) {
      try {
        const res = await api.post("/employees", employee);
        commit("ADD_EMPLOYEE", res.data);
      } catch (err) {
        commit("SET_ERROR", "Failed to add employee");
        console.error(err);
      }
    },

    async deleteEmployee({ commit }, id) {
      try {
        await api.delete(`/employees/${id}`);
        commit("DELETE_EMPLOYEE", id);
      } catch (err) {
        commit("SET_ERROR", "Failed to delete employee");
        console.error(err);
      }
    },

    async addLeaveRequest({ commit }, request) {
      try {
        const res = await api.post("/leave-requests", request); // ✅ fixed
        commit("ADD_LEAVE_REQUEST", res.data);
      } catch (err) {
        commit("SET_ERROR", "Failed to submit leave request");
        console.error(err);
      }
    },

    async updateLeaveStatus({ commit }, payload) {
      try {
        await api.put(`/leave-requests/${payload.id}`, { status: payload.status }); // ✅ fixed
        commit("UPDATE_LEAVE_REQUEST", payload);
      } catch (err) {
        commit("SET_ERROR", "Failed to update leave request");
        console.error(err);
      }
    }
  },

  modules: {
    auth: {
      namespaced: true,
      state() { return { user: null, isAuthenticated: false }; },
      mutations: {
        login(state, user) { state.user = user; state.isAuthenticated = true; },
        logout(state) { state.user = null; state.isAuthenticated = false; }
      },
      actions: {
        async login({ commit }, credentials) {
          try {
            const res = await api.post("/login", credentials);
            if (res.data.success) {
              localStorage.setItem("token", res.data.token);
              commit("login", res.data.user);
            } else {
              throw new Error(res.data.message);
            }
          } catch (err) {
            console.error("Login failed:", err);
            throw err;
          }
        },
        logout({ commit }) {
          localStorage.removeItem("token");
          commit("logout");
        }
      }
    },

    reviews: {
      namespaced: true,
      state() { return { all: [] }; },
      getters: { allReviews: state => state.all },
      mutations: {
        SET_REVIEWS(state, reviews) { state.all = reviews; },
        ADD_REVIEW(state, review) { state.all.push(review); }
      },
      actions: {
        async fetchReviews({ commit }) {
          try {
            const res = await api.get("/performance-reviews"); // ✅ fixed
            commit("SET_REVIEWS", res.data);
          } catch (err) {
            console.error("Failed to load reviews:", err);
          }
        },
        async addReview({ commit }, review) {
          try {
            const res = await api.post("/performance-reviews", review); // ✅ fixed
            commit("ADD_REVIEW", res.data);
          } catch (err) {
            console.error("Failed to add review:", err);
          }
        }
      }
    }
  }
});
