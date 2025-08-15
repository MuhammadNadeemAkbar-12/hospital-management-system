<template>
	<div class="dashboard-layout">
		<!-- Main Content -->
		<div class="main-content">
			<!-- Top Navigation -->
			<header class="dashboard-header">
				<div class="header-left">
					<h1 class="text-primary">
						<i class="bi bi-heart-pulse me-2"></i>Patient Dashboard
					</h1>
					<div class="breadcrumb">Home / Dashboard</div>
				</div>
			</header>

			<!-- Welcome Banner -->
			<section class="welcome-banner">
				<div class="welcome-content">
					<h2>
						Welcome back, <span class="text-primary">{{ userName }}</span
						>!
					</h2>
					<p>
						Here's your health summary and quick access to important features.
					</p>
				</div>
				<div class="welcome-actions">
					<button
						class="btn btn-primary"
						@click="$router.push('/book-appointment')">
						<i class="bi bi-plus-circle"></i> Book Appointment
					</button>
				</div>
			</section>

			<!-- Stats Cards -->
			<div class="stats-container">
				<div class="stat-card">
					<div class="stat-icon bg-primary">
						<i class="bi bi-calendar-check"></i>
					</div>
					<div class="stat-info">
						<div class="stat-value">3</div>
						<div class="stat-label">Upcoming Appointments</div>
					</div>
				</div>
				<div class="stat-card">
					<div class="stat-icon bg-success">
						<i class="bi bi-file-earmark-text"></i>
					</div>
					<div class="stat-info">
						<div class="stat-value">5</div>
						<div class="stat-label">Medical Reports</div>
					</div>
				</div>
				<div class="stat-card">
					<div class="stat-icon bg-warning">
						<i class="bi bi-capsule"></i>
					</div>
					<div class="stat-info">
						<div class="stat-value">2</div>
						<div class="stat-label">Active Prescriptions</div>
					</div>
				</div>
				<div class="stat-card">
					<div class="stat-icon bg-info">
						<i class="bi bi-heart"></i>
					</div>
					<div class="stat-info">
						<div class="stat-value">Normal</div>
						<div class="stat-label">Health Status</div>
					</div>
				</div>
			</div>

			<!-- Quick Actions -->
			<section class="quick-actions">
				<h3 class="section-title">Quick Actions</h3>
				<div class="actions-grid">
					<div class="action-card" @click="$router.push('/book-appointment')">
						<div class="action-icon bg-primary">
							<i class="bi bi-calendar-plus"></i>
						</div>
						<div class="action-title">Book Appointment</div>
					</div>
					<div class="action-card" @click="$router.push('/medical-reports')">
						<div class="action-icon bg-success">
							<i class="bi bi-file-earmark-medical"></i>
						</div>
						<div class="action-title">View Reports</div>
					</div>
					<div
						class="action-card"
						@click="$router.push('/patien-trescriptions')">
						<div class="action-icon bg-warning">
							<i class="bi bi-capsule"></i>
						</div>
						<div class="action-title">My Prescriptions</div>
					</div>
					<div class="action-card" @click="$router.push('/pay-bills')">
						<div class="action-icon bg-info">
							<i class="bi bi-credit-card"></i>
						</div>
						<div class="action-title">Pay Bills</div>
					</div>
					<div class="action-card" @click="$router.push('/update-profile')">
						<div class="action-icon bg-secondary">
							<i class="bi bi-person-lines-fill"></i>
						</div>
						<div class="action-title">Update Profile</div>
					</div>
					<div class="action-card" @click="showEmergency">
						<div class="action-icon bg-danger">
							<i class="bi bi-exclamation-triangle"></i>
						</div>
						<div class="action-title">Emergency</div>
					</div>
				</div>
			</section>

			<!-- Upcoming Appointments -->
			<section class="appointments-section">
				<div class="section-header">
					<h3 class="section-title">Upcoming Appointments</h3>
					<router-link
						to="/appointments"
						class="view-all"
						v-if="patient && patient.role === 'patient'">
						View All
					</router-link>
				</div>
				<div class="appointments-list">
					<div
						class="appointment-card"
						v-for="appointment in patient.appointments"
						:key="appointment.id"
						@click="viewAppointment(appointment.id)">
						<div class="appointment-date">
							<div class="date-day">
								{{ new Date(appointment.date).getDate() }}
							</div>
							<div class="date-month">
								{{
									new Date(appointment.date).toLocaleString("default", {
										month: "short",
									})
								}}
							</div>
						</div>
						<div class="appointment-info">
							<div class="doctor-name">Dr. {{ appointment.doctor.name }}</div>
							<div class="appointment-time">
								<i class="bi bi-clock"></i>
								{{
									new Date(appointment.date).toLocaleTimeString([], {
										hour: "2-digit",
										minute: "2-digit",
									})
								}}
							</div>
							<div class="appointment-department">
								<i class="bi bi-hospital"></i>
								{{ appointment.department.name }}
							</div>
						</div>
						<div class="appointment-action">
							<i class="bi bi-chevron-right"></i>
						</div>
					</div>
				</div>
			</section>

			<!-- Patient Info Section -->
			<section class="patient-info-section">
				<h3 class="section-title">Patient Information</h3>
				<div class="patient-info-card">
					<div class="patient-info-header">
						<h4>Welcome, {{ patient && patient.name }}</h4>
						<p>Role: {{ patient && patient.role }}</p>
					</div>
					<div class="patient-info-body">
						<!-- Aur fields bhi show kar sakte hain -->
					</div>
				</div>
			</section>
		</div>
	</div>
