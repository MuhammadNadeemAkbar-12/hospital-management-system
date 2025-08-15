<template>
	<div class="medicines-inventory-container">
		<div class="medicines-inventory-card">
			<div class="mi-header">
				<i class="bi bi-capsule mi-icon"></i>
				<h2>Medicines Inventory</h2>
				<p class="mi-subtitle">
					Add, view, edit medicines. Track expiry, quantity & export inventory.
				</p>
			</div>
			<div class="mi-actions">
				<button class="mi-btn" @click="showForm = true">
					<i class="bi bi-plus-circle"></i> Add Medicine
				</button>
				<input
					v-model="search"
					class="mi-search"
					type="text"
					placeholder="Search by name or batch..." />
				<button class="mi-btn mi-btn-export" @click="exportExcel">
					<i class="bi bi-file-earmark-excel"></i> Export Excel
				</button>
			</div>
			<div class="mi-table-wrapper">
				<table class="mi-table">
					<thead>
						<tr>
							<th>Name</th>
							<th>Batch</th>
							<th>Expiry</th>
							<th>Quantity</th>
							<th>Status</th>
							<th>Actions</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="med in filteredMedicines" :key="med.id">
							<td>{{ med.name }}</td>
							<td>{{ med.batch }}</td>
							<td>
								<span :class="getExpiryClass(med.expiry)">
									{{ med.expiry }}
								</span>
							</td>
							<td>
								<span :class="getStockClass(med.quantity)">
									{{ med.quantity }}
								</span>
							</td>
							<td>
								<span v-if="isLowStock(med)" class="mi-badge-low"
									>Low Stock</span
								>
								<span v-else-if="isNearExpiry(med)" class="mi-badge-expiry"
									>Near Expiry</span
								>
								<span v-else class="mi-badge-ok">OK</span>
							</td>
							<td>
								<button class="mi-action-btn" @click="editMedicine(med)">
									<i class="bi bi-pencil"></i>
								</button>
								<button class="mi-action-btn" @click="confirmDelete(med)">
									<i class="bi bi-trash"></i>
								</button>
							</td>
						</tr>
						<tr v-if="filteredMedicines.length === 0">
							<td colspan="6" class="mi-empty-row">No medicines found.</td>
						</tr>
					</tbody>
				</table>
			</div>
			<!-- Medicine Form Modal -->
			<div v-if="showForm" class="mi-modal-backdrop">
				<div class="mi-modal">
					<h3>{{ editMode ? "Edit Medicine" : "Add Medicine" }}</h3>
					<form @submit.prevent="saveMedicine">
						<div class="form-group">
							<label>Name</label>
							<input
								v-model="form.name"
								type="text"
								required
								class="form-control" />
						</div>
						<div class="form-group">
							<label>Batch</label>
							<input
								v-model="form.batch"
								type="text"
								required
								class="form-control" />
						</div>
						<div class="form-group">
							<label>Expiry Date</label>
							<input
								v-model="form.expiry"
								type="date"
								required
								class="form-control" />
						</div>
						<div class="form-group">
							<label>Quantity</label>
							<input
								v-model.number="form.quantity"
								type="number"
								min="0"
								required
								class="form-control" />
						</div>
						<div class="form-group">
							<label>Status</label>
							<select v-model="form.active" class="form-control">
								<option :value="true">Active</option>
								<option :value="false">Inactive</option>
							</select>
						</div>
						<div class="mi-modal-actions">
							<button class="mi-btn" type="submit">
								<i class="bi bi-save"></i> Save
							</button>
							<button
								class="mi-btn mi-btn-cancel"
								type="button"
								@click="closeForm">
								Cancel
							</button>
						</div>
					</form>
				</div>
			</div>
			<!-- Delete Confirmation Modal -->
			<div v-if="showDeleteModal" class="mi-modal-backdrop">
				<div class="mi-modal">
					<h3>Delete Medicine</h3>
					<p>
						Are you sure you want to delete
						<strong>{{ deleteTarget.name }}</strong
						>?
					</p>
					<div class="mi-modal-actions">
						<button
							class="mi-btn mi-btn-cancel"
							@click="showDeleteModal = false">
							Cancel
						</button>
						<button class="mi-btn" @click="deleteMedicine">
							<i class="bi bi-trash"></i> Delete
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import axios from "@/api/axios";

	export default {
		name: "MedicinesInventory",
		data() {
			return {
				medicines: [],
				search: "",
				showForm: false,
				editMode: false,
				form: {
					id: null,
					name: "",
					batch: "",
					expiry: "",
					quantity: 0,
					active: true,
				},
				showDeleteModal: false,
				deleteTarget: {},
			};
		},
		computed: {
			filteredMedicines() {
				if (!this.search) return this.medicines.filter((m) => m.active);
				const s = this.search.toLowerCase();
				return this.medicines.filter(
					(m) =>
						m.active &&
						(m.name.toLowerCase().includes(s) ||
							m.batch.toLowerCase().includes(s))
				);
			},
		},
		created() {
			this.fetchMedicines();
		},
		methods: {
			async fetchMedicines() {
				const token = localStorage.getItem("Token");
				try {
					const response = await axios.get("/admin/medicines", {
						headers: { Authorization: `Bearer ${token}` },
					});
					console.log("Medicines API Response:", response.data); // <-- Add this line
					this.medicines = response.data.data || [];
				} catch (e) {
					console.log("Medicines API Error:", e.response?.data || e.message); // <-- Add this line
					this.medicines = [];
				}
			},
			editMedicine(med) {
				this.form = { ...med };
				this.editMode = true;
				this.showForm = true;
			},
			async saveMedicine() {
				const token = localStorage.getItem("Token");
				try {
					if (this.editMode) {
						await axios.put(`/admin/medicines/${this.form.id}`, this.form, {
							headers: { Authorization: `Bearer ${token}` },
						});
					} else {
						await axios.post("/admin/medicines", this.form, {
							headers: { Authorization: `Bearer ${token}` },
						});
					}
					this.fetchMedicines();
					this.closeForm();
				} catch (e) {
					alert("Error saving medicine");
				}
			},
			confirmDelete(med) {
				this.deleteTarget = med;
				this.showDeleteModal = true;
			},
			async deleteMedicine() {
				const token = localStorage.getItem("Token");
				try {
					await axios.delete(`/admin/medicines/${this.deleteTarget.id}`, {
						headers: { Authorization: `Bearer ${token}` },
					});
					this.fetchMedicines();
					this.showDeleteModal = false;
					this.deleteTarget = {};
				} catch (e) {
					alert("Error deleting medicine");
				}
			},
			closeForm() {
				this.showForm = false;
				this.editMode = false;
				this.form = {
					id: null,
					name: "",
					batch: "",
					expiry: "",
					quantity: 0,
					active: true,
				};
			},
			getExpiryClass(expiry) {
				const today = new Date();
				const exp = new Date(expiry);
				const diff = (exp - today) / (1000 * 60 * 60 * 24);
				if (diff < 30 && diff > 0) return "mi-expiry-near";
				if (diff < 0) return "mi-expiry-past";
				return "mi-expiry-ok";
			},
			getStockClass(qty) {
				if (qty < 10) return "mi-stock-low";
				return "mi-stock-ok";
			},
			isLowStock(med) {
				return med.quantity < 10;
			},
			isNearExpiry(med) {
				const today = new Date();
				const exp = new Date(med.expiry);
				const diff = (exp - today) / (1000 * 60 * 60 * 24);
				return diff < 30 && diff > 0;
			},
			async exportExcel() {
				const token = localStorage.getItem("Token");
				try {
					const response = await axios.get("/admin/medicines/export", {
						headers: { Authorization: `Bearer ${token}` },
						responseType: "blob",
					});
					const url = window.URL.createObjectURL(new Blob([response.data]));
					const link = document.createElement("a");
					link.href = url;
					link.setAttribute("download", "medicines_inventory.xlsx");
					document.body.appendChild(link);
					link.click();
					link.remove();
				} catch (e) {
					alert("Error exporting Excel");
				}
			},
		},
	};
