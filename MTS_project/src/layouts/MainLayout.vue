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
        <li><router-link to="/reviews">Perfomance Reviews</router-link></li>

        <li class="logout-box">
          <button class="logout-btn" @click="logoutUser">Logout</button>
        </li>
      </ul>
    </aside>

    <!-- MAIN CONTENT AREA -->
    <main class="main-content">
      <RouterView></RouterView>
    </main>
  </div>
</template>

<script>
import { mapActions } from "vuex";

export default {
  data() {
    return {
      sidebarOpen: true
    };
  },
  methods: {
    ...mapActions("auth", ["logout"]),
    toggleSidebar() {
      this.sidebarOpen = !this.sidebarOpen;
    },
    async logoutUser() {
      try {
        await this.logout();
        this.$router.push("/login");
      } catch (err) {
        console.error("Logout error:", err);
      }
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
  cursor: pointer;
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
</style>
