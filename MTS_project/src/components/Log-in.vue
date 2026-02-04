<template>
  <div class="login-container">
    <h2>Login</h2>
    <form @submit.prevent="handleLogin" class="login-form">
      <div class="form-group">
        <label>Email</label>
        <input v-model="email" type="email" placeholder="Enter email" required />
      </div>

      <div class="form-group">
        <label>Password</label>
        <input v-model="password" type="password" placeholder="Enter password" required />
      </div>

      <button type="submit" class="btn btn-primary">Login</button>

      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    </form>
  </div>
</template>

<script>
import api from "../api"; // your axios instance

export default {
  name: "Login",
  data() {
    return {
      email: "",
      password: "",
      errorMessage: ""
    };
  },
  methods: {
    async handleLogin() {
      try {
        const res = await api.post("/login", {
          email: this.email,
          password: this.password
        });

        if (res.data.success) {
          // Save token in localStorage
          localStorage.setItem("token", res.data.token);
          // Redirect to dashboard
          this.$router.push("/dashboard");
        } else {
          this.errorMessage = res.data.message || "Login failed.";
        }
      } catch (err) {
        console.error("Login error:", err);
        this.errorMessage = "Server error. Please try again.";
      }
    }
  }
};
</script>

<style scoped>
.login-container {
  max-width: 400px;
  margin: 60px auto;
  padding: 20px;
  border-radius: 8px;
  background: #fff;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}
.login-form {
  display: flex;
  flex-direction: column;
}
.form-group {
  margin-bottom: 14px;
}
input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
}
.btn-primary {
  background: #3B82F6;
  color: white;
  border: none;
  padding: 10px;
  border-radius: 6px;
  cursor: pointer;
}
.btn-primary:hover {
  background: #2563EB;
}
.error {
  margin-top: 10px;
  color: red;
  font-size: 0.9rem;
}
</style>

