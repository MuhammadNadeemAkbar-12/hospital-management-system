<template>
	<div class="notifications-container">
		<div class="notifications-header">
			<div class="header-content">
				<i class="bi bi-bell-fill header-icon"></i>
				<h2 class="header-title">Notifications</h2>
				<span class="notification-count">{{ notifications.length }}</span>
			</div>
			<p class="header-subtitle">Stay updated with your latest activities</p>
		</div>

		<div v-if="notifications.length === 0" class="empty-state">
			<div class="empty-icon">
				<i class="bi bi-bell-slash"></i>
			</div>
			<h4>No Notifications Yet</h4>
			<p>You'll see your notifications here when you have any.</p>
		</div>

		<div v-else class="notifications-grid">
			<div
				v-for="(note, index) in notifications"
				:key="note.id"
				class="notification-card"
				:style="{ animationDelay: `${index * 0.1}s` }">
				<div class="card-header">
					<div class="notification-type">
						<i :class="getTypeIcon(note.type)" class="type-icon"></i>
						<span :class="['type-badge', badgeClass(note.type)]">{{
							note.type
						}}</span>
					</div>
					<small class="notification-time">{{ note.time }}</small>
				</div>

				<div class="card-body">
					<p class="notification-message">{{ note.message }}</p>
					<div v-if="note.emailStatus" class="email-status">
						<i class="bi bi-envelope-check"></i>
						<span>Email Sent</span>
					</div>
				</div>

				<div class="card-actions">
					<button class="action-btn mark-read" @click="markAsRead(note.id)">
						<i class="bi bi-check2"></i>
						Mark as Read
					</button>
				</div>
			</div>
		</div>

		<!-- Enhanced Toast Notification -->
		<div v-if="showToast" class="toast-notification">
			<div class="toast-content">
				<i class="bi bi-bell-fill toast-icon"></i>
				<span class="toast-message">{{ toastMsg }}</span>
			</div>
			<div class="toast-progress"></div>
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
						return "badge-appointment";
					case "Stock":
						return "badge-stock";
					case "Reminder":
						return "badge-reminder";
					default:
						return "badge-default";
				}
			},
			getTypeIcon(type) {
				switch (type) {
					case "Appointment":
						return "bi bi-calendar-check";
					case "Stock":
						return "bi bi-exclamation-triangle";
					case "Reminder":
						return "bi bi-alarm";
					default:
						return "bi bi-info-circle";
				}
			},
			markAsRead(id) {
				// In a real app, this would update the notification status
				const index = this.notifications.findIndex((n) => n.id === id);
				if (index !== -1) {
					this.notifications.splice(index, 1);
					this.triggerToast("Notification marked as read");
				}
			},
			triggerToast(msg) {
				this.toastMsg = msg;
				this.showToast = true;
				setTimeout(() => {
					this.showToast = false;
				}, 3000);
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
	@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap");

	* {
		font-family: "Poppins", sans-serif;
	}

	.notifications-container {
		min-height: 100vh;
		background: linear-gradient(120deg, #e0f2fe 0%, #f8fafc 100%);
		padding: 2rem 1rem;
		max-width: 1200px;
		margin: 0 auto;
	}

	.notifications-header {
		text-align: center;
		margin-bottom: 3rem;
	}

	.header-content {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 1rem;
		margin-bottom: 0.5rem;
	}

	.header-icon {
		font-size: 3rem;
		color: #667eea;
		filter: drop-shadow(0 4px 8px rgba(102, 126, 234, 0.3));
		animation: bellShake 2s infinite;
	}

	@keyframes bellShake {
		0%,
		100% {
			transform: rotate(0deg);
		}
		10%,
		30%,
		50%,
		70%,
		90% {
			transform: rotate(-10deg);
		}
		20%,
		40%,
		60%,
		80% {
			transform: rotate(10deg);
		}
	}

	.header-title {
		font-size: 2.5rem;
		font-weight: 700;
		color: #2d3748;
		margin: 0;
		background: linear-gradient(45deg, #667eea 0%, #764ba2 100%);
		-webkit-background-clip: text;
		background-clip: text;
		-webkit-text-fill-color: transparent;
	}

	.notification-count {
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		color: #fff;
		padding: 0.5rem 1rem;
		border-radius: 2rem;
		font-size: 1rem;
		font-weight: 600;
		backdrop-filter: blur(10px);
		border: 1px solid rgba(102, 126, 234, 0.3);
	}

	.header-subtitle {
		color: #718096;
		font-size: 1.1rem;
		margin: 0;
		font-weight: 400;
	}

	.empty-state {
		background: #fff;
		backdrop-filter: blur(10px);
		border-radius: 2rem;
		padding: 4rem 2rem;
		text-align: center;
		box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
		margin-top: 2rem;
	}

	.empty-icon {
		font-size: 5rem;
		color: #667eea;
		margin-bottom: 1.5rem;
		opacity: 0.6;
	}

	.empty-state h4 {
		color: #2d3748;
		font-weight: 600;
		margin-bottom: 0.5rem;
	}

	.empty-state p {
		color: #718096;
		margin: 0;
	}

	.notifications-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
		gap: 1.5rem;
		margin-top: 2rem;
	}

	.notification-card {
		background: #fff;
		backdrop-filter: blur(10px);
		border-radius: 1.5rem;
		box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
		border: 1px solid rgba(102, 126, 234, 0.1);
		padding: 1.5rem;
		transition: all 0.3s ease;
		animation: slideInUp 0.5s ease forwards;
		opacity: 0;
		transform: translateY(20px);
	}

	@keyframes slideInUp {
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.notification-card:hover {
		transform: translateY(-5px);
		box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15);
		border-color: rgba(102, 126, 234, 0.2);
	}

	.card-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1rem;
	}

	.notification-type {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.type-icon {
		font-size: 1.2rem;
		color: #667eea;
	}

	.type-badge {
		padding: 0.4rem 0.8rem;
		border-radius: 1rem;
		font-size: 0.8rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.5px;
	}

	.badge-appointment {
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		color: white;
	}

	.badge-stock {
		background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
		color: white;
	}

	.badge-reminder {
		background: linear-gradient(135deg, #10b981 0%, #059669 100%);
		color: white;
	}

	.badge-default {
		background: linear-gradient(135deg, #6b7280 0%, #4b5563 100%);
		color: white;
	}

	.notification-time {
		color: #718096;
		font-size: 0.85rem;
		font-weight: 500;
	}

	.card-body {
		margin-bottom: 1rem;
	}

	.notification-message {
		color: #2d3748;
		font-size: 1rem;
		line-height: 1.5;
		margin: 0;
		font-weight: 500;
	}

	.email-status {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		color: #16a34a;
		font-size: 0.9rem;
		font-weight: 500;
		margin-top: 0.5rem;
	}

	.email-status i {
		font-size: 1rem;
	}

	.card-actions {
		display: flex;
		justify-content: flex-end;
	}

	.action-btn {
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		color: white;
		border: none;
		padding: 0.6rem 1.2rem;
		border-radius: 0.8rem;
		font-size: 0.9rem;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.2s ease;
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.action-btn:hover {
		transform: translateY(-2px);
		box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
	}

	.mark-read {
		background: linear-gradient(135deg, #10b981 0%, #059669 100%);
	}

	.toast-notification {
		position: fixed;
		top: 24px;
		right: 24px;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		color: #fff;
		padding: 1rem 1.5rem;
		border-radius: 1rem;
		box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
		font-weight: 500;
		z-index: 9999;
		display: flex;
		flex-direction: column;
		min-width: 300px;
		animation: toastSlideIn 0.3s ease;
	}

	.toast-content {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		margin-bottom: 0.5rem;
	}

	.toast-icon {
		font-size: 1.2rem;
	}

	.toast-message {
		font-size: 0.95rem;
		line-height: 1.4;
	}

	.toast-progress {
		height: 3px;
		background: rgba(255, 255, 255, 0.3);
		border-radius: 2px;
		overflow: hidden;
	}

	.toast-progress::after {
		content: "";
		display: block;
		height: 100%;
		background: #fff;
		animation: progress 3s linear;
	}

	@keyframes toastSlideIn {
		from {
			opacity: 0;
			transform: translateX(100%);
		}
		to {
			opacity: 1;
			transform: translateX(0);
		}
	}

	@keyframes progress {
		from {
			width: 100%;
		}
		to {
			width: 0%;
		}
	}

	/* Responsive Design */
	@media (max-width: 768px) {
		.notifications-container {
			padding: 1rem 0.5rem;
		}

		.header-title {
			font-size: 2rem;
		}

		.notifications-grid {
			grid-template-columns: 1fr;
			gap: 1rem;
		}

		.notification-card {
			padding: 1rem;
		}

		.toast-notification {
			left: 1rem;
			right: 1rem;
			min-width: auto;
		}
	}

	@media (max-width: 480px) {
		.header-content {
			flex-direction: column;
			gap: 0.5rem;
		}

		.header-icon {
			font-size: 2.5rem;
		}

		.header-title {
			font-size: 1.8rem;
		}

		.notification-count {
			padding: 0.4rem 0.8rem;
			font-size: 0.9rem;
		}
	}
</style>
