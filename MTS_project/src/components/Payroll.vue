<template>
  <div class="dashboard-container">
    <!-- SIDEBAR -->
    <aside :class="['sidebar', { collapsed: !sidebarOpen }]">
      <button class="toggle-btn" @click="sidebarOpen = !sidebarOpen">{{ sidebarOpen ? '⟨' : '⟩' }}</button>
      <ul v-show="sidebarOpen" class="sidebar-menu">
        <li v-for="link in links" :key="link.name"><router-link :to="link.path">{{ link.name }}</router-link></li>
        <li class="logout-box"><button class="logout-btn" @click="logoutUser">Logout</button></li>
      </ul>
    </aside>

    <!-- MAIN CONTENT -->
    <main class="main-content">
      <div class="payroll-container">
        <div class="payroll-header">
          <h3>Payroll Management</h3>
          <p class="subtitle">View and manage employee salaries with automated calculations</p>
        </div>

        <!-- SEARCH & RESET -->
        <div class="search-section">
          <input v-model="search" type="text" class="search-box" placeholder="Search by employee name or ID..." />
          <button class="btn-reset" @click="resetPayroll">Reset</button>
        </div>

        <!-- DESKTOP TABLE -->
        <div class="desktop-view table-section">
          <table class="payroll-table">
            <thead>
              <tr>
                <th>Employee ID</th><th>Name</th><th>Dept</th><th>Salary</th>
                <th>Hours</th><th>Leave</th><th>Deduction</th><th>Final</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in filtered" :key="row.employeeId">
                <td>{{ row.employeeId }}</td>
                <td>{{ row.name }}</td>
                <td>{{ row.department }}</td>
                <td class="salary-cell">R {{ formatCurrency(row.salary) }}</td>
                <td><input type="number" min="0" max="200" v-model.number="row.hoursWorked" @input="calculateSalary(row)" class="input-field" /></td>
                <td><input type="number" min="0" max="20" v-model.number="row.leaveDeductions" @input="calculateSalary(row)" class="input-field" /></td>
                <td class="deduction-cell">R {{ formatCurrency(row.deductionAmount) }}</td>
                <td class="final-salary">R {{ formatCurrency(row.finalSalary) }}</td>
                <td>
                  <button class="btn-view" @click="payslip = row">View</button>
                  <button class="btn-download" @click="downloadPayslip(row)">PDF</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- MOBILE CARDS -->
        <div class="mobile-view">
          <div v-for="row in filtered" :key="row.employeeId" class="payroll-card">
            <div class="card-header">
              <h4>{{ row.name }}</h4>
              <span class="emp-badge">ID: {{ row.employeeId }}</span>
            </div>
            <div class="card-body">
              <div class="info-row" v-for="(val, key) in {Dept: row.department, 'Base Salary': 'R ' + formatCurrency(row.salary)}" :key="key">
                <span class="label">{{ key }}:</span><span class="value">{{ val }}</span>
              </div>

              <div class="input-section">
                <div class="input-group" v-for="field in ['hoursWorked','leaveDeductions']" :key="field">
                  <label>{{ field==='hoursWorked'?'Hours Worked (max 200)':'Leave Days (max 20)' }}</label>
                  <input type="number" :min="0" :max="field==='hoursWorked'?200:20" v-model.number="row[field]" @input="calculateSalary(row)" class="input-field" />
                </div>
              </div>

              <div class="calculation-section">
                <div class="calc-row">Deduction: R {{ formatCurrency(row.deductionAmount) }}</div>
                <div class="calc-row final">Final: R {{ formatCurrency(row.finalSalary) }}</div>
              </div>

              <div class="card-actions">
                <button class="btn-view" @click="payslip=row">View</button>
                <button class="btn-download" @click="downloadPayslip(row)">PDF</button>
              </div>
            </div>
          </div>
        </div>

        <!-- PAYSLIP MODAL -->
        <div v-if="payslip" class="modal">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title">Payslip — {{ payslip.name }}</h5>
                <button class="btn-close" @click="payslip=null">×</button>
              </div>
              <div class="modal-body">
                <div class="payslip-details" v-for="(val,key) in {
                  'Employee ID': payslip.employeeId, Dept: payslip.department, 'Base Salary': 'R '+formatCurrency(payslip.salary),
                  'Hours Worked': payslip.hoursWorked+' hrs','Leave Days': payslip.leaveDeductions+' days',
                  'Deduction Amount':'R '+formatCurrency(payslip.deductionAmount), 'Final Salary':'R '+formatCurrency(payslip.finalSalary),
                  'Period':'Monthly'
                }" :key="key" :class="{'final': key==='Final Salary'}">
                  <span class="detail-label">{{ key }}:</span><span class="detail-value">{{ val }}</span>
                </div>
              </div>
              <div class="modal-footer">
                <button class="btn btn-secondary" @click="payslip=null">Close</button>
                <button class="btn btn-success" @click="downloadPayslip(payslip)">Download PDF</button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </main>
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
      sidebarOpen: true,
      originalRows: [],
      links: [
        { name: "Employees", path: "/" },
        { name: "Payroll", path: "/payroll" },
        { name: "Attendance", path: "/attendance" },
        { name: "Leave", path: "/leave" },
        { name: "Performance Reviews", path: "/reviews" },
      ]
    };
  },
  created() {
    this.rows = payrollData.map(p => {
      const emp = employeeInformation.find(e=>e.employeeId===p.employeeId);
      const salary = emp?.salary||0;
      const deductionAmount = this.calcDeduction(salary,p.leaveDeductions);
      return { ...p, name: emp?.name, department: emp?.department, salary, deductionAmount, finalSalary: salary-deductionAmount };
    });
    this.originalRows = JSON.parse(JSON.stringify(this.rows));
  },
  computed: {
    filtered() {
      const q = this.search.toLowerCase();
      return q ? this.rows.filter(r => (r.name||"").toLowerCase().includes(q) || r.employeeId.toString().includes(q)) : this.rows;
    }
  },
  methods: {
    calcDeduction(salary,leave){ return Math.round((salary/20*leave)*100)/100; },
    calculateSalary(emp){
      emp.hoursWorked=Math.min(Math.max(emp.hoursWorked,0),200);
      emp.leaveDeductions=Math.min(Math.max(emp.leaveDeductions,0),20);
      emp.deductionAmount=this.calcDeduction(emp.salary,emp.leaveDeductions);
      emp.finalSalary=Math.max(emp.salary-emp.deductionAmount,0);
    },
    resetPayroll(){ if(confirm("Are you sure?")) { this.rows=JSON.parse(JSON.stringify(this.originalRows)); this.search=""; } },
    formatCurrency(v){ return typeof v==='number'?v.toFixed(2):'0.00'; },
    logoutUser(){ this.$store.commit("auth/logout"); this.$router.push("/"); },
    downloadPayslip(row){
      const doc=new jsPDF(),w=doc.internal.pageSize.getWidth();let y=20;
      doc.setFontSize(18); doc.text("ModernTech Solutions",14,y); y+=10;
      doc.setFontSize(14); doc.text("PAYSLIP",14,y); y+=12;
      doc.setFontSize(11); ["Employee Name: "+row.name,"Employee ID: "+row.employeeId,"Department: "+row.department,"Period: Monthly"].forEach(t=>{doc.text(t,14,y);y+=7;});
      doc.setFontSize(10); doc.text("EARNINGS & DEDUCTIONS",14,y); y+=8;
      [["Base Salary","R "+this.formatCurrency(row.salary)],["Hours Worked",row.hoursWorked+" hrs"],["Leave Days",row.leaveDeductions+" days"],["Deductions","- R "+this.formatCurrency(row.deductionAmount)]].forEach(([l,v])=>{doc.text(l,14,y);doc.text(v,w-30,y,{align:'right'});y+=6;});
      y+=2; doc.setDrawColor(200); doc.line(14,y,w-14,y); y+=8;
      doc.setFont(undefined,"bold"); doc.setFontSize(12); doc.text("FINAL SALARY:",14,y); doc.text("R "+this.formatCurrency(row.finalSalary),w-30,y,{align:'right'}); y+=12;
      doc.setFont(undefined,"normal"); doc.setFontSize(9); doc.setTextColor(128); doc.text("Automated payslip",14,doc.internal.pageSize.getHeight()-10);
      doc.save(`Payslip-${row.name?.replace(/\s+/g,'_')||row.employeeId}-${new Date().toISOString().split('T')[0]}.pdf`);
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
