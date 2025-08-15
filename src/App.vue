<template>
	<div id="app" class="dashboard-layout">
		<!-- Burger Button for mobile -->
		<button
			class="burger-btn"
			v-if="showSidebar"
			@click="sidebarOpen = !sidebarOpen">
			<i class="bi bi-list"></i>
		</button>
		<aside
			v-if="showSidebar && !loadingUser"
			class="sidebar"
			:class="{ 'sidebar-collapsed': !sidebarOpen }">
			<div class="sidebar-header">
				<i class="bi bi-hospital fs-3"></i>
				<span class="fs-4 fw-bold">Hospital Panel</span>
			</div>
			<ul class="sidebar-menu">
				<li
					v-for="(item, index) in sidebarMenu"
					:key="index"
					@click="$router.push(item.route)"
					:class="{ active: $route.path === item.route }">
					<i :class="item.icon"></i> {{ item.label }}
				</li>
			</ul>
			<div class="sidebar-footer">
				<div class="user-info">
					<div class="user-avatar">
						<i class="bi bi-person-circle"></i>
					</div>
					<div class="user-details">
						<div class="user-name">{{ userName }}</div>
						<div class="user-role">{{ userRole }}</div>
					</div>
				</div>
				<button class="logout-btn-footer" @click="logout">
					<i class="bi bi-box-arrow-right me-2"></i> Logout
				</button>
			</div>
		</aside>
		<div :class="showSidebar ? 'main-content' : 'main-content-full'">
			<router-view />
		</div>
	</div>
</template>

<script>
	import axios from "@/api/axios";

	export default {
		name: "App",
		data() {
			return {
				sidebarOpen: true,
				user: null, // User info yahan store hogi
			};
		},
		computed: {
			userName() {
				return this.user && this.user.name ? this.user.name : "User";
			},
			userRole() {
				return this.user && this.user.role
					? this.user.role.charAt(0).toUpperCase() + this.user.role.slice(1)
					: "Patient";
			},
			sidebarMenu() {
				if (this.user && this.user.role === "patient") {
					return [
						{
							label: "Dashboard",
							route: "/patient-dashboard",
							icon: "bi bi-house-door",
						},
						{
							label: "Appointments",
							route: "/book-appointment",
							icon: "bi bi-calendar-check",
						},
						{
							label: "Medical Reports",
							route: "/medical-reports",
							icon: "bi bi-file-earmark-medical",
						},
						{
							label: "Prescriptions",
							route: "/patient-prescriptions",
							icon: "bi bi-capsule",
						},
						{
							label: "Billing",
							route: "/pay-bills",
							icon: "bi bi-receipt",
						},
						{
							label: "My Profile",
							route: "/update-profile",
							icon: "bi bi-person-gear",
						},
					];
				} else if (this.user && this.user.role === "doctor") {
					return [
						{
							label: "Home",
							route: "/doctor-dashboard",
							icon: "bi bi-house-door",
						},
						{
							label: "Appointments",
							route: "/doctor-apppoinment",
							icon: "bi bi-calendar-check",
						},
						{
							label: "Patients",
							route: "/all-patients",
							icon: "bi bi-file-earmark-medical",
						},
						{
							label: "Prescriptions",
							route: "/prescriptions-data",
							icon: "bi bi-prescription2",
						},
						{
							label: "Schedule",
							route: "/schedule-appoinment",
							icon: "bi bi-clock",
						},
						{
							label: "Notifications",
							route: "/doctor-notification",
							icon: "bi bi-bell",
						},
					];
				} else {
					// Admin sidebar menu
					return [
						{
							label: "Admin Dashboard",
							route: "/admin-dashboard",
							icon: "bi bi-house-door",
						},
						{
							label: "Patient Management",
							route: "/patient-management",
							icon: "bi bi-people",
						},
						{
							label: "Doctor Management",
							route: "/doctor-management",
							icon: "bi bi-person-badge",
						},
						{
							label: "Appoinment Management",
							route: "/appointment-calendar", // <-- unique route
							icon: "bi bi-person-badge",
						},

						{
							label: "Medicines Inventory",
							route: "/medicines-inventory",
							icon: "bi bi-capsule",
						},
						{
							label: "Billing & Prescriptions",
							route: "/billing-prescriptions",
							icon: "bi bi-receipt",
						},
						{
							label: "Notifications",
							route: "/notifications-all",
							icon: "bi bi-bell",
						},
						{
							label: "Settings",
							route: "/admin-settings",
							icon: "bi bi-gear",
						},
					];
				}
			},
			showSidebar() {
				// Only show sidebar on dashboard routes
				const noSidebarRoutes = ["/", "/register-user", "/forgot-password"];
				return !noSidebarRoutes.includes(this.$route.path);
			},
		},
		watch: {
			$route() {
				this.fetchUserInfo();
				this.sidebarOpen = window.innerWidth > 768;
			},
		},
		methods: {
			async fetchUserInfo() {
				const token = localStorage.getItem("Token");
				let user = null;
				if (token) {
					try {
						const response = await axios.get("/profile", {
							headers: { Authorization: `Bearer ${token}` },
						});
						if (response.data && response.data.data) {
							user = response.data.data;
							localStorage.setItem("User", JSON.stringify(user));
						}
					} catch (e) {
						user = null;
					}
				}
				if (!user) {
					const localUser = localStorage.getItem("User");
					user = localUser ? JSON.parse(localUser) : null;
				}
				this.user = user;
				console.log("User Info:", this.user); // Debug
			},
			logout() {
				localStorage.removeItem("Token");
				this.user = null;
				this.$router.push("/");
			},
		},
		mounted() {
			this.sidebarOpen = window.innerWidth > 768;
			this.fetchUserInfo();
			window.addEventListener("resize", () => {
				this.sidebarOpen = window.innerWidth > 768;
			});
		},
	};
