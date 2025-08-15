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
							<th>Specialization</th>
							<th>Created At</th>
							<th>Actions</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="doctor in filteredDoctors" :key="doctor.id">
							<td>{{ doctor.id }}</td>
							<td>{{ doctor.name }}</td>
							<td>{{ doctor.email }}</td>
							<td>{{ doctor.specialization || "-" }}</td>
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
							<td colspan="6" class="dm-empty-row">No doctors found.</td>
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
							<label>Phone</label>
							<input
								v-model="form.phone"
								type="text"
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
	import axios from "@/api/axios";

	export default {
		name: "DoctorManagement",
		data() {
			return {
				doctors: [],
				specializations: [],
				search: "",
				showForm: false,
				editMode: false,
				form: {
					id: null,
					name: "",
					email: "",
					specialization_id: null,
					phone: "",
					password: "",
				},
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
						(d.specialization && d.specialization.toLowerCase().includes(s))
				);
			},
		},
		created() {
			this.fetchDoctors();
			this.fetchSpecializations();
		},
		methods: {
			async fetchDoctors() {
				try {
					const token = localStorage.getItem("Token");
					const response = await axios.get("/admin/doctors", {
						headers: { Authorization: `Bearer ${token}` },
					});
					this.doctors = response.data.data || [];
				} catch (e) {
					this.doctors = [];
				}
			},
			async fetchSpecializations() {
				try {
					const token = localStorage.getItem("Token");
					const response = await axios.get("/admin/specializations", {
						headers: { Authorization: `Bearer ${token}` },
					});
					this.specializations = response.data.data || [];
				} catch (e) {
					this.specializations = [];
				}
			},
			editDoctor(doctor) {
				this.form = {
					id: doctor.id,
					name: doctor.name,
					email: doctor.email,
					specialization_id: doctor.specialization_id,
					phone: doctor.phone,
				};
				this.editMode = true;
				this.showForm = true;
			},
			async saveDoctor() {
				const token = localStorage.getItem("Token");
				try {
					if (this.editMode) {
						// Edit ke liye FormData (agar backend Laravel hai)
						const formData = new FormData();
						formData.append("name", this.form.name);
						formData.append("email", this.form.email);
						formData.append("specialization_id", this.form.specialization_id);
						formData.append("phone", this.form.phone);
						formData.append("_method", "PUT");
						await axios.post(`/admin/doctors/${this.form.id}`, formData, {
							headers: { Authorization: `Bearer ${token}` },
						});
					} else {
						// Add ke liye simple object bhejein
						await axios.post(
							"/admin/doctors",
							{
								name: this.form.name,
								email: this.form.email,
								specialization_id: this.form.specialization_id,
								phone: this.form.phone,
								password: this.form.password, // Make sure this is not blank!
							},
							{
								headers: { Authorization: `Bearer ${token}` },
							}
						);
					}
					this.fetchDoctors();
					this.closeForm();
				} catch (e) {
					alert("Error saving doctor");
					console.log("Add Doctor Error:", e.response?.data || e.message);
				}
			},
			async deleteDoctor(doctor) {
				const token = localStorage.getItem("Token");
				try {
					await axios.delete(`/admin/doctors/${doctor.id}`, {
						headers: { Authorization: `Bearer ${token}` },
					});
					this.fetchDoctors();
				} catch (e) {
					alert("Error deleting doctor");
				}
			},
			closeForm() {
				this.showForm = false;
				this.editMode = false;
				this.form = {
					id: null,
					name: "",
					email: "",
					specialization_id: null,
					phone: "",
					password: "", // Make sure password is blank for Add
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
</style>
