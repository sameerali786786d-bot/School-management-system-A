/**
 * Authentication Module - DEMO ONLY
 * Passwords are simple for demo. In production use proper hashing + backend.
 */

const Auth = {
  ROLES: {
    admin: {
      label: 'Admin',
      permissions: ['*']
    },
    principal: {
      label: 'Principal',
      permissions: [
        'dashboard', 'students', 'teachers', 'attendance', 'exams', 'fees',
        'reports', 'notices', 'admissions', 'leaves', 'timetable', 'homework',
        'classes', 'subjects', 'parents', 'staff', 'settings.view'
      ]
    },
    teacher: {
      label: 'Teacher',
      permissions: [
        'dashboard', 'students.view', 'attendance.manage', 'homework',
        'exams.manage', 'results', 'timetable.view', 'notices.view', 'leaves'
      ]
    },
    accountant: {
      label: 'Accountant',
      permissions: [
        'dashboard', 'fees', 'feePayments', 'reports.fees', 'students.view', 'notices.view'
      ]
    },
    staff: {
      label: 'Staff',
      permissions: ['dashboard', 'notices.view', 'leaves']
    }
  },

  DEMO_USERS: [
    { id: 'u1', username: 'admin', email: 'admin@smartschool.pk', password: 'admin123', role: 'admin', name: 'System Administrator', avatar: null },
    { id: 'u2', username: 'principal', email: 'principal@smartschool.pk', password: 'principal123', role: 'principal', name: 'Dr. Muhammad Ali Khan', avatar: null },
    { id: 'u3', username: 'teacher1', email: 'teacher@smartschool.pk', password: 'teacher123', role: 'teacher', name: 'Mrs. Fatima Zahra', avatar: null, teacherId: 't1' },
    { id: 'u4', username: 'accountant', email: 'accounts@smartschool.pk', password: 'account123', role: 'accountant', name: 'Mr. Bilal Ahmed', avatar: null },
    { id: 'u5', username: 'staff1', email: 'staff@smartschool.pk', password: 'staff123', role: 'staff', name: 'Mr. Imran Shah', avatar: null }
  ],

  init() {
    if (!Storage.get('users') || Storage.getAll('users').length === 0) {
      Storage.saveAll('users', this.DEMO_USERS);
    }
  },

  login(username, password, remember = false) {
    const users = Storage.getAll('users');
    const user = users.find(u =>
      (u.username === username || u.email === username) && u.password === password
    );
    if (!user) return { success: false, message: 'Invalid username or password' };
    if (user.status === 'disabled') return { success: false, message: 'Account is disabled' };

    const session = {
      id: user.id,
      username: user.username,
      email: user.email,
      name: user.name,
      role: user.role,
      teacherId: user.teacherId || null,
      loginAt: new Date().toISOString()
    };
    localStorage.setItem(STORAGE_PREFIX + 'currentUser', JSON.stringify(session));
    if (remember) {
      localStorage.setItem(STORAGE_PREFIX + 'remember', 'true');
    } else {
      localStorage.removeItem(STORAGE_PREFIX + 'remember');
    }
    return { success: true, user: session };
  },

  logout() {
    localStorage.removeItem(STORAGE_PREFIX + 'currentUser');
    window.location.href = 'login.html';
  },

  getCurrentUser() {
    try {
      const raw = localStorage.getItem(STORAGE_PREFIX + 'currentUser');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },

  isLoggedIn() {
    return !!this.getCurrentUser();
  },

  requireAuth() {
    if (!this.isLoggedIn()) {
      window.location.href = 'login.html';
      return false;
    }
    return true;
  },

  hasPermission(permission) {
    const user = this.getCurrentUser();
    if (!user) return false;
    const role = this.ROLES[user.role];
    if (!role) return false;
    if (role.permissions.includes('*')) return true;
    return role.permissions.some(p =>
      p === permission ||
      p === permission.split('.')[0] ||
      (permission.startsWith(p + '.') && p.includes('.'))
    );
  },

  canAccess(module) {
    return this.hasPermission(module) || this.hasPermission(module + '.view') || this.hasPermission(module + '.manage');
  },

  getRoleLabel(role) {
    return this.ROLES[role]?.label || role;
  }
};

const STORAGE_PREFIX = 'smps_';
window.Auth = Auth;
