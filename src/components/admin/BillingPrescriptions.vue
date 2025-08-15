<template>
    <div class="bp-container">
        <div class="bp-card">
            <div class="bp-header">
                <i class="bi bi-receipt bp-icon"></i>
                <h2>Billing & Prescriptions</h2>
                <p class="bp-subtitle">
                    Generate bills, create prescriptions, and export records.
                </p>
            </div>
            <div class="bp-actions">
                <button class="bp-btn" @click="showBillForm = true">
                    <i class="bi bi-file-earmark-plus"></i> New Bill
                </button>
                <button class="bp-btn" @click="showPrescriptionForm = true">
                    <i class="bi bi-file-earmark-medical"></i> New Prescription
                </button>
                <input
                    v-model="search"
                    class="bp-search"
                    type="text"
                    placeholder="Search by patient or doctor..." />
                <button class="bp-btn bp-btn-export" @click="exportExcel">
                    <i class="bi bi-file-earmark-excel"></i> Export Excel
                </button>
            </div>
            <div class="bp-table-wrapper">
                <h3 class="bp-section-title">Billing History</h3>
                <table class="bp-table">
                    <thead>
                        <tr>
                            <th>Patient</th>
                            <th>Doctor</th>
                            <th>Services</th>
                            <th>Total</th>
                            <th>Date</th>
                            <th>Download</th>
                            <th>Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="bill in filteredBills" :key="bill.id">
                            <td>{{ bill.patient }}</td>
                            <td>{{ bill.doctor }}</td>
                            <td>
                                <span
                                    v-for="srv in bill.services"
                                    :key="srv"
                                    class="bp-badge-service"
                                    >{{ srv }}</span
                                >
                            </td>
                            <td class="bp-badge-total">Rs. {{ bill.total }}</td>
                            <td>{{ bill.date }}</td>
                            <td>
                                <button class="bp-action-btn" @click="downloadBill(bill)">
                                    <i class="bi bi-download"></i>
                                </button>
                            </td>
                            <td>
                                <button
                                    class="bp-action-btn bp-action-btn-delete"
                                    @click="askDeleteBill(bill.id)">
                                    <i class="bi bi-trash"></i>
                                </button>
                            </td>
                        </tr>
                        <tr v-if="filteredBills.length === 0">
                            <td colspan="7" class="bp-empty-row">No bills found.</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="bp-table-wrapper">
                <h3 class="bp-section-title">Prescriptions</h3>
                <table class="bp-table">
                    <thead>
                        <tr>
                            <th>Patient</th>
                            <th>Doctor</th>
                            <th>Medicines</th>
                            <th>Date</th>
                            <th>Download</th>
                            <th>Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="pres in filteredPrescriptions" :key="pres.id">
                            <td>{{ pres.patient }}</td>
                            <td>{{ pres.doctor }}</td>
                            <td>
                                <span
                                    v-for="med in pres.medicines"
                                    :key="med"
                                    class="bp-badge-medicine"
                                    >{{ med }}</span
                                >
                            </td>
                            <td>{{ pres.date }}</td>
                            <td>
                                <button
                                    class="bp-action-btn"
                                    @click="downloadPrescription(pres)">
                                    <i class="bi bi-download"></i>
                                </button>
                            </td>
                            <td>
                                <button
                                    class="bp-action-btn bp-action-btn-delete"
                                    @click="askDeletePrescription(pres.id)">
                                    <i class="bi bi-trash"></i>
                                </button>
                            </td>
                        </tr>
                        <tr v-if="filteredPrescriptions.length === 0">
                            <td colspan="6" class="bp-empty-row">No prescriptions found.</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <!-- Bill Form Modal -->
            <div v-if="showBillForm" class="bp-modal-backdrop">
                <div class="bp-modal">
                    <h3>New Bill</h3>
                    <form @submit.prevent="saveBill">
                        <div class="form-group">
                            <label>Patient</label>
                            <input
                                v-model="billForm.patient"
                                type="text"
                                required
                                class="form-control" />
                        </div>
                        <div class="form-group">
                            <label>Doctor</label>
                            <input
                                v-model="billForm.doctor"
                                type="text"
                                required
                                class="form-control" />
                        </div>
                        <div class="form-group">
                            <label>Services</label>
                            <div class="bp-services">
                                <label
                                    v-for="srv in allServices"
                                    :key="srv"
                                    class="bp-service-label">
                                    <input
                                        type="checkbox"
                                        :value="srv"
                                        v-model="billForm.services" />
                                    {{ srv }}
                                </label>
                            </div>
                        </div>
                        <div class="form-group">
                            <label>Total Amount (Rs.)</label>
                            <input
                                v-model.number="billForm.total"
                                type="number"
                                min="0"
                                required
                                class="form-control" />
                        </div>
                        <div class="bp-modal-actions">
                            <button class="bp-btn" type="submit">
                                <i class="bi bi-save"></i> Save
                            </button>
                            <button
                                class="bp-btn bp-btn-cancel"
                                type="button"
                                @click="closeBillForm">
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            <!-- Prescription Form Modal -->
            <div v-if="showPrescriptionForm" class="bp-modal-backdrop">
                <div class="bp-modal">
                    <h3>New Prescription</h3>
                    <form @submit.prevent="savePrescription">
                        <div class="form-group">
                            <label>Patient</label>
                            <input
                                v-model="prescriptionForm.patient"
                                type="text"
                                required
                                class="form-control" />
                        </div>
                        <div class="form-group">
                            <label>Doctor</label>
                            <input
                                v-model="prescriptionForm.doctor"
                                type="text"
                                required
                                class="form-control" />
                        </div>
                        <div class="form-group">
                            <label>Medicines</label>
                            <input
                                v-model="prescriptionForm.medicinesInput"
                                type="text"
                                placeholder="Comma separated"
                                class="form-control" />
                            <small class="bp-help">e.g. Paracetamol, Amoxicillin</small>
                        </div>
                        <div class="bp-modal-actions">
                            <button class="bp-btn" type="submit">
                                <i class="bi bi-save"></i> Save
                            </button>
                            <button
                                class="bp-btn bp-btn-cancel"
                                type="button"
                                @click="closePrescriptionForm">
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            <!-- Delete Confirmation Modal -->
            <div v-if="showDeleteModal" class="bp-modal-backdrop">
                <div class="bp-modal" style="max-width:350px;text-align:center;">
                    <h3>Confirm Delete</h3>
                    <p>Are you sure you want to delete this {{ deleteType }}?</p>
                    <div class="bp-modal-actions" style="justify-content:center;">
                        <button class="bp-btn bp-action-btn-delete" @click="confirmDelete">
                            <i class="bi bi-trash"></i> Delete
                        </button>
                        <button class="bp-btn bp-btn-cancel" @click="cancelDelete">
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
            <!-- End Delete Modal -->
        </div>
    </div>
