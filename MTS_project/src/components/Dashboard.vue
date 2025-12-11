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
      
      <!-- HEADER -->
      <div class="header-section">
        <h2 class="title">ModernTech HR Dashboard</h2>
        <p class="subtitle">Manage employees, payroll, attendance, and more.</p>
      </div>

      <!-- SEARCH BAR -->
      <div class="search-section">
        <input
          type="text"
          v-model="searchQuery"
          placeholder="Search employees..."
          class="search-box"
        />
      </div>

      <!-- EMPLOYEE TABLE -->
      <div class="card shadow-sm mt-3">
        <div class="card-body">
          <h4 class="card-title mb-3">Employee Directory</h4>

          <table class="table table-hover modern-table text-center">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Position</th>
                <th>Department</th>
                <th>History</th>
                <th>Contact</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="x in filteredEmployees" :key="x.employeeId">
                <td>{{ x.employeeId }}</td>
                <td>{{ x.name }}</td>
                <td>{{ x.position }}</td>
                <td>{{ x.department }}</td>
                <td>{{ x.employmentHistory }}</td>
                <td>{{ x.contact }}</td>

                <td>
                  <button class="btn btn-danger btn-sm" @click="deleteEmployee(x.employeeId)">
                    Delete
                  </button>
                </td>
              </tr>
            </tbody>
          </table>

          <!-- NO EMPLOYEES -->
          <p v-if="filteredEmployees.length === 0" class="text-muted text-center mt-3">
            No employees match your search.
          </p>
        </div>
      </div>

      <!-- ADD EMPLOYEE -->
      <div class="card mt-4 p-3 shadow-sm">
        <h4 class="mb-3">Add New Employee</h4>

        <div class="add-employee-grid">
          <input v-model="newName" placeholder="Name" class="form-control" />
          <input v-model="newPosition" placeholder="Position" class="form-control" />
          <input v-model="newDepartment" placeholder="Department" class="form-control" />

          <button class="btn btn-primary" @click="addEmployee">
            Add Employee
          </button>
        </div>
      </div>

      <router-view />
    </main>
  </div>
</template>

<script>
import { employeeInformation } from "../assets/data/hrData.js";

export default {
  name: "Dashboard",

  data() {
    return {
      staff: [...employeeInformation],
      searchQuery: "",
      newName: "",
      newPosition: "",
      newDepartment: "",
      sidebarOpen: true
    };
  },

  computed: {
    filteredEmployees() {
      return this.staff.filter(emp =>
        emp.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        emp.position.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        emp.department.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }
  },

  methods: {
    toggleSidebar() {
      this.sidebarOpen = !this.sidebarOpen;
    },

    deleteEmployee(id) {
      this.staff = this.staff.filter(emp => emp.employeeId !== id);
    },

    addEmployee() {
      if (!this.newName || !this.newPosition || !this.newDepartment) {
        alert("Please fill all fields");
        return;
      }

      const newEmployee = {
        employeeId: this.staff.length + 1,
        name: this.newName,
        position: this.newPosition,
        department: this.newDepartment
      };

      this.staff.push(newEmployee);

      this.newName = "";
      this.newPosition = "";
      this.newDepartment = "";
    },

    logoutUser() {
      this.$store.commit("auth/logout");
      this.$router.push("/");
    }
  }
};
</script>

<style scoped>
/* Entire Layout */
.dashboard-container {
  display: flex;
  height: 100vh;
  background: #f5f7fb;
  font-family: "Inter", sans-serif;
}

/* Sidebar */
.sidebar {
  width: 220px;
  background: #1e1e2f;
  color: white;
  padding: 20px 0;
  position: relative;
  transition: 0.3s ease-in-out;
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
}

.logout-btn:hover {
  background: #c71c30;
}

/* Main Content */
.main-content {
  flex: 1;
  padding: 32px;
  overflow-y: auto;
}

.header-section {
  text-align: center;
  margin-bottom: 25px;
}

.title {
  font-weight: 700;
  font-size: 1.9rem;
}

.subtitle {
  color: #6b7280;
  margin-top: -5px;
}

/* Search */
.search-section {
  display: flex;
  justify-content: center;
}

.search-box {
  width: 70%;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #c3c5d0;
  background: white;
  box-shadow: 0 2px 6px rgba(0,0,0,0.07);
  transition: 0.2s;
}

.search-box:focus {
  border-color: #4a7cff;
  box-shadow: 0 4px 12px rgba(74,124,255,0.15);
}

/* Table Styling */
.modern-table {
  border-radius: 10px;
  overflow: hidden;
}

.modern-table thead {
  background: #1e1e2f;
  color: white;
}

.modern-table tbody tr {
  transition: 0.15s;
}

.modern-table tbody tr:hover {
  background: rgba(74,124,255,0.08);
  transform: scale(1.01);
}

/* Add Employee Form */
.add-employee-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 14px;
}

.card {
  border-radius: 12px;
  background: white;
  border: none;
}

.btn-primary {
  padding: 10px;
}
</style>
