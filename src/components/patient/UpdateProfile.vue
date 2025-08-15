<template>
  <div class="profile-container" role="main">
    <div class="profile-card">
      <div class="profile-header">
        <div class="profile-photo-wrapper">
          <img
            v-if="form.photoPreview"
            :src="form.photoPreview"
            alt="Profile Photo"
            class="profile-photo"
          />
          <i v-else class="bi bi-person-circle profile-icon" aria-hidden="true"></i>
          <label class="photo-upload-label" for="photo-upload" tabindex="0">
            <i class="bi bi-camera"></i>
            <input
              id="photo-upload"
              type="file"
              accept="image/*"
              @change="onPhotoChange"
              class="photo-upload-input"
              aria-label="Upload profile photo"
            />
          </label>
        </div>
        <h2>Update Profile</h2>
        <p class="profile-subtitle">Keep your information up to date</p>
      </div>
      <form class="profile-form" @submit.prevent="submitForm" novalidate>
        <div class="form-row">
          <label for="name" class="form-label">Full Name</label>
          <input
            v-model.trim="form.name"
            id="name"
            type="text"
            class="form-control"
            :aria-invalid="!!errors.name"
            :aria-describedby="errors.name ? 'err-name' : null"
            autocomplete="name"
            required
          />
          <span v-if="errors.name" class="form-error" id="err-name">{{ errors.name }}</span>
        </div>

        <div class="form-row">
          <label for="email" class="form-label">Email Address</label>
          <input
            v-model.trim="form.email"
            id="email"
            type="email"
            class="form-control"
            :aria-invalid="!!errors.email"
            :aria-describedby="errors.email ? 'err-email' : null"
            autocomplete="email"
            required
          />
          <span v-if="errors.email" class="form-error" id="err-email">{{ errors.email }}</span>
        </div>

        <div class="form-row">
          <label for="phone" class="form-label">Phone Number</label>
          <input
            v-model.trim="form.phone"
            id="phone"
            type="text"
            class="form-control"
            :aria-invalid="!!errors.phone"
            :aria-describedby="errors.phone ? 'err-phone' : null"
            autocomplete="tel"
          />
          <span v-if="errors.phone" class="form-error" id="err-phone">{{ errors.phone }}</span>
        </div>

        <div class="form-row">
          <label for="address" class="form-label">Address</label>
          <textarea
            v-model.trim="form.address"
            id="address"
            class="form-control"
            rows="2"
            :aria-invalid="!!errors.address"
            :aria-describedby="errors.address ? 'err-address' : null"
          ></textarea>
          <span v-if="errors.address" class="form-error" id="err-address">{{ errors.address }}</span>
        </div>

        <div class="form-row">
          <label for="dob" class="form-label">Date of Birth</label>
          <input
            v-model="form.dob"
            id="dob"
            type="date"
            class="form-control"
            :aria-invalid="!!errors.dob"
            :aria-describedby="errors.dob ? 'err-dob' : null"
          />
          <span v-if="errors.dob" class="form-error" id="err-dob">{{ errors.dob }}</span>
        </div>

        <div class="form-row">
          <label for="gender" class="form-label">Gender</label>
          <select
            v-model="form.gender"
            id="gender"
            class="form-control"
            :aria-invalid="!!errors.gender"
            :aria-describedby="errors.gender ? 'err-gender' : null"
          >
            <option disabled value="">Select gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          <span v-if="errors.gender" class="form-error" id="err-gender">{{ errors.gender }}</span>
        </div>

        <button
          class="submit-btn"
          type="submit"
          :disabled="loading"
          aria-busy="loading"
        >
          <span v-if="loading" class="spinner"></span>
          <span v-if="loading">Updating...</span>
          <span v-else>Update Profile</span>
        </button>

        <div v-if="success" class="success-msg" role="status">
          <i class="bi bi-check-circle"></i> Profile updated successfully!
        </div>
        <div v-if="error" class="error-msg" role="alert">
          <i class="bi bi-exclamation-circle"></i> {{ error }}
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: "UpdateProfile",
  data() {
    return {
      form: {
        name: "",
        email: "",
        phone: "",
        address: "",
        dob: "",
        gender: "",
        photo: null,
        photoPreview: ""
      },
      loading: false,
      success: false,
      error: "",
      errors: {}
    };
  },
  methods: {
    onPhotoChange(e) {
      const file = e.target.files[0];
      if (file) {
        this.form.photo = file;
        const reader = new FileReader();
        reader.onload = ev => {
          this.form.photoPreview = ev.target.result;
        };
        reader.readAsDataURL(file);
      }
    },
    validate() {
      this.errors = {};
      if (!this.form.name) this.errors.name = "Full name is required.";
      if (!this.form.email) this.errors.email = "Email is required.";
      else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(this.form.email))
        this.errors.email = "Enter a valid email address.";
      if (this.form.phone && !/^(\+?\d{10,15})$/.test(this.form.phone))
        this.errors.phone = "Enter a valid phone number.";
      if (!this.form.address) this.errors.address = "Address is required.";
      if (this.form.dob && new Date(this.form.dob) > new Date())
        this.errors.dob = "Date of birth cannot be in the future.";
      if (!this.form.gender) this.errors.gender = "Please select gender.";
      return Object.keys(this.errors).length === 0;
    },
    submitForm() {
      this.success = false;
      this.error = "";
      if (!this.validate()) return;
      this.loading = true;
      setTimeout(() => {
        this.loading = false;
        this.success = true;
        this.$emit("profile-updated", { ...this.form });
      }, 1200);
    }
  }
};
</script>