</script>

<style>
	@import url("https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css");
	@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap");

	cdbody {
		font-family: "Poppins", sans-serif;
		background-color: #f8f9fa;
	}

	.dashboard-layout {
		display: flex;
		min-height: 100vh;
	}

	/* Sidebar */
	.sidebar {
		width: 255px;
		background: linear-gradient(180deg, #1e3a8a 0%, #172554 100%);
		color: #ffffff;
		padding: 24px 0;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		box-shadow: 4px 0 15px rgba(0, 0, 0, 0.1);
		transition: all 0.3s ease;
		z-index: 1000;
		position: relative;
		/* height: 100vh; */
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
		background-color: rgba(59, 130, 246, 0.8);
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
	}

	.sidebar-menu li.active {
		font-weight: 500;
	}

	/* Sidebar Footer */
	.sidebar-footer {
		padding: 1.5rem;
		border-top: 1px solid rgba(255, 255, 255, 0.1);
		background: linear-gradient(
			90deg,
			rgba(30, 58, 138, 0.1) 0%,
			rgba(59, 130, 246, 0.1) 100%
		);
		box-shadow: 0 -2px 8px rgba(30, 58, 138, 0.07);
		border-radius: 0 0 16px 16px;
	}

	.user-info {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		margin-bottom: 1rem;
		padding: 0.5rem 0.2rem;
		border-radius: 0.7rem;
		background: rgba(59, 130, 246, 0.09);
		box-shadow: 0 1px 4px rgba(30, 58, 138, 0.06);
	}

	.user-avatar {
		width: 2.5rem;
		height: 2.5rem;
		border-radius: 50%;
		background: linear-gradient(135deg, #38bdf8 0%, #2563eb 100%);
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 1.35rem;
		color: #fff;
		box-shadow: 0 2px 8px rgba(30, 58, 138, 0.1);
	}

	.user-details {
		flex: 1;
	}

	.user-name {
		font-weight: 600;
		font-size: 1rem;
		color: #fff;
		letter-spacing: 0.2px;
	}

	.user-role {
		font-size: 0.8rem;
		opacity: 0.85;
		color: #e0e7ff;
	}

	.logout-btn-footer {
		width: 100%;
		padding: 0.65rem 0;
		border-radius: 0.6rem;
		background: linear-gradient(90deg, #f87171 0%, #ef4444 100%);
		border: none;
		color: #fff;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.7rem;
		transition: all 0.18s;
		cursor: pointer;
		font-size: 1rem;
		font-weight: 600;
		box-shadow: 0 2px 8px rgba(239, 68, 68, 0.1);
		letter-spacing: 0.5px;
		margin-top: 8px;
		position: relative;
		overflow: hidden;
	}
	.logout-btn-footer::after {
		content: "";
		position: absolute;
		left: 0;
		top: 0;
		width: 0;
		height: 100%;
		background: rgba(255, 255, 255, 0.12);
		transition: width 0.3s;
		z-index: 1;
	}
	.logout-btn-footer:hover {
		background: linear-gradient(90deg, #ef4444 0%, #f87171 100%);
		color: #fff;
		box-shadow: 0 4px 12px rgba(239, 68, 68, 0.13);
		transform: translateY(-2px) scale(1.03);
	}
	.logout-btn-footer:hover::after {
		width: 100%;
	}

	.logout-btn-footer i {
		font-size: 1.2rem;
	}

	/* Main Content */
	.main-content {
		flex: 1;
		padding: 1rem;
		background-color: #f8f9fa;
		overflow-y: auto;
	}

	.main-content-full {
		flex: 1;
		padding: 0;
		background-color: #f8f9fa;
		overflow-y: auto;
	}

	/* Burger Button */
	.burger-btn {
		display: none;
		position: fixed;
		top: 18px;
		left: 18px;
		z-index: 2001;
		background: #1e3a8a;
		color: #fff;
		border: none;
		border-radius: 8px;
		padding: 8px 12px;
		font-size: 1.7rem;
		box-shadow: 0 2px 8px rgba(30, 58, 138, 0.15);
	}

	@media (max-width: 768px) {
		.burger-btn {
			display: block;
		}

		.sidebar {
			position: fixed;
			top: 0;
			left: 0;
			height: 100vh;
			width: 220px;
			transform: translateX(0);
			transition: transform 0.3s;
			z-index: 2000;
		}

		.sidebar.sidebar-collapsed {
			transform: translateX(-100%);
		}

		.main-content {
			padding-top: 60px;
		}
	}
</style>