</script>

<style scoped>
	@import url("https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css");

	.medicines-inventory-container {
		min-height: 100vh;
		background: linear-gradient(135deg, #e0f2fe 0%, #f8fafc 100%);
		display: flex;
		align-items: flex-start;
		justify-content: center;
		padding: 2rem 0;
	}

	.medicines-inventory-card {
		background: #fff;
		border-radius: 1.5rem;
		box-shadow: 0 8px 32px rgba(30, 58, 138, 0.13);
		padding: 2.5rem 2.2rem;
		max-width: 1320px;
		width: 100%;
		margin: 0 auto;
	}

	.mi-header {
		text-align: center;
		margin-bottom: 2rem;
	}

	.mi-icon {
		font-size: 3rem;
		color: #f59e0b;
		margin-bottom: 0.5rem;
	}

	.mi-header h2 {
		font-size: 2rem;
		font-weight: 700;
		color: #f59e0b;
		margin-bottom: 0.3rem;
	}

	.mi-subtitle {
		color: #64748b;
		font-size: 1rem;
		margin-bottom: 0;
	}

	.mi-actions {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 1.5rem;
		gap: 1rem;
	}

	.mi-btn {
		background: linear-gradient(90deg, #f59e0b 0%, #38bdf8 100%);
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

	.mi-btn-export {
		background: linear-gradient(90deg, #38bdf8 0%, #f59e0b 100%);
	}

	.mi-btn-cancel {
		background: #64748b;
	}

	.mi-btn:hover {
		background: linear-gradient(90deg, #38bdf8 0%, #f59e0b 100%);
		box-shadow: 0 4px 16px rgba(30, 58, 138, 0.13);
	}

	.mi-search {
		border-radius: 0.7rem;
		border: 1px solid #cbd5e1;
		padding: 0.7rem 1rem;
		font-size: 1rem;
		background: #f8fafc;
		width: 260px;
		box-shadow: 0 1px 4px rgba(30, 58, 138, 0.04);
		transition: border-color 0.2s, box-shadow 0.2s;
	}

	.mi-search:focus {
		border-color: #f59e0b;
		outline: none;
		box-shadow: 0 2px 8px rgba(245, 158, 11, 0.09);
	}

	.mi-table-wrapper {
		overflow-x: auto;
	}

	.mi-table {
		width: 100%;
		border-collapse: separate;
		border-spacing: 0;
		background: #fff;
		border-radius: 1rem;
		box-shadow: 0 2px 8px rgba(30, 58, 138, 0.05);
		margin-bottom: 1rem;
	}

	.mi-table th,
	.mi-table td {
		padding: 1rem 0.7rem;
		text-align: left;
		font-size: 1rem;
		vertical-align: middle;
	}

	.mi-table th {
		background: #fef9c3;
		color: #f59e0b;
		font-weight: 600;
		border-bottom: 2px solid #bae6fd;
	}

	.mi-table tr:not(:last-child) td {
		border-bottom: 1px solid #fef9c3;
	}

	.mi-expiry-ok {
		background: #e0f2fe;
		color: #2563eb;
		border-radius: 0.6rem;
		padding: 0.4rem 0.9rem;
		font-size: 0.95rem;
		font-weight: 500;
		display: inline-block;
	}

	.mi-expiry-near {
		background: #fef9c3;
		color: #f59e0b;
		border-radius: 0.6rem;
		padding: 0.4rem 0.9rem;
		font-size: 0.95rem;
		font-weight: 500;
		display: inline-block;
	}

	.mi-expiry-past {
		background: #ef4444;
		color: #fff;
		border-radius: 0.6rem;
		padding: 0.4rem 0.9rem;
		font-size: 0.95rem;
		font-weight: 500;
		display: inline-block;
	}

	.mi-stock-ok {
		background: #e0f2fe;
		color: #2563eb;
		border-radius: 0.6rem;
		padding: 0.4rem 0.9rem;
		font-size: 0.95rem;
		font-weight: 500;
		display: inline-block;
	}

	.mi-stock-low {
		background: #fef9c3;
		color: #f59e0b;
		border-radius: 0.6rem;
		padding: 0.4rem 0.9rem;
		font-size: 0.95rem;
		font-weight: 500;
		display: inline-block;
	}

	.mi-badge-low {
		background: #f59e0b;
		color: #fff;
		border-radius: 0.6rem;
		padding: 0.4rem 0.9rem;
		font-size: 0.95rem;
		font-weight: 500;
		display: inline-block;
	}

	.mi-badge-expiry {
		background: #ef4444;
		color: #fff;
		border-radius: 0.6rem;
		padding: 0.4rem 0.9rem;
		font-size: 0.95rem;
		font-weight: 500;
		display: inline-block;
	}

	.mi-badge-ok {
		background: #10b981;
		color: #fff;
		border-radius: 0.6rem;
		padding: 0.4rem 0.9rem;
		font-size: 0.95rem;
		font-weight: 500;
		display: inline-block;
	}

	.mi-action-btn {
		background: #f8fafc;
		border: none;
		border-radius: 0.5rem;
		padding: 0.4rem 0.7rem;
		font-size: 1.1rem;
		color: #f59e0b;
		cursor: pointer;
		margin-right: 0.3rem;
		transition: background 0.2s, color 0.2s;
	}

	.mi-action-btn:hover {
		background: #fef9c3;
		color: #2563eb;
	}

	.mi-empty-row {
		text-align: center;
		color: #64748b;
		font-size: 1.05rem;
		padding: 2rem 0;
	}

	.mi-modal-backdrop {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		background: rgba(245, 158, 11, 0.18);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 9999;
	}

	.mi-modal {
		background: #fff;
		padding: 2rem;
		border-radius: 1rem;
		box-shadow: 0 4px 18px rgba(245, 158, 11, 0.12);
		min-width: 320px;
		max-width: 95vw;
	}

	.mi-modal h3 {
		color: #f59e0b;
		font-weight: 600;
		margin-bottom: 1.2rem;
	}

	.mi-modal-actions {
		display: flex;
		gap: 1rem;
		margin-top: 1.2rem;
	}

	@media (max-width: 900px) {
		.medicines-inventory-card {
			padding: 1.2rem 0.5rem;
			max-width: 99vw;
		}

		.mi-modal {
			padding: 1rem;
			min-width: 220px;
		}

		.mi-table th,
		.mi-table td {
			font-size: 0.95rem;
			padding: 0.6rem 0.4rem;
		}
	}
</style>
