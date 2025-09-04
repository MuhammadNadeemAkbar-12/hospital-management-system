<template>
	<div class="patient-management-container">
		<div class="patient-management-card">
			<div class="pm-header">
				<i class="bi bi-people pm-icon"></i>
				<h2>Patient Management</h2>
			</div>
			<div class="pm-actions">
				<button class="pm-btn" @click="showForm = true">
					<i class="bi bi-person-plus"></i> Add Patient
				</button>
				<input
					v-model="search"
					class="pm-search"
					type="text"
					placeholder="Search by name, email, phone..." />
			</div>
			<div class="pm-table-wrapper">
				<table class="pm-table">
					<thead>
						<tr>
							<th>ID</th>
							<th>Profile</th>
							<th>Name</th>
							<th>Email</th>
							<th>Phone</th>
							<th>Gender</th>
							<th>DOB</th>
							<th>Address</th>
							<th>Created At</th>
							<th>Actions</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="patient in filteredPatients" :key="patient.id">
							<td>{{ patient.id }}</td>
							<td>
								<img
									v-if="patient.profile_picture"
									:src="patient.profile_picture"
									alt="Profile"
									class="pm-profile-pic" />
								<span v-else class="pm-profile-placeholder">
									<i class="bi bi-person-circle"></i>
								</span>
							</td>
							<td>{{ patient.name }}</td>
							<td>{{ patient.email }}</td>
							<td>{{ patient.phone || "-" }}</td>
							<td>
								<span
									v-if="patient.gender"
									:class="
										patient.gender === 'male'
											? 'pm-badge-male'
											: 'pm-badge-female'
									">
									{{
										patient.gender.charAt(0).toUpperCase() +
										patient.gender.slice(1)
									}}
								</span>
								<span v-else>-</span>
							</td>
							<td>{{ patient.dob || "-" }}</td>
							<td>{{ patient.address || "-" }}</td>
							<td>
								<span class="pm-date">{{
									formatDate(patient.created_at)
								}}</span>
							</td>
							<td>
								<button class="pm-action-btn" @click="editPatient(patient)">
									<i class="bi bi-pencil"></i>
								</button>
								<button class="pm-action-btn" @click="softDelete(patient)">
									<i class="bi bi-trash"></i>
								</button>
							</td>
						</tr>
						<tr v-if="filteredPatients.length === 0">
							<td colspan="10" class="pm-empty-row">No patients found.</td>
						</tr>
					</tbody>
				</table>
			</div>
			<!-- Patient Form Modal -->
			<div v-if="showForm" class="pm-modal-backdrop">
				<div class="pm-modal">
					<h3>{{ editMode ? "Edit Patient" : "Add Patient" }}</h3>
					<form @submit.prevent="savePatient">
						<div class="form-group">
							<label>Name</label>
							<input
								v-model="form.name"
								type="text"
								required
								class="form-control" />
						</div>
						<div class="form-group">
							<label>Email</label>
							<input
								v-model="form.email"
								type="email"
								required
								class="form-control" />
						</div>
						<div class="form-group" v-if="!editMode">
							<label>Password</label>
							<input
								v-model="form.password"
								type="password"
								required
								class="form-control" />
						</div>
						<div class="form-group" v-if="!editMode">
							<label>Confirm Password</label>
							<input
								v-model="form.password_confirmation"
								type="password"
								required
								class="form-control" />
						</div>
						<div class="form-group">
							<label>Date of Birth</label>
							<input
								v-model="form.dob"
								type="date"
								required
								class="form-control" />
						</div>
						<div class="form-group">
							<label>Gender</label>
							<select v-model="form.gender" required class="form-control">
								<option value="">Select Gender</option>
								<option value="male">Male</option>
								<option value="female">Female</option>
							</select>
						</div>
						<div class="form-group">
							<label>Address</label>
							<input
								v-model="form.address"
								type="text"
								required
								class="form-control" />
						</div>
						<div class="form-group">
							<label>Phone</label>
							<input
								v-model="form.phone"
								type="text"
								required
								class="form-control" />
						</div>
						<div class="form-group">
							<label>Profile Picture (URL)</label>
							<input
								v-model="form.profile_picture_url"
								type="url"
								placeholder="https://example.com/profile.jpg"
								class="form-control" />
						</div>
						<div class="form-group">
							<label>Medical History Description</label>
							<textarea
								v-model="form.medical_history_description"
								rows="3"
								class="form-control"></textarea>
						</div>
						<div class="pm-modal-actions">
							<button class="pm-btn" type="submit">
								<i class="bi bi-save"></i> Save
							</button>
							<button
								class="pm-btn pm-btn-cancel"
								type="button"
								@click="closeForm">
								Cancel
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: "PatientManagement",
	data() {
		return {
			patients: [
				{
					id: 1,
					name: "Ahmed Khan",
					email: "ahmed.khan@email.com",
					phone: "+92-300-1234567",
					gender: "male",
					dob: "1990-05-15",
					address: "Gulberg III, Lahore",
					profile_picture: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
					created_at: "2024-01-15T10:30:00Z",
					medical_history: "No major medical issues"
				},
				{
					id: 2,
					name: "Fatima Ali",
					email: "fatima.ali@email.com",
					phone: "+92-301-2345678",
					gender: "female",
					dob: "1985-08-22",
					address: "DHA Phase 5, Lahore",
					profile_picture: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
					created_at: "2024-01-20T14:15:00Z",
					medical_history: "Diabetes Type 2"
				},
				{
					id: 3,
					name: "Muhammad Hassan",
					email: "m.hassan@email.com",
					phone: "+92-302-3456789",
					gender: "male",
					dob: "1988-12-03",
					address: "Johar Town, Lahore",
					profile_picture: null,
					created_at: "2024-02-01T09:20:00Z",
					medical_history: "Hypertension"
				},
				{
					id: 4,
					name: "Aisha Malik",
					email: "aisha.malik@email.com",
					phone: "+92-303-4567890",
					gender: "female",
					dob: "1992-03-10",
					address: "Model Town, Lahore",
					profile_picture: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
					created_at: "2024-02-10T16:45:00Z",
					medical_history: "Allergies to penicillin"
				},
				{
					id: 5,
					name: "Omar Sheikh",
					email: "omar.sheikh@email.com",
					phone: "+92-304-5678901",
					gender: "male",
					dob: "1995-07-18",
					address: "Cantt Area, Lahore",
					profile_picture: null,
					created_at: "2024-02-15T11:30:00Z",
					medical_history: "No significant medical history"
				}
			],
			search: "",
			showForm: false,
			editMode: false,
			form: {
				id: null,
				name: "",
				email: "",
				password: "",
				password_confirmation: "",
				dob: "",
				gender: "",
				address: "",
				phone: "",
				profile_picture_url: "",
				medical_history_description: "",
			},
			nextId: 6 // For generating new IDs
		};
	},
	computed: {
		filteredPatients() {
			if (!this.search) return this.patients;
			const s = this.search.toLowerCase();
			return this.patients.filter(
				(p) =>
					p.name.toLowerCase().includes(s) ||
					p.email.toLowerCase().includes(s) ||
					(p.phone && p.phone.toLowerCase().includes(s))
			);
		},
	},
	methods: {
		formatDate(dateStr) {
			if (!dateStr) return "-";
			const d = new Date(dateStr);
			return d.toLocaleDateString() + " " + d.toLocaleTimeString();
		},
		editPatient(patient) {
			// Patient data form me set karein
			this.form = {
				id: patient.id,
				name: patient.name,
				email: patient.email,
				dob: patient.dob,
				gender: patient.gender,
				address: patient.address,
				phone: patient.phone,
				profile_picture_url: patient.profile_picture || "",
				medical_history_description: patient.medical_history || "",
				password: "",
				password_confirmation: "",
			};
			this.editMode = true;
			this.showForm = true;
		},
		savePatient() {
			try {
				// Validate form data
				if (!this.editMode) {
					if (this.form.password !== this.form.password_confirmation) {
						alert("Passwords do not match!");
						return;
					}
				}

				// Check if email already exists (except for current patient in edit mode)
				const emailExists = this.patients.some(p => 
					p.email === this.form.email && 
					(!this.editMode || p.id !== this.form.id)
				);
				
				if (emailExists) {
					alert("Email already exists!");
					return;
				}

				if (this.editMode) {
					// Update existing patient
					const patientIndex = this.patients.findIndex(p => p.id === this.form.id);
					if (patientIndex !== -1) {
						this.patients[patientIndex] = {
							...this.patients[patientIndex],
							name: this.form.name,
							email: this.form.email,
							dob: this.form.dob,
							gender: this.form.gender,
							address: this.form.address,
							phone: this.form.phone,
							profile_picture: this.form.profile_picture_url || null,
							medical_history: this.form.medical_history_description
						};
					}
				} else {
					// Add new patient
					const newPatient = {
						id: this.nextId++,
						name: this.form.name,
						email: this.form.email,
						dob: this.form.dob,
						gender: this.form.gender,
						address: this.form.address,
						phone: this.form.phone,
						profile_picture: this.form.profile_picture_url || null,
						medical_history: this.form.medical_history_description,
						created_at: new Date().toISOString()
					};
					this.patients.push(newPatient);
				}

				this.closeForm();
				alert(this.editMode ? "Patient updated successfully!" : "Patient added successfully!");
			} catch (e) {
				console.error("Save Patient Error:", e);
				alert("Error saving patient");
			}
		},
		softDelete(patient) {
			if (confirm(`Are you sure you want to delete ${patient.name}?`)) {
				const patientIndex = this.patients.findIndex(p => p.id === patient.id);
				if (patientIndex !== -1) {
					this.patients.splice(patientIndex, 1);
					alert("Patient deleted successfully!");
				}
			}
		},
		closeForm() {
			this.showForm = false;
			this.editMode = false;
			this.form = {
				id: null,
				name: "",
				email: "",
				password: "",
				password_confirmation: "",
				dob: "",
				gender: "",
				address: "",
				phone: "",
				profile_picture_url: "",
				medical_history_description: "",
			};
		}
	},
};
</script>

