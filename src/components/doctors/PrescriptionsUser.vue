<template>
	<div class="prescriptions-wrapper">
		<h2 class="mb-4 text-primary fw-bold">
			<i class="bi bi-prescription2 me-2"></i> Prescriptions
		</h2>
		<div class="mb-4">
			<button class="btn btn-primary" @click="showForm = true">
				<i class="bi bi-plus-circle me-1"></i> New Prescription
			</button>
		</div>
		<div v-if="prescriptions.length === 0" class="alert alert-info text-center">
			No prescriptions found.
		</div>
		<div v-else>
			<table class="table table-hover align-middle rounded shadow-sm">
				<thead class="table-light">
					<tr>
						<th>#</th>
						<th>Date</th>
						<th>Patient</th>
						<th>Doctor</th>
						<th>Medicines</th>
						<th>Actions</th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="(presc, idx) in prescriptions" :key="presc.id">
						<td>{{ idx + 1 }}</td>
						<td>{{ presc.date }}</td>
						<td>{{ presc.patient }}</td>
						<td>{{ presc.doctor }}</td>
						<td>
							<ul class="list-unstyled mb-0">
								<li v-for="(med, i) in presc.medicines" :key="i">
									<span class="badge bg-info text-dark">{{ med }}</span>
								</li>
							</ul>
						</td>
						<td>
							<button
								class="btn btn-warning btn-sm me-2"
								@click="editPrescription(presc)">
								<i class="bi bi-pencil"></i> Edit
							</button>
							<button
								class="btn btn-danger btn-sm"
								@click="deletePrescription(presc.id)">
								<i class="bi bi-trash"></i> Delete
							</button>
							<button
								class="btn btn-success btn-sm ms-2"
								@click="downloadPrescription(presc)">
								<i class="bi bi-download"></i> Download
							</button>
						</td>
					</tr>
				</tbody>
			</table>
		</div>

		<!-- Prescription Form Modal -->
		<div v-if="showForm" class="modal-backdrop" @click.self="closeForm">
			<div class="modal-content-custom">
				<h4 class="mb-3 text-primary">
					<i class="bi bi-prescription2 me-2"></i> Prescription Form
				</h4>
				<form @submit.prevent="savePrescription">
					<div class="mb-3">
						<label class="form-label fw-semibold">Date</label>
						<input
							type="date"
							v-model="form.date"
							class="form-control"
							required />
					</div>
					<div class="mb-3">
						<label class="form-label fw-semibold">Patient Name</label>
						<input
							type="text"
							v-model="form.patient"
							class="form-control"
							required />
					</div>
					<div class="mb-3">
						<label class="form-label fw-semibold">Doctor Name</label>
						<input
							type="text"
							v-model="form.doctor"
							class="form-control"
							required />
					</div>
					<div class="mb-3">
						<label class="form-label fw-semibold"
							>Medicines (comma separated)</label
						>
						<input
							type="text"
							v-model="form.medicines"
							class="form-control"
							required />
					</div>
					<div class="d-grid gap-2">
						<button type="submit" class="btn btn-primary">
							<i class="bi bi-save me-1"></i> Save
						</button>
						<button type="button" class="btn btn-secondary" @click="closeForm">
							Cancel
						</button>
					</div>
				</form>
			</div>
		</div>
	</div>
</template>

<script>
	/* eslint-disable */
	export default {
		name: "PrescriptionsUser",
		data() {
			return {
				prescriptions: [
					{
						id: 1,
						date: "2025-08-07",
						patient: "Ali Raza",
						doctor: "Dr. Nadeem",
						medicines: ["Panadol", "Augmentin"],
					},
					{
						id: 2,
						date: "2025-08-06",
						patient: "Sara Khan",
						doctor: "Dr. Nadeem",
						medicines: ["Metformin"],
					},
				],
				showForm: false,
				form: {
					id: null,
					date: "",
					patient: "",
					doctor: "",
					medicines: "",
				},
			};
		},
		methods: {
			editPrescription(presc) {
				this.form = {
					id: presc.id,
					date: presc.date,
					patient: presc.patient,
					doctor: presc.doctor,
					medicines: presc.medicines.join(", "),
				};
				this.showForm = true;
			},
			deletePrescription(id) {
				this.prescriptions = this.prescriptions.filter((p) => p.id !== id);
			},
			downloadPrescription() {
				alert(
					"Download functionality will be implemented with backend integration."
				);
			},
			savePrescription() {
				if (
					!this.form.date ||
					!this.form.patient ||
					!this.form.doctor ||
					!this.form.medicines
				)
					return;
				const medicinesArr = this.form.medicines
					.split(",")
					.map((m) => m.trim())
					.filter((m) => m);
				if (this.form.id) {
					// Edit
					this.prescriptions = this.prescriptions.map((p) =>
						p.id === this.form.id
							? {
									...p,
									date: this.form.date,
									patient: this.form.patient,
									doctor: this.form.doctor,
									medicines: medicinesArr,
							  }
							: p
					);
				} else {
					// New
					const newId = this.prescriptions.length
						? Math.max(...this.prescriptions.map((p) => p.id)) + 1
						: 1;
					this.prescriptions.push({
						id: newId,
						date: this.form.date,
						patient: this.form.patient,
						doctor: this.form.doctor,
						medicines: medicinesArr,
					});
				}
				this.closeForm();
			},
			closeForm() {
				this.showForm = false;
				this.form = {
					id: null,
					date: "",
					patient: "",
					doctor: "",
					medicines: "",
				};
			},
		},
	};
</script>

<style scoped>
	@import url("https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css");
	@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap");

	.prescriptions-wrapper {
		margin: 0 auto;
		padding: 2rem 1rem;
	}

	.table {
		border-radius: 12px;
		overflow: hidden;
		background: #fff;
	}

	.table th,
	.table td {
		vertical-align: middle !important;
	}

	.badge.bg-info {
		background: linear-gradient(90deg, #38bdf8 0%, #0ea5e9 100%);
		color: #fff;
	}

	.btn-primary {
		background: linear-gradient(90deg, #3b82f6 0%, #2563eb 100%);
		border: none;
		border-radius: 8px;
		padding: 0.5rem 1.2rem;
		font-weight: 500;
		letter-spacing: 0.5px;
		transition: all 0.3s ease;
		box-shadow: 0 4px 6px rgba(59, 130, 246, 0.2);
	}

	.btn-primary:hover {
		background: linear-gradient(90deg, #2563eb 0%, #1d4ed8 100%);
		transform: translateY(-2px);
		box-shadow: 0 6px 12px rgba(59, 130, 246, 0.3);
	}

	.modal-backdrop {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		background: rgba(30, 58, 138, 0.15);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 9999;
	}

	.modal-content-custom {
		background: #fff;
		border-radius: 16px;
		padding: 2rem;
		box-shadow: 0 8px 32px rgba(30, 58, 138, 0.15);
		max-width: 400px;
		width: 100%;
	}

	.list-unstyled {
		margin-bottom: 0;
	}

	.list-group-item {
		font-size: 1rem;
	}
</style>
