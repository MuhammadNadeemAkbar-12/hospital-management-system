<template>
	<div class="settings-container">
		<div class="settings-card">
			<div class="settings-header">
				<i class="bi bi-gear settings-icon"></i>
				<h2>Admin Settings</h2>
				<p class="settings-subtitle">
					Manage hospital profile, admin account, theme, and system preferences.
				</p>
			</div>
			<div class="settings-tabs">
				<button
					v-for="tab in tabs"
					:key="tab"
					:class="['settings-tab', { active: activeTab === tab }]"
					@click="activeTab = tab">
					{{ tab }}
				</button>
			</div>
			<div class="settings-content">
				<!-- Hospital Profile Tab -->
				<div v-if="activeTab === 'Hospital Profile'">
					<form @submit.prevent="saveHospitalProfile" class="settings-form">
						<h3 class="settings-section-title">Hospital Profile</h3>
						<div class="form-group">
							<label>Hospital Name</label>
							<input
								v-model="hospital.name"
								type="text"
								required
								class="form-control" />
						</div>
						<div class="form-group">
							<label>Address</label>
							<input
								v-model="hospital.address"
								type="text"
								required
								class="form-control" />
						</div>
						<div class="form-group">
							<label>Contact Number</label>
							<input
								v-model="hospital.contact"
								type="text"
								required
								class="form-control" />
						</div>
						<div class="form-group">
							<label>Logo</label>
							<input
								type="file"
								@change="onLogoChange"
								accept="image/*"
								class="form-control" />
							<div v-if="hospital.logoPreview" class="settings-logo-preview">
								<img :src="hospital.logoPreview" alt="Logo Preview" />
							</div>
						</div>
						<div class="settings-form-actions">
							<button class="settings-btn" type="submit">
								<i class="bi bi-save"></i> Save Profile
							</button>
						</div>
					</form>
				</div>
				<!-- Admin Account Tab -->
				<div v-if="activeTab === 'Admin Account'">
					<form @submit.prevent="saveAdminAccount" class="settings-form">
						<h3 class="settings-section-title">Admin Account</h3>
						<div class="form-group">
							<label>Full Name</label>
							<input
								v-model="admin.name"
								type="text"
								required
								class="form-control" />
						</div>
						<div class="form-group">
							<label>Email</label>
							<input
								v-model="admin.email"
								type="email"
								required
								class="form-control" />
						</div>
						<div class="form-group">
							<label>Change Password</label>
							<input
								v-model="admin.password"
								type="password"
								placeholder="New Password"
								class="form-control" />
						</div>
						<div class="settings-form-actions">
							<button class="settings-btn" type="submit">
								<i class="bi bi-person-check"></i> Update Account
							</button>
						</div>
					</form>
				</div>
				<!-- Theme Tab -->
				<div v-if="activeTab === 'Theme'">
					<form @submit.prevent="saveTheme" class="settings-form">
						<h3 class="settings-section-title">Theme & Appearance</h3>
						<div class="form-group">
							<label>Sidebar Color</label>
							<select v-model="theme.sidebar" class="form-control">
								<option value="blue">Blue</option>
								<option value="purple">Purple</option>
								<option value="orange">Orange</option>
								<option value="green">Green</option>
							</select>
						</div>
						<div class="form-group">
							<label>Card Style</label>
							<select v-model="theme.card" class="form-control">
								<option value="rounded">Rounded</option>
								<option value="flat">Flat</option>
								<option value="shadow">Shadow</option>
							</select>
						</div>
						<div class="form-group">
							<label>Dark Mode</label>
							<input type="checkbox" v-model="theme.darkMode" />
							<span class="settings-dark-label">{{
								theme.darkMode ? "Enabled" : "Disabled"
							}}</span>
						</div>
						<div class="settings-form-actions">
							<button class="settings-btn" type="submit">
								<i class="bi bi-palette"></i> Save Theme
							</button>
						</div>
					</form>
				</div>
				<!-- System Preferences Tab -->
				<div v-if="activeTab === 'System Preferences'">
					<form @submit.prevent="savePreferences" class="settings-form">
						<h3 class="settings-section-title">System Preferences</h3>
						<div class="form-group">
							<label>Enable Notifications</label>
							<input type="checkbox" v-model="preferences.notifications" />
						</div>
						<div class="form-group">
							<label>Auto-Logout (minutes)</label>
							<input
								v-model.number="preferences.autoLogout"
								type="number"
								min="5"
								max="120"
								class="form-control" />
						</div>
						<div class="form-group">
							<label>Language</label>
							<select v-model="preferences.language" class="form-control">
								<option value="en">English</option>
								<option value="ur">Urdu</option>
							</select>
						</div>
						<div class="settings-form-actions">
							<button class="settings-btn" type="submit">
								<i class="bi bi-sliders"></i> Save Preferences
							</button>
						</div>
					</form>
				</div>
			</div>
			<div v-if="showToast" class="settings-toast">
				<i class="bi bi-check-circle"></i> {{ toastMsg }}
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		name: "AdminSettings",
		data() {
			return {
				tabs: [
					"Hospital Profile",
					"Admin Account",
					"Theme",
					"System Preferences",
				],
				activeTab: "Hospital Profile",
				hospital: {
					name: "City Hospital",
					address: "Main Road, Lahore",
					contact: "+92 300 1234567",
					logo: "",
					logoPreview: "",
				},
				admin: {
					name: "Admin User",
					email: "admin@hospital.com",
					password: "",
				},
				theme: {
					sidebar: "blue",
					card: "rounded",
					darkMode: false,
				},
				preferences: {
					notifications: true,
					autoLogout: 30,
					language: "en",
				},
				showToast: false,
				toastMsg: "",
			};
		},
		methods: {
			saveHospitalProfile() {
				this.showToastMsg("Hospital profile saved!");
			},
			onLogoChange(e) {
				const file = e.target.files[0];
				if (file) {
					this.hospital.logo = file;
					const reader = new FileReader();
					reader.onload = (ev) => {
						this.hospital.logoPreview = ev.target.result;
					};
					reader.readAsDataURL(file);
				}
			},
			saveAdminAccount() {
				this.showToastMsg("Admin account updated!");
				this.admin.password = "";
			},
			saveTheme() {
				this.showToastMsg("Theme settings saved!");
			},
			savePreferences() {
				this.showToastMsg("System preferences saved!");
			},
			showToastMsg(msg) {
				this.toastMsg = msg;
				this.showToast = true;
				setTimeout(() => {
					this.showToast = false;
				}, 2000);
			},
		},
	};