</template>

<script>
	import axios from "axios";

	export default {
		name: "PatientDashboard",

		data() {
			return {
				user: null,
				patient: null,
			};
		},

		computed: {
			userName() {
				const user =
					JSON.parse(localStorage.getItem("Token")) ||
					JSON.parse(localStorage.getItem("User"));
				return user && user.name ? user.name : "Patient";
			},
		},
		methods: {
			logout() {
				this.$store.dispatch("auth/logout");
				this.$router.push("/");
			},
			showHelp() {
				// Implement help functionality
				this.$toast.info("Help center will open shortly", {
					position: "top-right",
				});
			},
			showEmergency() {
				// Implement emergency functionality
				this.$toast.warning("Emergency contact options will be shown", {
					position: "top-right",
				});
			},
			viewAppointment(id) {
				this.$router.push(`/book-appointment/${id}`);
			},
			async fetchUserInfo() {
				const token = localStorage.getItem("Token");
				let user = null;
				if (token) {
					try {
						const response = await axios.get("/me", {
							headers: { Authorization: `Bearer ${token}` },
						});
						if (response.data && response.data.data) {
							user = response.data.data;
							localStorage.setItem("User", JSON.stringify(response.data.data));
							localStorage.setItem("Token", response.data.token);
						}
					} catch (e) {
						user = null;
					}
				}
				// Agar API fail ho toh localStorage se user info lo
				if (!user) {
					const localUser = localStorage.getItem("User");
					user = localUser ? JSON.parse(localUser) : null;
				}
				this.user = user;
				console.log("User Info:", this.user); // Debug line
			},
		},
		async mounted() {
			const token = localStorage.getItem("Token");
			const response = await axios.get("/profile", {
				headers: { Authorization: `Bearer ${token}` },
			});
			console.log("Patient Dashboard API Response:", response.data);
			this.patient = response.data.data; // Assign only the object, not the whole response
		},
	};
</script>

