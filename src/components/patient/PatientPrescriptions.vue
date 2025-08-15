<template>
	<div class="prescriptions-main-bg">
		<div class="prescriptions-card">
			<div class="prescriptions-header">
				<i class="bi bi-file-earmark-medical"></i>
				<span>My Prescriptions</span>
			</div>
			<div class="prescriptions-body">
				<div v-if="prescriptions.length === 0" class="prescriptions-alert">
					No prescriptions found.
				</div>
				<div v-else class="prescriptions-table-wrapper">
					<div class="table-responsive">
						<table class="prescriptions-table">
							<thead>
								<tr>
									<th>#</th>
									<th>Date</th>
									<th>Doctor</th>
									<th>Medicines</th>
									<th>Notes</th>
									<th>Actions</th>
								</tr>
							</thead>
							<tbody>
								<tr
									v-for="(prescription, idx) in prescriptions"
									:key="prescription.id">
									<td>{{ idx + 1 }}</td>
									<td>{{ formatDate(prescription.date) }}</td>
									<td class="td-doctor">{{ prescription.doctor }}</td>
									<td>
										<ul class="med-list">
											<li v-for="med in prescription.medicines" :key="med.name">
												<span class="med-badge">{{ med.name }}</span>
												<span class="med-dosage">({{ med.dosage }})</span>
											</li>
										</ul>
									</td>
									<td class="td-notes">
										<span>{{ prescription.notes }}</span>
									</td>
									<td>
										<button
											@click="downloadPrescription()"
											class="prescriptions-btn prescriptions-btn-download">
											<i class="bi bi-download"></i> Download
										</button>
										<button
											@click="viewPrescription(prescription)"
											class="prescriptions-btn prescriptions-btn-view">
											<i class="bi bi-eye"></i> View
										</button>
									</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
				<!-- View Modal -->
				<div
					v-if="showViewModal && selectedPrescription.date"
					class="prescriptions-modal-backdrop">
					<div class="prescriptions-modal">
						<h5>Prescription Details</h5>
						<p>
							<strong>Date:</strong>
							{{ formatDate(selectedPrescription.date) }}
						</p>
						<p><strong>Doctor:</strong> {{ selectedPrescription.doctor }}</p>
						<p><strong>Medicines:</strong></p>
						<ul>
							<li v-for="med in selectedPrescription.medicines" :key="med.name">
								{{ med.name }} - {{ med.dosage }}
							</li>
						</ul>
						<p><strong>Notes:</strong> {{ selectedPrescription.notes }}</p>
						<button
							@click="showViewModal = false"
							class="prescriptions-btn prescriptions-btn-close">
							Close
						</button>
					</div>
				</div>
				<div v-if="successMsg" class="prescriptions-success" role="status">
					<i class="bi bi-check-circle"></i> {{ successMsg }}
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		name: "PatientPrescriptions",
		data() {
			return {
				prescriptions: [],
				showViewModal: false,
				selectedPrescription: {
					date: "",
					doctor: "",
					medicines: [],
					notes: "",
				},
				successMsg: "",
			};
		},
		created() {
			this.fetchPrescriptions();
		},
		methods: {
			fetchPrescriptions() {
				// Dummy data, replace with API call
				this.prescriptions = [
					{
						id: 1,
						date: "2025-07-10",
						doctor: "Dr. Ali Raza",
						medicines: [
							{ name: "Paracetamol", dosage: "500mg, 2x daily" },
							{ name: "Amoxicillin", dosage: "250mg, 3x daily" },
						],
						notes: "Take after meals. Drink plenty of water.",
					},
					{
						id: 2,
						date: "2025-06-22",
						doctor: "Dr. Sara Khan",
						medicines: [{ name: "Ibuprofen", dosage: "400mg, 1x daily" }],
						notes: "For pain relief only.",
					},
					{
						id: 3,
						date: "2025-05-15",
						doctor: "Dr. Ahmed Siddiqui",
						medicines: [
							{ name: "Cetirizine", dosage: "10mg, 1x daily" },
							{ name: "Vitamin D", dosage: "1000IU, 1x daily" },
						],
						notes: "Take at night. Avoid allergens.",
					},
				];
			},
			formatDate(dateStr) {
				const options = { year: "numeric", month: "short", day: "numeric" };
				return new Date(dateStr).toLocaleDateString(undefined, options);
			},
			downloadPrescription() {
				this.successMsg =
					"Download will be available after backend integration.";
				setTimeout(() => {
					this.successMsg = "";
				}, 2000);
			},
			viewPrescription(prescription) {
				this.selectedPrescription = prescription;
				this.showViewModal = true;
			},
		},
	};
