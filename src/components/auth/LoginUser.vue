<template>
	<div
		class="login-container vh-100 d-flex align-items-center justify-content-center p-3">
		<div
			class="login-wrapper row w-100 shadow-lg rounded-4 overflow-hidden"
			style="max-width: 1200px">
			<!-- Left Panel -->
			<div
				class="col-md-6 d-none d-md-flex flex-column align-items-center justify-content-center left-panel text-white p-5">
				<div class="w-100 text-center">
					<h2 class="mb-4 fw-bold display-5">Welcome to MediCare</h2>
					<p class="mb-4 fs-5 px-4">
						Your secure portal to healthcare management and patient care.
					</p>
					<img
						src="https://cdn-icons-png.flaticon.com/512/2967/2967213.png"
						alt="Healthcare Illustration"
						class="img-fluid mt-3"
						style="max-width: 250px" />
				</div>
				<div class="w-100 mt-auto">
					<div class="d-flex justify-content-center gap-3">
						<div
							class="p-2 bg-white bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center"
							style="width: 40px; height: 40px">
							<i class="bi bi-shield-check fs-5"></i>
						</div>
						<div
							class="p-2 bg-white bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center"
							style="width: 40px; height: 40px">
							<i class="bi bi-lock fs-5"></i>
						</div>
						<div
							class="p-2 bg-white bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center"
							style="width: 40px; height: 40px">
							<i class="bi bi-activity fs-5"></i>
						</div>
					</div>
					<p class="text-center mt-3 small opacity-75">
						HIPAA Compliant & Secure Login
					</p>
				</div>
			</div>
			<!-- Right Panel -->
			<div
				class="col-md-6 bg-white p-4 p-md-5 d-flex flex-column justify-content-center position-relative">
				<div class="text-center mb-4">
					<img
						src="https://cdn-icons-png.flaticon.com/512/2967/2967178.png"
						alt="Logo"
						style="height: 60px"
						class="mb-3" />
					<h3 class="mb-2 text-dark fw-bold">Welcome Back</h3>
					<p class="text-muted">Please login to access your dashboard</p>
				</div>
				<form @submit.prevent="handleLogin" class="needs-validation" novalidate>
					<div class="mb-4">
						<label for="email" class="form-label fw-semibold"
							>Email Address</label
						>
						<div class="input-group has-validation">
							<span class="input-group-text bg-light border-end-0">
								<i class="bi bi-envelope text-primary"></i>
							</span>
							<input
								type="email"
								v-model="email"
								class="form-control border-start-0 py-2"
								placeholder="Please enter your email"
								required
								id="email" />
							<div class="invalid-feedback">Please provide a valid email.</div>
						</div>
					</div>
					<div class="mb-4">
						<label for="password" class="form-label fw-semibold"
							>Password</label
						>
						<div class="input-group has-validation">
							<span class="input-group-text bg-light border-end-0">
								<i class="bi bi-lock text-primary"></i>
							</span>
							<input
								type="password"
								v-model="password"
								class="form-control border-start-0 py-2"
								placeholder="••••••••"
								required
								id="password" />
							<div class="invalid-feedback">Please enter your password.</div>
						</div>
						<div class="d-flex justify-content-end mt-2">
							<router-link
								to="/forgot-password"
								class="small text-decoration-none text-primary"
								>Forgot password?</router-link
							>
						</div>
					</div>
					<div class="mb-4">
						<label for="role" class="form-label fw-semibold">Select Role</label>
						<select v-model="role" class="form-select py-2" required id="role">
							<option disabled value="">Choose your role</option>
							<option value="admin">Administrator</option>
							<option value="doctor">Doctor</option>
							<option value="patient">Patient</option>
						</select>
						<div class="invalid-feedback">Please select your role.</div>
					</div>
					<button type="submit" class="btn btn-primary w-100 py-2 fw-bold mb-3" :disabled="loading">
						<span v-if="loading">
							<i class="bi bi-hourglass-split me-2"></i>
							Logging In...
						</span>
						<span v-else>
							Log In <i class="bi bi-arrow-right ms-2"></i>
						</span>
					</button>
				</form>
				
				<!-- Quick Login Buttons for Testing -->
				<div class="mt-3 pt-2 border-top">
					<p class="text-center text-muted small mb-3">Quick Login (For Testing)</p>
					<div class="d-flex gap-2 justify-content-center">
						<button @click="quickLogin('admin')" class="btn btn-outline-primary btn-sm">Admin</button>
						<button @click="quickLogin('doctor')" class="btn btn-outline-success btn-sm">Doctor</button>
						<button @click="quickLogin('patient')" class="btn btn-outline-info btn-sm">Patient</button>
					</div>
				</div>
				
				<div class="text-center mt-4 pt-2">
					<p class="mb-0 text-muted">
						Don't have an account?
						<router-link
							to="/register-user"
							class="text-primary fw-semibold text-decoration-none">
							Register up here
						</router-link>
					</p>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		name: "LoginUser",
		data() {
			return {
				email: "",
				password: "",
				role: "",
				loading: false,
			};
		},
		methods: {
			getAllUsers() {
				const users = localStorage.getItem('medicare_users');
				return users ? JSON.parse(users) : [];
			},
			
			findUser(email, password, role) {
				const users = this.getAllUsers();
				return users.find(user => 
					user.email === email.toLowerCase().trim() && 
					user.password === password && 
					user.role === role &&
					user.isActive === true
				);
			},
			
			validateForm() {
				const form = document.querySelector(".needs-validation");
				if (!form.checkValidity()) {
					form.classList.add("was-validated");
					return false;
				}
				
				// Additional validation
				const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
				if (!emailRegex.test(this.email)) {
					alert("Please enter a valid email address!");
					return false;
				}
				
				return true;
			},
			
			saveUserSession(user) {
				// Save current user session
				const sessionData = {
					id: user.id,
					name: user.name,
					email: user.email,
					role: user.role,
					loginTime: new Date().toISOString(),
					sessionId: 'session_' + Date.now()
				};
				
				localStorage.setItem('medicare_current_user', JSON.stringify(sessionData));
				localStorage.setItem('medicare_auth_token', 'local_' + user.id + '_' + Date.now());
				localStorage.setItem('medicare_user_role', user.role);
				
				// Update last login time
				this.updateLastLogin(user.id);
			},
			
			updateLastLogin(userId) {
				const users = this.getAllUsers();
				const userIndex = users.findIndex(user => user.id === userId);
				if (userIndex !== -1) {
					users[userIndex].lastLogin = new Date().toISOString();
					localStorage.setItem('medicare_users', JSON.stringify(users));
				}
			},
			
			updateLoginStats(role) {
				const stats = JSON.parse(localStorage.getItem('medicare_stats') || '{}');
				const today = new Date().toDateString();
				
				stats.totalLogins = (stats.totalLogins || 0) + 1;
				stats.loginsByDate = stats.loginsByDate || {};
				stats.loginsByDate[today] = (stats.loginsByDate[today] || 0) + 1;
				stats.loginsByRole = stats.loginsByRole || {};
				stats.loginsByRole[role] = (stats.loginsByRole[role] || 0) + 1;
				
				localStorage.setItem('medicare_stats', JSON.stringify(stats));
			},
			
			redirectToDashboard(role) {
				// Role ke hisaab se redirect
				switch(role) {
					case 'admin':
						if (this.$route.path !== '/admin-dashboard') {
							this.$router.push('/admin-dashboard');
						}
						break;
					case 'doctor':
						if (this.$route.path !== '/doctor-dashboard') {
							this.$router.push('/doctor-dashboard');
						}
						break;
					case 'patient':
						if (this.$route.path !== '/patient-dashboard') {
							this.$router.push('/patient-dashboard');
						}
						break;
					default:
						alert('Invalid role selected!');
				}
			},
			
			async handleLogin() {
				if (!this.validateForm()) {
					return;
				}
				
				this.loading = true;
				
				try {
					// Check if user exists in localStorage
					const user = this.findUser(this.email, this.password, this.role);
					
					if (!user) {
						alert('Invalid credentials or user not found! Please check your email, password, and role.');
						return;
					}
					
					// Check if user is active
					if (!user.isActive) {
						alert('Your account has been deactivated. Please contact administrator.');
						return;
					}
					
					// Save user session
					this.saveUserSession(user);
					
					// Update login statistics
					this.updateLoginStats(user.role);
					
					// Success message
					alert(`Welcome back, ${user.name}! Redirecting to ${user.role} dashboard...`);
					
					// Clear form
					this.resetForm();
					
					// Redirect based on role
					this.redirectToDashboard(user.role);
					
				} catch (error) {
					console.error('Login error:', error);
					alert('Login failed. Please try again.');
				} finally {
					this.loading = false;
				}
			},
			
			// Quick login for testing purposes
			quickLogin(role) {
				const users = this.getAllUsers();
				const testUser = users.find(user => user.role === role && user.isActive);
				
				if (testUser) {
					this.email = testUser.email;
					this.password = testUser.password;
					this.role = testUser.role;
					this.handleLogin();
				} else {
					alert(`No ${role} user found! Please register a ${role} first.`);
				}
			},
			
			resetForm() {
				this.email = "";
				this.password = "";
				this.role = "";
				
				// Remove validation classes
				const form = document.querySelector(".needs-validation");
				if (form) {
					form.classList.remove("was-validated");
				}
			},
			
			// Check if user is already logged in
			checkExistingSession() {
				const currentUser = localStorage.getItem('medicare_current_user');
				const authToken = localStorage.getItem('medicare_auth_token');
				
				if (currentUser && authToken) {
					const userData = JSON.parse(currentUser);
					// Redirect to appropriate dashboard if already logged in
					this.redirectToDashboard(userData.role);
				}
			},
			
			// Get users by role (utility method)
			getUsersByRole(role) {
				const users = this.getAllUsers();
				return users.filter(user => user.role === role && user.isActive);
			}
		},
		
		mounted() {
			// Check if already logged in
			// this.checkExistingSession();
			
			// Log users count for debugging
			const users = this.getAllUsers();
			console.log('Total registered users:', users.length);
			console.log('Admin users:', this.getUsersByRole('admin').length);
			console.log('Doctor users:', this.getUsersByRole('doctor').length);
			console.log('Patient users:', this.getUsersByRole('patient').length);
			
			// Initialize stats if not exists
			if (!localStorage.getItem('medicare_stats')) {
				localStorage.setItem('medicare_stats', '{}');
			}
		}
	};
