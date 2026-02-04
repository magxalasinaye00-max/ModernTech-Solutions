 <template>
  <div class="employee-grid" v-if="!loading">
    <div class="employee-card" v-for="e in employees" :key="e.id">
      <h3>{{ e.name }}</h3>
      <p>ID: {{ e.id }}</p>

      <div class="section">
        <h4>Attendance</h4>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="att in attendanceRecords.filter(a => a.employee_id === e.id)"
              :key="att.id"
            >
              <td>{{ formatDate(att.date) }}</td>
              <td :class="statusClass(att.status)">{{ att.status }}</td>
            </tr>
            <tr v-if="attendanceRecords.filter(a => a.employee_id === e.id).length === 0">
              <td colspan="2" class="empty-msg">No records found</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <p v-if="employees.length === 0" class="empty-msg">
      No employees found.
    </p>
  </div>

  <div v-else class="loading">Loading attendance...</div>
  <p v-if="error" class="error">{{ error }}</p>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  data() {
    return {
      loading: true,
      error: null
    };
  },
  computed: {
    ...mapState(["employees", "attendanceRecords"])
  },
  async created() {
    try {
      await Promise.all([this.fetchEmployees(), this.fetchAttendance()]);
    } catch (err) {
      this.error = "Failed to load attendance data.";
      console.error(err);
    } finally {
      this.loading = false;
    }
  },
  methods: {
    ...mapActions(["fetchEmployees", "fetchAttendance"]),
    formatDate(date) {
      return new Date(date).toLocaleDateString();
    },
    statusClass(status) {
      return {
        Present: "status-present",
        Absent: "status-absent",
        Late: "status-late",
        Leave: "status-leave",
      }[status] || "";
    }
  }
};
</script>

<style scoped>
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
.section {
  margin-top: 12px;
}
.empty-msg {
  grid-column: 1 / -1;
  text-align: center;
  color: #666;
  margin-top: 20px;
}
.loading {
  text-align: center;
  font-size: 1.2rem;
  color: #555;
}
.error {
  text-align: center;
  color: red;
  margin-top: 10px;
}
/* Attendance status colors */
.status-present { color: green; font-weight: bold; }
.status-absent { color: red; font-weight: bold; }
.status-late { color: orange; font-weight: bold; }
.status-leave { color: blue; font-weight: bold; }
</style>
