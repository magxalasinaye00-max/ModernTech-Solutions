<template>
  <div class="card shadow-sm">
    <div class="card-body">
      <h5 class="card-title">Payroll</h5>

      <div class="row mb-3">
        <div class="col-md-4">
          <input v-model="search" class="form-control" placeholder="Search by employee name" />
        </div>
      </div>

      <div class="table-responsive">
        <table class="table table-striped table-hover align-middle">
          <thead>
            <tr>
              <th>Employee</th>
              <th>Department</th>
              <th>Hours Worked</th>
              <th>Leave Deductions</th>
              <th>Final Salary</th>
              <th>Payslip</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in filtered" :key="row.employeeId">
              <td>{{ row.name }}</td>
              <td>{{ row.department }}</td>
              <td>{{ row.hoursWorked }}</td>
              <td>{{ row.leaveDeductions }}</td>
              <td>R {{ row.finalSalary }}</td>
              <td>
                <button class="btn btn-sm btn-outline-primary me-2" @click="openPayslip(row)">View</button>
                <button class="btn btn-sm btn-outline-success" @click="downloadPayslip(row)">Download</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="payslip" class="modal d-block" tabindex="-1" style="background: rgba(0,0,0,0.5);">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Payslip — {{ payslip.name }}</h5>
              <button type="button" class="btn-close" @click="payslip=null"></button>
            </div>
            <div class="modal-body">
              <p><strong>Department:</strong> {{ payslip.department }}</p>
              <p><strong>Base salary:</strong> R {{ payslip.salary }}</p>
              <p><strong>Hours worked:</strong> {{ payslip.hoursWorked }}</p>
              <p><strong>Leave deductions:</strong> {{ payslip.leaveDeductions }}</p>
              <hr />
              <p><strong>Final salary:</strong> R {{ payslip.finalSalary }}</p>
              <p><strong>Period:</strong> Monthly</p>
            </div>
            <div class="modal-footer">
              <button class="btn btn-secondary" @click="payslip=null">Close</button>
              <button class="btn btn-success" @click="downloadPayslip(payslip)">Download PDF</button>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import { payrollData, employeeInformation } from "../assets/data/hrData";
import { jsPDF } from "jspdf";

export default {
  data() {
    return {
      search: "",
      payslip: null,
      rows: [],
      sidebarOpen: true
     
    };
  },
  created() {
    this.rows = payrollData.map(p => {
      const emp = employeeInformation.find(e => e.employeeId === p.employeeId);
      return { ...p, name: emp?.name, department: emp?.department, salary: emp?.salary };
    });
  },
  computed: {
    filtered() {
      const q = this.search.toLowerCase();
      if (!q) return this.rows;
      return this.rows.filter(r => (r.name || "").toLowerCase().includes(q));
    }
  },
  methods: {
       toggleSidebar() {
      this.sidebarOpen = !this.sidebarOpen;
    },
    openPayslip(row) {
      this.payslip = row;
    },
    downloadPayslip(row) {
      const doc = new jsPDF();
      const title = `Payslip - ${row.name || 'Employee'}`;
      doc.setFontSize(16);
      doc.text(title, 14, 20);

      doc.setFontSize(12);
      doc.text(`Employee ID: ${row.employeeId}`, 14, 36);
      doc.text(`Name: ${row.name || ''}`, 14, 46);
      doc.text(`Department: ${row.department || ''}`, 14, 56);
      doc.text(`Base salary: R ${row.salary ?? ''}`, 14, 66);
      doc.text(`Hours worked: ${row.hoursWorked}`, 14, 76);
      doc.text(`Leave deductions: ${row.leaveDeductions}`, 14, 86);
      doc.text(`Final salary: R ${row.finalSalary}`, 14, 96);

      const fileName = `Payslip-${row.name ? row.name.replace(/\s+/g, '_') : row.employeeId}.pdf`;
      doc.save(fileName);
    }
  }
};
</script>

<style scoped>
.payroll {
  max-width: 900px;
  margin: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

button {
  padding: 5px 12px;
  cursor: pointer;
}

</style>