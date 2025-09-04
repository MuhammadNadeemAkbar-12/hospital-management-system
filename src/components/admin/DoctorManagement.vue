<template>
	<div class="doctor-management-container">
		<div class="doctor-management-card">
			<div class="dm-header">
				<i class="bi bi-person-badge dm-icon"></i>
				<h2>Doctor Management</h2>
			</div>
			<div class="dm-actions">
				<button class="dm-btn" @click="showForm = true">
					<i class="bi bi-person-plus"></i> Add Doctor
				</button>
				<input
					v-model="search"
					class="dm-search"
					type="text"
					placeholder="Search by name, email, specialization..." />
			</div>
			<div class="dm-table-wrapper">
				<table class="dm-table">
					<thead>
						<tr>
							<th>ID</th>
							<th>Name</th>
							<th>Email</th>
							<th>Phone</th>
							<th>Specialization</th>
							<th>Experience</th>
							<th>Created At</th>
							<th>Actions</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="doctor in filteredDoctors" :key="doctor.id">
							<td>{{ doctor.id }}</td>
							<td>{{ doctor.name }}</td>
							<td>{{ doctor.email }}</td>
							<td>{{ doctor.phone || "-" }}</td>
							<td>
								<span class="dm-badge-specialization">
									{{ getSpecializationName(doctor.specialization_id) }}
								</span>
							</td>
							<td>{{ doctor.experience }} years</td>
							<td>{{ formatDate(doctor.created_at) }}</td>
							<td>
								<button class="dm-action-btn" @click="editDoctor(doctor)">
									<i class="bi bi-pencil"></i>
								</button>
								<button class="dm-action-btn" @click="deleteDoctor(doctor)">
									<i class="bi bi-trash"></i>
								</button>
							</td>
						</tr>
						<tr v-if="filteredDoctors.length === 0">
							<td colspan="8" class="dm-empty-row">No doctors found.</td>
						</tr>
					</tbody>
				</table>
			</div>
			<!-- Doctor Form Modal (add/edit doctor) -->
			<div v-if="showForm" class="dm-modal-backdrop">
				<div class="dm-modal">
					<h3>{{ editMode ? "Edit Doctor" : "Add Doctor" }}</h3>
					<form @submit.prevent="saveDoctor">
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
							<label>Phone</label>
							<input
								v-model="form.phone"
								type="text"
								required
								class="form-control" />
						</div>
						<div class="form-group">
							<label>Specialization</label>
							<select
								v-model="form.specialization_id"
								required
								class="form-control">
								<option disabled value="">Select Specialization</option>
								<option
									v-for="spec in specializations"
									:key="spec.id"
									:value="spec.id">
									{{ spec.name }}
								</option>
							</select>
						</div>
						<div class="form-group">
							<label>Experience (Years)</label>
							<input
								v-model.number="form.experience"
								type="number"
								min="0"
								max="50"
								required
								class="form-control" />
						</div>
						<div class="form-group">
							<label>Qualification</label>
							<input
								v-model="form.qualification"
								type="text"
								placeholder="e.g., MBBS, MD"
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
						<div class="dm-modal-actions">
							<button class="dm-btn" type="submit">
								<i class="bi bi-save"></i> Save
							</button>
							<button
								class="dm-btn dm-btn-cancel"
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
	name: "DoctorManagement",
	data() {
		return {
			doctors: [
				{
					id: 1,
					name: "Dr. Muhammad Ali Khan",
					email: "dr.ali@hospital.com",
					phone: "+92-300-1111111",
					specialization_id: 1,
					experience: 8,
					qualification: "MBBS, MD (Cardiology)",
					created_at: "2024-01-10T09:00:00Z"
				},
				{
					id: 2,
					name: "Dr. Sarah Ahmed",
					email: "dr.sarah@hospital.com",
					phone: "+92-301-2222222",
					specialization_id: 2,
					experience: 6,
					qualification: "MBBS, MS (Dermatology)",
					created_at: "2024-01-15T11:30:00Z"
				},
				{
					id: 3,
					name: "Dr. Ahmed Hassan",
					email: "dr.hassan@hospital.com",
					phone: "+92-302-3333333",
					specialization_id: 3,
					experience: 12,
					qualification: "MBBS, FCPS (Orthopedics)",
					created_at: "2024-01-20T14:15:00Z"
				},
				{
					id: 4,
					name: "Dr. Fatima Malik",
					email: "dr.fatima@hospital.com",
					phone: "+92-303-4444444",
					specialization_id: 4,
					experience: 10,
					qualification: "MBBS, FCPS (Gynecology)",
					created_at: "2024-02-01T10:20:00Z"
				},
				{
					id: 5,
					name: "Dr. Omar Sheikh",
					email: "dr.omar@hospital.com",
					phone: "+92-304-5555555",
					specialization_id: 5,
					experience: 5,
					qualification: "MBBS, FCPS (Pediatrics)",
					created_at: "2024-02-05T16:45:00Z"
				},
				{
					id: 6,
					name: "Dr. Aisha Rahman",
					email: "dr.aisha@hospital.com",
					phone: "+92-305-6666666",
					specialization_id: 6,
					experience: 15,
					qualification: "MBBS, FCPS (Neurology)",
					created_at: "2024-02-10T08:30:00Z"
				}
			],
			specializations: [
				{ id: 1, name: "Cardiology" },
				{ id: 2, name: "Dermatology" },
				{ id: 3, name: "Orthopedics" },
				{ id: 4, name: "Gynecology" },
				{ id: 5, name: "Pediatrics" },
				{ id: 6, name: "Neurology" },
				{ id: 7, name: "General Medicine" },
				{ id: 8, name: "Surgery" },
				{ id: 9, name: "Psychiatry" },
				{ id: 10, name: "Radiology" }
			],
			search: "",
			showForm: false,
			editMode: false,
			form: {
				id: null,
				name: "",
				email: "",
				phone: "",
				specialization_id: "",
				experience: 0,
				qualification: "",
				password: "",
			},
			nextId: 7 // For generating new IDs
		};
	},
	computed: {
		filteredDoctors() {
			if (!this.search) return this.doctors;
			const s = this.search.toLowerCase();
			return this.doctors.filter(
				(d) =>
					d.name.toLowerCase().includes(s) ||
					d.email.toLowerCase().includes(s) ||
					this.getSpecializationName(d.specialization_id).toLowerCase().includes(s)
			);
		},
	},
	methods: {
		getSpecializationName(specId) {
			const spec = this.specializations.find(s => s.id === specId);
			return spec ? spec.name : "-";
		},
		editDoctor(doctor) {
			this.form = {
				id: doctor.id,
				name: doctor.name,
				email: doctor.email,
				phone: doctor.phone,
				specialization_id: doctor.specialization_id,
				experience: doctor.experience,
				qualification: doctor.qualification,
				password: "",
			};
			this.editMode = true;
			this.showForm = true;
		},
		saveDoctor() {
			try {
				// Check if email already exists (except for current doctor in edit mode)
				const emailExists = this.doctors.some(d => 
					d.email === this.form.email && 
					(!this.editMode || d.id !== this.form.id)
				);
				
				if (emailExists) {
					alert("Email already exists!");
					return;
				}

				// Validate experience
				if (this.form.experience < 0 || this.form.experience > 50) {
					alert("Experience should be between 0 and 50 years!");
					return;
				}

				if (this.editMode) {
					// Update existing doctor
					const doctorIndex = this.doctors.findIndex(d => d.id === this.form.id);
					if (doctorIndex !== -1) {
						this.doctors[doctorIndex] = {
							...this.doctors[doctorIndex],
							name: this.form.name,
							email: this.form.email,
							phone: this.form.phone,
							specialization_id: parseInt(this.form.specialization_id),
							experience: this.form.experience,
							qualification: this.form.qualification
						};
					}
				} else {
					// Add new doctor
					if (!this.form.password) {
						alert("Password is required for new doctor!");
						return;
					}

					const newDoctor = {
						id: this.nextId++,
						name: this.form.name,
						email: this.form.email,
						phone: this.form.phone,
						specialization_id: parseInt(this.form.specialization_id),
						experience: this.form.experience,
						qualification: this.form.qualification,
						created_at: new Date().toISOString()
					};
					this.doctors.push(newDoctor);
				}

				this.closeForm();
				alert(this.editMode ? "Doctor updated successfully!" : "Doctor added successfully!");
			} catch (e) {
				console.error("Save Doctor Error:", e);
				alert("Error saving doctor");
			}
		},
		deleteDoctor(doctor) {
			if (confirm(`Are you sure you want to delete Dr. ${doctor.name}?`)) {
				const doctorIndex = this.doctors.findIndex(d => d.id === doctor.id);
				if (doctorIndex !== -1) {
					this.doctors.splice(doctorIndex, 1);
					alert("Doctor deleted successfully!");
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
				phone: "",
				specialization_id: "",
				experience: 0,
				qualification: "",
				password: "",
			};
		},
		formatDate(dateStr) {
			if (!dateStr) return "-";
			const d = new Date(dateStr);
			return d.toLocaleDateString() + " " + d.toLocaleTimeString();
		},
	},
};
</script>

