<template>
	<div class="patients-container">
		<div class="patients-card">
			<div class="patients-header">
				<i class="bi bi-people patients-icon"></i>
				<h2 class="patients-title">All Patients</h2>
				<p class="patients-subtitle">Manage and view patient records</p>
			</div>

			<div v-if="patients.length === 0" class="patients-empty">
				<i class="bi bi-person-x empty-icon"></i>
				<h4>No Patients Found</h4>
				<p>Start by adding your first patient to the system.</p>
			</div>

			<div v-else class="patients-content">
				<!-- Mobile Cards View -->
				<div class="patients-mobile-view">
					<div
						v-for="(patient, idx) in patients"
						:key="patient.id"
						class="patient-card-mobile">
						<div class="patient-card-header">
							<div class="patient-info">
								<h5 class="patient-name">{{ patient.name }}</h5>
								<span
									:class="[
										'patient-status',
										patient.active ? 'status-active' : 'status-inactive',
									]">
									<i
										:class="
											patient.active
												? 'bi bi-check-circle'
												: 'bi bi-pause-circle'
										"></i>
									{{ patient.active ? "Active" : "Inactive" }}
								</span>
							</div>
							<div class="patient-number">#{{ idx + 1 }}</div>
						</div>

						<div class="patient-details">
							<div class="detail-item">
								<i class="bi bi-envelope detail-icon"></i>
								<span>{{ patient.email }}</span>
							</div>
							<div class="detail-item">
								<i class="bi bi-telephone detail-icon"></i>
								<span>{{ patient.phone }}</span>
							</div>
						</div>

						<div class="patient-actions">
							<button
								class="action-btn btn-history"
								@click="viewMedicalHistory(patient)">
								<i class="bi bi-file-earmark-medical"></i>
								<span>History</span>
							</button>
							<button class="action-btn btn-edit" @click="editPatient(patient)">
								<i class="bi bi-pencil"></i>
								<span>Edit</span>
							</button>
							<button
								class="action-btn btn-delete"
								@click="softDelete(patient)">
								<i class="bi bi-trash"></i>
								<span>Delete</span>
							</button>
						</div>
					</div>
				</div>

				<!-- Desktop Table View -->
				<div class="patients-desktop-view">
					<div class="table-wrapper">
						<table class="patients-table">
							<thead>
								<tr>
									<th>#</th>
									<th>Patient Name</th>
									<th>Contact Information</th>
									<th>Status</th>
									<th>Actions</th>
								</tr>
							</thead>
							<tbody>
								<tr
									v-for="(patient, idx) in patients"
									:key="patient.id"
									class="table-row">
									<td>
										<div class="patient-number-desktop">#{{ idx + 1 }}</div>
									</td>
									<td>
										<div class="patient-name-cell">
											<div class="patient-avatar">
												{{ patient.name.charAt(0).toUpperCase() }}
											</div>
											<span class="name-text">{{ patient.name }}</span>
										</div>
									</td>
									<td>
										<div class="contact-info">
											<div class="contact-item">
												<i class="bi bi-envelope contact-icon"></i>
												{{ patient.email }}
											</div>
											<div class="contact-item">
												<i class="bi bi-telephone contact-icon"></i>
												{{ patient.phone }}
											</div>
										</div>
									</td>
									<td>
										<span
											:class="[
												'status-badge',
												patient.active ? 'status-active' : 'status-inactive',
											]">
											<i
												:class="
													patient.active
														? 'bi bi-check-circle'
														: 'bi bi-pause-circle'
												"></i>
											{{ patient.active ? "Active" : "Inactive" }}
										</span>
									</td>
									<td>
										<div class="desktop-actions">
											<button
												class="desktop-btn btn-history"
												@click="viewMedicalHistory(patient)"
												title="View History">
												<i class="bi bi-file-earmark-medical"></i>
											</button>
											<button
												class="desktop-btn btn-edit"
												@click="editPatient(patient)"
												title="Edit Patient">
												<i class="bi bi-pencil"></i>
											</button>
											<button
												class="desktop-btn btn-delete"
												@click="softDelete(patient)"
												title="Delete Patient">
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

			<!-- Medical History Modal -->
			<div
				v-if="showHistoryModal"
				class="modal-backdrop"
				@click.self="showHistoryModal = false">
				<div class="modal-content">
					<div class="modal-header">
						<h4 class="modal-title">
							<i class="bi bi-file-earmark-medical me-2"></i>
							Medical History
						</h4>
						<button class="close-btn" @click="showHistoryModal = false">
							<i class="bi bi-x-lg"></i>
						</button>
					</div>

					<div class="modal-body">
						<div v-if="modalHistory.length === 0" class="no-history">
							<i class="bi bi-clipboard-x"></i>
							<p>No medical history found</p>
						</div>
						<div v-else class="history-timeline">
							<div
								v-for="(record, idx) in modalHistory"
								:key="idx"
								class="history-item">
								<div class="history-date">
									<i class="bi bi-calendar3"></i>
									{{ record.date }}
								</div>
								<div class="history-details">{{ record.details }}</div>
							</div>
						</div>
					</div>

					<div class="modal-footer">
						<button class="modal-close-btn" @click="showHistoryModal = false">
							Close
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		name: "AllPatients",
		data() {
			return {
				patients: [
					{
						id: 1,
						name: "Ali Raza",
						email: "ali@example.com",
						phone: "03001234567",
						active: true,
						history: [
							{ date: "2025-07-01", details: "Fever, prescribed Panadol." },
							{ date: "2025-07-15", details: "Follow-up, recovered." },
							{ date: "2025-08-01", details: "Regular checkup, all good." },
						],
					},
					{
						id: 2,
						name: "Sara Khan",
						email: "sara@example.com",
						phone: "03007654321",
						active: true,
						history: [
							{ date: "2025-06-10", details: "Diabetes checkup." },
							{ date: "2025-07-10", details: "Blood sugar levels normal." },
						],
					},
					{
						id: 3,
						name: "Ahmed Ali",
						email: "ahmed@example.com",
						phone: "03009876543",
						active: false,
						history: [{ date: "2025-05-20", details: "Blood pressure issue." }],
					},
					{
						id: 4,
						name: "Fatima Sheikh",
						email: "fatima@example.com",
						phone: "03001122334",
						active: true,
						history: [
							{ date: "2025-08-15", details: "Headache treatment." },
							{ date: "2025-08-20", details: "Follow-up visit, improved." },
						],
					},
					{
						id: 5,
						name: "Hassan Malik",
						email: "hassan@example.com",
						phone: "03005566778",
						active: true,
						history: [{ date: "2025-07-25", details: "Routine vaccination." }],
					},
				],
				showHistoryModal: false,
				modalHistory: [],
			};
		},
		methods: {
			viewMedicalHistory(patient) {
				this.modalHistory = patient.history;
				this.showHistoryModal = true;
			},
			editPatient(patient) {
				alert("Edit patient: " + patient.name);
			},
			softDelete(patient) {
				if (confirm(`Are you sure you want to delete ${patient.name}?`)) {
					this.patients = this.patients.map((p) =>
						p.id === patient.id ? { ...p, active: false } : p
					);
				}
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

	.patients-container {
		min-height: 100vh;
		background: linear-gradient(120deg, #e0f2fe 0%, #f8fafc 100%);
		padding: 2rem 1rem;
	}

	.patients-card {
		background: rgba(255, 255, 255, 0.95);
		backdrop-filter: blur(10px);
		border-radius: 2rem;
		box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
		max-width: 1200px;
		margin: 0 auto;
		padding: 2.5rem;
		transition: all 0.3s ease;
	}

	.patients-header {
		text-align: center;
		margin-bottom: 3rem;
	}

	.patients-icon {
		font-size: 4rem;
		color: #667eea;
		margin-bottom: 1rem;
		filter: drop-shadow(0 4px 8px rgba(102, 126, 234, 0.3));
	}

	.patients-title {
		font-size: 2.5rem;
		font-weight: 700;
		color: #2d3748;
		margin-bottom: 0.5rem;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
	}

	.patients-subtitle {
		color: #718096;
		font-size: 1.1rem;
		margin: 0;
	}

	.patients-empty {
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
	.patients-mobile-view {
		display: block;
	}

	.patient-card-mobile {
		background: #fff;
		border-radius: 1.5rem;
		box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
		margin-bottom: 1.5rem;
		padding: 1.5rem;
		border: 1px solid rgba(102, 126, 234, 0.1);
		transition: all 0.3s ease;
	}

	.patient-card-mobile:hover {
		transform: translateY(-2px);
		box-shadow: 0 12px 35px rgba(0, 0, 0, 0.12);
	}

	.patient-card-header {
		display: flex;
		justify-content: between;
		align-items: flex-start;
		margin-bottom: 1rem;
	}

	.patient-info {
		flex: 1;
	}

	.patient-name {
		font-size: 1.3rem;
		font-weight: 600;
		color: #2d3748;
		margin-bottom: 0.5rem;
	}

	.patient-number {
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		color: white;
		padding: 0.3rem 0.8rem;
		border-radius: 1rem;
		font-size: 0.9rem;
		font-weight: 600;
	}

	.patient-status {
		display: inline-flex;
		align-items: center;
		gap: 0.3rem;
		padding: 0.4rem 0.8rem;
		border-radius: 1rem;
		font-size: 0.85rem;
		font-weight: 500;
	}

	.status-active {
		background: rgba(34, 197, 94, 0.15);
		color: #16a34a;
	}

	.status-inactive {
		background: rgba(100, 116, 139, 0.15);
		color: #64748b;
	}

	.patient-details {
		margin-bottom: 1.5rem;
	}

	.detail-item {
		display: flex;
		align-items: center;
		gap: 0.8rem;
		margin-bottom: 0.8rem;
		color: #4a5568;
	}

	.detail-icon {
		color: #667eea;
		font-size: 1rem;
		width: 16px;
	}

	.patient-actions {
		display: flex;
		gap: 0.8rem;
		flex-wrap: wrap;
	}

	.action-btn {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.7rem 1rem;
		border: none;
		border-radius: 0.8rem;
		font-size: 0.9rem;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.2s ease;
		flex: 1;
		justify-content: center;
		min-width: 0;
	}

	.btn-history {
		background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
		color: white;
	}

	.btn-edit {
		background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
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
	.patients-desktop-view {
		display: none;
	}

	.table-wrapper {
		background: #fff;
		border-radius: 1.5rem;
		overflow: hidden;
		box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
	}

	.patients-table {
		width: 100%;
		border-collapse: collapse;
	}

	.patients-table th {
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		color: white;
		padding: 1.5rem 1.2rem;
		font-weight: 600;
		font-size: 1rem;
		text-align: left;
	}

	.patients-table td {
		padding: 1.5rem 1.2rem;
		border-bottom: 1px solid #e2e8f0;
		vertical-align: middle;
	}

	.table-row:hover {
		background: rgba(102, 126, 234, 0.05);
	}

	.patient-number-desktop {
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		color: white;
		padding: 0.5rem 0.8rem;
		border-radius: 1rem;
		font-weight: 600;
		display: inline-block;
		min-width: 50px;
		text-align: center;
	}

	.patient-name-cell {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.patient-avatar {
		width: 45px;
		height: 45px;
		border-radius: 50%;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		display: flex;
		align-items: center;
		justify-content: center;
		color: white;
		font-weight: 600;
		font-size: 1.2rem;
	}

	.name-text {
		font-weight: 600;
		color: #2d3748;
	}

	.contact-info {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.contact-item {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		color: #4a5568;
	}

	.contact-icon {
		color: #667eea;
		width: 16px;
	}

	.status-badge {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.6rem 1.2rem;
		border-radius: 1rem;
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
		max-height: 80vh;
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

	.no-history {
		text-align: center;
		color: #718096;
		padding: 2rem;
	}

	.no-history i {
		font-size: 3rem;
		margin-bottom: 1rem;
		opacity: 0.6;
	}

	.history-timeline {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.history-item {
		background: rgba(102, 126, 234, 0.05);
		padding: 1.5rem;
		border-radius: 1rem;
		border-left: 4px solid #667eea;
	}

	.history-date {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-weight: 600;
		color: #667eea;
		margin-bottom: 0.8rem;
		font-size: 0.9rem;
	}

	.history-details {
		color: #4a5568;
		line-height: 1.6;
	}

	.modal-footer {
		padding: 1rem 2rem 2rem;
		border-top: 1px solid #e2e8f0;
	}

	.modal-close-btn {
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		color: white;
		border: none;
		padding: 0.8rem 2rem;
		border-radius: 0.8rem;
		font-weight: 600;
		cursor: pointer;
		width: 100%;
		transition: all 0.2s ease;
	}

	.modal-close-btn:hover {
		transform: translateY(-1px);
		box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
	}

	/* Responsive Design */
	@media (min-width: 768px) {
		.patients-container {
			padding: 3rem 2rem;
		}

		.patients-card {
			padding: 3rem;
		}

		.action-btn {
			flex: none;
			min-width: 100px;
		}
	}

	@media (min-width: 992px) {
		.patients-mobile-view {
			display: none;
		}

		.patients-desktop-view {
			display: block;
		}

		.modal-backdrop {
			padding: 2rem;
		}
	}

	@media (min-width: 1200px) {
		.patients-title {
			font-size: 3rem;
		}

		.patients-icon {
			font-size: 5rem;
		}
	}
</style>