<style scoped>
	@import url("https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css");
	@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap");

	:root {
		--primary-color: #0ea5e9;
		--primary-light: #e0f2fe;
		--secondary-color: #64748b;
		--danger-color: #ef4444;
		--warning-color: #f59e0b;
		--success-color: #10b981;
		--info-color: #3b82f6;
		--sidebar-width: 280px;
	}

	body,
	html {
		max-width: 100vw;
		overflow-x: hidden;
	}

	.dashboard-layout {
		display: flex;
		min-height: 100vh;
		background-color: #f8fafc;
		max-width: 100vw;
		overflow-x: hidden;
	}

	.main-content {
		max-width: 100%;
		width: 100%;
		overflow-x: hidden;
		box-sizing: border-box;
		padding: 2rem;
		padding-left: 2rem;
		padding-right: 2rem;
	}

	/* Main Content Styles */
	.main-content {
		flex: 1;
		padding: 2rem;
		padding-left: 2rem;
		padding-right: 2rem;
		overflow-y: auto;
	}

	.dashboard-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1.5rem;
	}

	.header-left h1 {
		font-size: 1.75rem;
		font-weight: 600;
		color: var(--primary-color);
		display: flex;
		align-items: center;
		margin-bottom: 0.25rem;
	}

	.breadcrumb {
		font-size: 0.8rem;
		color: var(--secondary-color);
	}

	.header-right {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.notification-count {
		position: absolute;
		top: -0.25rem;
		right: -0.25rem;
		background-color: var(--danger-color);
		color: white;
		border-radius: 50%;
		width: 1.25rem;
		height: 1.25rem;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 0.65rem;
		font-weight: 600;
	}

	/* Welcome Banner */
	.welcome-banner {
		background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
		border-radius: 1rem;
		padding: 1.5rem;
		margin-bottom: 2rem;
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-left: 4px solid var(--primary-color);
	}

	.welcome-content h2 {
		font-size: 1.5rem;
		font-weight: 600;
		margin-bottom: 0.5rem;
	}

	.welcome-content p {
		color: var(--secondary-color);
		margin-bottom: 0;
	}

	.welcome-actions .btn {
		padding: 0.75rem 1.5rem;
		font-weight: 500;
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	/* Stats Cards */
	.stats-container {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: 1.5rem;
		margin-bottom: 2rem;
	}

	.stats-container,
	.actions-grid {
		max-width: 100%;
		width: 100%;
		box-sizing: border-box;
	}

	.stat-card {
		background-color: white;
		border-radius: 1rem;
		padding: 1.5rem;
		display: flex;
		align-items: center;
		gap: 1rem;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
		transition: all 0.2s ease;
	}

	.stat-card:hover {
		transform: translateY(-5px);
		box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
	}

	.stat-icon {
		width: 3rem;
		height: 3rem;
		border-radius: 0.75rem;
		display: flex;
		align-items: center;
		justify-content: center;
		color: white;
		font-size: 1.25rem;
	}

	.stat-icon.bg-primary {
		background-color: var(--primary-color);
	}

	.stat-icon.bg-success {
		background-color: var(--success-color);
	}

	.stat-icon.bg-warning {
		background-color: var(--warning-color);
	}

	.stat-icon.bg-info {
		background-color: var(--info-color);
	}

	.stat-value {
		font-size: 1.5rem;
		font-weight: 600;
		line-height: 1;
	}

	.stat-label {
		font-size: 0.85rem;
		color: var(--secondary-color);
	}

	/* Quick Actions */
	.section-title {
		font-size: 1.25rem;
		font-weight: 600;
		margin-bottom: 1rem;
		color: #1e293b;
	}

	.quick-actions {
		margin-bottom: 2rem;
	}

	.actions-grid {
		display: grid;
		grid-template-columns: repeat(5, 1fr);
		/* 5 cards in one row */
		gap: 1rem;
		width: 100%;
	}

	@media (max-width: 1200px) {
		.actions-grid {
			grid-template-columns: repeat(3, 1fr);
			/* 3 cards per row on medium screens */
		}
	}

	@media (max-width: 768px) {
		.actions-grid {
			grid-template-columns: repeat(2, 1fr);
			/* 2 cards per row on small screens */
		}
	}

	@media (max-width: 480px) {
		.actions-grid {
			grid-template-columns: 1fr;
			/* 1 card per row on mobile */
		}
	}

	.action-card {
		flex: 1 1 220px;
		min-width: 180px;
		max-width: 320px;
		background-color: white;
		border-radius: 1rem;
		padding: 1.5rem 1rem;
		text-align: center;
		cursor: pointer;
		transition: all 0.2s ease;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
		margin-bottom: 1rem;
	}

	.action-card:hover {
		transform: translateY(-5px);
		box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
	}

	.action-icon {
		width: 3rem;
		height: 3rem;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		color: white;
		font-size: 1.25rem;
		margin: 0 auto 0.75rem;
	}

	.action-title {
		font-weight: 500;
		font-size: 0.95rem;
	}

	/* Appointments Section */
	.appointments-section {
		background-color: white;
		border-radius: 1rem;
		padding: 1.5rem;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
	}

	.section-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1.5rem;
	}

	.view-all {
		color: var(--primary-color);
		font-size: 0.9rem;
		font-weight: 500;
		text-decoration: none;
		transition: all 0.2s ease;
	}

	.view-all:hover {
		text-decoration: underline;
	}

	.appointments-list {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.appointment-card {
		display: flex;
		align-items: center;
		padding: 1rem;
		border-radius: 0.75rem;
		background-color: #f8fafc;
		transition: all 0.2s ease;
		cursor: pointer;
	}

	.appointment-card:hover {
		background-color: #f1f5f9;
	}

	.appointment-date {
		width: 3.5rem;
		height: 3.5rem;
		border-radius: 0.5rem;
		background-color: var(--primary-color);
		color: white;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		margin-right: 1rem;
		flex-shrink: 0;
	}

	.date-day {
		font-size: 1.25rem;
		font-weight: 600;
		line-height: 1;
	}

	.date-month {
		font-size: 0.75rem;
		text-transform: uppercase;
		line-height: 1;
		margin-top: 0.25rem;
	}

	.appointment-info {
		flex: 1;
	}

	.doctor-name {
		font-weight: 500;
		margin-bottom: 0.25rem;
	}

	.appointment-time,
	.appointment-department {
		font-size: 0.85rem;
		color: var(--secondary-color);
		display: flex;
		align-items: center;
		gap: 0.25rem;
	}

	.appointment-department {
		margin-top: 0.25rem;
	}

	.appointment-action {
		width: 2.5rem;
		height: 2.5rem;
		border-radius: 50%;
		background-color: white;
		border: 1px solid #e2e8f0;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		transition: all 0.2s ease;
		flex-shrink: 0;
	}

	.appointment-action:hover {
		background-color: #f1f5f9;
		color: var(--primary-color);
	}

	/* Responsive Styles */
	@media (max-width: 992px) {
		.sidebar {
			width: 250px;
		}
	}

	@media (max-width: 768px) {
		.dashboard-layout {
			flex-direction: column;
		}

		.sidebar {
			width: 100%;
			padding: 1rem;
		}

		.sidebar-menu {
			display: flex;
			flex-wrap: wrap;
			gap: 0.5rem;
		}

		.sidebar-menu li {
			margin: 0;
			padding: 0.5rem 1rem;
			font-size: 0.9rem;
		}

		.stats-container {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	@media (max-width: 576px) {
		.main-content {
			padding-left: 0.5rem;
			padding-right: 0.5rem;
		}

		.dashboard-header {
			flex-direction: column;
			align-items: flex-start;
			gap: 1rem;
		}

		.welcome-banner {
			flex-direction: column;
			align-items: flex-start;
			gap: 1rem;
		}

		.stats-container {
			grid-template-columns: 1fr;
		}
	}
</style>
