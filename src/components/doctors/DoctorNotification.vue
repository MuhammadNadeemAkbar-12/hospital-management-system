<template>
    <div class="notification-wrapper">
        <h2 class="mb-4 text-primary fw-bold">
            <i class="bi bi-bell me-2"></i> Notifications
        </h2>
        <div v-if="notifications.length === 0" class="alert alert-info text-center">
            No notifications yet.
        </div>
        <ul v-else class="list-group">
            <li v-for="(note) in notifications" :key="note.id"
                class="list-group-item d-flex align-items-center justify-content-between">
                <div>
                    <span :class="['badge', badgeClass(note.type)]" class="me-2">
                        {{ note.type }}
                    </span>
                    <span>{{ note.message }}</span>
                    <span v-if="note.emailStatus" class="ms-2 text-success">
                        <i class="bi bi-envelope-check"></i> Email Sent
                    </span>
                </div>
                <small class="text-muted">{{ note.time }}</small>
            </li>
        </ul>
        <!-- Toast Notification Example -->
        <div v-if="showToast" class="toast-notification">
            <i class="bi bi-bell-fill me-2"></i> {{ toastMsg }}
        </div>
    </div>
</template>

<script>
export default {
    name: "DoctorNotification",
    data() {
        return {
            notifications: [
                {
                    id: 1,
                    type: "Appointment",
                    message: "New appointment request from Sara Khan.",
                    time: "2 min ago",
                    emailStatus: true,
                },
                {
                    id: 2,
                    type: "Stock",
                    message: "Panadol stock is low.",
                    time: "10 min ago",
                    emailStatus: false,
                },
                {
                    id: 3,
                    type: "Reminder",
                    message: "Email reminder sent to patient Ali Raza.",
                    time: "30 min ago",
                    emailStatus: true,
                },
            ],
            showToast: false,
            toastMsg: "",
        };
    },
    methods: {
        badgeClass(type) {
            switch (type) {
                case "Appointment":
                    return "badge-primary";
                case "Stock":
                    return "badge-danger";
                case "Reminder":
                    return "badge-success";
                default:
                    return "badge-secondary";
            }
        },
        triggerToast(msg) {
            this.toastMsg = msg;
            this.showToast = true;
            setTimeout(() => {
                this.showToast = false;
            }, 2500);
        },
    },
    mounted() {
        // Example: Simulate real-time notification
        setTimeout(() => {
            this.notifications.unshift({
                id: 4,
                type: "Appointment",
                message: "New appointment approved for Ahmed Ali.",
                time: "Just now",
                emailStatus: false,
            });
            this.triggerToast("New appointment approved for Ahmed Ali.");
        }, 4000);
    },
};
</script>

<style scoped>
@import url("https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css");
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap");

.notification-wrapper {

    margin: 0 auto;
    padding: 2rem 1rem;
}

.list-group-item {
    font-size: 1rem;
}

.badge-primary {
    background: linear-gradient(90deg, #3b82f6 0%, #2563eb 100%);
    color: #fff;
}

.badge-danger {
    background: linear-gradient(90deg, #ef4444 0%, #dc2626 100%);
    color: #fff;
}

.badge-success {
    background: linear-gradient(90deg, #22c55e 0%, #16a34a 100%);
    color: #fff;
}

.badge-secondary {
    background: linear-gradient(90deg, #64748b 0%, #334155 100%);
    color: #fff;
}

.toast-notification {
    position: fixed;
    top: 24px;
    right: 24px;
    background: #2563eb;
    color: #fff;
    padding: 12px 24px;
    border-radius: 8px;
    box-shadow: 0 4px 16px rgba(37, 99, 235, 0.15);
    font-weight: 500;
    z-index: 9999;
    display: flex;
    align-items: center;
    animation: fadeInOut 2.5s;
}

@keyframes fadeInOut {
    0% {
        opacity: 0;
        transform: translateY(-20px);
    }

    10% {
        opacity: 1;
        transform: translateY(0);
    }

    90% {
        opacity: 1;
        transform: translateY(0);
    }

    100% {
        opacity: 0;
        transform: translateY(-20px);
    }
}
</style>