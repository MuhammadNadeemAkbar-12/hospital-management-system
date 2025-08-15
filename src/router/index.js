import Vue from "vue";
import Router from 'vue-router'
import LoginUser from "@/components/auth/LoginUser.vue";
import RegisterUser from "@/components/auth/RegisterUser.vue";
import AdminDashboard from "@/views/dashboard/AdminDashboard.vue";
import DoctorDashboard from "@/views/dashboard/DoctorDashboard.vue";
import PatientDashboard from "@/views/dashboard/PatientDashboard.vue";
import ForgotPassword from "@/components/auth/ForgotPassword.vue";
import DoctorApppoinment from '@/components/doctors/DoctorApppoinment.vue'
import AllPatients from "@/components/doctors/AllPatients.vue";
import PrescriptionsUser from "@/components/doctors/PrescriptionsUser.vue";
import ScheduleAppoinment from "@/components/doctors/ScheduleAppoinment.vue";
import DoctorNotification from "@/components/doctors/DoctorNotification.vue";
import BookAppointment from "@/components/patient/BookAppointment.vue";
import MedicalReports from "@/components/patient/MedicalReports.vue";
import PatientPrescriptions from "@/components/patient/PatientPrescriptions.vue";
import PayBills from "@/components/patient/PayBills.vue";
import UpdateProfile from "@/components/patient/UpdateProfile.vue";
import PatientManagement from "@/components/admin/PatientManagement.vue";
import DoctorManagement from "@/components/admin/DoctorManagement.vue";
import MedicinesInventory from "@/components/admin/MedicinesInventory.vue";
import BillingPrescriptions from "@/components/admin/BillingPrescriptions.vue";
import NotificationsAll from "@/components/admin/NotificationsAll.vue";
import AdminSettings from "@/components/admin/AdminSettings.vue";
import AppointmentCalendar from "@/components/admin/AppointmentApprove.vue";
Vue.use(Router)

export default new Router({
    mode: 'history',
    routes: [

        { path: '/', name: "LoginUser", component: LoginUser },
        { path: '/forgot-password', name: 'ForgotPassword', component: ForgotPassword },
        { path: '/register-user', name: "RegisterUser", component: RegisterUser },
        { path: "/admin-dashboard", name: "AdminDashboard", component: AdminDashboard },
        { path: "/doctor-dashboard", name: "DoctorDashboard", component: DoctorDashboard },
        { path: "/patient-dashboard", name: "PatientDashboard", component: PatientDashboard },
        { path: "/doctor-apppoinment", name: "DoctorApppoinment", component: DoctorApppoinment },
        { path: "/all-patients", name: "all-patients", component: AllPatients },
        { path: "/prescriptions-data", name: "PrescriptionsUser", component: PrescriptionsUser },
        { path: "/schedule-appoinment", name: "ScheduleAppoinment", component: ScheduleAppoinment },
        { path: "/doctor-notification", name: "DoctorNotification", component: DoctorNotification },
        { path: "/book-appointment", name: "BookAppointment", component: BookAppointment },
        { path: "/medical-reports", name: "MedicalReports", component: MedicalReports },
        { path: "/patient-prescriptions", name: "PatientPrescriptions", component: PatientPrescriptions },
        { path: "/pay-bills", name: "PayBills", component: PayBills },
        { path: "/update-profile", name: "UpdateProfile", component: UpdateProfile },
        { path: "/patient-management", name: "PatientManagement", component: PatientManagement },
        { path: "/doctor-management", name: "DoctorManagement", component: DoctorManagement },
        { path: "/medicines-inventory", name: "MedicinesInventory", component: MedicinesInventory },
        { path: "/billing-prescriptions", name: "BillingPrescriptions", component: BillingPrescriptions },
        { path: "/notifications-all", name: "NotificationsAll", component: NotificationsAll },
        { path: "/admin-settings", name: "AdminSettings", component: AdminSettings },
        { path: "/appointment-calendar", name: "AppointmentCalendar", component: AppointmentCalendar }

    ]
})