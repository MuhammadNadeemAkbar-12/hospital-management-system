<template>
  <div class="forgot-bg vh-100 d-flex align-items-center justify-content-center p-3">
    <div class="forgot-wrapper shadow-lg rounded-4 overflow-hidden bg-white p-5" style="max-width: 420px; width: 100%;">
      <div class="text-center mb-4">
        <img src="https://cdn-icons-png.flaticon.com/512/2967/2967178.png" alt="Logo" style="height: 60px" class="mb-3" />
        <h3 class="mb-2 text-primary fw-bold">Reset Your Password</h3>
        <p class="text-muted">Enter your registered email and verification code.</p>
      </div>
      <form v-if="step === 1" @submit.prevent="verifyCode" class="needs-validation" novalidate>
        <div class="mb-4">
          <label for="email" class="form-label fw-semibold">Email Address</label>
          <div class="input-group has-validation">
            <span class="input-group-text bg-light border-end-0">
              <i class="bi bi-envelope text-primary"></i>
            </span>
            <input
              type="email"
              v-model="email"
              class="form-control border-start-0 py-2"
              placeholder="your@email.com"
              required
              id="email"
            />
            <div class="invalid-feedback">Please provide a valid email.</div>
          </div>
        </div>
        <div class="mb-4">
          <label for="verificationCode" class="form-label fw-semibold">Authentication Code</label>
          <div class="input-group has-validation">
            <span class="input-group-text bg-light border-end-0">
              <i class="bi bi-shield-lock text-primary"></i>
            </span>
            <input
              type="text"
              v-model="verificationCode"
              class="form-control border-start-0 py-2"
              placeholder="Enter 6-digit code"
              maxlength="6"
              required
              id="verificationCode"
            />
            <div class="invalid-feedback">Please enter the code sent to your email.</div>
          </div>
        </div>
        <button type="submit" class="btn btn-primary w-100 py-2 fw-bold mb-3">
          Verify Code <i class="bi bi-arrow-right ms-2"></i>
        </button>
      </form>
      <form v-else @submit.prevent="resetPassword" class="needs-validation" novalidate>
        <div class="mb-4">
          <label for="newPassword" class="form-label fw-semibold">New Password</label>
          <div class="input-group has-validation">
            <span class="input-group-text bg-light border-end-0">
              <i class="bi bi-lock text-primary"></i>
            </span>
            <input
              type="password"
              v-model="newPassword"
              class="form-control border-start-0 py-2"
              placeholder="Enter new password"
              required
              minlength="6"
              id="newPassword"
            />
            <div class="invalid-feedback">Password must be at least 6 characters.</div>
          </div>
        </div>
        <div class="mb-4">
          <label for="confirmPassword" class="form-label fw-semibold">Confirm New Password</label>
          <div class="input-group has-validation">
            <span class="input-group-text bg-light border-end-0">
              <i class="bi bi-lock-fill text-primary"></i>
            </span>
            <input
              type="password"
              v-model="confirmPassword"
              class="form-control border-start-0 py-2"
              placeholder="Confirm new password"
              required
              minlength="6"
              id="confirmPassword"
            />
            <div class="invalid-feedback">Passwords do not match.</div>
          </div>
        </div>
        <button type="submit" class="btn btn-primary w-100 py-2 fw-bold mb-3">
          Reset Password <i class="bi bi-arrow-repeat ms-2"></i>
        </button>
        <p class="text-center mt-4 mb-0 text-muted">
          Remember your password?
          <router-link to="/login" class="text-primary fw-semibold text-decoration-none">Log in</router-link>
        </p>
      </form>
      <div v-if="successMsg" class="alert alert-success mt-3 text-center py-2">
        {{ successMsg }}
      </div>
      <div v-if="errorMsg" class="alert alert-danger mt-3 text-center py-2">
        {{ errorMsg }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ForgotPassword",
  data() {
    return {
      email: "",
      verificationCode: "",
      newPassword: "",
      confirmPassword: "",
      step: 1,
      successMsg: "",
      errorMsg: "",
      dummyCode: "123456", // Demo code for verification
    };
  },
  methods: {
    verifyCode() {
      const form = document.querySelector(".needs-validation");
      this.successMsg = "";
      this.errorMsg = "";
      if (!form.checkValidity()) {
        form.classList.add("was-validated");
        return;
      }
      // Dummy logic: check if email exists in localStorage users
      const users = JSON.parse(localStorage.getItem("users")) || [];
      const found = users.find((u) => u.email === this.email);
      if (!found) {
        this.errorMsg = "Email not found. Please check and try again.";
        return;
      }
      if (this.verificationCode !== this.dummyCode) {
        this.errorMsg = "Invalid code. Please check your email for the correct code.";
        return;
      }
      this.step = 2;
      this.successMsg = "";
      this.errorMsg = "";
    },
    resetPassword() {
      const form = document.querySelector(".needs-validation");
      this.successMsg = "";
      this.errorMsg = "";
      if (!form.checkValidity()) {
        form.classList.add("was-validated");
        return;
      }
      if (this.newPassword !== this.confirmPassword) {
        this.errorMsg = "Passwords do not match.";
        return;
      }
      // Dummy logic: update password in localStorage users
      let users = JSON.parse(localStorage.getItem("users")) || [];
      users = users.map((u) =>
        u.email === this.email ? { ...u, password: this.newPassword } : u
      );
      localStorage.setItem("users", JSON.stringify(users));
      this.successMsg = "Your password has been reset successfully!";
      this.errorMsg = "";
      setTimeout(() => {
        this.$router.push("/login");
      }, 2000);
    },
  },
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap");
@import url("https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css");

.forgot-bg {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  font-family: "Poppins", sans-serif;
}

.forgot-wrapper {
  max-width: 420px;
  width: 100%;
}

.input-group-text {
  border-radius: 8px 0 0 8px !important;
  background-color: #f8f9fa;
  border-right: none;
}

.form-control.border-start-0 {
  border-left: none;
  border-radius: 0 8px 8px 0 !important;
}

.btn-primary {
  background: linear-gradient(90deg, #3b82f6 0%, #2563eb 100%);
  border: none;
  border-radius: 8px;
  padding: 0.625rem;
  font-weight: 500;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(59, 130, 246, 0.2);
}

.btn-primary:hover {
  background: linear-gradient(90deg, #2563eb 0%, #1d4ed8 100%);
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(59, 130, 246, 0.3);
}

.invalid-feedback {
  font-size: 0.85rem;
}

.was-validated .form-control:invalid {
  border-color: #dc3545;
}

.was-validated .form-control:invalid:focus {
  box-shadow: 0 0 0 0.25rem rgba(220, 53, 69, 0.25);
}
</style>