<style scoped>
@import url("https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css");

.profile-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #e0f2fe 0%, #f8fafc 100%);
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: flex-start;
  padding: 2rem;
}

.profile-card {
  background: #fff;
  border-radius: 1.5rem;
  box-shadow: 0 8px 32px rgba(30,58,138,0.13);
  padding: 2.5rem 2.2rem;
  width: 100%;
}

.profile-header {
  text-align: center;
  margin-bottom: 2rem;
  position: relative;
}

/* Photo section */
.profile-photo-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 1rem;
  position: relative;
}

.profile-photo {
  width: 90px;
  height: 90px;
  object-fit: cover;
  border-radius: 50%;
  box-shadow: 0 2px 8px rgba(30,58,138,0.09);
  border: 3px solid #e0f2fe;
  background: #f8fafc;
}

.profile-icon {
  font-size: 5rem;
  color: #2563eb;
  background: #f8fafc;
  border-radius: 50%;
  padding: 0.2rem;
}

.photo-upload-label {
  position: absolute;
  bottom: 0;
  right: 38%;
  background: #2563eb;
  color: #fff;
  border-radius: 50%;
  padding: 0.5rem;
  cursor: pointer;
  font-size: 1.2rem;
  box-shadow: 0 2px 8px rgba(30,58,138,0.09);
  transition: background 0.2s;
  display: flex;
  align-items: center;
}
.photo-upload-label:focus,
.photo-upload-label:hover {
  background: #0ea5e9;
  outline: none;
}
.photo-upload-input {
  display: none;
}

/* Typography */
.profile-header h2 {
  font-size: 2rem;
  font-weight: 700;
  color: #2563eb;
  margin-bottom: 0.3rem;
}

.profile-subtitle {
  color: #64748b;
  font-size: 1rem;
  margin-bottom: 0;
}

/* Form styles */
.profile-form {
  margin-top: 1rem;
}

.form-row {
  margin-bottom: 1.2rem;
  display: flex;
  flex-direction: column;
}

.form-label {
  font-weight: 500;
  color: #2563eb;
  margin-bottom: 0.4rem;
  letter-spacing: 0.2px;
}

.form-control {
  width: 100%;
  padding: 0.7rem 1rem;
  border-radius: 0.7rem;
  border: 1px solid #cbd5e1;
  font-size: 1rem;
  background: #f8fafc;
  transition: border-color 0.2s, box-shadow 0.2s;
  box-shadow: 0 1px 4px rgba(30,58,138,0.04);
}

.form-control:focus {
  border-color: #2563eb;
  outline: none;
  box-shadow: 0 2px 8px rgba(30,58,138,0.09);
}

.form-error {
  color: #ef4444;
  font-size: 0.95rem;
  margin-top: 0.2rem;
}

/* Button */
.submit-btn {
  width: 100%;
  padding: 0.8rem;
  border-radius: 0.7rem;
  background: linear-gradient(90deg, #2563eb 0%, #0ea5e9 100%);
  color: #fff;
  font-weight: 600;
  border: none;
  font-size: 1.1rem;
  margin-top: 0.5rem;
  cursor: pointer;
  transition: background 0.2s, box-shadow 0.2s;
  box-shadow: 0 2px 8px rgba(30,58,138,0.07);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.submit-btn:disabled {
  background: #94a3b8;
  cursor: not-allowed;
  box-shadow: none;
}

.spinner {
  display: inline-block;
  width: 18px;
  height: 18px;
  border: 3px solid #fff;
  border-top: 3px solid #2563eb;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin-right: 8px;
  vertical-align: middle;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Messages */
.success-msg {
  color: #22c55e;
  background: #f0fdf4;
  border-radius: 0.7rem;
  padding: 0.7rem;
  margin-top: 1rem;
  font-weight: 500;
  text-align: center;
  box-shadow: 0 1px 4px rgba(34,197,94,0.07);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  justify-content: center;
}

.error-msg {
  color: #ef4444;
  background: #fef2f2;
  border-radius: 0.7rem;
  padding: 0.7rem;
  margin-top: 1rem;
  font-weight: 500;
  text-align: center;
  box-shadow: 0 1px 4px rgba(239,68,68,0.07);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  justify-content: center;
}

/* Responsive tweaks */
@media (max-width: 900px) {
  .profile-card {
    padding: 1.2rem 0.8rem;
  }
  .profile-photo {
    width: 70px;
    height: 70px;
  }
  .profile-icon {
    font-size: 3.5rem;
  }
}
</style>
