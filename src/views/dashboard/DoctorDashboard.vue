<template>
	<div class="dashboard-layout">
		<!-- Main Content -->
		<div class="main-content">
			<header class="dashboard-header">
				<h1 class="text-primary">
					<i class="bi bi-heart-pulse me-3"></i>Doctor Dashboard
				</h1>
			</header>

			<section class="dashboard-welcome bg-light rounded p-4 mb-4">
				<p class="mb-0 fs-5">
					Welcome back, <strong class="text-primary">{{ userName }}</strong
					>! Here you can manage your appointments, patients, and schedules.
				</p>
			</section>

			<section class="dashboard-grid">
				<div
					class="dashboard-card card-hover-effect"
					@click="$router.push('/doctor-apppoinment')">
					<div class="card-icon text-primary">
						<i class="bi bi-calendar-check fs-1"></i>
					</div>
					<h3 class="text-primary">Appointments</h3>
					<p class="text-muted">Upcoming appointments with patients</p>
					<div class="card-badge bg-primary">View Schedule</div>
				</div>

				<div
					class="dashboard-card card-hover-effect"
					@click="$router.push('/all-patients')">
					<div class="card-icon text-primary">
						<i class="bi bi-file-earmark-medical fs-1"></i>
					</div>
					<h3 class="text-primary">Patient Records</h3>
					<p class="text-muted">Access and review medical history</p>
					<div class="card-badge bg-primary">Manage Records</div>
				</div>

				<div
					class="dashboard-card card-hover-effect"
					@click="$router.push('/prescriptions-data')">
					<div class="card-icon text-primary">
						<i class="bi bi-prescription2 fs-1"></i>
					</div>
					<h3 class="text-primary">Prescriptions</h3>
					<p class="text-muted">Create and manage prescriptions</p>
					<div class="card-badge bg-primary">New Prescription</div>
				</div>

				<div
					class="dashboard-card card-hover-effect"
					@click="$router.push('/schedule-appoinment')">
					<div class="card-icon text-primary">
						<i class="bi bi-clock fs-1"></i>
					</div>
					<h3 class="text-primary">Schedule</h3>
					<p class="text-muted">Update your weekly availability</p>
					<div class="card-badge bg-primary">Set Availability</div>
				</div>

				<div
					class="dashboard-card card-hover-effect"
					@click="$router.push('/doctor-notification')">
					<div class="card-icon text-primary">
						<i class="bi bi-bell fs-1"></i>
					</div>
					<h3 class="text-primary">Notifications</h3>
					<p class="text-muted">View alerts, test results, messages</p>
					<div class="card-badge bg-primary">Check Alerts</div>
				</div>
			</section>
		</div>
	</div>
</template>

<script>
	export default {
		name: "DoctorDashboard",
		data() {
			return {
				sidebarOpen: true,
				user: null,
				loadingUser: true, // Add this line
			};
		},
		computed: {
			userName() {
				const user = JSON.parse(localStorage.getItem("User"));
				return user && user.name ? user.name : "Doctor";
			},
		},
		async fetchUserInfo() {
			this.loadingUser = true; // Start loading
			// Dummy user data
			let user = {
				name: "Dr. Smith",
				email: "dr.smith@example.com",
				role: "doctor",
				specialization: "Cardiology",
			};
			// Agar localStorage mein hai toh use karo
			const localUser = localStorage.getItem("User");
			if (localUser) {
				user = JSON.parse(localUser);
			}
			this.user = user;
			this.loadingUser = false; // Done loading
			console.log("User Info:", this.user);
		},
	};
</script>

<style scoped>
	@import url("https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css");
	@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap");

	.dashboard-header h1 {
		color: #1e3a8a;
		font-size: 2rem;
		font-weight: 600;
		margin-bottom: 1.5rem;
		display: flex;
		align-items: center;
	}

	.dashboard-welcome {
		background: linear-gradient(135deg, #e6f0ff 0%, #f0f7ff 100%);
		border-left: 4px solid #3b82f6;
	}

	.dashboard-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
		gap: 1.5rem;
		margin-top: 1.5rem;
	}

	.dashboard-card {
		background: white;
		border-radius: 12px;
		padding: 2rem 1.5rem;
		box-shadow: 0 6px 15px rgba(0, 0, 0, 0.05);
		transition: all 0.3s ease;
		cursor: pointer;
		text-align: center;
		position: relative;
		overflow: hidden;
		border: 1px solid rgba(0, 0, 0, 0.03);
	}

	.card-hover-effect:hover {
		transform: translateY(-5px);
		box-shadow: 0 10px 25px rgba(59, 130, 246, 0.2);
		border-color: rgba(59, 130, 246, 0.3);
	}

	.card-icon {
		margin-bottom: 1rem;
		transition: all 0.3s ease;
	}

	.card-hover-effect:hover .card-icon {
		transform: scale(1.1);
	}

	.dashboard-card h3 {
		font-size: 1.3rem;
		color: #1e40af;
		margin-bottom: 0.75rem;
		font-weight: 600;
	}

	.dashboard-card p {
		font-size: 0.95rem;
		color: #64748b;
		margin-bottom: 1.5rem;
	}

	.card-badge {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		padding: 0.5rem;
		color: white;
		font-size: 0.85rem;
		border-radius: 0 0 12px 12px;
		opacity: 0;
		transform: translateY(100%);
		transition: all 0.3s ease;
	}

	.card-hover-effect:hover .card-badge {
		opacity: 1;
		transform: translateY(0);
	}

	@media (max-width: 768px) {
		.dashboard-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
