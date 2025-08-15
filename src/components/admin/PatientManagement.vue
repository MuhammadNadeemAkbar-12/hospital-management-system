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
									:src="profilePicUrl(patient.profile_picture)"
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
						<div class="form-group">
							<label>Password</label>
							<input
								v-model="form.password"
								type="password"
								required
								class="form-control" />
						</div>
						<div class="form-group">
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
							<label>Profile Picture</label>
							<input
								type="file"
								@change="onProfilePictureChange"
								accept="image/*"
								required
								class="form-control" />
						</div>
						<div class="form-group">
							<label>Medical History Description</label>
							<input
								v-model="form.medical_history_description"
								type="text"
								required
								class="form-control" />
						</div>
						<div class="form-group">
							<label>Medical History Document</label>
							<input
								type="file"
								@change="onMedicalDocumentChange"
								accept=".pdf,.jpg,.jpeg,.png,.docx"
								required
								class="form-control" />
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
	import axios from "@/api/axios";

	export default {
		name: "PatientManagement",
		data() {
			return {
				patients: [],
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
					profile_picture: null,
					medical_history_description: "",
					medical_history_document: null,
				},
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
		created() {
			this.fetchPatients();
		},
		methods: {
			async fetchPatients() {
				try {
					const token = localStorage.getItem("Token");
					const response = await axios.get("/admin/patients", {
						headers: { Authorization: `Bearer ${token}` },
					});
					this.patients = response.data.data || [];
				} catch (e) {
					this.patients = [];
				}
			},
			profilePicUrl(pic) {
				// Backend ke hisaab se base URL set karein
				return pic ? "http://192.168.12.187:8000" + pic : "";
			},
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
					profile_picture: null, // File edit ke liye blank rakhein
					medical_history_description: "",
					medical_history_document: null,
					password: "",
					password_confirmation: "",
				};
				this.editMode = true;
				this.showForm = true;
			},
			async savePatient() {
				const token = localStorage.getItem("Token");
				try {
					const formData = new FormData();
					formData.append("name", this.form.name);
					formData.append("email", this.form.email);
					formData.append("dob", this.form.dob);
					formData.append("gender", this.form.gender);
					formData.append("address", this.form.address);
					formData.append("phone", this.form.phone);
					if (this.form.profile_picture) {
						formData.append("profile_picture", this.form.profile_picture);
					}
					if (this.form.medical_history_description) {
						formData.append(
							"medical_histories[0][description]",
							this.form.medical_history_description
						);
					}
					if (this.form.medical_history_document) {
						formData.append(
							"medical_histories[0][document]",
							this.form.medical_history_document
						);
					}
					// Only add password fields if not editing
					if (!this.editMode) {
						formData.append("password", this.form.password);
						formData.append(
							"password_confirmation",
							this.form.password_confirmation
						);
					}
					if (this.editMode) {
						await axios.post(
							`/admin/patients/${this.form.id}?_method=PUT`,
							formData,
							{
								headers: {
									Authorization: `Bearer ${token}`,
									"Content-Type": "multipart/form-data",
								},
							}
						);
					} else {
						await axios.post("/admin/patients", formData, {
							headers: {
								Authorization: `Bearer ${token}`,
								"Content-Type": "multipart/form-data",
							},
						});
					}
					this.fetchPatients();
					this.closeForm();
				} catch (e) {
					console.log(
						"Add/Edit Patient Error:",
						e.response?.data.errors || e.message
					);
					alert("Error saving patient");
				}
			},
			async softDelete(patient) {
				const token = localStorage.getItem("Token");
				try {
					await axios.delete(`/admin/patients/${patient.id}`, {
						headers: { Authorization: `Bearer ${token}` },
					});
					this.fetchPatients();
				} catch (e) {
					alert("Error deleting patient");
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
					profile_picture: null,
					medical_history_description: "",
					medical_history_document: null,
				};
			},
			onProfilePictureChange(e) {
				this.form.profile_picture = e.target.files[0];
			},
			onMedicalDocumentChange(e) {
				this.form.medical_history_document = e.target.files[0];
			},
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
		max-height: 80vh; /* Add this line */
		overflow-y: auto; /* Add this line */
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
