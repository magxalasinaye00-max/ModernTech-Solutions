<template>
  <div>
    <h2>Perfomance Review Chart</h2>
    <canvas ref="perfomanceChart"></canvas>
  </div>
</template>

<script>
import { Chart, registerables } from "chart.js";
import { mapState, mapGetters } from "vuex";

Chart.register(...registerables);

export default {
  name: "PerfomanceChart",
  data() {
    return {
      chartInstance: null
    };
  },
  computed: {
    ...mapState(["employees"]),
    ...mapGetters("reviews", ["allReviews"]),

    perfomanceData() {
      return this.employees.map(emp => {
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
    }
  },
  mounted() {
    this.generateChart();
  },
  watch: {
    performanceData: {
      deep: true,
      handler() {
        this.updateChart();
      }
    }
  },
  methods: {
    generateChart() {
      if (this.chartInstance) {
        this.chartInstance.destroy();
      }
      const ctx = this.$refs.performanceChart.getContext("2d");
      this.chartInstance = new Chart(ctx, {
        type: "bar",
        data: {
          labels: this.performanceData.map(e => e.name),
          datasets: [
            {
              label: "Average Performance Score",
              data: this.performanceData.map(e => e.avgScore),
              backgroundColor: this.performanceData.map(e =>
                e.avgScore >= 4 ? "#10B981" : e.avgScore >= 2 ? "#F59E0B" : "#EF4444"
              )
            }
          ]
        },
        options: {
          scales: {
            y: { beginAtZero: true, max: 5 }
          },
          plugins: {
            tooltip: {
              callbacks: {
                label: ctx => `Score: ${ctx.raw.toFixed(2)}`
              }
            }
          }
        }
      });
    },
    updateChart() {
      if (this.chartInstance) {
        this.chartInstance.data.labels = this.performanceData.map(e => e.name);
        this.chartInstance.data.datasets[0].data = this.performanceData.map(e => e.avgScore);
        this.chartInstance.update();
      }
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
