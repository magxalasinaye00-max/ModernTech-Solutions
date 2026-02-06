<template>
  <div class="payroll-container">
    <div class="payroll-header">
      <h3>Payroll Management</h3>
    </div>

    <div v-if="payroll.length > 0" class="desktop-view">
      <table class="payroll-table">
        <thead>
          <tr>
            <th>Employee Name</th>
            <th>Salary</th>
            <th>Hours Worked</th>
            <th>Leave Deductions</th>
            <th>Final Salary</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="record in payroll" :key="record.id" class="payroll-row">
            <td>{{ record.name }}</td>
            <td class="salary-cell">{{ formatCurrency(record.salary) }}</td>
            <td>{{ record.hoursWorked }}</td>
            <td class="deduction-cell">{{ formatCurrency(record.leaveDeductions) }}</td>
            <td class="final-salary">{{ formatCurrency(record.finalSalary) }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-else-if="payroll.length === 0" class="empty-msg">
      <p>No payroll data available</p>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  name: "Payroll",

  computed: {
    ...mapState(["payroll"])
  },

  created() {
    this.fetchPayroll();
  },

  methods: {
    ...mapActions(["fetchPayroll"]),

    formatCurrency(value) {

      if (value === null || value === undefined) {
        return "R0.00";
      }

      return new Intl.NumberFormat("en-ZA", {
        style: "currency",
        currency: "ZAR"
      }).format(Number(value));
    }
  }
};
</script>

<style scoped>
/* ---------- VARIABLES ---------- */
:root{--blue:#3B82F6;--blue-light:#dbeafe;--blue-dark:#1e40af;--green:#059669;--green-light:#dcfce7;--green-bg:#ecfdf5;--gray:#e5e7eb;--gray-dark:#374151;--font:#1e1e2f}
.dashboard-container{display:flex;min-height:100vh;}
.sidebar{width:220px;background:#1e1e2f;color:white;padding-top:20px;transition:width .3s;position:relative;border: none;border-radius:10px}
.sidebar.collapsed{width:10px}
.toggle-btn{position:absolute;top:10px;right:-25px;width:25px;height:25px;background:#1e1e2f;color:white;border:none;cursor:pointer;font-weight:bold}
.sidebar-menu{list-style:none;padding:0;margin:0}
.sidebar-menu li{margin:18px 0}
.sidebar-menu a{color:#d7d7e0;text-decoration:none;padding:10px 18px;display:block;font-size:.95rem;transition:.2s}
.sidebar-menu a:hover,.sidebar-menu a.router-link-active{background:#2c2c44;color:white;border-radius:6px}
.logout-box{margin-top:30px;padding:0 18px}
.logout-btn{width:100%;padding:8px 0;background:#e63946;color:white;border:none;border-radius:6px;cursor:pointer}
.logout-btn:hover{background:#c71c30}
.main-content{flex:1;padding:32px;overflow-y:auto}
.payroll-container{max-width:1400px;margin:0 auto}
.payroll-header{margin-bottom:30px}
.payroll-header h3{font-size:28px;font-weight:600;color:var(--font)}
.search-section{display:flex;gap:10px;flex-wrap:wrap;margin-bottom:25px}
.search-box,.input-field,.editable-cell input{padding:10px 12px;border:1px solid #ddd;border-radius:6px;font-size:14px;transition:.2s}
.search-box:focus,.input-field:focus,.editable-cell input:focus{outline:none;border-color:var(--blue);box-shadow:0 0 0 3px rgba(59,130,246,.1)}
.btn-reset{padding:12px 20px;background:#f3f4f6;border:1px solid #ddd;border-radius:6px;cursor:pointer;transition:.2s}
.btn-reset:hover{background:#e5e7eb}
.desktop-view{overflow-x:auto}
.payroll-table{width:100%;border-collapse:collapse;background:#fff;border-radius:8px;box-shadow:0 2px 8px rgba(0,0,0,.08)}
.payroll-table th,.payroll-table td{padding:14px 12px;border-bottom:1px solid #f0f0f0;font-size:13px}
.payroll-table th{background:#f3f4f6;text-transform:uppercase;letter-spacing:.5px;font-weight:600;color:var(--gray-dark)}
.payroll-row:hover{background:#fafafa}
.salary-cell{color:var(--green)}
.deduction-cell{color:#dc2626}
.final-salary{background:var(--green-bg);padding:8px 12px;border-radius:4px;font-weight:600;color:var(--green)}
.actions-cell button,.card-actions button{padding:6px 12px;border:none;border-radius:4px;cursor:pointer;font-size:12px;font-weight:500;transition:.2s}
.btn-view{background:var(--blue-light);color:var(--blue-dark)}
.btn-view:hover{background:#bfdbfe}
.btn-download{background:var(--green-light);color:#166534}
.btn-download:hover{background:#bbf7d0}
.mobile-view{display:none}
.payroll-card{background:#fff;border-radius:8px;margin-bottom:20px;box-shadow:0 2px 8px rgba(0,0,0,.08)}
.card-header{background:#f3f4f6;padding:16px;display:flex;justify-content:space-between}
.emp-badge{background:var(--blue-light);color:var(--blue-dark);padding:5px 10px;border-radius:12px;font-size:12px;font-weight:500}
.info-row,.calc-row,.detail-row{display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #f0f0f0;font-size:14px}
.calc-row.final,.detail-row.final{background:var(--green-bg);border:none;font-weight:600;color:var(--green)}
.modal{position:fixed;inset:0;display:flex;align-items:center;justify-content:center}
.modal-dialog{background:#fff;border-radius:8px;width:90%;max-width:500px;max-height:90vh;overflow-y:auto}
.modal-header,.modal-footer{padding:20px;display:flex;justify-content:space-between}
@media(max-width:1023px){.desktop-view{display:none}.mobile-view{display:block}}
@media(max-width:768px){.search-section{flex-direction:column}.card-body{padding:12px}}
@media(max-width:480px){.info-row,.detail-row{flex-direction:column}.card-header{flex-direction:column;align-items:flex-start}.modal-footer{flex-direction:column-reverse}}
</style>
