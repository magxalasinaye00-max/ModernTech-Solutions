import { createStore } from "vuex";
import api from "../api";
import reviews from "./modules/reviews";

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
    getEmployees: s => s.employees,
    getPayroll: s => s.payroll,
    isLoading: s => s.loading,
    getError: s => s.error
  },

  mutations: {

    SET_EMPLOYEES(state, data) {
      state.employees = data;
    },

    SET_PAYROLL(state, data) {
      state.payroll = data;
    },

    SET_ATTENDANCE(state, data) {
      state.attendanceRecords = data;
    },

    SET_LEAVE(state, data) {
      state.leaveRequests = data;
    },

    ADD_EMPLOYEE(state, emp) {
      console.log("Mutation: ADD_EMPLOYEE called with:", emp);
      state.employees.push({
        id: emp.id,
        name: emp.name,
        position: emp.position,
        department: emp.department,
        employmentHistory: emp.employmentHistory || "",
        contact: emp.contact
      });
      console.log("Mutation: employees array is now:", state.employees);
    },

    UPDATE_EMPLOYEE_ID(state, { tempId, realId }) {
      const idx = state.employees.findIndex(e => e.id === tempId);
      if (idx !== -1) {
        state.employees[idx].id = realId;
        console.log(`Mutation: Updated temp id ${tempId} -> ${realId}`);
      }
    },

    DELETE_EMPLOYEE(state, id) {
      console.log("Mutation: DELETE_EMPLOYEE called with id:", id);
      const initialLength = state.employees.length;
      state.employees = state.employees.filter(e => e.id !== id);
      console.log(`Mutation: Deleted employee. Was ${initialLength}, now ${state.employees.length}`);
    },

    ADD_LEAVE_REQUEST(state, leaveReq) {
      console.log("Mutation: ADD_LEAVE_REQUEST called with:", leaveReq);
      state.leaveRequests.push(leaveReq);
      console.log("Mutation: leaveRequests array is now:", state.leaveRequests);
    },

    UPDATE_LEAVE_REQUEST(state, updatedReq) {
      console.log("Mutation: UPDATE_LEAVE_REQUEST called with:", updatedReq);
      const idx = state.leaveRequests.findIndex(r => r.id === updatedReq.id);
      if (idx !== -1) {
        state.leaveRequests[idx] = updatedReq;
        console.log("Mutation: Updated leave request at index", idx);
      }
    },

    SET_LOADING(state, val) {
      state.loading = val;
    },

    SET_ERROR(state, err) {
      state.error = err;
    }
  },

  actions: {

    /* EMPLOYEES */

    async fetchEmployees({ commit }) {
      commit("SET_LOADING", true);

      try {
        const res = await api.get("/employees");
        commit("SET_EMPLOYEES", res.data);
      } catch {
        commit("SET_ERROR", "Failed to load employees");
      }

      commit("SET_LOADING", false);
    },

    async addEmployee({ commit }, emp) {
      // Optimistic add: insert a temporary item so UI updates immediately
      const tempId = `tmp_${Date.now()}`;
      const tempEmp = {
        id: tempId,
        name: emp.name,
        position: emp.position,
        department: emp.department,
        employmentHistory: emp.employmentHistory || "",
        contact: emp.contact
      };

      commit("ADD_EMPLOYEE", tempEmp);

      try {
        console.log("Store: Adding employee (API)", emp);
        const res = await api.post("/employees", emp);
        console.log("Store: API response for add", res.data);
        // replace temp id with real id
        commit("UPDATE_EMPLOYEE_ID", { tempId, realId: res.data.id });
        console.log("Store: UPDATE_EMPLOYEE_ID committed");
        return res.data;
      } catch (err) {
        console.error("Store: Add employee error:", err);
        // rollback: remove the temp employee
        commit("DELETE_EMPLOYEE", tempId);
        commit("SET_ERROR", "Failed to add employee: " + err.message);
        throw err;
      }
    },

    async deleteEmployee({ commit, dispatch }, id) {
      // Optimistic delete: remove locally first
      const existing = [...this.state.employees];
      commit("DELETE_EMPLOYEE", id);

      try {
        console.log("Store: Deleting employee with id:", id);
        const res = await api.delete(`/employees/${id}`);
        console.log("Store: API response for delete", res.data);
        return res.data;
      } catch (err) {
        console.error("Store: Delete employee error:", err);
        // rollback: restore entire list from server to be safe
        try {
          const res = await api.get("/employees");
          commit("SET_EMPLOYEES", res.data);
        } catch (fetchErr) {
          console.error("Store: Failed to reload employees after delete failure", fetchErr);
        }
        commit("SET_ERROR", "Failed to delete employee: " + err.message);
        throw err;
      }
    },

    /* PAYROLL */

    async fetchPayroll({ commit }) {
      commit("SET_LOADING", true);

      try {
        const res = await api.get("/payroll");
        commit("SET_PAYROLL", res.data);
      } catch {
        commit("SET_ERROR", "Failed to load payroll");
      }

      commit("SET_LOADING", false);
    },

    /* ATTENDANCE */

    async fetchAttendance({ commit }) {
      commit("SET_LOADING", true);

      try {
        const res = await api.get("/attendance");
        commit("SET_ATTENDANCE", res.data);
      } catch {
        commit("SET_ERROR", "Failed to load attendance");
      }

      commit("SET_LOADING", false);
    },

    /* LEAVE REQUESTS */

    async fetchLeaveRequests({ commit }) {
      commit("SET_LOADING", true);

      try {
        const res = await api.get("/leave-requests");
        commit("SET_LEAVE", res.data);
      } catch {
        commit("SET_ERROR", "Failed to load leave requests");
      }

      commit("SET_LOADING", false);
    },

    async addLeaveRequest({ commit }, leaveData) {
      try {
        console.log("Store: Adding leave request:", leaveData);
        const res = await api.post("/leave-requests", leaveData);
        console.log("Store: API response for add leave:", res.data);
        commit("ADD_LEAVE_REQUEST", res.data);
        return res.data;
      } catch (err) {
        console.error("Store: Add leave request error:", err);
        commit("SET_ERROR", "Failed to add leave request");
        throw err;
      }
    },

    async updateLeaveStatus({ commit }, { id, status }) {
      try {
        console.log("Store: Updating leave request:", { id, status });
        const res = await api.patch(`/leave-requests/${id}`, { status });
        console.log("Store: API response for update leave:", res.data);
        commit("UPDATE_LEAVE_REQUEST", res.data);
        return res.data;
      } catch (err) {
        console.error("Store: Update leave request error:", err);
        commit("SET_ERROR", "Failed to update leave request");
        throw err;
      }
    }
  },

  modules: {

    /* REVIEWS MODULE */

    reviews,

    /* AUTH MODULE */

    auth: {
      namespaced: true,

      state() {
        return {
          user: null,
          isAuthenticated: false
        };
      },

      mutations: {
        login(state, user) {
          state.user = user;
          state.isAuthenticated = true;
        },

        logout(state) {
          state.user = null;
          state.isAuthenticated = false;
        }
      },

      actions: {

        async login({ commit }, creds) {

          const res = await api.post("/login", creds);

          if (!res.data.success) {
            throw new Error("Login failed");
          }

          localStorage.setItem("token", res.data.token);

          commit("login", res.data.user);
        },

        logout({ commit }) {
          localStorage.removeItem("token");
          commit("logout");
        }
      }
    }
  }
});