</template>

<script>
export default {
    name: "BillingPrescriptions",
    data() {
        return {
            bills: [
                {
                    id: 1,
                    patient: "Ali Raza",
                    doctor: "Dr. Usman",
                    services: ["Consultation", "Blood Test"],
                    total: 1200,
                    date: "2025-08-10",
                },
                {
                    id: 2,
                    patient: "Sara Khan",
                    doctor: "Dr. Sana",
                    services: ["Consultation", "X-Ray"],
                    total: 1800,
                    date: "2025-08-09",
                },
            ],
            prescriptions: [
                {
                    id: 1,
                    patient: "Ali Raza",
                    doctor: "Dr. Usman",
                    medicines: ["Paracetamol", "Ibuprofen"],
                    date: "2025-08-10",
                },
                {
                    id: 2,
                    patient: "Sara Khan",
                    doctor: "Dr. Sana",
                    medicines: ["Amoxicillin"],
                    date: "2025-08-09",
                },
            ],
            search: "",
            showBillForm: false,
            showPrescriptionForm: false,
            billForm: {
                patient: "",
                doctor: "",
                services: [],
                total: 0,
            },
            prescriptionForm: {
                patient: "",
                doctor: "",
                medicinesInput: "",
            },
            allServices: ["Consultation", "Blood Test", "X-Ray", "MRI", "Medicine"],
            // Delete modal state
            showDeleteModal: false,
            deleteType: null, // "bill" or "prescription"
            deleteId: null,
        };
    },
    computed: {
        filteredBills() {
            if (!this.search) return this.bills;
            const s = this.search.toLowerCase();
            return this.bills.filter(
                (b) =>
                    b.patient.toLowerCase().includes(s) ||
                    b.doctor.toLowerCase().includes(s)
            );
        },
        filteredPrescriptions() {
            if (!this.search) return this.prescriptions;
            const s = this.search.toLowerCase();
            return this.prescriptions.filter(
                (p) =>
                    p.patient.toLowerCase().includes(s) ||
                    p.doctor.toLowerCase().includes(s)
            );
        },
    },
    methods: {
        saveBill() {
            this.bills.push({
                id: Date.now(),
                patient: this.billForm.patient,
                doctor: this.billForm.doctor,
                services: [...this.billForm.services],
                total: this.billForm.total,
                date: new Date().toISOString().slice(0, 10),
            });
            this.closeBillForm();
        },
        closeBillForm() {
            this.showBillForm = false;
            this.billForm = {
                patient: "",
                doctor: "",
                services: [],
                total: 0,
            };
        },
        savePrescription() {
            const meds = this.prescriptionForm.medicinesInput
                .split(",")
                .map((m) => m.trim())
                .filter((m) => m);
            this.prescriptions.push({
                id: Date.now(),
                patient: this.prescriptionForm.patient,
                doctor: this.prescriptionForm.doctor,
                medicines: meds,
                date: new Date().toISOString().slice(0, 10),
            });
            this.closePrescriptionForm();
        },
        closePrescriptionForm() {
            this.showPrescriptionForm = false;
            this.prescriptionForm = {
                patient: "",
                doctor: "",
                medicinesInput: "",
            };
        },
        downloadBill(bill) {
            alert(`Download Bill for ${bill.patient} (Demo)`);
        },
        downloadPrescription(pres) {
            alert(`Download Prescription for ${pres.patient} (Demo)`);
        },
        exportExcel() {
            alert("Excel export coming soon!");
        },
        // Modal-based delete logic
        askDeleteBill(id) {
            this.deleteType = "bill";
            this.deleteId = id;
            this.showDeleteModal = true;
        },
        askDeletePrescription(id) {
            this.deleteType = "prescription";
            this.deleteId = id;
            this.showDeleteModal = true;
        },
        confirmDelete() {
            if (this.deleteType === "bill") {
                this.bills = this.bills.filter((b) => b.id !== this.deleteId);
            } else if (this.deleteType === "prescription") {
                this.prescriptions = this.prescriptions.filter((p) => p.id !== this.deleteId);
            }
            this.showDeleteModal = false;
            this.deleteType = null;
            this.deleteId = null;
        },
        cancelDelete() {
            this.showDeleteModal = false;
            this.deleteType = null;
            this.deleteId = null;
        },
    },
};
</script>

