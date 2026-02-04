<template>
  <div class="pr-page">
    <div class="header">
      <h3>Performance Reviews</h3>
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
      <h4>Performance Overview</h4>
      <PerformanceChart />
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import PerfomanceChart from "./PerfomanceChart.vue";

export default {
  name: "PerfomanceReviews",
  components: { PerfomanceChart },
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
.error { color: red; margin-top: 8px; font-size: 0.9rem; }
.mt { margin-top: 16px; }
</style>
