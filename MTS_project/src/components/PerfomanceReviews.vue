<template>
  <div class="pr-page">
    <div class="header">
      <h3>Perfomance Reviews</h3>
      <p class="muted">Track employee ratings and feedback</p>
    </div>

    <div class="grid">
      <!-- Reviews Table -->
      <div class="col">
        <div class="card">
          <h4>Review History</h4>
          <table class="history">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Rating</th>
                <th>Comments</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="loading">
                <td colspan="4" class="muted">Loading reviews...</td>
              </tr>
              <tr v-else-if="reviews.length === 0">
                <td colspan="4" class="muted">No reviews found.</td>
              </tr>
              <tr v-for="r in reviews" :key="r.id">
                <td>{{ getEmployeeName(r.employee_id) }}</td>
                <td>
                  <span class="rating-pill" :data-rating="r.rating">{{ r.rating }}</span>
                </td>
                <td class="comments">{{ r.comments }}</td>
                <td>{{ formatDate(r.date) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Add Review Form -->
      <div class="col">
        <div class="card">
          <h4>Add New Review</h4>
          <select v-model="selectedEmployee" class="input">
            <option disabled value="">Select Employee</option>
            <option v-for="e in employees" :key="e.id" :value="e.id">
              {{ e.name }}
            </option>
          </select>
          <input
            v-model.number="rating"
            type="number"
            min="1"
            max="5"
            class="input"
            placeholder="Rating (1-5)"
          />
          <textarea v-model="comments" class="input" placeholder="Comments"></textarea>
          <div class="actions">
            <button class="btn primary" @click="submitReview">Submit Review</button>
          </div>
          <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
        </div>
      </div>
    </div>

    <!-- Chart Section -->
    <div class="card chart-card mt">
      <h4>Perfomance Overview</h4>
      <PerfomanceChart />
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import PerfomanceChart from "./PerfomanceChart.vue";

export default {
  name: "PerfomanceReviews",
  components: { PerfomanceChart: PerfomanceChart },
  data() {
    return {
      selectedEmployee: "",
      rating: "",
      comments: "",
      loading: true,
      errorMessage: ""
    };
  },
  computed: {
    ...mapState(["employees"]),
    reviews() {
      return this.$store.state.reviews.all;
    }
  },
  async created() {
    try {
      await this.fetchEmployees();
      await this.$store.dispatch("reviews/fetchReviews");
      console.log("Reviews loaded:", this.reviews);
    } catch (err) {
      this.errorMessage = "Failed to load reviews.";
      console.error(err);
    } finally {
      this.loading = false;
    }
  },
  methods: {
    async fetchEmployees() {
      await this.$store.dispatch("fetchEmployees");
    },
    async submitReview() {
      if (!this.selectedEmployee || !this.rating || !this.comments) {
        alert("Please fill all fields.");
        return;
      }
      if (this.rating < 1 || this.rating > 5) {
        alert("Rating must be between 1 and 5.");
        return;
      }
      try {
        await this.$store.dispatch("reviews/addReview", {
          employee_id: this.selectedEmployee,
          rating: this.rating,
          comments: this.comments,
          date: new Date().toISOString().split("T")[0]
        });
        // Reset form
        this.selectedEmployee = "";
        this.rating = "";
        this.comments = "";
      } catch (err) {
        this.errorMessage = "Error submitting review.";
        console.error(err);
      }
    },
    getEmployeeName(id) {
      const emp = this.employees.find(e => e.id === id);
      return emp ? emp.name : "Unknown";
    },
    formatDate(date) {
      return new Date(date).toLocaleDateString();
    }
  }
};
</script>

<style scoped>
.pr-page {
  padding: 20px;
}

.header {
  margin-bottom: 30px;
}

.header h3 {
  font-size: 28px;
  margin: 0;
  color: #1e1e2f;
}

.muted {
  color: #999;
  margin: 5px 0 0 0;
  font-size: 14px;
}

.grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 30px;
}

.col {
  flex: 1;
}

.card {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.card h4 {
  margin-top: 0;
  margin-bottom: 15px;
  font-size: 18px;
  color: #1e1e2f;
}

.chart-card {
  margin-top: 30px;
  text-align: center;
}

.history {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

.history th,
.history td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #eee;
}

.history th {
  background: #f5f5f5;
  font-weight: 600;
  color: #333;
}

.history tbody tr:hover {
  background: #fafafa;
}

.comments {
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.rating-pill {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 12px;
  font-weight: 600;
  color: white;
}

.rating-pill[data-rating="5"] {
  background: #10b981;
}

.rating-pill[data-rating="4"] {
  background: #3b82f6;
}

.rating-pill[data-rating="3"] {
  background: #f59e0b;
}

.rating-pill[data-rating="2"] {
  background: #ef5350;
}

.rating-pill[data-rating="1"] {
  background: #dc2626;
}

.input {
  width: 100%;
  padding: 10px;
  margin-bottom: 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  font-family: inherit;
}

.input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

textarea.input {
  resize: vertical;
  min-height: 100px;
}

.actions {
  display: flex;
  gap: 10px;
  margin-top: 15px;
}

.btn {
  flex: 1;
  padding: 10px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: 0.2s;
}

.btn.primary {
  background: #3b82f6;
  color: white;
}

.btn.primary:hover {
  background: #2563eb;
}

.error {
  color: #dc2626;
  margin-top: 8px;
  font-size: 0.9rem;
}

.mt {
  margin-top: 16px;
}

@media (max-width: 768px) {
  .grid {
    grid-template-columns: 1fr;
  }
}
</style>
