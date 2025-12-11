import { createRouter, createWebHistory } from "vue-router";
import Login from "../components/Log-in.vue"; 
import Dashboard from "../components/Dashboard.vue";
import Payroll from "../components/Payroll.vue";
import Attendance from "../components/Attendance.vue"; 
import LeaveRequests from "../components/LeaveRequests.vue"; 
import PerfomanceReviews from "../components/PerfomanceReviews.vue"; 

const routes = [ 
  { 
    path: "/", 
    redirect: () => {
      const isLoggedIn = localStorage.getItem("auth") === "true";
      return isLoggedIn ? "/dashboard" : "/login";
    }
  }, 
  { 
    path: "/login", 
    name: "Login", 
    component: Login 
  }, 
  { path: "/dashboard", 
    name: "Dashboard", 
    component: Dashboard,
    meta: { requiresAuth: true }
  }, 
  { path: "/payroll", 
    name: "Payroll", 
    component: Payroll,
    meta: { requiresAuth: true }
  }, 
  { path: "/attendance", 
    name: "Attendance", 
    component: Attendance,
    meta: { requiresAuth: true }
  }, 
  { path: "/leave", 
    name: "Leave", 
    component: LeaveRequests,
    meta: { requiresAuth: true }
  }, 
  { path: "/reviews", 
    name: "PerfomanceReviews", 
    component: PerfomanceReviews,
    meta: { requiresAuth: true }
  }, 
  { path: "/leave-requests", 
    name: "LeaveRequests", 
    component: LeaveRequests,
    meta: { requiresAuth: true }
  } 
]; 
        
const router = createRouter({ 
  history: createWebHistory(), 
  routes 
});

// Auth guard
router.beforeEach((to, from, next) => {
  const isLoggedIn = localStorage.getItem("auth") === "true";
  const requiresAuth = to.meta.requiresAuth;

  if (requiresAuth && !isLoggedIn) {
    // Redirect to login if trying to access protected route without auth
    next("/login");
  } else if (to.path === "/login" && isLoggedIn) {
    // Redirect to dashboard if already logged in and trying to access login
    next("/dashboard");
  } else {
    next();
  }
});

export default router;