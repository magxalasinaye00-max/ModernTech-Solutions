<template>
  <div class="dashboard-container">
    <!-- SIDEBAR -->
    <aside :class="['sidebar', { collapsed: !sidebarOpen }]">
      <button class="toggle-btn" @click="toggleSidebar">
        {{ sidebarOpen ? '⟨' : '⟩' }}
      </button>

      <ul v-show="sidebarOpen" class="sidebar-menu">
        <li><router-link to="/">Employees</router-link></li>
        <li><router-link to="/payroll">Payroll</router-link></li>
        <li><router-link to="/attendance">Attendance</router-link></li>
        <li><router-link to="/leave">Leave</router-link></li>
        <li><router-link to="/reviews">Performance Reviews</router-link></li>

        <li class="logout-box">
          <button class="logout-btn" @click="logoutUser">Logout</button>
        </li>
      </ul>
    </aside>

    <!-- MAIN CONTENT AREA -->
    <main class="main-content">
      <div class="header">
        <h2>Performance Reviews</h2>
        <p class="muted">Add reviews, see history and an at-a-glance employee average chart.</p>
      </div>

      <div class="grid">
        <!-- LEFT: form + history -->
        <div class="col">
          <div class="card">
            <h4>Add Review</h4>
            <select v-model.number="form.employeeId" class="input">
              <option disabled value="">Select employee</option>
              <option v-for="e in employees" :key="e.employeeId" :value="e.employeeId">
                {{ e.name }} — {{ e.department }}
              </option>
            </select>

            <input type="number" min="1" max="5" v-model.number="form.rating" class="input" placeholder="Rating 1–5" />
            <textarea v-model="form.comments" class="input" placeholder="Comments (optional)"></textarea>

            <div class="actions">
              <button class="btn primary" @click="submitReview">Submit</button>
              <button class="btn" @click="resetForm">Clear</button>
            </div>
          </div>

          <div class="card mt">
            <h4>Review History</h4>
            <table class="history">
              <thead>
                <tr><th>Employee</th><th>Rating</th><th>Comments</th><th>Date</th></tr>
              </thead>
              <tbody>
                <tr v-if="!reviews || reviews.length === 0">
                  <td colspan="4" class="muted">No reviews yet.</td>
                </tr>
                <tr v-for="r in reviewsSorted" :key="r.id">
                  <td>{{ empName(r.employeeId) }}</td>
                  <td><span class="rating-pill" :data-rating="r.rating">{{ r.rating }}</span></td>
                  <td class="comments">{{ r.comments || '—' }}</td>
                  <td class="muted small">{{ formatDate(r.date) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- RIGHT: chart -->
        <div class="col">
          <div class="card chart-card">
            <h4>Average Rating by Employee</h4>
            <canvas id="reviewsChart" aria-label="Average rating chart"></canvas>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import { Chart, BarController, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
Chart.register(BarController, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default {
  name: 'PerformanceReviews',
  data() {
    return {
      form: { employeeId: '', rating: null, comments: '' },
      chart: null,
      sidebarOpen: true
    };
  },
  computed: {
    employees() { return this.$store.state.employees || []; },
    reviews() {
      const g = this.$store.getters && this.$store.getters['reviews/allReviews'];
      if (Array.isArray(g)) return g;
      if (this.$store.state && this.$store.state.reviews && Array.isArray(this.$store.state.reviews.all)) return this.$store.state.reviews.all;
      if (this.$store.state && Array.isArray(this.$store.state.reviews)) return this.$store.state.reviews;
      return [];
    },
    reviewsSorted() { return [...(this.reviews || [])].sort((a,b) => new Date(b.date) - new Date(a.date)); }
  },
  methods: {
    empName(id) { return this.employees.find(e => e.employeeId === id)?.name ?? 'Unknown'; },
    formatDate(d) { return d ? new Date(d).toLocaleDateString() : ''; },
    resetForm() { this.form = { employeeId: '', rating: null, comments: '' }; },
    submitReview() {
      if (!this.form.employeeId || !this.form.rating) { alert('Please select an employee and enter a rating.'); return; }
      const payload = { employeeId: this.form.employeeId, rating: Number(this.form.rating), comments: this.form.comments || '', date: new Date().toISOString() };
      try { this.$store.dispatch('reviews/addReview', payload); } catch(e) {}
      this.resetForm();
      this.$nextTick(() => this.updateChart());
    },
    averages() {
      const labels = this.employees.map(e => e.name);
      const data = this.employees.map(e => {
        const their = (this.reviews || []).filter(r => Number(r.employeeId) === Number(e.employeeId));
        if (!their.length) return 0;
        const avg = their.reduce((s,r)=> s + Number(r.rating), 0) / their.length;
        return Math.round(avg * 100) / 100;
      });
      return { labels, data };
    },
    buildChart() {
      const ctx = document.getElementById('reviewsChart'); if (!ctx) return;
      const { labels, data } = this.averages();
      const palette = labels.map((_, i) => ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'][i % 4]);
      if (this.chart) {
        this.chart.data.labels = labels; this.chart.data.datasets[0].data = data; this.chart.data.datasets[0].backgroundColor = palette; this.chart.update(); return;
      }
      this.chart = new Chart(ctx, { type: 'bar', data: { labels, datasets: [{ label: 'Avg Rating', data, backgroundColor: palette }] }, options: { responsive: true, scales: { y: { beginAtZero: true, max: 5, ticks: { stepSize: 1 } } }, plugins: { legend: { display: false }, tooltip: { callbacks: { label: (c) => `${c.parsed.y} / 5` } } } } });
    },
    updateChart() { this.$nextTick(() => this.buildChart()); },
    toggleSidebar() {
      this.sidebarOpen = !this.sidebarOpen;
    },
    logoutUser() {
      this.$store.commit("auth/logout");
      this.$router.push("/");
    }
  },
  mounted() { try { this.$store.dispatch('reviews/loadReviews'); } catch(e) {} this.updateChart(); },
  watch: { employees: 'updateChart', reviews: { handler: 'updateChart', deep: true } }
};
</script>

<style scoped>

/* Dashboard Container */
.dashboard-container {
  display: flex;
  min-height: 100vh;
}

/* Sidebar */
.sidebar {
  width: 220px;
  background-color: #1e1e2f;
  color: white;
  padding-top: 20px;
  transition: width 0.3s;
  position: relative;
  border: none;
  border-radius: 10px;
}

.sidebar.collapsed {
  width: 20px;
}

.toggle-btn {
  position: absolute;
  top: 12px;
  right: -18px;
  background: #1e1e2f;
  color: white;
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  cursor: pointer;
}

.sidebar-menu {
  list-style: none;
  padding-left: 0;
}

.sidebar-menu li {
  margin: 18px 0;
}

.sidebar-menu a {
  color: #d7d7e0;
  text-decoration: none;
  padding: 10px 18px;
  display: block;
  font-size: 0.95rem;
  transition: 0.2s;
}

.sidebar-menu a:hover,
.sidebar-menu a.router-link-active {
  background: #2c2c44;
  color: white;
  border-radius: 6px;
}

.logout-box {
  margin-top: 30px;
  padding: 0 18px;
}

.logout-btn {
  width: 100%;
  padding: 8px 0;
  background: #e63946;
  color: white;
  border: none;
  border-radius: 6px;
  transition: 0.2s;
  cursor: pointer;
}

.logout-btn:hover {
  background: #c71c30;
}

.main-content {
  flex: 1;
  padding: 32px;
  overflow-y: auto;
}

.pr-page { padding: 20px; font-family: Inter, system-ui, -apple-system, "Segoe UI", Roboto, Arial; color:#0f172a; }
.header { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:12px; }
.muted { color:#6b7280; }
.grid { display:grid; grid-template-columns: 1fr 420px; gap:16px; }
.col { display:flex; flex-direction:column; gap:12px; }
.card { background:#fff; border-radius:10px; padding:14px; box-shadow:0 6px 18px rgba(17,24,39,0.06); border:1px solid rgba(15,23,42,0.04); }
.input { width:100%; padding:10px; border-radius:8px; border:1px solid #e5e7eb; margin:8px 0; font-size:14px; }
.actions { display:flex; gap:8px; margin-top:6px; }
.btn { padding:8px 12px; border-radius:8px; border:none; cursor:pointer; font-weight:600; background:#eef2ff; color:#1f2937; }
.btn.primary { background:#3B82F6; color:white; }
.mt { margin-top:6px; }
/* history table */
.history { width:100%; border-collapse:collapse; font-size:14px; }
.history th, .history td { text-align:left; padding:10px 8px; border-bottom:1px solid #f3f4f6; }
.rating-pill { display:inline-block; padding:6px 8px; border-radius:999px; font-weight:700; color:white; }
.rating-pill[data-rating="5"] { background:#10B981; } /* green */
.rating-pill[data-rating="4"] { background:#3B82F6; } /* blue */
.rating-pill[data-rating="3"] { background:#F59E0B; } /* orange */
.rating-pill[data-rating="2"] { background:#F97316; } /* amber */
.rating-pill[data-rating="1"] { background:#EF4444; } /* red */
.comments { color:#374151; max-width:40ch; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.chart-card canvas { width:100% !important; height:320px !important; }
@media (max-width:1000px) {
  .grid { grid-template-columns: 1fr; }
  .chart-card canvas { height:240px !important; }
}

</style>
