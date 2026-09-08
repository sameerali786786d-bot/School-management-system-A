/**
 * Authentication Module - DEMO ONLY
 * Passwords are simple for demo. In production use proper hashing + backend.
 */

const AUTH_PREFIX = 'smps_';

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
    try {
      let users = [];
      if (typeof Storage !== 'undefined' && Storage.getAll) {
        users = Storage.getAll('users') || [];
      }
      if (!users.length) {
        if (typeof Storage !== 'undefined' && Storage.saveAll) {
          Storage.saveAll('users', this.DEMO_USERS);
        } else {
          localStorage.setItem(AUTH_PREFIX + 'users', JSON.stringify(this.DEMO_USERS));
        }
      }
    } catch (e) {
      console.error('Auth.init error', e);
      localStorage.setItem(AUTH_PREFIX + 'users', JSON.stringify(this.DEMO_USERS));
    }
  },

  getUsers() {
    try {
      if (typeof Storage !== 'undefined' && Storage.getAll) {
        const users = Storage.getAll('users');
        if (users && users.length) return users;
      }
      const raw = localStorage.getItem(AUTH_PREFIX + 'users');
      if (raw) return JSON.parse(raw);
    } catch (e) {
      console.error('getUsers error', e);
    }
    return this.DEMO_USERS;
  },

  login(username, password, remember = false) {
    try {
      this.init();
      const users = this.getUsers();
      const user = users.find(u =>
        (String(u.username).toLowerCase() === String(username).toLowerCase() ||
         String(u.email).toLowerCase() === String(username).toLowerCase()) &&
        u.password === password
      );
      if (!user) {
        return { success: false, message: 'Invalid username or password' };
      }
      if (user.status === 'disabled') {
        return { success: false, message: 'Account is disabled' };
      }

      const session = {
        id: user.id,
        username: user.username,
        email: user.email,
        name: user.name,
        role: user.role,
        teacherId: user.teacherId || null,
        loginAt: new Date().toISOString()
      };
      localStorage.setItem(AUTH_PREFIX + 'currentUser', JSON.stringify(session));
      if (remember) {
        localStorage.setItem(AUTH_PREFIX + 'remember', 'true');
      } else {
        localStorage.removeItem(AUTH_PREFIX + 'remember');
      }
      return { success: true, user: session };
    } catch (e) {
      console.error('Login error', e);
      return { success: false, message: 'Login failed. Please try again.' };
    }
  },

  logout() {
    localStorage.removeItem(AUTH_PREFIX + 'currentUser');
    window.location.href = 'login.html';
  },

  getCurrentUser() {
    try {
      const raw = localStorage.getItem(AUTH_PREFIX + 'currentUser');
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

window.Auth = Auth;
