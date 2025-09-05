<div align="center">

# Hospital Management System (Frontend - Vue 2)

A comprehensive role-based Hospital Management System UI built with Vue 2, Vue
Router, Vuex, Bootstrap 5, and Vue Toastification. This system provides separate
dashboards and functionalities for Admin, Doctor, and Patient roles. Currently
uses browser localStorage for demo purposes (no secure backend yet).

</div>

## 🚀 Features

### Roles Supported

<div align="center">

# Hospital Management System (Frontend - Vue 2)

A comprehensive role-based Hospital Management System UI built with Vue 2, Vue
Router, Vuex, Bootstrap 5, and Vue Toastification. This repo contains the
frontend demo (client-only) implementing separate dashboards and UIs for Admin,
Doctor, and Patient roles. For demo purposes data is persisted to `localStorage`
— no secure backend is included.

</div>

## 🚀 Features

### Roles Supported

- **Admin**: Manage doctors, patients, medicines, billing, appointments,
  notifications, and system settings
- **Doctor**: Handle appointments, patients list, prescriptions, notifications,
  and schedule management
- **Patient**: Book appointments, view medical reports, prescriptions, pay
  bills, and update profile

### Implemented Highlights

- User registration and login (demo, client-side)
- Role-based dashboards (Admin, Doctor, Patient)
- Patient & Doctor management UIs, medicine inventory, billing, and appointment
  flows (UI + localStorage persistence)
- Toast notifications and responsive layout using Bootstrap 5

## 🧱 Tech Stack

- Vue 2.6
- Vue Router (history mode)
- Vuex (module-based; `auth` wired)
- Bootstrap 5
- Vue Toastification

## 🗂️ Project Structure

```
hospital-management-system/
├── src/
│   ├── main.js
│   ├── App.vue
│   ├── router/
│   │   └── index.js
│   ├── store/
│   │   ├── index.js
│   │   └── modules/
│   │       └── auth.js
│   ├── services/
│   └── components/
├── public/
└── package.json
```

## 🔐 Authentication (Demo Only)

This project uses purely client-side authentication for demonstration:

- Registration stores users in `localStorage.users` (email, password, role)
- Login validates credentials against `localStorage` and sets a demo token
- Role and session token are persisted to `localStorage`

⚠️ This is not secure. Do not use in production.

## 🧩 Routing Overview

Notable routes are defined in `src/router/index.js`:

- `/` — Login
- `/register-user` — Register
- `/forgot-password` — Forgot password (UI only)
- `/admin-dashboard`, `/patient-management`, `/doctor-management`, etc.

Add navigation guards for role-based protection before production use.

## 🛠️ Setup & Installation

Prerequisites: Node.js 16+, npm 8+

Install dependencies:

```bash
npm install
```

Start dev server:

```bash
npm run serve
```

Build for production:

```bash
npm run build
```

Run linter:

```bash
npm run lint
```

The app runs by default at `http://localhost:8080` in dev mode.

## 🔗 Live Demo

The frontend is deployed on Vercel:

https://hospital-management-system-blond.vercel.app

## 🗄️ State Management (Vuex)

Currently the `auth` module is active and handles registration/login/logout.
Other modules (appointments, billing, doctors, medicines, notifications,
patients) exist as placeholders and can be implemented when integrating a
backend API.

## 🔒 Environment Variables

For a real backend, add a `.env` file with keys like:

```
VUE_APP_API_BASE_URL=https://your-api.example.com/api
VUE_APP_ENV=development
```

## � Deployment

This is a static Vue SPA — build with `npm run build` and deploy the `dist/`
directory to any static host (Vercel, Netlify, S3 + CloudFront, GitHub Pages).

If using history mode routing, configure rewrites to `index.html` on your host.

## 🚨 Security Caveats

- No server-side authentication or password hashing
- Sensitive demo data stored in `localStorage`
- No CSRF/XSS hardening

Do not use this codebase in production without proper security changes.

## 🧭 Roadmap & Next Steps

- Add role-based navigation guards
- Integrate a real backend with JWT auth
- Implement remaining Vuex modules and API services
- Add tests (Jest + vue-jest) and CI workflows

## 🤝 Contributing

1. Fork
2. Create branch: `git checkout -b feature/your-feature`
3. Commit and push
4. Open a PR

Please follow conventional commit messages.

## 📄 License

No license specified. Consider adding an MIT license if you plan to open source
the project.

---

Made with Vue 2 and Bootstrap 5.
