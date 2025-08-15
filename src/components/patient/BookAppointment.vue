<template>
    <div class="book-appointment-container">
        <div class="appointment-card">
            <div class="appointment-header">
                <i class="bi bi-calendar-plus me-2"></i>
                Book New Appointment
            </div>
            <form @submit.prevent="submitAppointment" class="appointment-form">
                <!-- Doctor Selection -->
                <div class="form-group">
                    <label for="doctor">Select Doctor</label>
                    <select id="doctor" v-model="form.doctor_id" @change="fetchAvailableSlots" required>
                        <option value="" disabled>-- Select Doctor --</option>
                        <option v-for="doctor in doctors" :key="doctor.id" :value="doctor.id">
                            Dr. {{ doctor.name }} - {{ doctor.specialization }}
                        </option>
                    </select>
                </div>

                <!-- Appointment Date -->
                <div class="form-group">
                    <label for="date">Appointment Date</label>
                    <input type="date" id="date" v-model="form.date" :min="minDate" @change="fetchAvailableSlots"
                        required />
                </div>

                <!-- Time Slot Selection -->
                <div class="form-group" v-if="availableSlots.length > 0">
                    <label for="time">Available Time Slots</label>
                    <select id="time" v-model="form.time_slot" required>
                        <option value="" disabled>-- Select Time Slot --</option>
                        <option v-for="slot in availableSlots" :key="slot" :value="slot">
                            {{ slot }}
                        </option>
                    </select>
                </div>
                <div v-else-if="form.doctor_id && form.date" class="info-msg">
                    No available slots for selected date. Please choose another date.
                </div>

                <!-- Reason for Visit -->
                <div class="form-group">
                    <label for="reason">Reason for Visit</label>
                    <textarea id="reason" v-model="form.reason" rows="3"
                        placeholder="Briefly describe your symptoms or reason for appointment"></textarea>
                </div>

                <!-- Submit Button -->
                <button type="submit" class="submit-btn" :disabled="isSubmitting">
                    <span v-if="isSubmitting">
                        <span class="spinner"></span>
                        Booking...
                    </span>
                    <span v-else>Book Appointment</span>
                </button>

                <!-- Success/Error Messages -->
                <div v-if="successMessage" class="success-msg">
                    {{ successMessage }}
                </div>
                <div v-if="errorMessage" class="error-msg">
                    {{ errorMessage }}
                </div>
            </form>
        </div>
    </div>
</template>

<script>
export default {
    name: "BookAppointment",
    data() {
        return {
            doctors: [],
            availableSlots: [],
            form: {
                doctor_id: "",
                date: "",
                time_slot: "",
                reason: "",
            },
            isSubmitting: false,
            successMessage: "",
            errorMessage: "",
            minDate: new Date().toISOString().split("T")[0],
        };
    },
    created() {
        this.fetchDoctors();
    },
    methods: {
        async fetchDoctors() {
            try {
                this.doctors = [
                    { id: 1, name: "Ali", specialization: "Cardiologist" },
                    { id: 2, name: "Sara", specialization: "Dermatologist" },
                    { id: 3, name: "Ahmed", specialization: "Orthopedic" },
                ];
            } catch (error) {
                this.errorMessage = "Failed to load doctors. Please try again later.";
            }
        },
        async fetchAvailableSlots() {
            if (!this.form.doctor_id || !this.form.date) {
                this.availableSlots = [];
                return;
            }
            try {
                this.availableSlots = [
                    "10:00 AM",
                    "11:00 AM",
                    "12:00 PM",
                    "02:00 PM",
                ];
                this.form.time_slot = "";
            } catch (error) {
                this.errorMessage =
                    "Failed to load available slots. Please try again.";
            }
        },
        async submitAppointment() {
            this.isSubmitting = true;
            this.successMessage = "";
            this.errorMessage = "";
            try {
                this.successMessage = "Appointment booked successfully!";
                this.form = {
                    doctor_id: "",
                    date: "",
                    time_slot: "",
                    reason: "",
                };
                this.availableSlots = [];
                this.$emit("appointment-booked");
            } catch (error) {
                this.errorMessage = "Failed to book appointment.";
            } finally {
                this.isSubmitting = false;
            }
        },
    },
};
</script>

<style scoped>
.book-appointment-container {
    width: 100%;
    min-height: 100vh;
    background: #f8fafc;
    padding: 0;
    margin: 0;
    box-sizing: border-box;
}

.appointment-card {
    background: #fff;
    padding: 2rem;
    width: 100%;
    max-width: 100%;
    margin: 0;
    border-radius: 0;
    box-shadow: none;
}

.appointment-header {
    font-size: 1.5rem;
    font-weight: 600;
    color: #2563eb;
    margin-bottom: 1.5rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0 1rem;
}

.appointment-form {
    padding: 0 1rem;
}

.appointment-form .form-group {
    margin-bottom: 1.2rem;
}

.appointment-form label {
    font-weight: 500;
    color: #1e293b;
    margin-bottom: 0.4rem;
    display: block;
}

.appointment-form select,
.appointment-form input,
.appointment-form textarea {
    width: 100%;
    padding: 0.6rem 0.8rem;
    border-radius: 8px;
    border: 1px solid #cbd5e1;
    font-size: 1rem;
    background: #f1f5f9;
    transition: border-color 0.2s;
}

.appointment-form select:focus,
.appointment-form input:focus,
.appointment-form textarea:focus {
    border-color: #2563eb;
    outline: none;
}

.submit-btn {
    width: 100%;
    padding: 0.7rem;
    border-radius: 8px;
    background: linear-gradient(90deg, #2563eb 0%, #0ea5e9 100%);
    color: #fff;
    font-weight: 600;
    border: none;
    font-size: 1.1rem;
    margin-top: 0.5rem;
    cursor: pointer;
    transition: background 0.2s;
}

.submit-btn:disabled {
    background: #94a3b8;
    cursor: not-allowed;
}

.spinner {
    display: inline-block;
    width: 18px;
    height: 18px;
    border: 3px solid #fff;
    border-top: 3px solid #2563eb;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
    margin-right: 8px;
    vertical-align: middle;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

.success-msg {
    color: #22c55e;
    background: #f0fdf4;
    border-radius: 6px;
    padding: 0.7rem;
    margin-top: 1rem;
    font-weight: 500;
    text-align: center;
}

.error-msg {
    color: #ef4444;
    background: #fef2f2;
    border-radius: 6px;
    padding: 0.7rem;
    margin-top: 1rem;
    font-weight: 500;
    text-align: center;
}

.info-msg {
    color: #2563eb;
    background: #e0f2fe;
    border-radius: 6px;
    padding: 0.7rem;
    margin-bottom: 1rem;
    font-weight: 500;
    text-align: center;
}

@media (min-width: 768px) {
    .appointment-card {
        padding: 3rem;
        max-width: 800px;
        margin: 0 auto;
        border-radius: 16px;
        box-shadow: 0 6px 24px rgba(30, 58, 138, 0.08);
    }
    
    .appointment-header,
    .appointment-form {
        padding: 0;
    }
}
</style>    