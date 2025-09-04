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
				<span class="fs-4 fw-bold">MediCare Panel</span>
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
					<div class="user-avatar" :class="userAvatarClass">
						<i :class="userAvatarIcon"></i>
					</div>
					<div class="user-details">
						<div class="user-name">{{ userName }}</div>
						<div class="user-role">{{ userRole }}</div>
						<div class="user-id" v-if="user && user.id">ID: {{ user.id.substring(0, 8) }}</div>
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
	export default {
		name: "App",
		data() {
			return {
				sidebarOpen: true,
				user: null, // User info yahan store hogi
				loadingUser: false,
			};
		},
		computed: {
			userName() {
				return this.user && this.user.name ? this.user.name : "Guest User";
			},
			userRole() {
				if (!this.user || !this.user.role) return "Guest";
				return this.user.role.charAt(0).toUpperCase() + this.user.role.slice(1);
			},
			userAvatarClass() {
				if (!this.user || !this.user.role) return 'guest-avatar';
				switch(this.user.role) {
					case 'admin': return 'admin-avatar';
					case 'doctor': return 'doctor-avatar';
					case 'patient': return 'patient-avatar';
					default: return 'guest-avatar';
				}
			},
			userAvatarIcon() {
				if (!this.user || !this.user.role) return 'bi bi-person-circle';
				switch(this.user.role) {
					case 'admin': return 'bi bi-person-gear';
					case 'doctor': return 'bi bi-person-badge';
					case 'patient': return 'bi bi-person-heart';
					default: return 'bi bi-person-circle';
				}
			},
			sidebarMenu() {
				if (!this.user || !this.user.role) return [];
				
				if (this.user.role === "patient") {
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
				} else if (this.user.role === "doctor") {
					return [
						{
							label: "Dashboard",
							route: "/doctor-dashboard",
							icon: "bi bi-house-door",
						},
						{
							label: "Appointments",
							route: "/doctor-apppoinment",
							icon: "bi bi-calendar-check",
						},
						{
							label: "My Patients",
							route: "/all-patients",
							icon: "bi bi-people",
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
				} else if (this.user.role === "admin") {
					// Admin sidebar menu
					return [
						{
							label: "Admin Dashboard",
							route: "/admin-dashboard",
							icon: "bi bi-speedometer2",
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
							label: "Appointment Management",
							route: "/appointment-calendar",
							icon: "bi bi-calendar3",
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
						// {
						// 	label: "Reports & Analytics",
						// 	route: "/admin-reports",
						// 	icon: "bi bi-graph-up",
						// },
						{
							label: "Notifications",
							route: "/notifications-all",
							icon: "bi bi-bell",
						},
						{
							label: "System Settings",
							route: "/admin-settings",
							icon: "bi bi-gear",
						},
					];
				}
				
				return [];
			},
			showSidebar() {
				// Only show sidebar on dashboard routes (when user is logged in)
				const noSidebarRoutes = ["/", "/register-user", "/forgot-password"];
				return !noSidebarRoutes.includes(this.$route.path) && this.user;
			},
		},
		watch: {
			$route() {
				this.fetchUserInfo();
				this.sidebarOpen = window.innerWidth > 768;
			},
		},
		methods: {
			fetchUserInfo() {
				this.loadingUser = true;
				
				try {
					// Get user info from localStorage (set during login)
					const currentUser = localStorage.getItem('medicare_current_user');
					const authToken = localStorage.getItem('medicare_auth_token');
					
					if (currentUser && authToken) {
						this.user = JSON.parse(currentUser);
						console.log('User Info Loaded:', this.user);
					} else {
						// No user session found
						this.user = null;
						console.log('No user session found');
						
						// Redirect to login if on a dashboard route
						const dashboardRoutes = [
							'/admin-dashboard', '/patient-dashboard', '/doctor-dashboard',
							'/patient-management', '/doctor-management', '/appointment-calendar',
							'/medicines-inventory', '/billing-prescriptions',
							'/notifications-all', '/admin-settings', '/book-appointment',
							'/medical-reports', '/patient-prescriptions', '/pay-bills',
							'/update-profile', '/doctor-apppoinment', '/all-patients',
							'/prescriptions-data', '/schedule-appoinment', '/doctor-notification',
							'/doctor-profile'
						];
						
						if (dashboardRoutes.some(route => this.$route.path.startsWith(route))) {
							this.$router.push('/');
						}
					}
				} catch (error) {
					console.error('Error loading user info:', error);
					this.user = null;
				} finally {
					this.loadingUser = false;
				}
			},
			
			logout() {
				// Clear all localStorage data
				localStorage.removeItem('medicare_current_user');
				localStorage.removeItem('medicare_auth_token');
				localStorage.removeItem('medicare_user_role');
				localStorage.removeItem('Token'); // Legacy token key
				localStorage.removeItem('User'); // Legacy user key
				
				// Update logout statistics
				this.updateLogoutStats();
				
				// Clear user data
				this.user = null;
				
				// Show logout message
				alert(`Goodbye, ${this.userName}! You have been logged out successfully.`);
				
				// Redirect to login page
				this.$router.push("/");
			},
			
			updateLogoutStats() {
				if (this.user) {
					const stats = JSON.parse(localStorage.getItem('medicare_stats') || '{}');
					const today = new Date().toDateString();
					
					stats.totalLogouts = (stats.totalLogouts || 0) + 1;
					stats.logoutsByDate = stats.logoutsByDate || {};
					stats.logoutsByDate[today] = (stats.logoutsByDate[today] || 0) + 1;
					stats.logoutsByRole = stats.logoutsByRole || {};
					stats.logoutsByRole[this.user.role] = (stats.logoutsByRole[this.user.role] || 0) + 1;
					
					localStorage.setItem('medicare_stats', JSON.stringify(stats));
				}
			},
			
			// Check if user has permission for current route
			checkRoutePermission() {
				if (!this.user) return false;
				
				const currentPath = this.$route.path;
				
				// Admin can access all routes
				if (this.user.role === 'admin') return true;
				
				// Doctor specific routes
				if (this.user.role === 'doctor') {
					const doctorRoutes = [
						'/doctor-dashboard', '/doctor-apppoinment', '/all-patients',
						'/prescriptions-data', '/schedule-appoinment', '/doctor-notification'
					];
					return doctorRoutes.some(route => currentPath.startsWith(route));
				}
				
				// Patient specific routes
				if (this.user.role === 'patient') {
					const patientRoutes = [
						'/patient-dashboard', '/book-appointment', '/medical-reports',
						'/patient-prescriptions', '/pay-bills', '/update-profile'
					];
					return patientRoutes.some(route => currentPath.startsWith(route));
				}
				
				return false;
			},
			
			// Get session duration
			getSessionDuration() {
				if (this.user && this.user.loginTime) {
					const loginTime = new Date(this.user.loginTime);
					const currentTime = new Date();
					const diffMs = currentTime - loginTime;
					const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
					const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
					return `${diffHours}h ${diffMinutes}m`;
				}
				return 'N/A';
			}
		},
		
		mounted() {
			this.sidebarOpen = window.innerWidth > 768;
			this.fetchUserInfo();
			
			// Handle window resize
			window.addEventListener("resize", () => {
				this.sidebarOpen = window.innerWidth > 768;
			});
			
			// Check route permission
			if (!this.checkRoutePermission() && this.user) {
				console.log('Access denied for current route');
				// Redirect to appropriate dashboard
				switch(this.user.role) {
					case 'admin':
						this.$router.push('/admin-dashboard');
						break;
					case 'doctor':
						this.$router.push('/doctor-dashboard');
						break;
					case 'patient':
						this.$router.push('/patient-dashboard');
						break;
					default:
						this.$router.push('/');
				}
			}
			
			// Debug info
			console.log('App mounted, session duration:', this.getSessionDuration());
		},
		
		// Before route change
		beforeRouteUpdate(to, from, next) {
			if (this.checkRoutePermission()) {
				next();
			} else {
				console.log('Route access denied');
				next(false);
			}
		}
	};
</script>

<style>
	@import url("https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css");
	@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap");

	body {
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
		overflow-y: auto;
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
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 1.35rem;
		color: #fff;
		box-shadow: 0 2px 8px rgba(30, 58, 138, 0.1);
	}

	.admin-avatar {
		background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
	}

	.doctor-avatar {
		background: linear-gradient(135deg, #10b981 0%, #059669 100%);
	}

	.patient-avatar {
		background: linear-gradient(135deg, #38bdf8 0%, #2563eb 100%);
	}

	.guest-avatar {
		background: linear-gradient(135deg, #6b7280 0%, #4b5563 100%);
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

	.user-id {
		font-size: 0.7rem;
		opacity: 0.7;
		color: #cbd5e1;
		margin-top: 2px;
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