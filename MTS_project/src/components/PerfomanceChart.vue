<template>
  <div class="chart-wrapper">
    <h2>Perfomance Review Chart</h2>
    <div v-if="loading" class="status-message">
      <p>Loading chart data...</p>
    </div>
    <div v-else-if="employees.length === 0" class="status-message">
      <p>No employee data available</p>
    </div>
    <div v-else class="chart-container">
      <canvas ref="perfomanceChart"></canvas>
    </div>
    <div v-if="debug" class="debug-info">
      <p>Employees: {{ employees.length }}</p>
      <p>Reviews: {{ allReviews.length }}</p>
      <p>Loading: {{ loading }}</p>
    </div>
  </div>
</template>

<script>
import { Chart, registerables } from "chart.js";
import { mapState, mapGetters, mapActions } from "vuex";

Chart.register(...registerables);

export default {
  name: "PerfomanceChart",
  data() {
    return {
      chartInstance: null,
      loading: true,
      debug: true
    };
  },
  computed: {
    ...mapState(["employees"]),
    ...mapGetters("reviews", ["allReviews"]),

    performanceData() {
      if (!this.employees || this.employees.length === 0) {
        console.log("No employees for chart");
        return [];
      }
      
      const data = this.employees.map(emp => {
        const empReviews = this.allReviews.filter(r => r.employee_id === emp.id);
        if (empReviews.length === 0) {
          return { name: emp.name, avgScore: 0 };
        }
        const total = empReviews.reduce((sum, r) => sum + r.rating, 0);
        return {
          name: emp.name,
          avgScore: total / empReviews.length
        };
      });
      console.log("Performance data computed:", data);
      return data;
    }
  },
  async mounted() {
    console.log("PerfomanceChart mounted");
    try {
      this.loading = true;
      console.log("Fetching employees...");
      await this.fetchEmployees();
      console.log("Employees fetched:", this.employees.length);
      
      console.log("Fetching reviews...");
      await this.$store.dispatch("reviews/fetchReviews");
      console.log("Reviews fetched:", this.allReviews.length);
      
      this.loading = false;
      console.log("Loading complete, waiting for nextTick");
      
      this.$nextTick(() => {
        console.log("NextTick called, generating chart");
        this.generateChart();
      });
    } catch (err) {
      console.error("Error loading chart data:", err);
      this.loading = false;
    }
  },
  methods: {
    ...mapActions(["fetchEmployees"]),

    generateChart() {
      console.log("generateChart called");
      try {
        if (!this.$refs.perfomanceChart) {
          console.error("Canvas ref not found");
          return;
        }

        console.log("Canvas ref found, creating chart");

        if (this.chartInstance) {
          this.chartInstance.destroy();
        }

        const chartData = this.performanceData.length > 0 ? this.performanceData : 
          this.employees.map(e => ({ name: e.name, avgScore: 0 }));

        console.log("Final chart data:", chartData);

        const ctx = this.$refs.perfomanceChart.getContext("2d");
        console.log("Canvas context obtained:", !!ctx);
        
        this.chartInstance = new Chart(ctx, {
          type: "bar",
          data: {
            labels: chartData.map(e => e.name),
            datasets: [
              {
                label: "Average Perfomance Score",
                data: chartData.map(e => e.avgScore),
                backgroundColor: chartData.map(e =>
                  e.avgScore >= 4 ? "#10B981" : e.avgScore >= 2 ? "#F59E0B" : "#EF4444"
                ),
                borderColor: "#ddd",
                borderWidth: 1
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: { 
                beginAtZero: true, 
                max: 5,
                ticks: {
                  stepSize: 1
                }
              }
            },
            plugins: {
              legend: {
                display: true,
                position: "top"
              },
              tooltip: {
                callbacks: {
                  label: (context) => `Score: ${context.parsed.y.toFixed(2)}`
                }
              }
            }
          }
        });
        console.log("Chart created successfully");
      } catch (err) {
        console.error("Error generating chart:", err);
      }
    },
    updateChart() {
      console.log("updateChart called");
      if (this.chartInstance && this.performanceData.length > 0) {
        this.chartInstance.data.labels = this.performanceData.map(e => e.name);
        this.chartInstance.data.datasets[0].data = this.performanceData.map(e => e.avgScore);
        this.chartInstance.update();
      }
    }
  }
};
</script>

<style scoped>
.chart-wrapper {
  width: 100%;
}

h2 {
  margin: 0 0 20px 0;
  color: #1e1e2f;
  font-size: 20px;
}

.status-message {
  color: #666;
  padding: 20px;
  text-align: center;
}

.chart-container {
  position: relative;
  width: 100%;
  height: 400px;
  margin: 20px 0;
  background: #fff;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

canvas {
  display: block !important;
  max-width: 100%;
}

.debug-info {
  background: #f5f5f5;
  padding: 10px;
  margin-top: 10px;
  border-radius: 4px;
  font-size: 12px;
  color: #666;
}

.debug-info p {
  margin: 5px 0;
}
</style>
