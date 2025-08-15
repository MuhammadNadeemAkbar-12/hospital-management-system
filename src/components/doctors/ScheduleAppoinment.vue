<template>
    <div class="schedule-wrapper">
        <h2 class="mb-4 text-primary fw-bold">
            <i class="bi bi-clock me-2"></i> Doctor Weekly Schedule
        </h2>
        <div class="alert alert-info mb-3">
            Set your available time slots for each day. Patients will only see
            available slots.
        </div>
        <table class="table table-bordered table-hover rounded shadow-sm">
            <thead class="table-light">
                <tr>
                    <th>Day</th>
                    <th>Start Time</th>
                    <th>End Time</th>
                    <th>Status</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(slot, idx) in schedule" :key="slot.day">
                    <td>{{ slot.day }}</td>
                    <td>
                        <input type="time" v-model="slot.start" class="form-control form-control-sm"
                            :disabled="!slot.active" />
                    </td>
                    <td>
                        <input type="time" v-model="slot.end" class="form-control form-control-sm"
                            :disabled="!slot.active" />
                    </td>
                    <td>
                        <span :class="[
                            'badge',
                            slot.active ? 'badge-success' : 'badge-secondary',
                        ]">
                            {{ slot.active ? "Active" : "Inactive" }}
                        </span>
                    </td>
                    <td>
                        <button class="btn btn-sm" :class="slot.active ? 'btn-danger' : 'btn-success'"
                            @click="toggleDay(idx)">
                            {{ slot.active ? "Deactivate" : "Activate" }}
                        </button>
                    </td>
                </tr>
            </tbody>
        </table>
        <div class="d-flex justify-content-end mt-4">
            <button class="btn btn-primary" @click="saveSchedule">
                <i class="bi bi-save me-1"></i> Save Schedule
            </button>
        </div>
    </div>
</template>

<script>
export default {
    name: "ScheduleAppoinment",
    data() {
        return {
            schedule: [
                { day: "Monday", start: "09:00", end: "17:00", active: true },
                { day: "Tuesday", start: "09:00", end: "17:00", active: true },
                { day: "Wednesday", start: "09:00", end: "17:00", active: true },
                { day: "Thursday", start: "09:00", end: "17:00", active: true },
                { day: "Friday", start: "09:00", end: "17:00", active: true },
                { day: "Saturday", start: "10:00", end: "14:00", active: false },
                { day: "Sunday", start: "", end: "", active: false },
            ],
        };
    },
    methods: {
        toggleDay(idx) {
            this.schedule[idx].active = !this.schedule[idx].active;
            if (!this.schedule[idx].active) {
                this.schedule[idx].start = "";
                this.schedule[idx].end = "";
            }
        },
        saveSchedule() {
            // Here you would send this.schedule to backend via Axios
            alert("Schedule saved successfully!");
        },
    },
};
</script>

<style scoped>
@import url("https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css");
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap");

.schedule-wrapper {

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

.btn-success,
.btn-danger {
    border-radius: 6px;
    font-weight: 500;
}

@media (max-width: 768px) {
    .schedule-wrapper {
        padding: 1rem 0.2rem;
    }

    .table {
        font-size: 0.95rem;
    }
}
</style>
