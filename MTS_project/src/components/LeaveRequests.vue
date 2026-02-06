<template>
  <div class="leave-page">
    <div class="header">
      <h3>Leave Requests</h3>
      <p class="muted">Submit and manage employee leave requests</p>
    </div>

    <!-- Submit Form -->
    <div class="form-card">
      <h6>Submit Leave Request</h6>
      <div class="row g-2">
        <div class="col-md-3">
          <select v-model="selectedEmployee" class="form-select form-select-sm">
            <option disabled value="">Select Employee</option>
            <option v-for="e in employees" :key="e.id" :value="e.id">
              {{ e.name }}
            </option>
          </select>
        </div>

        <div class="col-md-3">
          <input type="text" v-model="reason" class="form-control form-control-sm" placeholder="Reason" />
        </div>

        <div class="col-md-3">
          <input type="date" v-model="leaveDate" class="form-control form-control-sm" />
        </div>

        <div class="col-md-3">
          <button class="btn btn-primary btn-sm w-100" @click="submitRequest">
            Submit Request
          </button>
        </div>
      </div>
      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
      <p v-if="successMessage" class="success">{{ successMessage }}</p>
    </div>

    <!-- Requests Table -->
    <table class="table table-hover align-middle">
      <thead>
        <tr>
          <th>Employee</th>
          <th>Reason</th>
          <th>Date</th>
          <th>Status</th>
          <th class="text-center">Action</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="loading">
          <td colspan="5" class="text-muted text-center">Loading leave requests...</td>
        </tr>
        <tr v-else-if="leaveRequests.length === 0">
          <td colspan="5" class="text-muted text-center">No leave requests found.</td>
        </tr>
        <tr v-for="req in leaveRequests" :key="req.id">
          <td>{{ getEmployeeName(req.employeeId) }}</td>
          <td>{{ req.reason }}</td>
          <td>{{ new Date(req.date).toLocaleDateString() }}</td>
          <td>
            <span class="status-pill" :class="req.status.toLowerCase()">
              {{ req.status }}
            </span>
          </td>
          <td class="text-center">
            <button class="btn btn-success btn-sm" :disabled="req.status === 'Approved'" @click="updateStatus(req.id, 'Approved')">
              Approve
            </button>
            <button class="btn btn-danger btn-sm" :disabled="req.status === 'Denied'" @click="updateStatus(req.id, 'Denied')">
              Deny
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  data() {
    return {
      selectedEmployee: "",
      reason: "",
      leaveDate: "",
      loading: true,
      errorMessage: null,
      successMessage: null
    };
  },
  computed: {
    ...mapState(["employees", "leaveRequests"])
  },
  async created() {
    try {
      await Promise.all([this.fetchEmployees(), this.fetchLeaveRequests()]);
    } catch (err) {
      this.errorMessage = "Failed to load leave requests.";
      console.error(err);
    } finally {
      this.loading = false;
    }
  },
  methods: {
    ...mapActions(["fetchEmployees", "fetchLeaveRequests", "addLeaveRequest", "updateLeaveStatus"]),
    async submitRequest() {
      if (!this.selectedEmployee || !this.reason || !this.leaveDate) {
        alert("Please fill all fields.");
        return;
      }
      if (new Date(this.leaveDate) < new Date()) {
        alert("Leave date cannot be in the past.");
        return;
      }
      try {
        console.log("Component: Submitting leave request");
        await this.addLeaveRequest({
          employee_id: this.selectedEmployee,
          reason: this.reason,
          date: this.leaveDate,
          status: "Pending"
        });
        this.successMessage = "Leave request submitted successfully!";
        this.errorMessage = null;
        setTimeout(() => {
          this.successMessage = null;
        }, 3000);
        this.selectedEmployee = "";
        this.reason = "";
        this.leaveDate = "";
      } catch (err) {
        this.errorMessage = "Error submitting request: " + err.message;
        console.error(err);
      }
    },
    async updateStatus(id, newStatus) {
      try {
        console.log("Component: Updating leave request status");
        await this.updateLeaveStatus({ id, status: newStatus });
        this.successMessage = "Leave request updated successfully!";
        this.errorMessage = null;
        setTimeout(() => {
          this.successMessage = null;
        }, 3000);
      } catch (err) {
        this.errorMessage = "Error updating status: " + err.message;
        console.error(err);
      }
    },
    getEmployeeName(id) {
      const emp = this.employees.find(e => e.id === id);
      return emp ? emp.name : "Unknown";
    }
  }
};
</script>

<style scoped>
.status-pill {
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  color: #fff;
}
.status-pill.approved { background: #10b981; }
.status-pill.denied { background: #ef4444; }
.status-pill.pending { background: #f59e0b; }
.error { color: red; margin-top: 8px; font-size: 0.9rem; }
.success { color: green; margin-top: 8px; font-size: 0.9rem; font-weight: bold; }
</style>
