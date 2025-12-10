<template>
  <div class="login-page">
    <div class="card mx-auto mt-5" style="max-width:420px;">
      <div class="card-body">
        <h4 class="card-title text-center mb-3">Sign in</h4>

        <div class="mb-2">
          <label class="form-label">Email</label>
          <input v-model="email" type="email" class="form-control" placeholder="you@company.com" />
        </div>

        <div class="mb-3">
          <label class="form-label">Password</label>
          <input v-model="password" type="password" class="form-control" placeholder="Password" />
        </div>

        <div class="d-grid">
          <button class="btn btn-primary" @click="loginUser">Login</button>
        </div>

        <p class="text-danger mt-3" v-if="errorMsg">{{ errorMsg }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Login",

  data() {
    return {
      email: "",
      password: "",
      errorMsg: ""
    };
  },

  methods: {
    loginUser() {
      const validEmail = "lungile.moyo@moderntech.com";
      const validPassword = "2468";

      if (this.email.trim().toLowerCase() === validEmail && this.password === validPassword) {

        // CALL VUEX LOGIN
        this.$store.commit("auth/login");

        // Navigate to dashboard
        this.$router.push("/dashboard");

      } else {
        this.errorMsg = "Incorrect login details";
      }
    }
  }
};
</script>

<style scoped>
.login-page {
  padding: 24px;
}
</style>