</script>

<style scoped>
	@import url("https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css");

	.prescriptions-main-bg {
		min-height: 100vh;
		width: 100%;
		background: linear-gradient(135deg, #e0f2fe 0%, #f8fafc 100%);
		display: flex;
		align-items: stretch;
		justify-content: center;
		box-sizing: border-box;
		padding: 0;
		margin: 0;
	}

	.prescriptions-card {
		background: #fff;
		border-radius: 0;
		box-shadow: none;
		padding: 0;
		width: 100%;
		margin: 0;
		min-height: 100vh;
		display: flex;
		flex-direction: column;
	}

	.prescriptions-header {
		background: linear-gradient(90deg, #2563eb 0%, #38bdf8 100%);
		color: #fff;
		border-radius: 1rem 1rem 0 0;
		padding: 1rem;
		font-size: 1.2rem;
		font-weight: 700;
		display: flex;
		align-items: center;
		gap: 0.7rem;
		margin-bottom: 0;
		box-shadow: 0 2px 8px rgba(30, 58, 138, 0.09);
		letter-spacing: 0.5px;
	}

	.prescriptions-body {
		background: #f8fafc;
		border-radius: 0;
		
		flex: 1;
		min-height: calc(100vh - 60px);
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
	}

	.prescriptions-table-wrapper {
		overflow-x: auto;
		width: 100%;
		flex-grow: 1;
	}

	.table-responsive {
		width: 100%;
		overflow-x: auto;
	}

	.prescriptions-table {
		width: 100%;
		min-width: 700px;
		border-collapse: separate;
		border-spacing: 0;
		background: #fff;
		border-radius: 0.7rem;
		box-shadow: 0 1px 6px rgba(30, 58, 138, 0.09);
		margin-bottom: 1rem;
		table-layout: auto;
	}

	.prescriptions-table th,
	.prescriptions-table td {
		vertical-align: middle;
		padding: 0.8rem;
		font-size: 0.95rem;
		text-align: left;
		word-break: break-word;
	}

	.prescriptions-table th {
		background: #e0e7ff;
		color: #2563eb;
		font-weight: 700;
		border-bottom: 2px solid #bae6fd;
		letter-spacing: 0.3px;
	}

	.prescriptions-table tr:not(:last-child) td {
		border-bottom: 1px solid #bae6fd;
	}

	.prescriptions-table tbody tr:hover {
		background: #e0f2fe;
		transition: background 0.2s;
	}

	.td-doctor,
	.td-notes {
		max-width: 120px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.med-list {
		margin-bottom: 0;
		padding-left: 0.2rem;
		list-style-type: none;
	}

	.med-badge {
		background: linear-gradient(90deg, #38bdf8 0%, #bae6fd 100%);
		color: #2563eb;
		font-size: 0.9rem;
		font-weight: 600;
		border-radius: 0.5rem;
		padding: 0.2rem 0.5rem;
		margin-right: 0.2rem;
		display: inline-block;
		box-shadow: 0 1px 4px rgba(30, 58, 138, 0.07);
	}

	.med-dosage {
		color: #64748b;
		font-size: 0.9rem;
	}

	.prescriptions-btn {
		border-radius: 0.5rem;
		font-size: 0.9rem;
		font-weight: 600;
		padding: 0.5rem 0.8rem;
		transition: background 0.2s, color 0.2s, box-shadow 0.2s;
		border: none;
		cursor: pointer;
		margin-right: 0.5rem;
		display: inline-flex;
		align-items: center;
		gap: 0.3rem;
		box-shadow: 0 1px 4px rgba(30, 58, 138, 0.07);
	}

	.prescriptions-btn-download {
		background: #e0e7ff;
		color: #2563eb;
	}
	.prescriptions-btn-download:hover {
		background: #bae6fd;
		color: #2563eb;
		box-shadow: 0 2px 8px rgba(30, 58, 138, 0.13);
	}

	.prescriptions-btn-view {
		background: #bae6fd;
		color: #2563eb;
	}
	.prescriptions-btn-view:hover {
		background: #38bdf8;
		color: #fff;
		box-shadow: 0 2px 8px rgba(30, 58, 138, 0.13);
	}

	.prescriptions-btn-close {
		background: #64748b;
		color: #fff;
		margin-top: 1rem;
		padding: 0.5rem 1rem;
	}
	.prescriptions-btn-close:hover {
		background: #2563eb;
	}

	.prescriptions-alert {
		background: linear-gradient(90deg, #e0f2fe 0%, #bae6fd 100%);
		color: #2563eb;
		border-radius: 0.7rem;
		font-size: 0.95rem;
		font-weight: 600;
		padding: 1rem;
		margin: 1rem 0;
		border: none;
		text-align: center;
		box-shadow: 0 1px 4px rgba(30, 58, 138, 0.07);
	}

	.prescriptions-modal {
		background: #fff;
		padding: 1.5rem;
		border-radius: 0.7rem;
		box-shadow: 0 8px 32px rgba(30, 58, 138, 0.13);
		min-width: 300px;
		max-width: 90%;
		word-break: break-word;
	}

	.prescriptions-modal h5 {
		margin-top: 0;
		margin-bottom: 1rem;
	}

	.prescriptions-modal p {
		margin-bottom: 0.5rem;
	}

	.prescriptions-modal ul {
		margin-bottom: 1rem;
		padding-left: 1.5rem;
	}

	.prescriptions-modal-backdrop {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(30, 58, 138, 0.18);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 9999;
	}

	.prescriptions-success {
		margin-top: 1rem;
		color: #10b981;
		font-weight: 700;
		font-size: 0.95rem;
		display: flex;
		align-items: center;
		gap: 0.5rem;
		justify-content: center;
		background: #f0fdf4;
		border-radius: 0.7rem;
		padding: 1rem;
		box-shadow: 0 1px 4px rgba(34, 197, 94, 0.07);
	}

	@media (max-width: 768px) {
		.prescriptions-header {
			padding: 0.8rem;
			font-size: 1.1rem;
		}
		.prescriptions-body {
			padding: 0.8rem;
		}
		.prescriptions-table th,
		.prescriptions-table td {
			padding: 0.6rem;
			font-size: 0.85rem;
		}
		.prescriptions-btn {
			padding: 0.4rem 0.7rem;
			font-size: 0.85rem;
		}
		.prescriptions-modal {
			padding: 1rem;
			min-width: 250px;
		}
	}

	@media (max-width: 576px) {
		.prescriptions-header {
			padding: 0.6rem;
			font-size: 1rem;
		}
		.prescriptions-table th,
		.prescriptions-table td {
			padding: 0.5rem;
			font-size: 0.8rem;
		}
		.prescriptions-btn {
			padding: 0.3rem 0.6rem;
			font-size: 0.8rem;
		}
		.med-badge {
			font-size: 0.8rem;
			padding: 0.15rem 0.4rem;
		}
		.med-dosage {
			font-size: 0.8rem;
		}
	}
</style>