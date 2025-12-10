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
    redirect: "/login" 
  }, 
  { 
    path: "/login", 
    name: "Login", 
    component: Login 
  }, 
  { path: "/dashboard", 
    name: "Dashboard", 
    component: Dashboard 
  }, 
  { path: "/payroll", 
    name: "Payroll", 
    component: Payroll 
  }, 
  { path: "/attendance", 
    name: "Attendance", 
    component: Attendance 
  }, 
  { path: "/leave", 
    name: "Leave", 
    component: LeaveRequests }, 
    { path: "/reviews", 
      name: "PerfomanceReviews", 
      component: PerfomanceReviews }, 
      { path: "/leave-requests", 
        name: "LeaveRequests", 
        component: LeaveRequests } ]; 
        
        const router = createRouter({ 
          history: createWebHistory(), 
          routes }); 
          
          export default router;