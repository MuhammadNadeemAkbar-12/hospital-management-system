<template>
  <div class="notif-container">
    <div class="notif-card">
      <div class="notif-header">
        <i class="bi bi-bell notif-icon"></i>
        <h2>Notifications & Alerts</h2>
        <p class="notif-subtitle">
          Real-time notifications for appointments, stock, and emails.
        </p>
      </div>
      <div class="notif-actions">
        <input v-model="search" class="notif-search" type="text" placeholder="Search notifications..." />
        <button class="notif-btn" @click="markAllRead">
          <i class="bi bi-check2-all"></i> Mark All Read
        </button>
        <button class="notif-btn notif-btn-clear" @click="clearAll">
          <i class="bi bi-trash"></i> Clear All
        </button>
      </div>
      <div class="notif-list-wrapper">
        <div v-if="filteredNotifications.length === 0" class="notif-empty-row">
          No notifications found.
        </div>
        <div v-for="notif in filteredNotifications" :key="notif.id" class="notif-item" :class="{ unread: !notif.read }">
          <div class="notif-left">
            <span :class="['notif-badge', notif.type]">
              <i :class="notif.icon"></i>
            </span>
            <div>
              <div class="notif-title">{{ notif.title }}</div>
              <div class="notif-desc">{{ notif.desc }}</div>
              <div class="notif-meta">
                <span class="notif-time">{{ notif.time }}</span>
                <span v-if="notif.emailStatus" :class="['notif-email', notif.emailStatus]">
                  <i class="bi bi-envelope"></i> {{ notif.emailStatus }}
                </span>
              </div>
            </div>
          </div>
          <div class="notif-right">
            <button class="notif-action-btn" v-if="!notif.read" @click="markRead(notif)">
              <i class="bi bi-check2"></i>
            </button>
            <button class="notif-action-btn" @click="deleteNotif(notif)">
              <i class="bi bi-x"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "NotificationsAll",
  data() {
    return {
      notifications: [
        {
          id: 1,
          type: "appointment",
          icon: "bi bi-calendar-check",
          title: "New Appointment Request",
          desc: "Patient Ali Raza requested an appointment with Dr. Usman.",
          time: "2 min ago",
          read: false,
        },
        {
          id: 2,
          type: "stock",
          icon: "bi bi-capsule",
          title: "Low Medicine Stock",
          desc: "Paracetamol stock is below 10 units.",
          time: "10 min ago",
          read: false,
        },
        {
          id: 3,
          type: "email",
          icon: "bi bi-envelope",
          title: "Email Reminder Sent",
          desc: "Reminder email sent to Sara Khan for appointment.",
          time: "30 min ago",
          read: true,
          emailStatus: "Sent",
        },
        {
          id: 4,
          type: "appointment",
          icon: "bi bi-calendar-x",
          title: "Appointment Cancelled",
          desc: "Patient Ahmed Malik cancelled appointment.",
          time: "1 hour ago",
          read: true,
        },
        {
          id: 5,
          type: "stock",
          icon: "bi bi-capsule",
          title: "Medicine Expiry Alert",
          desc: "Ibuprofen batch C789 expires in 5 days.",
          time: "2 hours ago",
          read: false,
        },
        {
          id: 6,
          type: "email",
          icon: "bi bi-envelope",
          title: "Email Failed",
          desc: "Failed to send email to Dr. Sana.",
          time: "3 hours ago",
          read: false,
          emailStatus: "Failed",
        },
      ],
      search: "",
    };
  },
  computed: {
    filteredNotifications() {
      if (!this.search) return this.notifications;
      const s = this.search.toLowerCase();
      return this.notifications.filter(
        n =>
          n.title.toLowerCase().includes(s) ||
          n.desc.toLowerCase().includes(s) ||
          (n.emailStatus && n.emailStatus.toLowerCase().includes(s))
      );
    },
  },
  methods: {
    markRead(notif) {
      notif.read = true;
    },
    deleteNotif(notif) {
      this.notifications = this.notifications.filter(n => n.id !== notif.id);
    },
    markAllRead() {
      this.notifications.forEach(n => (n.read = true));
    },
    clearAll() {
      this.notifications = [];
    },
  },
};
</script>

<style scoped>
@import url("https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css");

.notif-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #e0f2fe 0%, #f8fafc 100%);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 2rem;
  box-sizing: border-box;
  width: 100%;
}

.notif-card {
  background: #fff;
  border-radius: 1.5rem;
  box-shadow: 0 8px 32px rgba(30,58,138,0.13);
  padding: 2.5rem 2.2rem;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
}

