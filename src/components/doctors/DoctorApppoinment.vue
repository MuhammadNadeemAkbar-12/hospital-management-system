<template>
  <div class="doctor-appointment-container">
    <div class="doctor-appointment-card">
      <div class="da-header">
        <i class="bi bi-calendar-check da-icon"></i>
        <h2>Appointment Requests</h2>
        <p class="da-subtitle">Approve or reject patient appointments.</p>
      </div>
      <div class="da-actions">
        <input
          v-model="search"
          class="da-search"
          type="text"
          placeholder="Search by patient name..." />
      </div>
      <div class="da-table-wrapper">
        <table class="da-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Patient</th>
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
              <td>{{ app.date }}</td>
              <td>{{ app.slot }}</td>
              <td>
                <span :class="['da-badge-status', app.status]">{{ app.status }}</span>
              </td>
              <td>
                <button
                  v-if="app.status === 'Pending'"
                  class="da-action-btn"
                  @click="updateStatus(app, 'Approved')"
                  title="Approve">
                  <i class="bi bi-check2-circle"></i>
                </button>
                <button
                  v-if="app.status === 'Pending'"
                  class="da-action-btn da-action-btn-reject"
                  @click="updateStatus(app, 'Rejected')"
                  title="Reject">
                  <i class="bi bi-x-circle"></i>
                </button>
                <button
                  class="da-action-btn"
                  @click="viewStatus(app)"
                  title="View Status">
                  <i class="bi bi-info-circle"></i>
                </button>
              </td>
            </tr>
            <tr v-if="filteredAppointments.length === 0">
              <td colspan="6" class="da-empty-row">No appointments found.</td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- Status Modal -->
      <div v-if="showStatusModal" class="da-modal-backdrop">
        <div class="da-modal">
          <h3>Appointment Status</h3>
          <div class="da-status-details">
            <p><strong>ID:</strong> {{ statusTarget.id }}</p>
            <p><strong>Patient:</strong> {{ statusTarget.patient_name || statusTarget.patient }}</p>
            <p><strong>Date:</strong> {{ statusTarget.date }}</p>
            <p><strong>Time Slot:</strong> {{ statusTarget.slot }}</p>
            <p>
              <strong>Status:</strong>
              <span :class="['da-badge-status', statusTarget.status]">{{ statusTarget.status }}</span>
            </p>
          </div>
          <div class="da-modal-actions">
            <button
              class="da-btn da-btn-cancel"
              type="button"
              @click="showStatusModal = false">
              Close
            </button>
          </div>
        </div>
      </div>
      <div v-if="showToast" class="da-toast">
        <i class="bi bi-check-circle"></i> {{ toastMsg }}
      </div>
    </div>
  </div>
</template>

<script>
import axios from "@/api/axios";

