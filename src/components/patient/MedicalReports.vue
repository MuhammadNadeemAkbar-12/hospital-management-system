<template>
	<div class="medicalreports-bg">
		<div class="medicalreports-card">
			<div class="medicalreports-header">
				<i class="bi bi-file-earmark-medical"></i>
				<span>My Medical Reports</span>
			</div>
			<div class="medicalreports-body">
				<!-- Upload Form -->
				<form @submit.prevent="uploadReport" class="medicalreports-form">
					<div class="medicalreports-form-row">
						<div class="medicalreports-form-group">
							<label for="reportTitle">Report Title</label>
							<input
								type="text"
								id="reportTitle"
								v-model="newReport.title"
								placeholder="e.g. Blood Test Results"
								required />
						</div>
						<div class="medicalreports-form-group">
							<label for="reportFile">Upload Document (PDF/Image)</label>
							<input
								type="file"
								id="reportFile"
								ref="fileInput"
								@change="handleFile"
								accept=".pdf,.jpg,.jpeg,.png"
								required />
							<div class="medicalreports-form-text">Max file size: 5MB</div>
						</div>
						<div class="medicalreports-form-actions">
							<button
								type="submit"
								class="medicalreports-btn medicalreports-btn-primary"
								:disabled="isUploading">
								<span v-if="isUploading">
									<span class="medicalreports-spinner"></span>
									Uploading...
								</span>
								<span v-else>Upload Report</span>
							</button>
						</div>
					</div>
					<div
						v-if="uploadError"
						class="medicalreports-alert medicalreports-alert-danger">
						<i class="bi bi-exclamation-circle-fill"></i> {{ uploadError }}
					</div>
					<div
						v-if="uploadSuccess"
						class="medicalreports-alert medicalreports-alert-success">
						<i class="bi bi-check-circle-fill"></i> {{ uploadSuccess }}
					</div>
				</form>
				<!-- Reports Table -->
				<div class="medicalreports-table-section">
					<div v-if="isLoading" class="medicalreports-loading">
						<span class="medicalreports-spinner"></span>
					</div>
					<div
						v-else-if="reports.length === 0"
						class="medicalreports-alert medicalreports-alert-info">
						<i class="bi bi-info-circle-fill"></i> No medical reports found.
					</div>
					<div v-else class="medicalreports-table-wrapper">
						<div class="table-responsive">
							<table class="medicalreports-table">
								<thead>
									<tr>
										<th>#</th>
										<th>Title</th>
										<th>Date</th>
										<th>Type</th>
										<th>Actions</th>
									</tr>
								</thead>
								<tbody>
									<tr v-for="(report, idx) in reports" :key="report.id">
										<td>{{ idx + 1 }}</td>
										<td class="td-title">{{ report.title }}</td>
										<td>{{ formatDate(report.date) }}</td>
										<td>
											<span
												class="medicalreports-badge"
												:class="getFileTypeClass(report.type)">
												{{ report.type }}
											</span>
										</td>
										<td>
											<button
												@click="downloadReport(report)"
												class="medicalreports-btn medicalreports-btn-outline">
												<i class="bi bi-download"></i>
											</button>
											<button
												@click="openDeleteModal(report.id)"
												class="medicalreports-btn medicalreports-btn-danger">
												<i class="bi bi-trash"></i>
											</button>
										</td>
									</tr>
								</tbody>
							</table>
						</div>
					</div>
				</div>
			</div>
		</div>
		<!-- Custom Modal -->
		<div v-if="showDeleteModal" class="medicalreports-modal-backdrop">
			<div class="medicalreports-modal">
				<h5>Confirm Delete</h5>
				<p>Are you sure you want to delete this report?</p>
				<button
					@click="deleteReport"
					class="medicalreports-btn medicalreports-btn-danger"
					:disabled="isDeleting">
					<span v-if="isDeleting">Deleting...</span>
					<span v-else>Delete</span>
				</button>
				<button
					@click="showDeleteModal = false"
					class="medicalreports-btn medicalreports-btn-secondary">
					Cancel
				</button>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		name: "MedicalReports",
		data() {
			return {
				reports: [],
				newReport: {
					title: "",
					file: null,
				},
				isLoading: false,
				isUploading: false,
				isDeleting: false,
				uploadError: "",
				uploadSuccess: "",
				error: "",
				selectedReportId: null,
				showDeleteModal: false,
			};
		},
		created() {
			this.fetchReports();
		},
		methods: {
			async fetchReports() {
				this.isLoading = true;
				this.error = "";
				try {
					// Dummy data for demo
					this.reports = [
						{
							id: 1,
							title: "Complete Blood Count",
							date: "2025-07-01",
							url: "#",
							type: "PDF",
						},
						{
							id: 2,
							title: "Chest X-Ray",
							date: "2025-06-15",
							url: "#",
							type: "Image",
						},
						{
							id: 3,
							title: "MRI Scan Results",
							date: "2025-05-20",
							url: "#",
							type: "PDF",
						},
					];
				} catch (err) {
					this.error =
						"Failed to load medical reports. Please try again later.";
					console.error("Error fetching reports:", err);
				} finally {
					this.isLoading = false;
				}
			},
			handleFile(event) {
				const file = event.target.files[0];
				if (file) {
					if (file.size > 5 * 1024 * 1024) {
						this.uploadError = "File size exceeds 5MB limit.";
						this.$refs.fileInput.value = "";
						return;
					}
					this.newReport.file = file;
				}
			},
			async uploadReport() {
				this.uploadError = "";
				this.uploadSuccess = "";

				if (!this.newReport.title || !this.newReport.file) {
					this.uploadError = "Please provide both a title and a file.";
					return;
				}

				this.isUploading = true;

				try {
					const newReport = {
						id: this.reports.length + 1,
						title: this.newReport.title,
						date: new Date().toISOString().split("T")[0],
						url: "#",
						type: this.newReport.file.type.includes("image") ? "Image" : "PDF",
					};

					this.reports.unshift(newReport);
					this.uploadSuccess = "Report uploaded successfully!";
					this.newReport = { title: "", file: null };
					this.$refs.fileInput.value = "";
				} catch (err) {
					this.uploadError =
						err.response?.data?.message ||
						"Failed to upload report. Please try again.";
					console.error("Error uploading report:", err);
				} finally {
					this.isUploading = false;
				}
			},
			downloadReport(report) {
				if (report.url && report.url !== "#") {
					window.open(report.url, "_blank");
				} else {
					alert("No file available for download.");
				}
			},
			openDeleteModal(reportId) {
				this.selectedReportId = reportId;
				this.showDeleteModal = true;
			},
			async deleteReport() {
				this.isDeleting = true;
				try {
					this.reports = this.reports.filter(
						(r) => r.id !== this.selectedReportId
					);
					this.showDeleteModal = false;
				} catch (err) {
					console.error("Error deleting report:", err);
					alert("Failed to delete report. Please try again.");
				} finally {
					this.isDeleting = false;
				}
			},
			formatDate(dateString) {
				const options = { year: "numeric", month: "short", day: "numeric" };
				return new Date(dateString).toLocaleDateString(undefined, options);
			},
			getFileTypeClass(type) {
				return {
					"medicalreports-badge-pdf": type === "PDF",
					"medicalreports-badge-img": type === "Image",
					"medicalreports-badge-other": type === "Other",
				};
			},
		},
	};
