# THE SMART MODERN PUBLIC SCHOOL QAMBER
## School Management System (Demo)

A complete, modern, professional School Management System web application built with pure HTML5, CSS3, Vanilla JavaScript, Bootstrap 5, Chart.js and LocalStorage.

**DEMO ONLY** — Authentication and data persistence use browser LocalStorage. Ready to connect to Firebase, Supabase or MySQL later.

---

## Features

- Role-based login (Admin, Principal, Teacher, Accountant, Staff)
- Dashboard with live stats & Chart.js charts
- Student Management (full CRUD, search, filter, export, profile)
- Teacher Management (CRUD)
- Staff & Parents listing
- Classes & Sections
- Subjects
- Student Attendance (mark present/absent/leave, save, bulk actions)
- Fee Management (collect fee, receipts, pending tracking, CSV export)
- Homework, Exams, Results, Timetable
- Admissions, Leaves, Notices
- Reports with CSV export
- Settings (school profile, session, reset demo data)
- Global search
- Responsive mobile-first design
- Print-friendly pages
- Toast notifications & confirmation modals

---

## Demo Credentials

| Role        | Username    | Password      |
|-------------|-------------|---------------|
| Admin       | admin       | admin123      |
| Principal   | principal   | principal123  |
| Teacher     | teacher1    | teacher123    |
| Accountant  | accountant  | account123    |
| Staff       | staff1      | staff123      |

All accounts are clearly marked as **DEMO ONLY**.

---

## Project Structure

```
school-management-system/
├── index.html              # Redirects to login/dashboard
├── login.html
├── dashboard.html
├── students.html
├── teachers.html
├── staff.html
├── parents.html
├── classes.html
├── subjects.html
├── attendance.html
├── timetable.html
├── homework.html
├── exams.html
├── fees.html
├── admissions.html
├── leaves.html
├── notices.html
├── reports.html
├── settings.html
├── css/
│   ├── style.css
│   ├── responsive.css
│   └── print.css
├── js/
│   ├── storage.js          # LocalStorage abstraction
│   ├── auth.js             # Authentication & roles
│   ├── utils.js            # Helpers, Toast, CSV, print
│   ├── demo-data.js        # Realistic seed data
│   ├── app.js              # Layout, sidebar, search
│   ├── dashboard.js
│   ├── students.js
│   ├── teachers.js
│   ├── attendance.js
│   ├── fees.js
│   └── ... (other modules)
└── assets/
```

---

## How to Run Locally

1. Download or clone the project folder.
2. Open the folder in any static server, or simply open `index.html` / `login.html` in a modern browser.

**Recommended (to avoid CORS issues with modules):**

```bash
# Using Python
cd school-management-system
python -m http.server 8080

# Using Node (npx)
npx serve .

# Using VS Code Live Server extension
```

Then open: `http://localhost:8080`

3. Login with any demo account above.
4. Data is stored in the browser’s LocalStorage and persists across refreshes.

To reset all data: go to **Settings → Reset Demo Data**.

---

## How to Deploy on GitHub Pages

1. Create a new GitHub repository.
2. Upload the entire `school-management-system` folder contents to the root (or `/docs`).
3. Go to **Settings → Pages**.
4. Source: Deploy from branch `main` (or `/docs`).
5. Visit `https://yourusername.github.io/repo-name/`

No build step required — pure static files.

---

## Architecture Overview

```
UI (HTML + Bootstrap)
    ↓
App.js (layout, nav, permissions)
    ↓
Module JS (students.js, fees.js, …)
    ↓
Storage.js (get/set/add/update/delete)
    ↓
LocalStorage  ←→  (later) Firebase / Supabase / MySQL API
```

- **Storage.js** is the only data layer. Replace its methods with `fetch()` / SDK calls when adding a backend.
- **Auth.js** handles roles and simple permission checks. Move password verification to the server in production.
- Each page is a standalone HTML file that loads shared modules, making it easy to convert to SPA or server-rendered pages later.

---

## Connecting Firebase / Supabase Later

1. Create a project in Firebase or Supabase.
2. Replace methods inside `js/storage.js`:

```js
// Example: Firebase
async getAll(collection) {
  const snap = await getDocs(collection(db, collection));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}
```

3. Move authentication to Firebase Auth / Supabase Auth.
4. Never store real passwords in LocalStorage or client-side code.
5. Use HTTPS and proper security rules.

The UI and module structure remain unchanged.

---

## Browser Support

Chrome, Firefox, Edge, Safari (latest two versions).  
Requires LocalStorage and ES6 support.

---

## Security Notes (Demo)

- This is a **frontend-only demo**.
- Passwords are stored in plain text for demo convenience — **never do this in production**.
- No real payment card data is collected.
- Role-based UI hiding is present; enforce permissions on the server when a backend is added.

---

## License

Built as a demonstration project for THE SMART MODERN PUBLIC SCHOOL QAMBER.  
Free to use and adapt for educational purposes.

---

**School:** THE SMART MODERN PUBLIC SCHOOL QAMBER  
**Location:** Qamber Ali Khan, Sindh, Pakistan  
**Academic Session (demo):** 2025-2026