export default {
  name: "AppointmentApproval",
  data() {
    return {
      appointments: [],
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
          (a.patient_name || a.patient).toLowerCase().includes(s)
      );
    },
  },
  created() {
    this.fetchAppointments();
  },
  methods: {
    async fetchAppointments() {
      const token = localStorage.getItem("Token");
      try {
        const response = await axios.get("/appointments", {
          headers: { Authorization: `Bearer ${token}` },
        });
        this.appointments = response.data.data || [];
      } catch (e) {
        this.appointments = [];
      }
    },
    async updateStatus(app, status) {
      const token = localStorage.getItem("Token");
      try {
        await axios.patch(
          `/doctor/appointments/${app.id}/status`,
          { status },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        app.status = status;
        this.showToastMsg(`Appointment ${status.toLowerCase()}!`);
        this.fetchAppointments();
      } catch (e) {
        alert("Error updating status");
      }
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

.doctor-appointment-container {
  min-height: 100vh;
  background: linear-gradient(120deg, #e0f2fe 0%, #f8fafc 100%);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 2.5rem 1rem;
  width: 100%;
}

.doctor-appointment-card {
  background: #fff;
  border-radius: 2rem;
  box-shadow: 0 8px 32px rgba(16, 185, 129, 0.14);
  padding: 2.8rem 2.2rem;
  width: 100%;
  max-width: 1100px;
  margin: 0 auto;
  transition: box-shadow 0.2s;
}

.doctor-appointment-card:hover {
  box-shadow: 0 12px 40px rgba(16, 185, 129, 0.18);
}

.da-header {
  text-align: center;
  margin-bottom: 2.2rem;
}

.da-icon {
  font-size: 3.2rem;
  color: #10b981;
  margin-bottom: 0.7rem;
  filter: drop-shadow(0 2px 8px #10b98133);
}

.da-header h2 {
  font-size: 2.2rem;
  font-weight: 700;
  color: #10b981;
  margin-bottom: 0.3rem;
  letter-spacing: 1px;
}

.da-subtitle {
  color: #64748b;
  font-size: 1.08rem;
  margin-bottom: 0;
}

.da-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-bottom: 2rem;
  gap: 1.2rem;
  flex-wrap: wrap;
}

.da-search {
  border-radius: 0.9rem;
  border: 1px solid #cbd5e1;
  padding: 0.8rem 1.1rem;
  font-size: 1.08rem;
  background: #f8fafc;
  min-width: 260px;
  flex-grow: 1;
  box-shadow: 0 1px 4px rgba(16, 185, 129, 0.04);
  transition: border-color 0.2s, box-shadow 0.2s;
}

.da-search:focus {
  border-color: #10b981;
  outline: none;
  box-shadow: 0 2px 8px rgba(16, 185, 129, 0.09);
}

.da-table-wrapper {
  overflow-x: auto;
  width: 100%;
}

.da-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  background: #fff;
  border-radius: 1.2rem;
  box-shadow: 0 2px 8px rgba(16, 185, 129, 0.07);
  margin-bottom: 1.2rem;
  overflow: hidden;
}

.da-table th,
.da-table td {
  padding: 1.1rem 0.7rem;
  text-align: left;
  font-size: 1.08rem;
  vertical-align: middle;
}

.da-table th {
  background: linear-gradient(90deg, #e0f2fe 0%, #bae6fd 100%);
  color: #10b981;
  font-weight: 600;
  border-bottom: 2px solid #bae6fd;
  letter-spacing: 0.5px;
}

.da-table tr:not(:last-child) td {
  border-bottom: 1px solid #e0f2fe;
}

.da-table tbody tr:hover {
  background: #f1f5f9;
  transition: background 0.2s;
}

.da-badge-status {
  border-radius: 0.7rem;
  padding: 0.45rem 1rem;
  font-size: 1rem;
  font-weight: 500;
  display: inline-block;
  box-shadow: 0 1px 4px #10b98122;
}

.da-badge-status.Pending {
  background: #fbbf24;
  color: #92400e;
}

.da-badge-status.Approved {
  background: #10b981;
  color: #fff;
}

.da-badge-status.Rejected {
  background: #ef4444;
  color: #fff;
}

.da-action-btn {
  background: #f8fafc;
  border: none;
  border-radius: 0.6rem;
  padding: 0.5rem 0.8rem;
  font-size: 1.15rem;
  color: #10b981;
  cursor: pointer;
  margin-right: 0.3rem;
  transition: background 0.2s, color 0.2s, transform 0.1s;
  box-shadow: 0 1px 4px #10b98111;
  vertical-align: middle;
  display: inline-block;
}

.da-action-btn:hover {
  background: #e0f2fe;
  color: #2563eb;
  transform: scale(1.08);
}

.da-action-btn-reject {
  color: #ef4444;
}

.da-empty-row {
  text-align: center;
  color: #adb5bd;
  font-size: 1.15rem;
  padding: 28px 0;
}

.da-modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(16, 185, 129, 0.18);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  animation: fadeIn 0.3s;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.da-modal {
  background: #fff;
  padding: 2.2rem;
  border-radius: 1.2rem;
  box-shadow: 0 4px 18px rgba(16, 185, 129, 0.14);
  min-width: 320px;
  max-width: 95vw;
  width: 520px;
  animation: slideUp 0.3s;
  max-height: 80vh;
  overflow-y: auto;
}

@keyframes slideUp {
  from { transform: translateY(40px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

.da-modal h3 {
  color: #10b981;
  font-weight: 600;
  margin-bottom: 1.3rem;
  letter-spacing: 0.5px;
}

.da-modal-actions {
  display: flex;
  gap: 1.2rem;
  margin-top: 1.3rem;
}

.da-toast {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  background: #10b981;
  color: #fff;
  padding: 1rem 2rem;
  border-radius: 1rem;
  box-shadow: 0 4px 18px #10b98133;
  font-size: 1.08rem;
  display: flex;
  align-items: center;
  gap: 0.7rem;
  z-index: 99999;
  animation: fadeIn 0.3s;
}
</style>