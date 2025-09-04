<div align="center">

# Hospital Management System (Frontend - Vue 2)

A comprehensive role-based Hospital Management System UI built with Vue 2, Vue
Router, Vuex, Bootstrap 5, and Vue Toastification. This system provides separate
dashboards and functionalities for Admin, Doctor, and Patient roles. Currently
uses browser localStorage for demo purposes (no secure backend yet).

</div>

## 🚀 Features

### Roles Supported

- **Admin**: Manage doctors, patients, medicines, billing, appointments,
  notifications, and system settings
- **Doctor**: Handle appointments, patients list, prescriptions, notifications,
  and schedule management
- **Patient**: Book appointments, view medical reports, prescriptions, pay
  bills, and update profile

### Implemented Features

#### Authentication

- User Registration with role selection
- Login with role-based access
- Logout functionality
- Forgot Password (UI placeholder)

#### Admin Dashboard

- **Patient Management**: Full CRUD operations (Create, Read, Update, Delete)
  with search functionality
- **Doctor Management**: Add, view, edit doctors and their specializations
- **Medicines Inventory**: Manage hospital medicines stock
- **Billing & Prescriptions**: Handle billing and prescription management
- **Appointment Approval**: Review and approve appointment requests
- **Notifications**: View all system notifications
- **Admin Settings**: System configuration options

#### Doctor Dashboard

- **Appointments**: View and manage doctor appointments
- **All Patients**: Access to patient list under doctor's care
- **Prescriptions**: Create and manage patient prescriptions
- **Schedule Appointments**: Manage doctor's availability and schedules
- **Notifications**: Doctor-specific notifications

#### Patient Dashboard

- **Book Appointment**: Schedule appointments with doctors
- **Medical Reports**: View medical history and reports (UI placeholder)
- **Patient Prescriptions**: View prescribed medications
- **Pay Bills**: Handle billing and payments
- **Update Profile**: Manage personal information

### Technical Features

- Responsive design with Bootstrap 5
- Toast notifications for user feedback
- Role-based routing and navigation
- Local storage persistence for demo data
- Modern UI with icons and animations

## 🧱 Tech Stack

- **Vue 2.6.14** - Progressive JavaScript framework
- **Vue Router 3.6.5** - Official router for Vue.js
- **Vuex 3.6.2** - State management pattern and library
- **Bootstrap 5.3.7** - CSS framework for responsive design
- **Vue Toastification 1.7.14** - Toast notification plugin
- **Core-js 3.8.3** - Modular standard library for JavaScript

## 🗂️ Project Structure

```
hospital-management-system/
├── src/
│   ├── main.js                 # App entry point with Vue setup
│   ├── App.vue                 # Root component with sidebar layout
│   ├── router/
│   │   └── index.js            # Route definitions for all pages
│   ├── store/
│   │   ├── index.js            # Vuex store configuration
│   │   └── modules/
│   │       ├── auth.js         # Authentication state management
│   │       └── [other].js      # Placeholder modules for future use
│   ├── services/               # API service layer (placeholders)
│   ├── components/
│   │   ├── auth/               # Authentication components
│   │   ├── admin/              # Admin role components
│   │   ├── doctors/            # Doctor role components
│   │   └── patient/            # Patient role components
│   └── views/
│       ├── dashboard/          # Dashboard views for each role
│       └── NotFound.vue        # 404 error page
├── public/
│   └── index.html              # Main HTML template
└── package.json                # Project dependencies and scripts
```

## 🔐 Authentication (Demo Only)

The authentication system is purely client-side for demonstration:

- **Registration**: Stores users in `localStorage.users` with email, password,
  and role
- **Login**: Matches credentials against stored users and sets a demo token
- **Session**: Token and role persisted in localStorage
- **Security**: No password hashing or server-side verification

**⚠️ Not secure for production use**

## 🧩 Routing Overview

All routes are defined in `src/router/index.js` with history mode:

### Authentication Routes

- `/` - Login page
- `/register-user` - User registration
- `/forgot-password` - Password recovery (UI only)

### Admin Routes

- `/admin-dashboard` - Admin dashboard
- `/patient-management` - Patient CRUD operations
- `/doctor-management` - Doctor management
- `/medicines-inventory` - Medicine stock management
- `/billing-prescriptions` - Billing and prescriptions
- `/appointment-calendar` - Appointment approval
- `/notifications-all` - System notifications
- `/admin-settings` - Admin configuration

