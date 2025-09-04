<template>
	<div class="ba-container">
		<div class="ba-card">
			<div class="ba-header">
				<i class="bi bi-calendar-plus ba-icon"></i>
				<h2>Appointments</h2>
				<p class="ba-subtitle">View and update appointment status.</p>
			</div>
			<div class="ba-actions">
				<input
					v-model="search"
					class="ba-search"
					type="text"
					placeholder="Search by patient or doctor..." />
			</div>
			<div class="ba-table-wrapper">
				<h3 class="ba-section-title">Appointment Requests</h3>
				<table class="ba-table">
					<thead>
						<tr>
							<th>ID</th>
							<th>Patient</th>
							<th>Doctor</th>
							<th>Date</th>
							<th>Time Slot</th>
							<th>Status</th>
							<th>Actions</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="app in filteredAppointments" :key="app.id">
							<td>{{ app.id }}</td>
							<td>{{ app.patient_name || app.patient }}</td>
							<td>{{ app.doctor_name || app.doctor }}</td>
							<td>{{ app.date }}</td>
							<td>{{ app.slot }}</td>
							<td>
								<span :class="['ba-badge-status', app.status]">{{
									app.status
								}}</span>
							</td>
							<td>
								<button
									v-if="app.status === 'Pending'"
									class="ba-action-btn"
									@click="updateStatus(app, 'Approved')"
									title="Approve">
									<i class="bi bi-check2-circle"></i>
								</button>
								<button
									v-if="app.status === 'Pending'"
									class="ba-action-btn ba-action-btn-reject"
									@click="updateStatus(app, 'Rejected')"
									title="Reject">
									<i class="bi bi-x-circle"></i>
								</button>
								<button
									class="ba-action-btn"
									@click="viewStatus(app)"
									title="View Status">
									<i class="bi bi-info-circle"></i>
								</button>
							</td>
						</tr>
						<tr v-if="filteredAppointments.length === 0">
							<td colspan="7" class="ba-empty-row">No appointments found.</td>
						</tr>
					</tbody>
				</table>
			</div>
			<!-- Status Modal -->
			<div v-if="showStatusModal" class="ba-modal-backdrop">
				<div class="ba-modal">
					<h3>Appointment Status</h3>
					<div class="ba-status-details">
						<p><strong>ID:</strong> {{ statusTarget.id }}</p>
						<p>
							<strong>Patient:</strong>
							{{ statusTarget.patient_name || statusTarget.patient }}
						</p>
						<p>
							<strong>Doctor:</strong>
							{{ statusTarget.doctor_name || statusTarget.doctor }}
						</p>
						<p><strong>Date:</strong> {{ statusTarget.date }}</p>
						<p><strong>Time Slot:</strong> {{ statusTarget.slot }}</p>
						<p>
							<strong>Status:</strong>
							<span :class="['ba-badge-status', statusTarget.status]">{{
								statusTarget.status
							}}</span>
						</p>
					</div>
					<div class="ba-modal-actions">
						<button
							class="ba-btn ba-btn-cancel"
							type="button"
							@click="showStatusModal = false">
							Close
						</button>
					</div>
				</div>
			</div>
			<div v-if="showToast" class="ba-toast">
				<i class="bi bi-check-circle"></i> {{ toastMsg }}
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: "AppointmentApprove",
	data() {
		return {
			appointments: [
				{
					id: 1,
					patient_name: "Ahmed Ali",
					doctor_name: "Dr. Sarah Khan",
					date: "2025-01-15",
					slot: "10:00 AM - 11:00 AM",
					status: "Pending"
				},
				{
					id: 2,
					patient_name: "Fatima Sheikh",
					doctor_name: "Dr. Muhammad Hassan",
					date: "2025-01-16",
					slot: "02:00 PM - 03:00 PM",
					status: "Approved"
				},
				{
					id: 3,
					patient_name: "Hassan Ahmed",
					doctor_name: "Dr. Ayesha Malik",
					date: "2025-01-17",
					slot: "09:00 AM - 10:00 AM",
					status: "Pending"
				},
				{
					id: 4,
					patient_name: "Zainab Qureshi",
					doctor_name: "Dr. Omar Farid",
					date: "2025-01-18",
					slot: "11:00 AM - 12:00 PM",
					status: "Rejected"
				},
				{
					id: 5,
					patient_name: "Ali Raza",
					doctor_name: "Dr. Maryam Siddiqui",
					date: "2025-01-19",
					slot: "03:00 PM - 04:00 PM",
					status: "Pending"
				},
				{
					id: 6,
					patient_name: "Sana Tariq",
					doctor_name: "Dr. Imran Shah",
					date: "2025-01-20",
					slot: "01:00 PM - 02:00 PM",
					status: "Approved"
				},
				{
					id: 7,
					patient_name: "Usman Khan",
					doctor_name: "Dr. Hina Abbas",
					date: "2025-01-21",
					slot: "04:00 PM - 05:00 PM",
					status: "Pending"
				},
				{
					id: 8,
					patient_name: "Rabia Noor",
					doctor_name: "Dr. Bilal Ahmed",
					date: "2025-01-22",
					slot: "08:00 AM - 09:00 AM",
					status: "Approved"
				}
			],
			search: "",
			showStatusModal: false,
			statusTarget: {},
			showToast: false,
			toastMsg: "",
		};
	},
	computed: {
		filteredAppointments() {
			if (!this.search) return this.appointments;
			const s = this.search.toLowerCase();
			return this.appointments.filter(
				(a) =>
					(a.patient_name || a.patient).toLowerCase().includes(s) ||
					(a.doctor_name || a.doctor).toLowerCase().includes(s)
			);
		},
	},
	methods: {
		updateStatus(app, status) {
			// Simulate API call delay
			setTimeout(() => {
				// Find the appointment in the array and update its status
				const index = this.appointments.findIndex(a => a.id === app.id);
				if (index !== -1) {
					this.appointments[index].status = status;
					this.showToastMsg(`Appointment ${status.toLowerCase()}!`);
				}
			}, 500);
		},
		viewStatus(app) {
			this.statusTarget = app;
			this.showStatusModal = true;
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

.ba-container {
	min-height: 100vh;
	display: flex;
	align-items: flex-start;
	justify-content: center;
	padding: 2rem 0;
}

.ba-card {
	background: #fff;
	border-radius: 1.5rem;
	box-shadow: 0 8px 32px rgba(30, 58, 138, 0.13);
	padding: 2.5rem 2.2rem;
	max-width: 1100px;
	width: 100%;
	margin: 0 auto;
}

.ba-header {
	text-align: center;
	margin-bottom: 2rem;
}

.ba-icon {
	font-size: 3rem;
	color: #0ea5e9;
	margin-bottom: 0.5rem;
}

.ba-header h2 {
	font-size: 2rem;
	font-weight: 700;
	color: #0ea5e9;
	margin-bottom: 0.3rem;
}

.ba-subtitle {
	color: #64748b;
	font-size: 1rem;
	margin-bottom: 0;
}

.ba-actions {
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-bottom: 1.5rem;
	gap: 1rem;
}

.ba-btn {
	background: linear-gradient(90deg, #0ea5e9 0%, #38bdf8 100%);
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

.ba-btn-cancel {
	background: #64748b;
}

.ba-btn:hover {
	box-shadow: 0 4px 16px rgba(30, 58, 138, 0.13);
}

.ba-search {
	border-radius: 0.7rem;
	border: 1px solid #cbd5e1;
	padding: 0.7rem 1rem;
	font-size: 1rem;
	background: #f8fafc;
	width: 260px;
	box-shadow: 0 1px 4px rgba(30, 58, 138, 0.04);
	transition: border-color 0.2s, box-shadow 0.2s;
}

.ba-search:focus {
	border-color: #0ea5e9;
	outline: none;
	box-shadow: 0 2px 8px rgba(14, 165, 233, 0.09);
}

.ba-table-wrapper {
	overflow-x: auto;
	margin-bottom: 2rem;
}

.ba-section-title {
	color: #0ea5e9;
	font-size: 1.2rem;
	font-weight: 600;
	margin-bottom: 0.7rem;
}

.ba-table {
	width: 100%;
	border-collapse: separate;
	border-spacing: 0;
	background: #fff;
	border-radius: 1rem;
	box-shadow: 0 2px 8px rgba(30, 58, 138, 0.05);
	margin-bottom: 1rem;
}

.ba-table th,
.ba-table td {
	padding: 1rem 0.7rem;
	text-align: left;
	font-size: 1rem;
	vertical-align: middle;
}

.ba-table th {
	background: #bae6fd;
	color: #0ea5e9;
	font-weight: 600;
	border-bottom: 2px solid #38bdf8;
}

.ba-table tr:not(:last-child) td {
	border-bottom: 1px solid #bae6fd;
}

.ba-badge-status {
	border-radius: 0.6rem;
	padding: 0.4rem 0.9rem;
	font-size: 0.95rem;
	font-weight: 500;
	display: inline-block;
	color: #fff;
}
.ba-badge-status.Pending {
	background: #f59e0b;
}
.ba-badge-status.Approved {
	background: #10b981;
}
.ba-badge-status.Rejected {
	background: #ef4444;
}

.ba-action-btn {
	background: #f8fafc;
	border: none;
	border-radius: 0.5rem;
	padding: 0.4rem 0.7rem;
	font-size: 1.1rem;
	color: #0ea5e9;
	cursor: pointer;
	margin-right: 0.3rem;
	transition: background 0.2s, color 0.2s;
}

.ba-action-btn-reject {
	color: #ef4444;
}

.ba-action-btn:hover {
	background: #bae6fd;
	color: #2563eb;
}

.ba-empty-row {
	text-align: center;
	color: #64748b;
	font-size: 1.05rem;
	padding: 2rem 0;
}

.ba-modal-backdrop {
	position: fixed;
	top: 0;
	left: 0;
	width: 100vw;
	height: 100vh;
	background: rgba(14, 165, 233, 0.18);
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 9999;
}

.ba-modal {
	background: #fff;
	padding: 2rem;
	border-radius: 1rem;
	box-shadow: 0 4px 18px rgba(14, 165, 233, 0.12);
	min-width: 320px;
	max-width: 95vw;
}

.ba-modal h3 {
	color: #0ea5e9;
	font-weight: 600;
	margin-bottom: 1.2rem;
}

.ba-modal-actions {
	display: flex;
	gap: 1rem;
	margin-top: 1.2rem;
}

.ba-status-details p {
	font-size: 1.05rem;
	color: #2563eb;
	margin-bottom: 0.5rem;
}

.ba-toast {
	position: fixed;
	bottom: 2.5rem;
	right: 2.5rem;
	background: linear-gradient(90deg, #0ea5e9 0%, #38bdf8 100%);
	color: #fff;
	padding: 1rem 2rem;
	border-radius: 1rem;
	font-weight: 600;
	font-size: 1.1rem;
	box-shadow: 0 4px 18px rgba(14, 165, 233, 0.12);
	display: flex;
	align-items: center;
	gap: 0.7rem;
	z-index: 99999;
}

@media (max-width: 900px) {
	.ba-card {
		padding: 1.2rem 0.5rem;
		max-width: 99vw;
	}
	.ba-modal {
		padding: 1rem;
		min-width: 220px;
	}
	.ba-table th,
	.ba-table td {
		font-size: 0.95rem;
		padding: 0.6rem 0.4rem;
	}
	.ba-toast {
		right: 1rem;
		bottom: 1rem;
		padding: 0.7rem 1.2rem;
		font-size: 1rem;
	}
}
</style>