<style scoped>
	@import url("https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css");

	.doctor-management-container {
		min-height: 100vh;
		background: linear-gradient(120deg, #e0f2fe 0%, #f8fafc 100%);
		display: flex;
		align-items: flex-start;
		justify-content: center;
		padding: 2.5rem 1rem;
		width: 100%;
	}

	.doctor-management-card {
		background: #fff;
		border-radius: 2rem;
		box-shadow: 0 8px 32px rgba(16, 185, 129, 0.14);
		padding: 2.8rem 2.2rem;
		width: 100%;
		max-width: 1450px;
		margin: 0 auto;
		transition: box-shadow 0.2s;
	}

	.doctor-management-card:hover {
		box-shadow: 0 12px 40px rgba(16, 185, 129, 0.18);
	}

	.dm-header {
		text-align: center;
		margin-bottom: 2.2rem;
	}

	.dm-icon {
		font-size: 3.2rem;
		color: #10b981;
		margin-bottom: 0.7rem;
		filter: drop-shadow(0 2px 8px #10b98133);
	}

	.dm-header h2 {
		font-size: 2.2rem;
		font-weight: 700;
		color: #10b981;
		margin-bottom: 0.3rem;
		letter-spacing: 1px;
	}

	.dm-subtitle {
		color: #64748b;
		font-size: 1.08rem;
		margin-bottom: 0;
	}

	.dm-actions {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 2rem;
		gap: 1.2rem;
		flex-wrap: wrap;
	}

	.dm-btn {
		background: linear-gradient(90deg, #10b981 0%, #38bdf8 100%);
		color: #fff;
		border: none;
		border-radius: 0.9rem;
		padding: 0.8rem 1.5rem;
		font-weight: 600;
		font-size: 1.08rem;
		cursor: pointer;
		box-shadow: 0 2px 8px rgba(16, 185, 129, 0.09);
		transition: background 0.2s, box-shadow 0.2s, transform 0.1s;
		display: flex;
		align-items: center;
		gap: 0.6rem;
		white-space: nowrap;
	}

	.dm-btn:active {
		transform: scale(0.97);
	}

	.dm-btn-cancel {
		background: #64748b;
	}

	.dm-btn:hover {
		background: linear-gradient(90deg, #38bdf8 0%, #10b981 100%);
		box-shadow: 0 4px 16px rgba(16, 185, 129, 0.15);
	}

	.dm-search {
		border-radius: 0.9rem;
		border: 1px solid #cbd5e1;
		padding: 0.8rem 1.1rem;
		font-size: 1.08rem;
		background: #f8fafc;
		min-width: 260px;
		flex-grow: 1;
		box-shadow: 0 1px 4px rgba(16, 185, 129, 0.04);
		transition: border-color 0.2s, box-shadow 0.2s;
	}

	.dm-search:focus {
		border-color: #10b981;
		outline: none;
		box-shadow: 0 2px 8px rgba(16, 185, 129, 0.09);
	}

	.dm-table-wrapper {
		overflow-x: auto;
		width: 100%;
	}

	.dm-table {
		width: 100%;
		border-collapse: separate;
		border-spacing: 0;
		background: #fff;
		border-radius: 1.2rem;
		box-shadow: 0 2px 8px rgba(16, 185, 129, 0.07);
		margin-bottom: 1.2rem;
		overflow: hidden;
	}

	.dm-table th,
	.dm-table td {
		padding: 1.1rem 0.7rem;
		text-align: left;
		font-size: 1.08rem;
		vertical-align: middle;
	}

	.dm-table th {
		background: linear-gradient(90deg, #e0f2fe 0%, #bae6fd 100%);
		color: #10b981;
		font-weight: 600;
		border-bottom: 2px solid #bae6fd;
		letter-spacing: 0.5px;
	}

	.dm-table tr:not(:last-child) td {
		border-bottom: 1px solid #e0f2fe;
	}

	.dm-table tbody tr:hover {
		background: #f1f5f9;
		transition: background 0.2s;
	}

	.dm-badge-specialization {
		background: linear-gradient(90deg, #10b981 0%, #38bdf8 100%);
		color: #fff;
		border-radius: 0.7rem;
		padding: 0.45rem 1rem;
		font-size: 0.95rem;
		font-weight: 500;
		display: inline-block;
		box-shadow: 0 1px 4px #10b98122;
	}

	.dm-badge-active {
		background: linear-gradient(90deg, #38bdf8 0%, #10b981 100%);
		color: #fff;
		border-radius: 0.7rem;
		padding: 0.45rem 1rem;
		font-size: 1rem;
		font-weight: 500;
		display: inline-block;
		box-shadow: 0 1px 4px #10b98122;
	}

	.dm-badge-inactive {
		background: #64748b;
		color: #fff;
		border-radius: 0.7rem;
		padding: 0.45rem 1rem;
		font-size: 1rem;
		font-weight: 500;
		display: inline-block;
	}

	.dm-action-btn {
		background: #f8fafc;
		border: none;
		border-radius: 0.6rem;
		padding: 0.5rem 0.8rem;
		font-size: 1.15rem;
		color: #10b981;
		cursor: pointer;
		margin-right: 0.3rem;
		transition: background 0.2s, color 0.2s, transform 0.1s;
		box-shadow: 0 1px 4px #10b98111;
	}

	.dm-action-btn:hover {
		background: #e0f2fe;
		color: #2563eb;
		transform: scale(1.08);
	}

	.dm-empty-row {
		text-align: center;
		color: #adb5bd;
		font-size: 1.15rem;
		padding: 28px 0;
	}

	.dm-modal-backdrop {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		background: rgba(16, 185, 129, 0.18);
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

	.dm-modal {
		background: #fff;
		padding: 2.2rem;
		border-radius: 1.2rem;
		box-shadow: 0 4px 18px rgba(16, 185, 129, 0.14);
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

	.dm-modal h3 {
		color: #10b981;
		font-weight: 600;
		margin-bottom: 1.3rem;
		letter-spacing: 0.5px;
	}

	.dm-modal-actions {
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
		color: #10b981;
		letter-spacing: 0.3px;
	}

	.form-control {
		width: 100%;
		padding: 0.7rem 1rem;
		border-radius: 0.7rem;
		border: 1px solid #cbd5e1;
		font-size: 1.08rem;
		background: #f8fafc;
		box-shadow: 0 1px 4px #10b98111;
		transition: border-color 0.2s, box-shadow 0.2s;
		box-sizing: border-box;
	}

	.form-control:focus {
		border-color: #10b981;
		outline: none;
		box-shadow: 0 2px 8px #10b98122;
	}

	@media (max-width: 900px) {
		.doctor-management-container {
			padding: 1rem;
		}

		.doctor-management-card {
			padding: 1.5rem 1rem;
		}

		.dm-actions {
			gap: 0.5rem;
		}

		.dm-btn {
			padding: 0.5rem 1rem;
			font-size: 0.9rem;
		}

		.dm-search {
			width: 100%;
		}

		.dm-table th,
		.dm-table td {
			font-size: 0.95rem;
			padding: 0.6rem 0.4rem;
		}

		.dm-modal {
			padding: 1rem;
			min-width: 220px;
		}
	}

	@media (max-width: 600px) {
		.doctor-management-container {
			padding: 0.5rem;
		}
		.dm-header h2 {
			font-size: 1.3rem;
		}
		.dm-table th,
		.dm-table td {
			font-size: 0.85rem;
			padding: 0.5rem 0.1rem;
		}
		.dm-modal {
			width: 98vw;
			padding: 0.5rem;
		}
	}
</style>