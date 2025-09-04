<template>
	<div class="dashboard-layout">
		<!-- Main Content -->
		<div class="main-content">
			<header class="dashboard-header">
				<h1 class="text-primary">
					<i class="bi bi-hospital me-3"></i>Admin Dashboard
				</h1>
			</header>

			<section class="dashboard-welcome bg-light rounded p-4 mb-4">
				<p class="mb-0 fs-5">
					Welcome, <strong class="text-primary">{{ userName }}</strong
					>! Manage hospital, patients, doctors, appointments, medicines,
					billing, and notifications here.
				</p>
			</section>

			<section class="dashboard-grid">
				<div
					class="dashboard-card card-hover-effect"
					@click="$router.push('/patient-management')">
					<div class="card-icon text-primary">
						<i class="bi bi-people fs-1"></i>
					</div>
					<h3 class="text-primary">Patients</h3>
					<p class="text-muted">Register, view, edit, and manage patients</p>
					<div class="card-badge bg-primary">Manage Patients</div>
				</div>
				<div
					class="dashboard-card card-hover-effect"
					@click="$router.push('/doctor-management')">
					<div class="card-icon text-success">
						<i class="bi bi-person-badge fs-1"></i>
					</div>
					<h3 class="text-success">Doctors</h3>
					<p class="text-muted">View, add, edit doctors & specialization</p>
					<div class="card-badge bg-success">Manage Doctors</div>
				</div>
				<div
					class="dashboard-card card-hover-effect"
					@click="$router.push('/appointment-calendar')">
					<div class="card-icon text-info">
						<i class="bi bi-calendar-check fs-1"></i>
					</div>
					<h3 class="text-info">Appointments</h3>
					<p class="text-muted">View and approve appointment requests</p>
					<div class="card-badge bg-info">Appointments</div>
				</div>
				<div
					class="dashboard-card card-hover-effect"
					@click="$router.push('/medicines-inventory')">
					<div class="card-icon text-warning">
						<i class="bi bi-capsule fs-1"></i>
					</div>
					<h3 class="text-warning">Medicines</h3>
					<p class="text-muted">Inventory, expiry, and stock alerts</p>
					<div class="card-badge bg-warning">Inventory</div>
				</div>
				<div
					class="dashboard-card card-hover-effect"
					@click="$router.push('/billing-prescriptions')">
					<div class="card-icon text-secondary">
						<i class="bi bi-receipt fs-1"></i>
					</div>
					<h3 class="text-secondary">Billing</h3>
					<p class="text-muted">Generate bills and view history</p>
					<div class="card-badge bg-secondary">Billing</div>
				</div>
				<div
					class="dashboard-card card-hover-effect"
					@click="$router.push('/notifications-all')">
					<div class="card-icon text-danger">
						<i class="bi bi-bell fs-1"></i>
					</div>
					<h3 class="text-danger">Notifications</h3>
					<p class="text-muted">Alerts for appointments, stock, emails</p>
					<div class="card-badge bg-danger">Notifications</div>
				</div>
			</section>
		</div>
	</div>
</template>

<script>
	export default {
		name: "AdminDashboard",
		data() {
			return {
				userName: "Admin",
				userRole: "Administrator",
			};
		},
		async created() {
			// Dummy admin data
			this.userName = "Admin User";
			this.userRole = "Administrator";
		},
	};
</script>

<style scoped>
	@import url("https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css");
	@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap");

	.dashboard-layout {
		display: flex;
		min-height: 100vh;
	}

	/* Sidebar */
	.sidebar {
		width: 250px;
		background: linear-gradient(180deg, #6366f1 0%, #0ea5e9 100%);
		color: #fff;
		padding: 24px 0;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		box-shadow: 4px 0 15px rgba(0, 0, 0, 0.1);
		transition: all 0.3s ease;
		z-index: 1000;
	}

	.sidebar-header {
		display: flex;
		align-items: center;
		gap: 12px;
		padding: 0 20px 30px;
		border-bottom: 1px solid rgba(255, 255, 255, 0.1);
	}

	.sidebar-menu {
		list-style: none;
		padding: 0;
		margin-top: 20px;
		flex: 1;
	}

	.sidebar-menu li {
		padding: 14px 25px;
		cursor: pointer;
		display: flex;
		align-items: center;
		gap: 12px;
		transition: all 0.3s ease;
		font-size: 15px;
		margin: 5px 10px;
		border-radius: 8px;
	}

	.sidebar-menu li i {
		width: 20px;
		text-align: center;
	}

	.sidebar-menu li.active,
	.sidebar-menu li:hover {
		background-color: rgba(99, 102, 241, 0.8);
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
	}

	.sidebar-menu li.active {
		font-weight: 500;
	}

	/* Sidebar Footer */
	.sidebar-footer {
		padding: 20px;
		border-top: 1px solid rgba(255, 255, 255, 0.1);
		display: flex;
		flex-direction: column;
		gap: 12px;
	}

	.user-name-footer {
		font-weight: 500;
		color: #fff;
		font-size: 1rem;
		display: flex;
		align-items: center;
	}

	.logout-btn-footer {
		background-color: #ef4444;
		color: white;
		border: none;
		padding: 8px 16px;
		border-radius: 6px;
		cursor: pointer;
		font-size: 0.95rem;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: all 0.3s ease;
		width: 100%;
	}

	.logout-btn-footer:hover {
		background-color: #dc2626;
		transform: translateY(-1px);
		box-shadow: 0 4px 8px rgba(220, 38, 38, 0.3);
	}

	/* Main Content */
	.main-content {
		flex: 1;
		padding: 2rem;
		background-color: #f8f9fa;
		overflow-y: auto;
	}

	.dashboard-header h1 {
		color: #6366f1;
		font-size: 2rem;
		font-weight: 600;
		margin-bottom: 1.5rem;
		display: flex;
		align-items: center;
	}

	/* Welcome Text */
	.dashboard-welcome {
		background: linear-gradient(135deg, #e0f7fa 0%, #f0f7ff 100%);
		border-left: 4px solid #6366f1;
	}

	/* Grid Cards */
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
		box-shadow: 0 10px 25px rgba(99, 102, 241, 0.2);
		border-color: rgba(99, 102, 241, 0.3);
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

	/* Responsive adjustments */
	@media (max-width: 992px) {
		.sidebar {
			width: 220px;
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

		.dashboard-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
