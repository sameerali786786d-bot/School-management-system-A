/**
 * Main Application Module - Shared layout, navigation, permissions
 */

const App = {
  currentPage: '',

  init() {
    if (!Auth.requireAuth()) return;
    DemoData.seed();
    this.renderLayout();
    this.bindEvents();
    this.updateNotificationBadge();
  },

  renderLayout() {
    const user = Auth.getCurrentUser();
    if (!user) return;

    // Inject sidebar & topbar if not present
    if (!document.getElementById('appSidebar')) {
      document.body.insertAdjacentHTML('afterbegin', this.getSidebarHTML() + this.getOverlayHTML());
      const main = document.querySelector('.page-content')?.parentElement;
      if (main && !document.querySelector('.topbar')) {
        main.insertAdjacentHTML('afterbegin', this.getTopbarHTML(user));
      }
    }

    this.highlightActiveNav();
    this.applyPermissions();
  },

  getSidebarHTML() {
    return `
    <aside class="sidebar" id="appSidebar">
      <div class="sidebar-brand">
        <div class="brand-icon">SM</div>
        <div class="brand-text">SMPS Qamber</div>
      </div>
      <nav class="sidebar-nav">
        <div class="nav-section-title">Main</div>
        <a href="dashboard.html" class="nav-link" data-page="dashboard" data-perm="dashboard">
          <i class="fas fa-tachometer-alt"></i><span class="nav-text">Dashboard</span>
        </a>

        <div class="nav-section-title">Academic</div>
        <a href="students.html" class="nav-link" data-page="students" data-perm="students">
          <i class="fas fa-user-graduate"></i><span class="nav-text">Students</span>
        </a>
        <a href="teachers.html" class="nav-link" data-page="teachers" data-perm="teachers">
          <i class="fas fa-chalkboard-teacher"></i><span class="nav-text">Teachers</span>
        </a>
        <a href="staff.html" class="nav-link" data-page="staff" data-perm="staff">
          <i class="fas fa-users"></i><span class="nav-text">Staff</span>
        </a>
        <a href="parents.html" class="nav-link" data-page="parents" data-perm="parents">
          <i class="fas fa-user-friends"></i><span class="nav-text">Parents</span>
        </a>
        <a href="classes.html" class="nav-link" data-page="classes" data-perm="classes">
          <i class="fas fa-school"></i><span class="nav-text">Classes & Sections</span>
        </a>
        <a href="subjects.html" class="nav-link" data-page="subjects" data-perm="subjects">
          <i class="fas fa-book"></i><span class="nav-text">Subjects</span>
        </a>

        <div class="nav-section-title">Operations</div>
        <a href="attendance.html" class="nav-link" data-page="attendance" data-perm="attendance">
          <i class="fas fa-calendar-check"></i><span class="nav-text">Attendance</span>
        </a>
        <a href="timetable.html" class="nav-link" data-page="timetable" data-perm="timetable">
          <i class="fas fa-clock"></i><span class="nav-text">Timetable</span>
        </a>
        <a href="homework.html" class="nav-link" data-page="homework" data-perm="homework">
          <i class="fas fa-tasks"></i><span class="nav-text">Homework</span>
        </a>
        <a href="exams.html" class="nav-link" data-page="exams" data-perm="exams">
          <i class="fas fa-file-alt"></i><span class="nav-text">Exams & Results</span>
        </a>

        <div class="nav-section-title">Finance</div>
        <a href="fees.html" class="nav-link" data-page="fees" data-perm="fees">
          <i class="fas fa-money-bill-wave"></i><span class="nav-text">Fees</span>
        </a>

        <div class="nav-section-title">Admin</div>
        <a href="admissions.html" class="nav-link" data-page="admissions" data-perm="admissions">
          <i class="fas fa-user-plus"></i><span class="nav-text">Admissions</span>
        </a>
        <a href="leaves.html" class="nav-link" data-page="leaves" data-perm="leaves">
          <i class="fas fa-calendar-minus"></i><span class="nav-text">Leave Management</span>
        </a>
        <a href="notices.html" class="nav-link" data-page="notices" data-perm="notices">
          <i class="fas fa-bullhorn"></i><span class="nav-text">Notices</span>
        </a>
        <a href="reports.html" class="nav-link" data-page="reports" data-perm="reports">
          <i class="fas fa-chart-bar"></i><span class="nav-text">Reports</span>
        </a>
        <a href="settings.html" class="nav-link" data-page="settings" data-perm="settings">
          <i class="fas fa-cog"></i><span class="nav-text">Settings</span>
        </a>

        <div class="nav-section-title">Account</div>
        <a href="#" class="nav-link" id="logoutBtn">
          <i class="fas fa-sign-out-alt"></i><span class="nav-text">Logout</span>
        </a>
      </nav>
    </aside>`;
  },

  getOverlayHTML() {
    return `<div class="sidebar-overlay" id="sidebarOverlay"></div>`;
  },

  getTopbarHTML(user) {
    const initials = (user.name || 'U').split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    return `
    <header class="topbar">
      <div class="topbar-left">
        <button class="btn-icon" id="sidebarToggle" aria-label="Toggle sidebar">
          <i class="fas fa-bars"></i>
        </button>
        <nav aria-label="breadcrumb" class="d-none d-md-block">
          <ol class="breadcrumb mb-0" id="pageBreadcrumb">
            <li class="breadcrumb-item"><a href="dashboard.html">Home</a></li>
            <li class="breadcrumb-item active" id="breadcrumbCurrent">Dashboard</li>
          </ol>
        </nav>
      </div>
      <div class="topbar-right">
        <div class="position-relative d-none d-md-block me-2">
          <input type="search" class="form-control form-control-sm" id="globalSearch" placeholder="Search students, teachers..." style="width:220px;border-radius:20px;padding-left:36px;">
          <i class="fas fa-search position-absolute" style="left:12px;top:50%;transform:translateY(-50%);color:#94a3b8;font-size:.85rem;"></i>
          <div class="search-dropdown" id="searchResults"></div>
        </div>
        <button class="btn-icon" id="notifBtn" title="Notifications">
          <i class="fas fa-bell"></i>
          <span class="badge-dot" id="notifDot" style="display:none;"></span>
        </button>
        <div class="dropdown user-dropdown">
          <button class="dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
            <div class="user-avatar">${initials}</div>
            <span class="user-name d-none d-lg-inline">${user.name}</span>
            <i class="fas fa-chevron-down d-none d-lg-inline" style="font-size:.7rem;"></i>
          </button>
          <ul class="dropdown-menu dropdown-menu-end">
            <li><h6 class="dropdown-header">${user.name}<br><small class="text-muted">${Auth.getRoleLabel(user.role)}</small></h6></li>
            <li><hr class="dropdown-divider"></li>
            <li><a class="dropdown-item" href="settings.html"><i class="fas fa-cog me-2"></i>Settings</a></li>
            <li><a class="dropdown-item text-danger" href="#" id="logoutBtnTop"><i class="fas fa-sign-out-alt me-2"></i>Logout</a></li>
          </ul>
        </div>
      </div>
    </header>`;
  },

  bindEvents() {
    document.getElementById('sidebarToggle')?.addEventListener('click', () => this.toggleSidebar());
    document.getElementById('sidebarOverlay')?.addEventListener('click', () => this.closeMobileSidebar());
    document.getElementById('logoutBtn')?.addEventListener('click', (e) => { e.preventDefault(); Auth.logout(); });
    document.getElementById('logoutBtnTop')?.addEventListener('click', (e) => { e.preventDefault(); Auth.logout(); });

    const searchInput = document.getElementById('globalSearch');
    if (searchInput) {
      searchInput.addEventListener('input', Utils.debounce((e) => this.globalSearch(e.target.value), 250));
      searchInput.addEventListener('blur', () => setTimeout(() => document.getElementById('searchResults')?.classList.remove('show'), 200));
    }

    document.getElementById('notifBtn')?.addEventListener('click', () => {
      window.location.href = 'notices.html';
    });
  },

  toggleSidebar() {
    const sidebar = document.getElementById('appSidebar');
    const overlay = document.getElementById('sidebarOverlay');
    if (window.innerWidth < 992) {
      sidebar.classList.toggle('mobile-open');
      overlay.classList.toggle('show');
    } else {
      sidebar.classList.toggle('collapsed');
    }
  },

  closeMobileSidebar() {
    document.getElementById('appSidebar')?.classList.remove('mobile-open');
    document.getElementById('sidebarOverlay')?.classList.remove('show');
  },

  highlightActiveNav() {
    const page = window.location.pathname.split('/').pop().replace('.html', '') || 'dashboard';
    this.currentPage = page;
    document.querySelectorAll('.sidebar .nav-link').forEach(link => {
      link.classList.toggle('active', link.dataset.page === page);
    });
    const bc = document.getElementById('breadcrumbCurrent');
    if (bc) bc.textContent = page.charAt(0).toUpperCase() + page.slice(1).replace(/-/g, ' ');
  },

  applyPermissions() {
    document.querySelectorAll('[data-perm]').forEach(el => {
      const perm = el.dataset.perm;
      if (!Auth.canAccess(perm)) {
        el.style.display = 'none';
      }
    });
  },

  globalSearch(query) {
    const dropdown = document.getElementById('searchResults');
    if (!dropdown) return;
    if (!query || query.length < 2) {
      dropdown.classList.remove('show');
      return;
    }
    const q = query.toLowerCase();
    const results = [];

    Storage.getAll('students').forEach(s => {
      if (s.fullName.toLowerCase().includes(q) || s.admissionNo.toLowerCase().includes(q)) {
        results.push({ type: 'Student', icon: 'fa-user-graduate', name: s.fullName, sub: s.admissionNo + ' • ' + s.className, link: `students.html?id=${s.id}` });
      }
    });
    Storage.getAll('teachers').forEach(t => {
      if (t.name.toLowerCase().includes(q) || (t.email || '').toLowerCase().includes(q)) {
        results.push({ type: 'Teacher', icon: 'fa-chalkboard-teacher', name: t.name, sub: t.designation, link: `teachers.html?id=${t.id}` });
      }
    });
    Storage.getAll('staff').forEach(s => {
      if (s.name.toLowerCase().includes(q)) {
        results.push({ type: 'Staff', icon: 'fa-users', name: s.name, sub: s.position, link: 'staff.html' });
      }
    });

    if (results.length === 0) {
      dropdown.innerHTML = '<div class="search-item text-muted">No results found</div>';
    } else {
      dropdown.innerHTML = results.slice(0, 8).map(r => `
        <a href="${r.link}" class="search-item text-decoration-none text-dark">
          <i class="fas ${r.icon}"></i>
          <div><strong>${r.name}</strong><br><small class="text-muted">${r.type} • ${r.sub}</small></div>
        </a>`).join('');
    }
    dropdown.classList.add('show');
  },

  updateNotificationBadge() {
    const notifs = Storage.getAll('notifications').filter(n => !n.read);
    const dot = document.getElementById('notifDot');
    if (dot) dot.style.display = notifs.length ? 'block' : 'none';
  },

  // Confirm modal HTML (shared)
  ensureConfirmModal() {
    if (document.getElementById('confirmModal')) return;
    document.body.insertAdjacentHTML('beforeend', `
    <div class="modal fade" id="confirmModal" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Confirm</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body" id="confirmModalBody">Are you sure?</div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
            <button type="button" class="btn btn-danger" id="confirmModalOk">Delete</button>
          </div>
        </div>
      </div>
    </div>`);
  }
};

// Shared page template helper
function pageScripts() {
  return `
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"><\/script>
  <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js"><\/script>
  <script src="js/storage.js"><\/script>
  <script src="js/utils.js"><\/script>
  <script src="js/auth.js"><\/script>
  <script src="js/demo-data.js"><\/script>
  <script src="js/app.js"><\/script>`;
}

window.App = App;
window.pageScripts = pageScripts;
