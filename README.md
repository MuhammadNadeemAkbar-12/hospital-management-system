<div align="center">

# Hospital Management System (Frontend - Vue 2)

Simple role-based Hospital Management System UI built with Vue 2, Vue Router,
Vuex, Axios, Bootstrap 5, and Toast notifications. Currently it uses browser
localStorage (no secure backend yet) for demo auth and basic flows.

</div>

## 🚀 Features (Current)

Roles supported:

- Admin (manage doctors, patients, medicines, billing, approvals)
- Doctor (appointments, patients list, prescriptions, notifications, schedule)
- Patient (book appointments, medical reports (UI placeholder), prescriptions,
  billing, profile update)

Implemented / UI Screens:

- Authentication: Register, Login, Logout, Forgot Password (UI only)
- Dashboards: Admin, Doctor, Patient
- Appointment booking & approval (Admin approval placeholder)
- Billing & prescriptions (UI scaffolding)
- Medicines inventory (UI only)
- Notifications (Doctor + Admin consolidated view)
- Local persistence of users + session token via Vuex + localStorage
- Central Axios instance with interceptors (`src/api/axios.js`)

Planned / Potential Enhancements:

- Real backend integration (JWT auth, RBAC)
- Form validation & input sanitization
- Proper error boundaries & loading states
- Pagination / search in management tables
- Audit logs & activity timeline
- i18n (internationalization)
- Accessibility pass (WCAG compliance)

## 🧱 Tech Stack

- Vue 2.6
- Vue Router (history mode)
- Vuex (module based, currently only `auth` active)
- Axios (custom instance + interceptors)
- Bootstrap 5 (styling & layout)
- Vue Toastification (notifications)

## 🗂️ Project Structure (Key)

```
hospital-management-system/
	src/
		api/axios.js           # Axios instance with base URL + interceptors
		main.js                # App bootstrap
		router/index.js        # Route definitions (all role routes)
		store/                 # Vuex (only auth module wired)
			modules/auth.js
		components/
			auth/                # Login, Register, ForgotPassword
			admin/               # Admin management & settings UIs
			doctors/             # Doctor workflow components
			patient/             # Patient portal components
		views/dashboard/       # Dashboard shells per role
```

## 🔐 Authentication (Demo Only)

Auth is purely client-side (NOT secure):

- Registration stores users in `localStorage.users` (email, password, role)
- Login matches against stored users and sets a dummy token `demo-token-123`
- Role & token persisted in `localStorage` (`role`, `token`)
- No password hashing, no backend verification — replace before production.

## 🧩 Routing Overview

Defined in `src/router/index.js` (history mode). Notable paths:

- `/` Login
- `/register-user` Register
- `/forgot-password` Forgot Password (UI)
- `/admin-dashboard`, `/doctor-dashboard`, `/patient-dashboard`
- Management & feature routes: `/patient-management`, `/doctor-management`,
  `/medicines-inventory`, `/book-appointment`, etc.

No navigation guards yet — any user can hit any route manually. Add per-role
guards using `beforeEach` in router + Vuex state.

## 🛠️ Setup & Run

Prerequisites: Node 16+ (recommended), npm 8+.

Install deps:

```bash
npm install
```

Start dev server:

```bash
npm run serve
```

App will be available (default) at: http://localhost:8080

Build for production:

```bash
npm run build
```

Output goes to `dist/`.

Lint:

```bash
npm run lint
```

## 🌐 API Layer

`src/api/axios.js` sets `baseURL` currently pointing to:
`http://16.171.47.239/api` (replace for your backend).

Interceptors ready for:

- Attaching Authorization headers
- Global error handling (401, 403, 500, etc.)

To use globally, either import the instance or configure a Vue plugin wrapper
(future enhancement). Currently raw axios may also be used from components.

## 🗄️ State Management (Vuex)

Active module: `auth` only. `auth` provides:

- state: token, role, users[]
- actions: register, login, logout
- getters: isAuthenticated, userRole

Add more modules (appointments, billing, etc.) then register them in
`store/index.js`.

## 🔒 Environment Variables (Future)

For production-grade setup create a `.env` file pattern:

```
VUE_APP_API_BASE_URL=https://your-api.example.com/api
VUE_APP_ENV=development
```

Then in `axios.js` read: `const BASE_URL = process.env.VUE_APP_API_BASE_URL`.

## 🧪 Testing (Not Implemented Yet)

Suggested stack:

- Unit: Jest + vue-jest for components
- E2E: Cypress or Playwright
- Add CI workflow (GitHub Actions) to run lint + tests on push

## 🧾 Deployment

Basic static hosting (e.g. Vercel, Netlify, AWS S3 + CloudFront) works once
built.

1. Build: `npm run build`
2. Deploy the `dist/` directory If using history mode routing, ensure rewrite to
   `/index.html`. Example (Vercel) rewrite already likely configured via
   `vercel.json`.

## 🚨 Security Caveats

Current implementation is for demonstration only:

- No server-side auth or password hashing
- Sensitive data stored in localStorage
- No CSRF / XSS hardening
- Open routing without guards Do NOT use as-is in production.

## 🧭 Next Steps (Roadmap Ideas)

| Area           | Improvement                                               |
| -------------- | --------------------------------------------------------- |
| Auth           | Real backend JWT, refresh tokens, password reset flow     |
| Roles          | Route guards + component-level authorization              |
| UX             | Loading spinners & skeletons                              |
| Data           | Real API integration for appointments, billing, inventory |
| Error Handling | Centralized toast + logging strategy                      |
| Performance    | Code splitting + lazy loaded routes                       |
| Observability  | Sentry integration                                        |
| Accessibility  | ARIA labels, keyboard navigation review                   |

## 🤝 Contributing

1. Fork & clone
2. Create feature branch: `git checkout -b feature/your-feature`
3. Commit changes: `git commit -m "feat: add your feature"`
4. Push & open PR

Follow conventional commits if possible.

## 📄 License

Currently no license specified. Add a LICENSE file (MIT recommended) if you
intend open-source distribution.

## 🙋 Support / Questions

Open an issue or extend the README with FAQ as the project grows.

---

Made with Vue 2, Bootstrap 5, and ☕.