.notif-header {
  text-align: center;
  margin-bottom: 2rem;
}

.notif-icon {
  font-size: 3rem;
  color: #f59e0b;
  margin-bottom: 0.5rem;
}

.notif-header h2 {
  font-size: 2rem;
  font-weight: 700;
  color: #f59e0b;
  margin-bottom: 0.3rem;
}

.notif-subtitle {
  color: #64748b;
  font-size: 1rem;
  margin-bottom: 0;
}

.notif-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
  gap: 1rem;
  flex-wrap: wrap;
}

.notif-btn {
  background: linear-gradient(90deg, #f59e0b 0%, #38bdf8 100%);
  color: #fff;
  border: none;
  border-radius: 0.7rem;
  padding: 0.7rem 1.3rem;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(30,58,138,0.07);
  transition: background 0.2s, box-shadow 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.notif-btn-clear {
  background: #ef4444;
}

.notif-btn:hover {
  background: linear-gradient(90deg, #38bdf8 0%, #f59e0b 100%);
  box-shadow: 0 4px 16px rgba(30,58,138,0.13);
}

.notif-search {
  border-radius: 0.7rem;
  border: 1px solid #cbd5e1;
  padding: 0.7rem 1rem;
  font-size: 1rem;
  background: #f8fafc;
  width: 260px;
  box-shadow: 0 1px 4px rgba(30,58,138,0.04);
  transition: border-color 0.2s, box-shadow 0.2s;
  flex-grow: 1;
}

.notif-search:focus {
  border-color: #f59e0b;
  outline: none;
  box-shadow: 0 2px 8px rgba(245,158,11,0.09);
}

.notif-list-wrapper {
  margin-top: 1.5rem;
}

.notif-item {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  background: #f8fafc;
  border-radius: 1rem;
  box-shadow: 0 2px 8px rgba(30,58,138,0.05);
  padding: 1.1rem 1.2rem;
  margin-bottom: 1.1rem;
  transition: background 0.2s;
  border-left: 6px solid #f59e0b;
}

.notif-item.unread {
  background: #fffbe6;
  border-left: 6px solid #ef4444;
}

.notif-left {
  display: flex;
  align-items: flex-start;
  gap: 1.1rem;
  flex: 1;
}

.notif-badge {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: #e0f2fe;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.7rem;
  margin-top: 0.2rem;
}

.notif-badge.appointment {
  background: #e0e7ff;
  color: #6366f1;
}

.notif-badge.stock {
  background: #fef9c3;
  color: #f59e0b;
}

.notif-badge.email {
  background: #e0f2fe;
  color: #2563eb;
}

.notif-title {
  font-weight: 600;
  font-size: 1.08rem;
  color: #f59e0b;
}

.notif-desc {
  color: #64748b;
  font-size: 0.98rem;
  margin-top: 0.2rem;
}

.notif-meta {
  margin-top: 0.5rem;
  font-size: 0.92rem;
  color: #6366f1;
  display: flex;
  gap: 1.2rem;
  align-items: center;
}

.notif-time {
  color: #64748b;
}

.notif-email {
  padding: 0.2rem 0.7rem;
  border-radius: 0.5rem;
  font-size: 0.93rem;
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
}

.notif-email.Sent {
  background: #e0e7ff;
  color: #6366f1;
}

.notif-email.Failed {
  background: #fee2e2;
  color: #ef4444;
}

.notif-right {
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
  align-items: flex-end;
}

.notif-action-btn {
  background: #e0e7ff;
  border: none;
  border-radius: 0.5rem;
  padding: 0.4rem 0.7rem;
  font-size: 1.1rem;
  color: #6366f1;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
}

.notif-action-btn:hover {
  background: #6366f1;
  color: #fff;
}

.notif-empty-row {
  text-align: center;
  color: #64748b;
  font-size: 1.05rem;
  padding: 2rem 0;
}

@media (max-width: 768px) {
  .notif-container {
    padding: 1rem;
  }
  
  .notif-card {
    padding: 1.5rem 1rem;
  }
  
  .notif-actions {
    flex-direction: column;
    align-items: stretch;
  }
  
  .notif-search {
    width: 100%;
  }
  
  .notif-btn {
    width: 100%;
    justify-content: center;
  }
  
  .notif-item {
    flex-direction: column;
    gap: 1rem;
  }
  
  .notif-right {
    flex-direction: row;
    align-self: flex-end;
    margin-top: 0.5rem;
  }
}
</style>