</script>

<style scoped>
	@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap");
	@import url("https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css");

	.login-container {
		background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
		font-family: "Poppins", sans-serif;
	}

	.login-wrapper {
		min-height: 600px;
		background: white;
		border: 1px solid rgba(0, 0, 0, 0.05);
		max-width: 1200px;
		width: 100%;
	}

	.left-panel {
		background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
		background-size: 200% 200%;
		animation: gradient 8s ease infinite;
	}

	@keyframes gradient {
		0% {
			background-position: 0% 50%;
		}

		50% {
			background-position: 100% 50%;
		}

		100% {
			background-position: 0% 50%;
		}
	}

	.form-control,
	.form-select {
		border-radius: 8px;
		border: 1px solid #dee2e6;
		transition: all 0.3s ease;
		padding: 0.5rem 1rem;
	}

	.form-control:focus,
	.form-select:focus {
		border-color: #3b82f6;
		box-shadow: 0 0 0 0.25rem rgba(59, 130, 246, 0.25);
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

	.btn-primary:disabled {
		opacity: 0.6;
		cursor: not-allowed;
		transform: none;
	}

	.btn-outline-primary,
	.btn-outline-success,
	.btn-outline-info {
		border-radius: 8px;
		padding: 0.4rem 0.8rem;
		font-weight: 500;
		transition: all 0.3s ease;
		font-size: 0.85rem;
	}

	.btn-outline-primary:hover {
		background-color: #f8f9fa;
	}

	.invalid-feedback {
		font-size: 0.85rem;
	}

	.was-validated .form-control:invalid,
	.was-validated .form-select:invalid {
		border-color: #dc3545;
	}

	.was-validated .form-control:invalid:focus,
	.was-validated .form-select:invalid:focus {
		box-shadow: 0 0 0 0.25rem rgba(220, 53, 69, 0.25);
	}

	@media (max-width: 1200px) {
		.login-wrapper {
			max-width: 98vw;
			padding-left: 0;
			padding-right: 0;
		}
	}

	@media (max-width: 768px) {
		.login-wrapper {
			min-height: auto;
			max-width: 100vw;
		}

		.left-panel {
			display: none !important;
		}

		.col-md-6 {
			padding: 2rem;
		}
	}
</style>