<template>
  <div>
    <h2>Performance Review Chart</h2>
     
    <canvas id="performanceChart"></canvas>
  </div>
</template>

<script>
import { Chart, registerables } from "chart.js";
import { mapGetters } from "vuex";

Chart.register(...registerables);

export default {
  computed: {
    ...mapGetters(["getPerformanceReviews"]),

    // Calculate average score per employee
    performanceData() {
      return this.getPerformanceReviews.map(emp => {
        let total = 0;
        emp.reviews.forEach(r => (total += r.rating));
        return {
          name: emp.name,
          avgScore: total / emp.reviews.length,
           sidebarOpen: true
        };
      });
    }
  },

  mounted() {
    this.generateChart();
  },

  methods: {
       toggleSidebar() {
      this.sidebarOpen = !this.sidebarOpen;
    },
    generateChart() {
      const ctx = document.getElementById("performanceChart");

      new Chart(ctx, {
        type: "bar",
        data: {
          labels: this.performanceData.map(e => e.name),
          datasets: [
            {
              label: "Average Performance Score",
              data: this.performanceData.map(e => e.avgScore)
            }
          ]
        },
        options: {
          scales: {
            y: { beginAtZero: true, max: 5 }
          }
        }
      });
    }
  }
};
</script>

<style scoped>
canvas {
  max-width: 600px;
  margin-top: 20px;
}

</style>
