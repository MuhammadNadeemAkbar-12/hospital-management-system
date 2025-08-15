<template>
    <div class="patients-wrapper">
        <h2 class="mb-4 text-primary fw-bold">
            <i class="bi bi-people me-2"></i> All Patients
        </h2>
        <div v-if="patients.length === 0" class="alert alert-info text-center">
            No patients found.
        </div>
        <div v-else>
            <table class="table table-hover align-middle rounded shadow-sm">
                <thead class="table-light">
                    <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(patient, idx) in patients" :key="patient.id">
                        <td>{{ idx + 1 }}</td>
                        <td>{{ patient.name }}</td>
                        <td>{{ patient.email }}</td>
                        <td>{{ patient.phone }}</td>
                        <td>
                            <span :class="['badge', patient.active ? 'badge-success' : 'badge-secondary']">
                                {{ patient.active ? 'Active' : 'Inactive' }}
                            </span>
                        </td>
                        <td>
                            <button class="btn btn-info btn-sm me-2" @click="viewMedicalHistory(patient)">
                                <i class="bi bi-file-earmark-medical"></i> History
                            </button>
                            <button class="btn btn-warning btn-sm me-2" @click="editPatient(patient)">
                                <i class="bi bi-pencil"></i> Edit
                            </button>
                            <button class="btn btn-danger btn-sm" @click="softDelete(patient)">
                                <i class="bi bi-trash"></i> Delete
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Medical History Modal -->
        <div v-if="showHistoryModal" class="modal-backdrop" @click.self="showHistoryModal = false">
            <div class="modal-content-custom">
                <h4 class="mb-3 text-primary">
                    <i class="bi bi-file-earmark-medical me-2"></i> Medical History
                </h4>
                <ul class="list-group mb-3">
                    <li v-for="(record, idx) in modalHistory" :key="idx" class="list-group-item">
                        <strong>{{ record.date }}:</strong> {{ record.details }}
                    </li>
                </ul>
                <button class="btn btn-secondary w-100" @click="showHistoryModal = false">Close</button>
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
                    ],
                },
                {
                    id: 3,
                    name: "Ahmed Ali",
                    email: "ahmed@example.com",
                    phone: "03009876543",
                    active: false,
                    history: [
                        { date: "2025-05-20", details: "Blood pressure issue." },
                    ],
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
            // Yahan PatientForm.vue ko open kar sakte hain (router push ya modal)
        },
        softDelete(patient) {
            // Soft delete: active flag ko false karna
            this.patients = this.patients.map((p) =>
                p.id === patient.id ? { ...p, active: false } : p
            );
        },
    },
};
</script>

<style scoped>
@import url("https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css");
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap");

.patients-wrapper {
  
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

.badge-success {
    background: linear-gradient(90deg, #22c55e 0%, #16a34a 100%);
    color: #fff;
}
.badge-secondary {
    background: linear-gradient(90deg, #64748b 0%, #334155 100%);
    color: #fff;
}

.btn-link {
    text-decoration: underline;
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
    max-width: 350px;
    width: 100%;
}

.list-group-item {
    font-size: 1rem;
}
</style>