</script>

<style scoped>
	@import url("https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css");

	.settings-container {
		min-height: 100vh;
		background: linear-gradient(135deg, #e0f2fe 0%, #f8fafc 100%);
		display: flex;
		align-items: flex-start;
		justify-content: center;
		padding: 2rem;
		box-sizing: border-box;
		width: 100%;
	}

	.settings-card {
		background: #fff;
		border-radius: 1.5rem;
		box-shadow: 0 8px 32px rgba(30, 58, 138, 0.13);
		padding: 2.5rem 2.2rem;
		width: 100%;
		max-width: 1200px;
		margin: 0 auto;
	}

	.settings-header {
		text-align: center;
		margin-bottom: 2rem;
	}

	.settings-icon {
		font-size: 3rem;
		color: #10b981;
		margin-bottom: 0.5rem;
	}

	.settings-header h2 {
		font-size: 2rem;
		font-weight: 700;
		color: #10b981;
		margin-bottom: 0.3rem;
	}

	.settings-subtitle {
		color: #64748b;
		font-size: 1rem;
		margin-bottom: 0;
	}

	.settings-tabs {
		display: flex;
		gap: 1.2rem;
		justify-content: center;
		margin-bottom: 2rem;
		flex-wrap: wrap;
	}

	.settings-tab {
		background: #e0f2fe;
		color: #2563eb;
		border: none;
		border-radius: 0.7rem;
		padding: 0.7rem 1.3rem;
		font-weight: 600;
		font-size: 1rem;
		cursor: pointer;
		transition: background 0.2s, color 0.2s;
	}

	.settings-tab.active {
		background: linear-gradient(90deg, #10b981 0%, #38bdf8 100%);
		color: #fff;
		box-shadow: 0 2px 8px rgba(30, 58, 138, 0.07);
	}

	.settings-content {
		margin-top: 1.5rem;
	}

	.settings-section-title {
		color: #10b981;
		font-size: 1.2rem;
		font-weight: 600;
		margin-bottom: 1.2rem;
	}

	.settings-form {
		max-width: 800px;
		margin: 0 auto;
	}

	.form-group {
		margin-bottom: 1.3rem;
	}

	.form-group label {
		font-weight: 600;
		color: #2563eb;
		margin-bottom: 0.4rem;
		display: block;
	}

	.form-control {
		border-radius: 0.7rem;
		border: 1px solid #cbd5e1;
		padding: 0.7rem 1rem;
		font-size: 1rem;
		background: #f8fafc;
		width: 100%;
		box-shadow: 0 1px 4px rgba(30, 58, 138, 0.04);
		transition: border-color 0.2s, box-shadow 0.2s;
	}

	.form-control:focus {
		border-color: #10b981;
		outline: none;
		box-shadow: 0 2px 8px rgba(16, 185, 129, 0.09);
	}

	.settings-logo-preview {
		margin-top: 0.7rem;
		text-align: left;
	}
	.settings-logo-preview img {
		max-width: 120px;
		max-height: 120px;
		border-radius: 1rem;
		box-shadow: 0 2px 8px rgba(30, 58, 138, 0.09);
		border: 2px solid #e0f2fe;
	}

	.settings-form-actions {
		display: flex;
		gap: 1rem;
		margin-top: 1.2rem;
		justify-content: flex-end;
	}

	.settings-btn {
		background: linear-gradient(90deg, #10b981 0%, #38bdf8 100%);
		color: #fff;
		border: none;
		border-radius: 0.7rem;
		padding: 0.7rem 1.3rem;
		font-weight: 600;
		font-size: 1rem;
		cursor: pointer;
		box-shadow: 0 2px 8px rgba(30, 58, 138, 0.07);
		transition: background 0.2s, box-shadow 0.2s;
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.settings-btn:hover {
		background: linear-gradient(90deg, #38bdf8 0%, #10b981 100%);
		box-shadow: 0 4px 16px rgba(30, 58, 138, 0.13);
	}

	.settings-dark-label {
		margin-left: 0.7rem;
		color: #64748b;
		font-size: 1rem;
	}

	.settings-toast {
		position: fixed;
		bottom: 2.5rem;
		right: 2.5rem;
		background: linear-gradient(90deg, #10b981 0%, #38bdf8 100%);
		color: #fff;
		padding: 1rem 2rem;
		border-radius: 1rem;
		font-weight: 600;
		font-size: 1.1rem;
		box-shadow: 0 4px 18px rgba(16, 185, 129, 0.12);
		display: flex;
		align-items: center;
		gap: 0.7rem;
		z-index: 99999;
	}

	@media (max-width: 768px) {
		.settings-container {
			padding: 1rem;
		}
		
		.settings-card {
			padding: 1.5rem 1rem;
		}
		
		.settings-tabs {
			gap: 0.5rem;
		}
		
		.settings-tab {
			padding: 0.5rem 1rem;
			font-size: 0.9rem;
		}
		
		.settings-form {
			max-width: 100%;
		}
		
		.settings-toast {
			right: 1rem;
			bottom: 1rem;
			padding: 0.7rem 1.2rem;
			font-size: 1rem;
		}
	}
</style>