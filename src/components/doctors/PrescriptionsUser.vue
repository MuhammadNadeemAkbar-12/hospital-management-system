<template>
	<div class="prescriptions-container">
		<div class="prescriptions-card">
			<div class="prescriptions-header">
				<i class="bi bi-prescription2 prescriptions-icon"></i>
				<h2 class="prescriptions-title">Prescriptions</h2>
				<p class="prescriptions-subtitle">
					Manage patient prescriptions and medical records
				</p>
			</div>

			<div class="prescriptions-actions">
				<button class="add-prescription-btn" @click="showForm = true">
					<i class="bi bi-plus-circle"></i>
					<span>New Prescription</span>
				</button>
			</div>

			<div v-if="prescriptions.length === 0" class="prescriptions-empty">
				<i class="bi bi-prescription2 empty-icon"></i>
				<h4>No Prescriptions Found</h4>
				<p>Start by creating your first prescription.</p>
			</div>

			<div v-else class="prescriptions-content">
				<!-- Mobile Cards View -->
				<div class="prescriptions-mobile-view">
					<div
						v-for="(presc, idx) in prescriptions"
						:key="presc.id"
						class="prescription-card-mobile">
						<div class="prescription-header">
							<div class="prescription-info">
								<div class="prescription-number">#{{ idx + 1 }}</div>
								<div class="prescription-date">
									<i class="bi bi-calendar3"></i>
									{{ formatDate(presc.date) }}
								</div>
							</div>
							<div class="prescription-status">
								<span class="status-badge">Active</span>
							</div>
						</div>

						<div class="prescription-details">
							<div class="detail-row">
								<div class="detail-label">
									<i class="bi bi-person detail-icon"></i>
									Patient
								</div>
								<div class="detail-value">{{ presc.patient }}</div>
							</div>
							<div class="detail-row">
								<div class="detail-label">
									<i class="bi bi-person-badge detail-icon"></i>
									Doctor
								</div>
								<div class="detail-value">{{ presc.doctor }}</div>
							</div>
						</div>

						<div class="medicines-section">
							<div class="medicines-label">
								<i class="bi bi-capsule"></i>
								Medicines
							</div>
							<div class="medicines-list">
								<span
									v-for="(med, i) in presc.medicines"
									:key="i"
									class="medicine-pill">
									{{ med }}
								</span>
							</div>
						</div>

						<div class="prescription-actions">
							<button
								class="action-btn btn-edit"
								@click="editPrescription(presc)">
								<i class="bi bi-pencil"></i>
								<span>Edit</span>
							</button>
							<button
								class="action-btn btn-download"
								@click="downloadPrescription(presc)">
								<i class="bi bi-download"></i>
								<span>Download</span>
							</button>
							<button
								class="action-btn btn-delete"
								@click="deletePrescription(presc.id)">
								<i class="bi bi-trash"></i>
								<span>Delete</span>
							</button>
						</div>
					</div>
				</div>

				<!-- Desktop Table View -->
				<div class="prescriptions-desktop-view">
					<div class="table-wrapper">
						<table class="prescriptions-table">
							<thead>
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
								<tr
									v-for="(presc, idx) in prescriptions"
									:key="presc.id"
									class="table-row">
									<td>
										<div class="prescription-number-desktop">
											#{{ idx + 1 }}
										</div>
									</td>
									<td>
										<div class="date-cell">
											<i class="bi bi-calendar3 date-icon"></i>
											{{ formatDate(presc.date) }}
										</div>
									</td>
									<td>
										<div class="patient-cell">
											<div class="patient-avatar">
												{{ presc.patient.charAt(0).toUpperCase() }}
											</div>
											<span>{{ presc.patient }}</span>
										</div>
									</td>
									<td>
										<div class="doctor-cell">
											<i class="bi bi-person-badge doctor-icon"></i>
											{{ presc.doctor }}
										</div>
									</td>
									<td>
										<div class="medicines-cell">
											<span
												v-for="(med, i) in presc.medicines"
												:key="i"
												class="medicine-tag">
												{{ med }}
											</span>
										</div>
									</td>
									<td>
										<div class="desktop-actions">
											<button
												class="desktop-btn btn-edit"
												@click="editPrescription(presc)"
												title="Edit Prescription">
												<i class="bi bi-pencil"></i>
											</button>
											<button
												class="desktop-btn btn-download"
												@click="downloadPrescription(presc)"
												title="Download Prescription">
												<i class="bi bi-download"></i>
											</button>
											<button
												class="desktop-btn btn-delete"
												@click="deletePrescription(presc.id)"
												title="Delete Prescription">
												<i class="bi bi-trash"></i>
											</button>
										</div>
									</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
			</div>

			<!-- Prescription Form Modal -->
			<div v-if="showForm" class="modal-backdrop" @click.self="closeForm">
				<div class="modal-content">
					<div class="modal-header">
						<h4 class="modal-title">
							<i class="bi bi-prescription2 me-2"></i>
							{{ form.id ? "Edit Prescription" : "New Prescription" }}
						</h4>
						<button class="close-btn" @click="closeForm">
							<i class="bi bi-x-lg"></i>
						</button>
					</div>

					<form @submit.prevent="savePrescription" class="modal-body">
						<div class="form-group">
							<label class="form-label">
								<i class="bi bi-calendar3"></i>
								Date
							</label>
							<input
								type="date"
								v-model="form.date"
								class="form-control"
								required />
						</div>

						<div class="form-group">
							<label class="form-label">
								<i class="bi bi-person"></i>
								Patient Name
							</label>
							<input
								type="text"
								v-model="form.patient"
								class="form-control"
								placeholder="Enter patient name"
								required />
						</div>

						<div class="form-group">
							<label class="form-label">
								<i class="bi bi-person-badge"></i>
								Doctor Name
							</label>
							<input
								type="text"
								v-model="form.doctor"
								class="form-control"
								placeholder="Enter doctor name"
								required />
						</div>

						<div class="form-group">
							<label class="form-label">
								<i class="bi bi-capsule"></i>
								Medicines
							</label>
							<textarea
								v-model="form.medicines"
								class="form-control"
								rows="3"
								placeholder="Enter medicines separated by commas (e.g., Panadol, Augmentin, Metformin)"
								required></textarea>
							<small class="form-hint"
								>Separate multiple medicines with commas</small
							>
						</div>

						<div class="modal-actions">
							<button type="submit" class="btn-save">
								<i class="bi bi-save"></i>
								{{ form.id ? "Update" : "Save" }} Prescription
							</button>
							<button type="button" class="btn-cancel" @click="closeForm">
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
		name: "PrescriptionsUser",
		data() {
			return {
				prescriptions: [
					{
						id: 1,
						date: "2025-08-07",
						patient: "Ali Raza",
						doctor: "Dr. Nadeem Ahmed",
						medicines: ["Panadol 500mg", "Augmentin 625mg", "Omeprazole 20mg"],
					},
					{
						id: 2,
						date: "2025-08-06",
						patient: "Sara Khan",
						doctor: "Dr. Fatima Sheikh",
						medicines: ["Metformin 500mg", "Glimepiride 2mg"],
					},
					{
						id: 3,
						date: "2025-08-05",
						patient: "Ahmed Ali",
						doctor: "Dr. Hassan Malik",
						medicines: ["Losartan 50mg", "Amlodipine 5mg", "Atorvastatin 20mg"],
					},
					{
						id: 4,
						date: "2025-08-04",
						patient: "Fatima Sheikh",
						doctor: "Dr. Nadeem Ahmed",
						medicines: ["Cetirizine 10mg", "Montelukast 10mg"],
					},
					{
						id: 5,
						date: "2025-08-03",
						patient: "Hassan Malik",
						doctor: "Dr. Fatima Sheikh",
						medicines: [
							"Amoxicillin 500mg",
							"Azithromycin 250mg",
							"Dexamethasone 4mg",
						],
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
			formatDate(dateString) {
				const options = { year: "numeric", month: "short", day: "numeric" };
				return new Date(dateString).toLocaleDateString("en-US", options);
			},
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
				if (confirm("Are you sure you want to delete this prescription?")) {
					this.prescriptions = this.prescriptions.filter((p) => p.id !== id);
				}
			},
			downloadPrescription(presc) {
				alert(`Downloading prescription for ${presc.patient}...`);
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
					// Edit existing prescription
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
					// Create new prescription
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
	@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap");

	* {
		font-family: "Poppins", sans-serif;
	}

	.prescriptions-container {
		min-height: 100vh;
		background: white;
		padding: 2rem 1rem;
	}

	.prescriptions-card {
		background: rgba(255, 255, 255, 0.95);
		backdrop-filter: blur(10px);
		border-radius: 2rem;
		box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
		max-width: 1200px;
		margin: 0 auto;
		padding: 2.5rem;
		transition: all 0.3s ease;
	}

	.prescriptions-header {
		text-align: center;
		margin-bottom: 3rem;
	}

	.prescriptions-icon {
		font-size: 4rem;
		color: #667eea;
		margin-bottom: 1rem;
		filter: drop-shadow(0 4px 8px rgba(102, 126, 234, 0.3));
	}

	.prescriptions-title {
		font-size: 2.5rem;
		font-weight: 700;
		color: #2d3748;
		margin-bottom: 0.5rem;
		/* background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); */
		-webkit-background-clip: text;
		background-clip: text;
		-webkit-text-fill-color: transparent;
	}

	.prescriptions-subtitle {
		color: #718096;
		font-size: 1.1rem;
		margin: 0;
	}

	.prescriptions-actions {
		display: flex;
		justify-content: center;
		margin-bottom: 2rem;
	}

	.add-prescription-btn {
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		color: white;
		border: none;
		padding: 0.8rem 2rem;
		border-radius: 1rem;
		font-weight: 600;
		font-size: 1rem;
		cursor: pointer;
		transition: all 0.3s ease;
		display: flex;
		align-items: center;
		gap: 0.5rem;
		box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
	}

	.add-prescription-btn:hover {
		transform: translateY(-2px);
		box-shadow: 0 12px 35px rgba(102, 126, 234, 0.4);
	}

	.prescriptions-empty {
		text-align: center;
		padding: 4rem 2rem;
		color: #718096;
	}

	.empty-icon {
		font-size: 4rem;
		margin-bottom: 1rem;
		opacity: 0.6;
	}

	/* Mobile Cards View */
	.prescriptions-mobile-view {
		display: block;
	}

	.prescription-card-mobile {
		background: #fff;
		border-radius: 1.5rem;
		box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
		margin-bottom: 1.5rem;
		padding: 1.5rem;
		border: 1px solid rgba(102, 126, 234, 0.1);
		transition: all 0.3s ease;
	}

	.prescription-card-mobile:hover {
		transform: translateY(-2px);
		box-shadow: 0 12px 35px rgba(0, 0, 0, 0.12);
	}

	.prescription-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		margin-bottom: 1rem;
	}

	.prescription-info {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.prescription-number {
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		color: white;
		padding: 0.3rem 0.8rem;
		border-radius: 1rem;
		font-size: 0.9rem;
		font-weight: 600;
		display: inline-block;
		width: fit-content;
	}

	.prescription-date {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		color: #4a5568;
		font-size: 0.9rem;
	}

	.status-badge {
		background: rgba(34, 197, 94, 0.15);
		color: #16a34a;
		padding: 0.3rem 0.8rem;
		border-radius: 1rem;
		font-size: 0.8rem;
		font-weight: 500;
	}

	.prescription-details {
		margin-bottom: 1.5rem;
	}

	.detail-row {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 0.8rem;
		padding: 0.5rem 0;
	}

	.detail-label {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		color: #718096;
		font-size: 0.9rem;
		font-weight: 500;
	}

	.detail-icon {
		color: #667eea;
		font-size: 1rem;
	}

	.detail-value {
		color: #2d3748;
		font-weight: 500;
	}

	.medicines-section {
		margin-bottom: 1.5rem;
	}

	.medicines-label {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		color: #718096;
		font-size: 0.9rem;
		font-weight: 500;
		margin-bottom: 0.8rem;
	}

	.medicines-list {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}

	.medicine-pill {
		background: linear-gradient(135deg, #38bdf8 0%, #0ea5e9 100%);
		color: white;
		padding: 0.4rem 0.8rem;
		border-radius: 1rem;
		font-size: 0.8rem;
		font-weight: 500;
	}

	.prescription-actions {
		display: flex;
		gap: 0.8rem;
		flex-wrap: wrap;
	}

	.action-btn {
		display: flex;
		align-items: center;
		gap: 0.4rem;
		padding: 0.6rem 1rem;
		border: none;
		border-radius: 0.8rem;
		font-size: 0.9rem;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.2s ease;
		flex: 1;
		justify-content: center;
	}

	.btn-edit {
		background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
		color: white;
	}

	.btn-download {
		background: linear-gradient(135deg, #10b981 0%, #059669 100%);
		color: white;
	}

	.btn-delete {
		background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
		color: white;
	}

	.action-btn:hover {
		transform: translateY(-1px);
		box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
	}

	/* Desktop Table View */
	.prescriptions-desktop-view {
		display: none;
	}

	.table-wrapper {
		background: #fff;
		border-radius: 1.5rem;
		overflow: hidden;
		box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
	}

	.prescriptions-table {
		width: 100%;
		border-collapse: collapse;
	}

	.prescriptions-table th {
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		color: white;
		padding: 1.5rem 1.2rem;
		font-weight: 600;
		font-size: 1rem;
		text-align: left;
	}

	.prescriptions-table td {
		padding: 1.5rem 1.2rem;
		border-bottom: 1px solid #e2e8f0;
		vertical-align: middle;
	}

	.table-row:hover {
		background: rgba(102, 126, 234, 0.05);
	}

	.prescription-number-desktop {
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		color: white;
		padding: 0.5rem 0.8rem;
		border-radius: 1rem;
		font-weight: 600;
		display: inline-block;
		min-width: 50px;
		text-align: center;
	}

	.date-cell {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		color: #4a5568;
	}

	.date-icon {
		color: #667eea;
	}

	.patient-cell {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.patient-avatar {
		width: 40px;
		height: 40px;
		border-radius: 50%;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		display: flex;
		align-items: center;
		justify-content: center;
		color: white;
		font-weight: 600;
		font-size: 1.1rem;
	}

	.doctor-cell {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		color: #4a5568;
	}

	.doctor-icon {
		color: #667eea;
	}

	.medicines-cell {
		display: flex;
		flex-wrap: wrap;
		gap: 0.4rem;
		max-width: 200px;
	}

	.medicine-tag {
		background: linear-gradient(135deg, #38bdf8 0%, #0ea5e9 100%);
		color: white;
		padding: 0.3rem 0.6rem;
		border-radius: 0.8rem;
		font-size: 0.8rem;
		font-weight: 500;
	}

	.desktop-actions {
		display: flex;
		gap: 0.5rem;
	}

	.desktop-btn {
		padding: 0.6rem 0.8rem;
		border: none;
		border-radius: 0.7rem;
		cursor: pointer;
		transition: all 0.2s ease;
		font-size: 1.1rem;
	}

	.desktop-btn:hover {
		transform: translateY(-1px);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
	}

	/* Modal Styles */
	.modal-backdrop {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		background: rgba(0, 0, 0, 0.6);
		backdrop-filter: blur(5px);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 9999;
		padding: 1rem;
	}

	.modal-content {
		background: white;
		border-radius: 1.5rem;
		box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
		max-width: 500px;
		width: 100%;
		max-height: 90vh;
		overflow-y: auto;
		animation: modalSlideIn 0.3s ease;
	}

	@keyframes modalSlideIn {
		from {
			opacity: 0;
			transform: translateY(30px) scale(0.9);
		}
		to {
			opacity: 1;
			transform: translateY(0) scale(1);
		}
	}

	.modal-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 2rem 2rem 1rem;
		border-bottom: 1px solid #e2e8f0;
	}

	.modal-title {
		font-size: 1.5rem;
		font-weight: 600;
		color: #2d3748;
		margin: 0;
		display: flex;
		align-items: center;
	}

	.close-btn {
		background: rgba(239, 68, 68, 0.1);
		border: none;
		border-radius: 50%;
		width: 35px;
		height: 35px;
		display: flex;
		align-items: center;
		justify-content: center;
		color: #ef4444;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.close-btn:hover {
		background: rgba(239, 68, 68, 0.2);
		transform: scale(1.1);
	}

	.modal-body {
		padding: 2rem;
	}

	.form-group {
		margin-bottom: 1.5rem;
	}

	.form-label {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-weight: 600;
		color: #2d3748;
		margin-bottom: 0.5rem;
		font-size: 0.9rem;
	}

	.form-control {
		width: 100%;
		padding: 0.8rem 1rem;
		border: 2px solid #e2e8f0;
		border-radius: 0.8rem;
		font-size: 1rem;
		transition: all 0.2s ease;
		background: #f8fafc;
	}

	.form-control:focus {
		outline: none;
		border-color: #667eea;
		box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
		background: white;
	}

	.form-hint {
		color: #718096;
		font-size: 0.8rem;
		margin-top: 0.3rem;
	}

	.modal-actions {
		display: flex;
		gap: 1rem;
		margin-top: 2rem;
	}

	.btn-save {
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		color: white;
		border: none;
		padding: 0.8rem 1.5rem;
		border-radius: 0.8rem;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.2s ease;
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
	}

	.btn-save:hover {
		transform: translateY(-1px);
		box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
	}

	.btn-cancel {
		background: #e2e8f0;
		color: #4a5568;
		border: none;
		padding: 0.8rem 1.5rem;
		border-radius: 0.8rem;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.btn-cancel:hover {
		background: #cbd5e1;
	}

	/* Responsive Design */
	@media (min-width: 768px) {
		.prescriptions-container {
			padding: 3rem 2rem;
		}

		.prescriptions-card {
			padding: 3rem;
		}

		.action-btn {
			flex: none;
			min-width: 100px;
		}

		.modal-actions {
			flex-direction: row;
		}

		.btn-cancel {
			flex: none;
			min-width: 120px;
		}
	}

	@media (min-width: 992px) {
		.prescriptions-mobile-view {
			display: none;
		}

		.prescriptions-desktop-view {
			display: block;
		}
	}

	@media (min-width: 1200px) {
		.prescriptions-title {
			font-size: 3rem;
		}

		.prescriptions-icon {
			font-size: 5rem;
		}

		.medicines-cell {
			max-width: 250px;
		}
	}

	@media (max-width: 767px) {
		.modal-actions {
			flex-direction: column;
		}

		.medicines-list {
			justify-content: flex-start;
		}

		.prescription-actions {
			flex-direction: column;
		}
	}
</style>
