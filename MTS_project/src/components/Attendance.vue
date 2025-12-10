<template>
  <div class="page">

    <h2>Attendance Overview</h2>

    <div class="employee-grid">
      <div class="employee-card" v-for="e in employees" :key="e.employeeId">

        <h3>{{ e.name }}</h3>
        <p class="emp-id">ID: {{ e.employeeId }}</p>

        <!-- Attendance Section -->
        <div class="section">
          <h4>Attendance</h4>
          <table class="info-table">
            <tr>
              <th>Date</th>
              <th>Status</th>
            </tr>

            <tr v-for="att in e.attendance" :key="att.date">
              <td>{{ format(att.date) }}</td>
              <td :class="statusClass(att.status)">
                {{ att.status }}
              </td>
            </tr>
          </table>
        </div>

        <!-- Leave Requests Section -->
        <div class="section">
          <h4>Leave Requests</h4>
          <table class="info-table">
            <tr>
              <th>Date</th>
              <th>Reason</th>
              <th>Status</th>
            </tr>

            <tr v-for="leave in e.leaveRequests" :key="leave.date">
              <td>{{ format(leave.date) }}</td>
              <td>{{ leave.reason }}</td>
              <td :class="leaveStatusClass(leave.status)">
                {{ leave.status }}
              </td>
            </tr>
          </table>
        </div>

      </div>
    </div>

  </div>
</template>

<script>
import { attendanceAndLeave } from "../assets/data/hrData.js";

export default {
  computed: {
    employees() {
      return attendanceAndLeave;
    }
  },

  methods: {
    format(date) {
      return new Date(date).toLocaleDateString();
    },

    // Attendance color coding
    statusClass(status) {
      return {
        Present: "status-present",
        Absent: "status-absent",
        Late: "status-late",
        Leave: "status-leave",
      }[status] || "";
    },

    // Leave request color coding
    leaveStatusClass(status) {
      return {
        Approved: "leave-approved",
        Pending: "leave-pending",
        Denied: "leave-denied",
      }[status] || "";
    }
  }
};
</script>

<style scoped>
.page {
  padding: 20px;
  max-width: 1200px;
}

.employee-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
}

.employee-card {
  border: 1px solid #ddd;
  padding: 15px;
  border-radius: 10px;
  background: #fafafa;
}

.employee-card h3 {
  margin: 0;
}

.emp-id {
  margin: 4px 0 12px 0;
  font-size: 14px;
  color: #666;
}

.section {
  margin-top: 12px;
}

.section h4 {
  margin-bottom: 6px;
}

.info-table {
  width: 100%;
  border-collapse: collapse;
}

.info-table th,
.info-table td {
  padding: 6px;
  border-bottom: 1px solid #eee;
  font-size: 14px;
}

/* Attendance Color Coding */
.status-present {
  color: #1a8f1a;
  font-weight: bold;
}

.status-absent {
  color: #d63031;
  font-weight: bold;
}

.status-late {
  color: #e67e22;
  font-weight: bold;
}

.status-leave {
  color: #2980b9;
  font-weight: bold;
}

/* Leave Request Color Coding */
.leave-approved {
  color: #1a8f1a;
  font-weight: bold;
}

.leave-pending {
  color: #e67e22;
  font-weight: bold;
}

.leave-denied {
  color: #d63031;
  font-weight: bold;
}
</style>