<style scoped>
	@import url("https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css");

	.patient-management-container {
		min-height: 100vh;
		background: linear-gradient(120deg, #e0e7ff 0%, #f8fafc 100%);
		display: flex;
		align-items: flex-start;
		justify-content: center;
		padding: 2.5rem 1rem;
		width: 100%;
	}

	.patient-management-card {
		background: #fff;
		border-radius: 2rem;
		box-shadow: 0 8px 32px rgba(30, 58, 138, 0.14);
		padding: 2.8rem 2.2rem;
		width: 100%;
		max-width: 1450px;
		margin: 0 auto;
		transition: box-shadow 0.2s;
	}

	.patient-management-card:hover {
		box-shadow: 0 12px 40px rgba(30, 58, 138, 0.18);
	}

	.pm-header {
		text-align: center;
		margin-bottom: 2.2rem;
	}

	.pm-icon {
		font-size: 3.2rem;
		color: #2563eb;
		margin-bottom: 0.7rem;
		filter: drop-shadow(0 2px 8px #2563eb33);
	}

	.pm-header h2 {
		font-size: 2.2rem;
		font-weight: 700;
		color: #2563eb;
		margin-bottom: 0.3rem;
		letter-spacing: 1px;
	}

	.pm-subtitle {
		color: #64748b;
		font-size: 1.08rem;
		margin-bottom: 0;
	}

	.pm-actions {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 2rem;
		gap: 1.2rem;
		flex-wrap: wrap;
	}

	.pm-btn {
		background: linear-gradient(90deg, #2563eb 0%, #38bdf8 100%);
		color: #fff;
		border: none;
		border-radius: 0.9rem;
		padding: 0.8rem 1.5rem;
		font-weight: 600;
		font-size: 1.08rem;
		cursor: pointer;
		box-shadow: 0 2px 8px rgba(30, 58, 138, 0.09);
		transition: background 0.2s, box-shadow 0.2s, transform 0.1s;
		display: flex;
		align-items: center;
		gap: 0.6rem;
		white-space: nowrap;
	}

	.pm-btn:active {
		transform: scale(0.97);
	}

	.pm-btn-cancel {
		background: #64748b;
	}

	.pm-btn:hover {
		background: linear-gradient(90deg, #38bdf8 0%, #2563eb 100%);
		box-shadow: 0 4px 16px rgba(30, 58, 138, 0.15);
	}

	.pm-search {
		border-radius: 0.9rem;
		border: 1px solid #cbd5e1;
		padding: 0.8rem 1.1rem;
		font-size: 1.08rem;
		background: #f8fafc;
		min-width: 260px;
		flex-grow: 1;
		box-shadow: 0 1px 4px rgba(30, 58, 138, 0.04);
		transition: border-color 0.2s, box-shadow 0.2s;
	}

	.pm-search:focus {
		border-color: #2563eb;
		outline: none;
		box-shadow: 0 2px 8px rgba(30, 58, 138, 0.09);
	}

	.pm-table-wrapper {
		overflow-x: auto;
		width: 100%;
	}

	.pm-table {
		width: 100%;
		border-collapse: separate;
		border-spacing: 0;
		background: #fff;
		border-radius: 1.2rem;
		box-shadow: 0 2px 8px rgba(30, 58, 138, 0.07);
		margin-bottom: 1.2rem;
		overflow: hidden;
	}

	.pm-table th,
	.pm-table td {
		padding: 1.1rem 0.7rem;
		text-align: left;
		font-size: 1.08rem;
		vertical-align: middle;
	}

	.pm-table th {
		background: linear-gradient(90deg, #e0e7ff 0%, #bae6fd 100%);
		color: #2563eb;
		font-weight: 600;
		border-bottom: 2px solid #bae6fd;
		letter-spacing: 0.5px;
	}

	.pm-table tr:not(:last-child) td {
		border-bottom: 1px solid #e0e7ff;
	}

	.pm-table tbody tr:hover {
		background: #f1f5f9;
		transition: background 0.2s;
	}

	.pm-badge-active {
		background: linear-gradient(90deg, #38bdf8 0%, #2563eb 100%);
		color: #fff;
		border-radius: 0.7rem;
		padding: 0.45rem 1rem;
		font-size: 1rem;
		font-weight: 500;
		display: inline-block;
		box-shadow: 0 1px 4px #2563eb22;
	}

	.pm-badge-inactive {
		background: #64748b;
		color: #fff;
		border-radius: 0.7rem;
		padding: 0.45rem 1rem;
		font-size: 1rem;
		font-weight: 500;
		display: inline-block;
	}

	.pm-action-btn {
		background: #f8fafc;
		border: none;
		border-radius: 0.6rem;
		padding: 0.5rem 0.8rem;
		font-size: 1.15rem;
		color: #2563eb;
		cursor: pointer;
		margin-right: 0.3rem;
		transition: background 0.2s, color 0.2s, transform 0.1s;
		box-shadow: 0 1px 4px #2563eb11;
	}

	.pm-action-btn:hover {
		background: #e0e7ff;
		color: #0ea5e9;
		transform: scale(1.08);
	}

	.pm-empty-row {
		text-align: center;
		color: #adb5bd;
		font-size: 1.15rem;
		padding: 28px 0;
	}

	.pm-modal-backdrop {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		background: rgba(30, 58, 138, 0.18);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 9999;
		animation: fadeIn 0.3s;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	.pm-modal {
		background: #fff;
		padding: 2.2rem;
		border-radius: 1.2rem;
		box-shadow: 0 4px 18px rgba(30, 58, 138, 0.14);
		min-width: 320px;
		max-width: 95vw;
		width: 520px;
		animation: slideUp 0.3s;
		max-height: 80vh;
		overflow-y: auto;
	}

	@keyframes slideUp {
		from {
			transform: translateY(40px);
			opacity: 0;
		}
		to {
			transform: translateY(0);
			opacity: 1;
		}
	}

	.pm-modal h3 {
		color: #2563eb;
		font-weight: 600;
		margin-bottom: 1.3rem;
		letter-spacing: 0.5px;
	}

	.pm-modal-actions {
		display: flex;
		gap: 1.2rem;
		margin-top: 1.3rem;
	}

	.form-group {
		margin-bottom: 1.2rem;
	}

	.form-group label {
		font-weight: 500;
		margin-bottom: 0.5rem;
		display: block;
		color: #2563eb;
		letter-spacing: 0.3px;
	}

	.form-control {
		width: 100%;
		padding: 0.7rem 1rem;
		border-radius: 0.7rem;
		border: 1px solid #cbd5e1;
		font-size: 1.08rem;
		background: #f8fafc;
		box-shadow: 0 1px 4px #2563eb11;
		transition: border-color 0.2s, box-shadow 0.2s;
		box-sizing: border-box;
	}

	.form-control:focus {
		border-color: #2563eb;
		outline: none;
		box-shadow: 0 2px 8px #2563eb22;
	}

	.pm-profile-pic {
		width: 44px;
		height: 44px;
		object-fit: cover;
		border-radius: 50%;
		border: 2px solid #38bdf8;
		box-shadow: 0 2px 8px #38bdf822;
		background: #e0e7ff;
	}

	.pm-profile-placeholder {
		display: inline-block;
		width: 44px;
		height: 44px;
		background: #e0e7ff;
		border-radius: 50%;
		text-align: center;
		line-height: 44px;
		color: #adb5bd;
		font-size: 1.7rem;
		box-shadow: 0 1px 4px #2563eb11;
	}

	.pm-badge-male {
		background: #cfe2ff;
		color: #084298;
		padding: 5px 14px;
		border-radius: 13px;
		font-size: 1rem;
		font-weight: 500;
		box-shadow: 0 1px 4px #08429822;
	}

	.pm-badge-female {
		background: #f7e1ff;
		color: #a21caf;
		padding: 5px 14px;
		border-radius: 13px;
		font-size: 1rem;
		font-weight: 500;
		box-shadow: 0 1px 4px #a21caf22;
	}

	.pm-date {
		font-size: 1rem;
		color: #6c757d;
	}

	@media (max-width: 900px) {
		.patient-management-card {
			padding: 1.5rem 0.5rem;
		}
		.pm-table th,
		.pm-table td {
			font-size: 0.98rem;
			padding: 0.7rem 0.3rem;
		}
		.pm-modal {
			padding: 1rem;
			min-width: 220px;
		}
		.pm-profile-pic,
		.pm-profile-placeholder {
			width: 36px;
			height: 36px;
			line-height: 36px;
			font-size: 1.2rem;
		}
	}

	@media (max-width: 600px) {
		.patient-management-container {
			padding: 0.5rem;
		}
		.pm-header h2 {
			font-size: 1.3rem;
		}
		.pm-table th,
		.pm-table td {
			font-size: 0.85rem;
			padding: 0.5rem 0.1rem;
		}
		.pm-modal {
			width: 98vw;
			padding: 0.5rem;
		}
	}
</style>