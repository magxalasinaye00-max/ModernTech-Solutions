<template>
  <div class="card shadow-sm p-3">
    <h4 class="mb-3 fw-bold">Leave Requests</h4>

    <!-- Submit Form -->
    <div class="card p-3 mb-4 form-card">
      <h6 class="mb-3 fw-semibold">Submit Leave Request</h6>

      <div class="row g-2">

        <div class="col-md-3">
          <select v-model="selectedEmployee" class="form-select form-select-sm">
            <option disabled value="">Select Employee</option>
            <option
              v-for="e in employees"
              :key="e.employeeId"
              :value="e.employeeId"
            >
              {{ e.name }}
            </option>
          </select>
        </div>

        <div class="col-md-3">
          <input
            type="text"
            v-model="reason"
            class="form-control form-control-sm"
            placeholder="Reason (e.g., Sick, Vacation)"
          />
        </div>

        <div class="col-md-3">
          <select v-model="requestStatus" class="form-select form-select-sm">
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Denied">Denied</option>
          </select>
        </div>

        <div class="col-md-3">
          <button class="btn btn-primary btn-sm w-100" @click="submitRequest">
            Submit Request
          </button>
        </div>

      </div>
    </div>

    <!-- Requests Table -->
    <h6 class="fw-semibold">Leave Requests History</h6>

    <div class="table-responsive">
      <table class="table table-hover align-middle">
        <thead class="table-light">
          <tr>
            <th>Employee</th>
            <th>Reason</th>
            <th>Date</th>
            <th>Status</th>
            <th class="text-center">Action</th>
          </tr>
        </thead>

        <tbody>
          <tr v-if="leaveRequests.length === 0">
            <td colspan="5" class="text-muted text-center">No leave requests found.</td>
          </tr>

          <tr v-for="req in leaveRequests" :key="req.id">
            <td>{{ getEmployeeName(req.employeeId) }}</td>
            <td>{{ req.reason }}</td>
            <td>{{ req.date }}</td>

            <!-- STATUS PILL -->
            <td>
              <span
                class="status-pill"
                :class="{
                  approved: req.status === 'Approved',
                  denied: req.status === 'Denied',
                  pending: req.status === 'Pending'
                }"
              >
                {{ req.status }}
              </span>
            </td>

            <!-- ACTION BUTTONS -->
            <td class="text-center">
              <div class="d-flex gap-2 justify-content-center">

                <!-- APPROVE -->
                <button
                  class="btn btn-success btn-sm"
                  :disabled="req.status === 'Approved'"
                  @click="setStatus(req, 'Approved')"
                >
                  Approve
                </button>

                <!-- DENY -->
                <button
                  class="btn btn-danger btn-sm"
                  :disabled="req.status === 'Denied'"
                  @click="setStatus(req, 'Denied')"
                >
                  Deny
                </button>

              </div>
            </td>

          </tr>
        </tbody>
      </table>
    </div>

  </div>
</template>

<script>
export default {
  data() {
    return {
      selectedEmployee: "",
      reason: "",
      requestStatus: "Pending"
    };
  },

  computed: {
    employees() {
      return this.$store.state.employees;
    },
    leaveRequests() {
      return this.$store.state.leaveRequests || [];
    }
  },

  methods: {
    getEmployeeName(id) {
      const emp = this.employees.find(e => e.employeeId === id);
      return emp ? emp.name : "Unknown";
    },

    submitRequest() {
      if (!this.selectedEmployee || !this.reason) {
        alert("Please fill all fields.");
        return;
      }

      this.$store.dispatch("addLeaveRequest", {
        employeeId: this.selectedEmployee,
        reason: this.reason,
        status: this.requestStatus
      });

      // Reset form
      this.selectedEmployee = "";
      this.reason = "";
      this.requestStatus = "Pending";
    },

    setStatus(req, newStatus) {
      req.status = newStatus;
      this.$store.commit("UPDATE_LEAVE_REQUEST", {
        id: req.id,
        status: newStatus
      });
    }
  },

  mounted() {
    this.$store.dispatch("loadLeaveRequestsFromStorage");
  }
};
</script>

<style scoped>

/* Form Card */
.form-card {
  background: #f8fafc;
  border-left: 4px solid #4f46e5;
}

/* Status Pills */
.status-pill {
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  color: #fff;
}

.status-pill.approved {
  background: #10b981;
}

.status-pill.denied {
  background: #ef4444;
}

.status-pill.pending {
  background: #f59e0b;
}

/* Buttons */
button.btn-sm {
  padding: 4px 12px;
  font-size: 0.75rem;
  border-radius: 6px;
}

button:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

</style>