<style scoped>
@import url("https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css");

.bp-container {
    min-height: 100vh;
    background: linear-gradient(135deg, #e0f2fe 0%, #f8fafc 100%);
    display: flex;
    align-items: flex-start;
    justify-content: center;
    padding: 2rem;
    box-sizing: border-box;
    width: 100%;
}

.bp-card {
    background: #fff;
    border-radius: 1.5rem;
    box-shadow: 0 8px 32px rgba(30, 58, 138, 0.13);
    padding: 2.5rem 2.2rem;
    width: 100%;
    max-width: 1400px;
    margin: 0 auto;
}

.bp-header {
    text-align: center;
    margin-bottom: 2rem;
}

.bp-icon {
    font-size: 3rem;
    color: #6366f1;
    margin-bottom: 0.5rem;
}

.bp-header h2 {
    font-size: 2rem;
    font-weight: 700;
    color: #6366f1;
    margin-bottom: 0.3rem;
}

.bp-subtitle {
    color: #64748b;
    font-size: 1rem;
    margin-bottom: 0;
}

.bp-actions {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1.5rem;
    gap: 1rem;
    flex-wrap: wrap;
}

.bp-btn {
    background: linear-gradient(90deg, #6366f1 0%, #38bdf8 100%);
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
    white-space: nowrap;
}

.bp-btn-export {
    background: linear-gradient(90deg, #38bdf8 0%, #6366f1 100%);
}

.bp-btn-cancel {
    background: #64748b;
}

.bp-btn:hover {
    background: linear-gradient(90deg, #38bdf8 0%, #6366f1 100%);
    box-shadow: 0 4px 16px rgba(30, 58, 138, 0.13);
}

.bp-search {
    border-radius: 0.7rem;
    border: 1px solid #cbd5e1;
    padding: 0.7rem 1rem;
    font-size: 1rem;
    background: #f8fafc;
    width: 260px;
    box-shadow: 0 1px 4px rgba(30, 58, 138, 0.04);
    transition: border-color 0.2s, box-shadow 0.2s;
    flex-grow: 1;
}

.bp-search:focus {
    border-color: #6366f1;
    outline: none;
    box-shadow: 0 2px 8px rgba(99, 102, 241, 0.09);
}

.bp-table-wrapper {
    overflow-x: auto;
    margin-bottom: 2rem;
    width: 100%;
}

.bp-section-title {
    color: #6366f1;
    font-size: 1.2rem;
    font-weight: 600;
    margin-bottom: 0.7rem;
}

.bp-table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0;
    background: #fff;
    border-radius: 1rem;
    box-shadow: 0 2px 8px rgba(30, 58, 138, 0.05);
    margin-bottom: 1rem;
}

.bp-table th,
.bp-table td {
    padding: 1rem 0.7rem;
    text-align: left;
    font-size: 1rem;
    vertical-align: middle;
}

.bp-table th {
    background: #e0e7ff;
    color: #6366f1;
    font-weight: 600;
    border-bottom: 2px solid #bae6fd;
}

.bp-table tr:not(:last-child) td {
    border-bottom: 1px solid #e0e7ff;
}

.bp-badge-service {
    background: #e0f2fe;
    color: #2563eb;
    border-radius: 0.5rem;
    padding: 0.3rem 0.7rem;
    font-size: 0.9rem;
    font-weight: 500;
    margin-right: 0.3rem;
    margin-bottom: 0.2rem;
    display: inline-block;
}

.bp-badge-medicine {
    background: #fef9c3;
    color: #f59e0b;
    border-radius: 0.5rem;
    padding: 0.3rem 0.7rem;
    font-size: 0.9rem;
    font-weight: 500;
    margin-right: 0.3rem;
    margin-bottom: 0.2rem;
    display: inline-block;
}

.bp-badge-total {
    background: #6366f1;
    color: #fff;
    border-radius: 0.6rem;
    padding: 0.4rem 0.9rem;
    font-size: 0.95rem;
    font-weight: 500;
    display: inline-block;
}

.bp-action-btn {
    background: #f8fafc;
    border: none;
    border-radius: 0.5rem;
    padding: 0.4rem 0.7rem;
    font-size: 1.1rem;
    color: #6366f1;
    cursor: pointer;
    margin-right: 0.3rem;
    transition: background 0.2s, color 0.2s;
}

.bp-action-btn:hover {
    background: #e0e7ff;
    color: #0ea5e9;
}

.bp-action-btn-delete {
    background: #f87171;
    color: #fff;
    transition: background 0.2s, color 0.2s;
}

.bp-action-btn-delete:hover {
    background: #ef4444;
    color: #fff;
}

.bp-empty-row {
    text-align: center;
    color: #64748b;
    font-size: 1.05rem;
    padding: 2rem 0;
}

.bp-modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(99, 102, 241, 0.18);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
}

.bp-modal {
    background: #fff;
    padding: 2rem;
    border-radius: 1rem;
    box-shadow: 0 4px 18px rgba(99, 102, 241, 0.12);
    min-width: 320px;
    max-width: 95vw;
    width: 500px;
}

.bp-modal h3 {
    color: #6366f1;
    font-weight: 600;
    margin-bottom: 1.2rem;
}

.bp-modal-actions {
    display: flex;
    gap: 1rem;
    margin-top: 1.2rem;
}

.bp-services {
    display: flex;
    flex-wrap: wrap;
    gap: 0.7rem;
    margin-top: 0.3rem;
}

.bp-service-label {
    font-size: 0.98rem;
    color: #2563eb;
    background: #e0f2fe;
    border-radius: 0.5rem;
    padding: 0.3rem 0.7rem;
    cursor: pointer;
    user-select: none;
    display: flex;
    align-items: center;
    gap: 0.3rem;
}

.bp-service-label input[type="checkbox"] {
    margin-right: 0.2rem;
}

.bp-help {
    color: #64748b;
    font-size: 0.9rem;
    margin-top: 0.2rem;
    display: block;
}

@media (max-width: 768px) {
    .bp-container {
        padding: 1rem;
    }

    .bp-card {
        padding: 1.5rem 1rem;
    }

    .bp-actions {
        gap: 0.5rem;
    }

    .bp-btn {
        padding: 0.5rem 1rem;
        font-size: 0.9rem;
    }

    .bp-search {
        width: 100%;
    }

    .bp-table th,
    .bp-table td {
        font-size: 0.95rem;
        padding: 0.6rem 0.4rem;
    }

    .bp-modal {
        padding: 1rem;
        min-width: 220px;
    }
}
</style>
