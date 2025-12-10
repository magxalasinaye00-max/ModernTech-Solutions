import { createStore } from "vuex";
import { employeeInformation, payrollData, attendanceAndLeave, performanceReviews } from "../assets/data/hrData";

// Helper to load from localStorage
function loadFromStorage(key) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (e) {
    console.error(`Error loading ${key}:`, e);
    return null;
  }
}

export default createStore({
  state() {
    return {
      employees: employeeInformation,
      payroll: payrollData,
      attendance: attendanceAndLeave,
      leaveRequests: loadFromStorage("leaveRequests") || [],
      attendanceRecords: loadFromStorage("attendanceRecords") || []
    };
  },

  getters: {
    getEmployees(state) { return state.employees; },
    getPayroll(state) { return state.payroll; },
    getAttendance(state) { return state.attendance; },
    getLeaveRequests(state) { return state.leaveRequests; },
    getAttendanceRecords(state) { return state.attendanceRecords; }
  },

  mutations: {
    SET_LEAVE_REQUESTS(state, data) {
      state.leaveRequests = data;
      localStorage.setItem("leaveRequests", JSON.stringify(data));
    },
    ADD_LEAVE_REQUEST(state, request) {
      state.leaveRequests.push(request);
      localStorage.setItem("leaveRequests", JSON.stringify(state.leaveRequests));
    },
    UPDATE_LEAVE_REQUEST(state, payload) {
      const req = state.leaveRequests.find(r => r.id === payload.id);
      if (req) req.status = payload.status;
      localStorage.setItem("leaveRequests", JSON.stringify(state.leaveRequests));
    },
    SET_ATTENDANCE(state, data) {
      state.attendanceRecords = data;
      localStorage.setItem("attendanceRecords", JSON.stringify(data));
    },
    ADD_ATTENDANCE(state, record) {
      state.attendanceRecords.push(record);
      localStorage.setItem("attendanceRecords", JSON.stringify(state.attendanceRecords));
    }
  },

  actions: {
    loadLeaveRequestsFromStorage({ commit }) {
      const data = loadFromStorage("leaveRequests");
      if (data) commit("SET_LEAVE_REQUESTS", data);
    },
    addLeaveRequest({ commit }, request) {
      const newRequest = { ...request, id: Date.now(), date: new Date().toLocaleDateString() };
      commit("ADD_LEAVE_REQUEST", newRequest);
    },
    updateLeaveStatus({ commit }, payload) { commit("UPDATE_LEAVE_REQUEST", payload); },
    loadAttendanceFromStorage({ commit }) {
      const data = loadFromStorage("attendanceRecords");
      if (data) commit("SET_ATTENDANCE", data);
    },
    addAttendance({ commit }, record) {
      const newRecord = { ...record, id: Date.now(), date: new Date().toLocaleDateString() };
      commit("ADD_ATTENDANCE", newRecord);
    }
  },

  modules: {
    auth: {
      namespaced: true,
      state() { return { isLoggedIn: localStorage.getItem("auth") === "true" }; },
      getters: { isAuthenticated(state) { return state.isLoggedIn; } },
      mutations: {
        login(state) { state.isLoggedIn = true; localStorage.setItem("auth", "true"); },
        logout(state) { state.isLoggedIn = false; localStorage.removeItem("auth"); }
      }
    },

    reviews: {
      namespaced: true,
      state() {
        const stored = loadFromStorage('reviews');
        return { all: Array.isArray(stored) ? stored : [...performanceReviews] };
      },
      getters: { allReviews(state) { return state.all; } },
      mutations: {
        ADD_REVIEW(state, review) {
          state.all.push(review);
          try {
            localStorage.setItem('reviews', JSON.stringify(state.all));
          } catch (e) { /* ignore storage errors */ }
        },
        SET_REVIEWS(state, reviews) {
          state.all = reviews || [];
          try { localStorage.setItem('reviews', JSON.stringify(state.all)); } catch(e){}
        }
      },
      actions: {
        addReview({ commit }, review) {
          const newReview = {
            ...review,
            id: review.id || Date.now(),
            date: review.date || new Date().toISOString()
          };
          commit('ADD_REVIEW', newReview);
        },
        loadReviews({ commit }) {
          const stored = loadFromStorage('reviews');
          if (Array.isArray(stored)) commit('SET_REVIEWS', stored);
        }
      }
    }
  }
});