### Doctor Routes

- `/doctor-dashboard` - Doctor dashboard
- `/doctor-apppoinment` - Doctor appointments
- `/all-patients` - Patient list
- `/prescriptions-data` - Prescription management
- `/schedule-appoinment` - Appointment scheduling
- `/doctor-notification` - Doctor notifications

### Patient Routes

- `/patient-dashboard` - Patient dashboard
- `/book-appointment` - Appointment booking
- `/medical-reports` - Medical reports
- `/patient-prescriptions` - View prescriptions
- `/pay-bills` - Bill payment
- `/update-profile` - Profile management

**Note**: No navigation guards implemented yet - any user can access any route
manually.

## 🛠️ Setup & Installation

### Prerequisites

- Node.js 16+ (recommended)
- npm 8+

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd hospital-management-system

# Install dependencies
npm install
```

### Development Server

```bash
# Start development server
npm run serve
```

App will be available at: `http://localhost:8080`

### Production Build

```bash
# Build for production
npm run build
```

Output will be in the `dist/` directory.

### Linting

```bash
# Run ESLint
npm run lint
```

## 🗄️ State Management (Vuex)

### Active Module

- **auth**: Handles authentication state, user registration, login, and logout

### Placeholder Modules

The following modules exist but are not yet implemented:

- appointments.js
- billing.js
- doctors.js
- medicines.js
- notifications.js
- patients.js

These can be activated and integrated as the backend API is developed.

## 🔒 Environment Variables (Future Setup)

For production-grade deployment, create a `.env` file:

```env
VUE_APP_API_BASE_URL=https://your-api.example.com/api
VUE_APP_ENV=development
```

## 🧪 Testing (Not Implemented Yet)

Suggested testing stack:

- **Unit Tests**: Jest + vue-jest for component testing
- **E2E Tests**: Cypress or Playwright for end-to-end testing
- **CI/CD**: GitHub Actions for automated testing

## 🧾 Deployment

### Static Hosting

The app can be deployed to any static hosting service:

1. **Build the project**:

   ```bash
   npm run build
   ```

2. **Deploy the `dist/` directory** to:

   - Vercel
   - Netlify
   - AWS S3 + CloudFront
   - GitHub Pages

3. **Configure routing**: Ensure the server redirects all routes to
   `/index.html` for SPA routing to work properly.

### Example: Vercel Deployment

- Connect your repository to Vercel
- Vercel will automatically detect the Vue.js project
- The `vercel.json` can be configured for custom routing if needed

## 🚨 Security Considerations

**This implementation is for demonstration only:**

- ❌ No server-side authentication
- ❌ Sensitive data stored in localStorage
- ❌ No CSRF/XSS protection
- ❌ No password encryption
- ❌ Open routing without role-based guards

**Do NOT use in production without proper security measures.**

## 🧭 Roadmap & Future Enhancements

### High Priority

- [ ] Implement navigation guards with role-based access control
- [ ] Add form validation and input sanitization
- [ ] Integrate real backend API
- [ ] Add loading states and error boundaries

### Medium Priority

- [ ] Implement remaining Vuex modules
- [ ] Add pagination and search in data tables
- [ ] Implement audit logs and activity tracking
- [ ] Add i18n (internationalization)

### Low Priority

- [ ] Add accessibility improvements (WCAG compliance)
- [ ] Implement code splitting and lazy loading
- [ ] Add Sentry for error monitoring
- [ ] Performance optimizations

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Make your changes and commit: `git commit -m "feat: add your feature"`
4. Push to your branch: `git push origin feature/your-feature`
5. Open a Pull Request

Please follow conventional commit format and ensure all tests pass.

## 📄 License

This project is currently unlicensed. Consider adding an appropriate license
(MIT recommended) for open-source distribution.

## 🙋 Support & Questions

- Open an issue for bugs or feature requests
- Check existing issues before creating new ones
- For questions, please use the discussions section

---

Built with ❤️ using Vue 2, Bootstrap 5, and modern web technologies.

## 🧱 Tech Stack

- Vue 2.6
- Vue Router (history mode)
- Vuex (module based, currently only `auth` active)
- Bootstrap 5 (styling & layout)
- Vue Toastification (notifications)

## 🗂️ Project Structure (Key)

```
hospital-management-system/
	src/
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