</script>

<style scoped>
	@import url("https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css");

	.medicalreports-bg {
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

	.medicalreports-card {
		background: #fff;
		border-radius: 1.2rem;
		box-shadow: 0 8px 32px rgba(30, 58, 138, 0.13);
		padding: 0;
		width: 100%;
		margin: 0;
		min-height: 100vh;
		display: flex;
		flex-direction: column;
	}

	.medicalreports-header {
		background: linear-gradient(90deg, #2563eb 0%, #38bdf8 100%);
		color: #fff;
		border-radius: 1rem 1rem 0 0;
		padding: 0.8rem 1rem;
		font-size: 1.2rem;
		font-weight: 700;
		display: flex;
		align-items: center;
		gap: 0.5rem;
		margin-bottom: 0;
		box-shadow: 0 2px 8px rgba(30, 58, 138, 0.09);
		letter-spacing: 0.5px;
	}

	.medicalreports-body {
		background: #f8fafc;
		border-radius: 0 0 1.2rem 1.2rem;
		padding: 1rem;
		flex: 1;
		min-height: calc(100vh - 60px);
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
	}

	.medicalreports-form {
		margin-bottom: 1rem;
	}
	.medicalreports-form-row {
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;
	}
	.medicalreports-form-group {
		flex: 1 1 200px;
		display: flex;
		flex-direction: column;
		min-width: 0;
	}
	.medicalreports-form-group label {
		font-weight: 600;
		margin-bottom: 0.3rem;
		font-size: 0.9rem;
	}
	.medicalreports-form-group input[type="text"],
	.medicalreports-form-group input[type="file"] {
		font-size: 0.9rem;
		padding: 0.5rem;
		border-radius: 0.5rem;
		border: 1px solid #bae6fd;
		margin-bottom: 0.2rem;
		width: 100%;
		box-sizing: border-box;
	}
	.medicalreports-form-text {
		font-size: 0.8rem;
		color: #64748b;
		margin-top: 0.2rem;
	}
	.medicalreports-form-actions {
		display: flex;
		align-items: flex-end;
	}
	.medicalreports-btn {
		border-radius: 0.5rem;
		font-size: 0.9rem;
		font-weight: 600;
		padding: 0.5rem 1rem;
		border: none;
		cursor: pointer;
		margin-right: 0.5rem;
		display: inline-flex;
		align-items: center;
		gap: 0.3rem;
		box-shadow: 0 1px 4px rgba(30, 58, 138, 0.07);
		transition: background 0.2s, color 0.2s;
	}
	.medicalreports-btn-primary {
		background: linear-gradient(90deg, #2563eb 0%, #38bdf8 100%);
		color: #fff;
	}
	.medicalreports-btn-primary:disabled {
		opacity: 0.7;
		cursor: not-allowed;
	}
	.medicalreports-btn-outline {
		background: #e0e7ff;
		color: #2563eb;
	}
	.medicalreports-btn-outline:hover {
		background: #bae6fd;
		color: #2563eb;
	}
	.medicalreports-btn-danger {
		background: #f87171;
		color: #fff;
	}
	.medicalreports-btn-danger:hover {
		background: #ef4444;
	}
	.medicalreports-btn-secondary {
		background: #64748b;
		color: #fff;
	}
	.medicalreports-btn-secondary:hover {
		background: #2563eb;
	}

	.medicalreports-spinner {
		display: inline-block;
		width: 1em;
		height: 1em;
		border: 2px solid #38bdf8;
		border-top: 2px solid #2563eb;
		border-radius: 50%;
		animation: medicalreports-spin 0.7s linear infinite;
		margin-right: 0.5em;
		vertical-align: middle;
	}
	@keyframes medicalreports-spin {
		to {
			transform: rotate(360deg);
		}
	}

	.medicalreports-alert {
		border-radius: 0.5rem;
		font-size: 0.9rem;
		font-weight: 600;
		padding: 0.8rem 1rem;
		margin-bottom: 1rem;
		border: none;
		text-align: center;
		box-shadow: 0 1px 4px rgba(30, 58, 138, 0.07);
		display: flex;
		align-items: center;
		gap: 0.5rem;
		justify-content: center;
	}
	.medicalreports-alert-danger {
		background: #fee2e2;
		color: #b91c1c;
	}
	.medicalreports-alert-success {
		background: #f0fdf4;
		color: #10b981;
	}
	.medicalreports-alert-info {
		background: #e0f2fe;
		color: #2563eb;
	}

	.medicalreports-table-section {
		margin-top: 1rem;
		flex-grow: 1;
	}

	.medicalreports-table-wrapper {
		overflow-x: auto;
		width: 100%;
	}
	.table-responsive {
		width: 100%;
		overflow-x: auto;
	}
	.medicalreports-table {
		width: 100%;
		border-collapse: separate;
		border-spacing: 0;
		background: #fff;
		border-radius: 0.5rem;
		box-shadow: 0 1px 6px rgba(30, 58, 138, 0.09);
		margin-bottom: 1rem;
		table-layout: auto;
	}
	.medicalreports-table th,
	.medicalreports-table td {
		vertical-align: middle;
		padding: 0.8rem;
		font-size: 0.9rem;
		text-align: left;
		word-break: break-word;
	}
	.medicalreports-table th {
		background: #e0e7ff;
		color: #2563eb;
		font-weight: 700;
		border-bottom: 2px solid #bae6fd;
		letter-spacing: 0.1px;
	}
	.medicalreports-table tr:not(:last-child) td {
		border-bottom: 1px solid #bae6fd;
	}
	.medicalreports-table tbody tr:hover {
		background: #e0f2fe;
		transition: background 0.2s;
	}
	.td-title {
		max-width: 200px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.medicalreports-badge {
		font-size: 0.8rem;
		padding: 0.3em 0.6em;
		border-radius: 0.5em;
		font-weight: 600;
		color: #fff;
		display: inline-block;
	}
	.medicalreports-badge-pdf {
		background: #2563eb;
	}
	.medicalreports-badge-img {
		background: #10b981;
	}
	.medicalreports-badge-other {
		background: #64748b;
	}

	.medicalreports-modal-backdrop {
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
	.medicalreports-modal {
		background: #fff;
		padding: 1.5rem;
		border-radius: 0.5rem;
		box-shadow: 0 8px 32px rgba(30, 58, 138, 0.13);
		min-width: 300px;
		max-width: 90%;
		word-break: break-word;
	}
	.medicalreports-modal h5 {
		margin-top: 0;
		margin-bottom: 1rem;
	}
	.medicalreports-modal p {
		margin-bottom: 1.5rem;
	}
	.medicalreports-modal button {
		margin-right: 0.5rem;
	}

	@media (max-width: 768px) {
		.medicalreports-card {
			border-radius: 0;
		}
		.medicalreports-header {
			border-radius: 0;
		}
		.medicalreports-body {
			padding: 0.8rem;
		}
		.medicalreports-form-group {
			flex: 1 1 100%;
		}
		.medicalreports-table th,
		.medicalreports-table td {
			padding: 0.5rem;
			font-size: 0.8rem;
		}
		.medicalreports-btn {
			padding: 0.4rem 0.8rem;
			font-size: 0.8rem;
		}
	}
</style>