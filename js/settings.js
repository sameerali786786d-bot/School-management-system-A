const PageModule = {
  init() {
    document.getElementById('pageTitle').textContent = 'Settings';
    const s = Storage.get('settings') || {};
    const user = Auth.getCurrentUser();
    const isAdmin = user && user.role === 'admin';

    let lastLogin = null;
    let history = [];
    try { lastLogin = JSON.parse(localStorage.getItem('smps_lastLogin') || 'null'); } catch (e) {}
    try {
      history = JSON.parse(localStorage.getItem('smps_loginHistory') || '[]');
      if (!Array.isArray(history)) history = [];
    } catch (e) {}

    const lastLoginHtml = lastLogin
      ? `<div class="row g-2 small">
          <div class="col-md-4"><strong>User:</strong> ${this.esc(lastLogin.name || lastLogin.username)}</div>
          <div class="col-md-4"><strong>Role:</strong> ${this.esc(lastLogin.role)}</div>
          <div class="col-md-4"><strong>Time:</strong> ${this.formatDateTime(lastLogin.loginAt)}</div>
        </div>`
      : '<p class="text-muted small mb-0">No login recorded yet.</p>';

    const historyRows = history.length
      ? history.map((h, i) => `
        <tr>
          <td>${i + 1}</td>
          <td>${this.esc(h.name || h.username)}</td>
          <td><code>${this.esc(h.username)}</code></td>
          <td><span class="badge bg-secondary">${this.esc(h.role)}</span></td>
          <td>${this.formatDateTime(h.loginAt)}</td>
        </tr>`).join('')
      : '<tr><td colspan="5" class="text-center text-muted">No login history yet</td></tr>';

    const usersTab = isAdmin ? `
        <li class="nav-item"><button class="nav-link" data-bs-toggle="tab" data-bs-target="#tabUsers" type="button">Users</button></li>` : '';

    document.querySelector('.card-body').innerHTML = `
      <ul class="nav nav-tabs mb-3" role="tablist">
        <li class="nav-item"><button class="nav-link active" data-bs-toggle="tab" data-bs-target="#tabSchool" type="button">School Settings</button></li>
        <li class="nav-item"><button class="nav-link" data-bs-toggle="tab" data-bs-target="#tabLogin" type="button">Login History</button></li>
        ${usersTab}
      </ul>

      <div class="tab-content">
        <div class="tab-pane fade show active" id="tabSchool">
          <form id="settingsForm" class="row g-3">
            <div class="col-12"><h6 class="text-primary">School Profile</h6></div>
            <div class="col-md-6"><label class="form-label">School Name</label><input class="form-control" id="schoolName" value="${this.esc(s.schoolName)}"></div>
            <div class="col-md-6"><label class="form-label">Principal Name</label><input class="form-control" id="principalName" value="${this.esc(s.principalName)}"></div>
            <div class="col-md-6"><label class="form-label">Address</label><input class="form-control" id="address" value="${this.esc(s.address)}"></div>
            <div class="col-md-3"><label class="form-label">Phone</label><input class="form-control" id="phone" value="${this.esc(s.phone)}"></div>
            <div class="col-md-3"><label class="form-label">Email</label><input class="form-control" id="email" value="${this.esc(s.email)}"></div>
            <div class="col-12"><hr><h6 class="text-primary">Academic</h6></div>
            <div class="col-md-4"><label class="form-label">Academic Session</label><input class="form-control" id="session" value="${this.esc(s.academicSession)}"></div>
            <div class="col-md-4"><label class="form-label">Currency</label><input class="form-control" id="currency" value="${this.esc(s.currency || 'PKR')}"></div>
            <div class="col-md-4"><label class="form-label">Passing %</label><input type="number" class="form-control" id="passPct" value="${s.passingPercentage || 50}"></div>
            <div class="col-12">
              <button type="submit" class="btn btn-primary">Save Settings</button>
              <button type="button" class="btn btn-outline-danger ms-2" id="resetDemo">Reset Demo Data</button>
            </div>
          </form>
          <div class="alert alert-info mt-3 small mb-0">
            <i class="fas fa-user-circle me-1"></i>
            <strong>Profile Photo</strong> alag hai — top-right menu → <em>Profile Photo</em>.
          </div>
        </div>

        <div class="tab-pane fade" id="tabLogin">
          <div class="card border mb-3">
            <div class="card-header bg-light py-2"><strong><i class="fas fa-clock me-1"></i> Last Login</strong></div>
            <div class="card-body">${lastLoginHtml}</div>
          </div>
          <div class="d-flex justify-content-between align-items-center mb-2">
            <h6 class="mb-0 text-primary">Login History</h6>
            <button type="button" class="btn btn-sm btn-outline-danger" id="clearLoginHistory">Clear History</button>
          </div>
          <div class="table-responsive">
            <table class="table table-sm table-hover align-middle">
              <thead><tr><th>#</th><th>Name</th><th>Username</th><th>Role</th><th>Login Time</th></tr></thead>
              <tbody>${historyRows}</tbody>
            </table>
          </div>
        </div>

        ${isAdmin ? `
        <div class="tab-pane fade" id="tabUsers">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <h6 class="mb-0 text-primary">Manage Users</h6>
            <button type="button" class="btn btn-primary btn-sm" id="btnAddUser"><i class="fas fa-plus me-1"></i>Add User</button>
          </div>
          <div class="table-responsive">
            <table class="table table-hover align-middle">
              <thead>
                <tr><th>Name</th><th>Username</th><th>Email</th><th>Role</th><th>Status</th><th>Actions</th></tr>
              </thead>
              <tbody id="usersTableBody"></tbody>
            </table>
          </div>
          <div class="alert alert-info small mt-2 mb-0">
            <i class="fab fa-whatsapp text-success me-1"></i>
            Admin WhatsApp contact: <strong>0326-7029939</strong>
            <a href="https://wa.me/923267029939" target="_blank" class="btn btn-sm btn-success ms-2"><i class="fab fa-whatsapp"></i> Chat</a>
          </div>
        </div>` : ''}
      </div>

      <!-- Add/Edit User Modal -->
      <div class="modal fade" id="userModal" tabindex="-1">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="userModalTitle">Add User</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <form id="userForm">
              <div class="modal-body">
                <input type="hidden" id="userEditId">
                <div class="mb-2">
                  <label class="form-label">Full Name *</label>
                  <input type="text" class="form-control" id="userName" required>
                </div>
                <div class="mb-2">
                  <label class="form-label">Username *</label>
                  <input type="text" class="form-control" id="userUsername" required>
                </div>
                <div class="mb-2">
                  <label class="form-label">Email</label>
                  <input type="email" class="form-control" id="userEmail">
                </div>
                <div class="mb-2">
                  <label class="form-label">Phone / WhatsApp</label>
                  <input type="tel" class="form-control" id="userPhone" placeholder="03XXXXXXXXX">
                </div>
                <div class="mb-2">
                  <label class="form-label">Password *</label>
                  <input type="text" class="form-control" id="userPassword" required placeholder="Enter password">
                </div>
                <div class="mb-2">
                  <label class="form-label">Role *</label>
                  <select class="form-select" id="userRole" required>
                    <option value="admin">Admin</option>
                    <option value="principal">Principal</option>
                    <option value="teacher">Teacher</option>
                    <option value="accountant">Accountant</option>
                    <option value="staff">Staff</option>
                  </select>
                </div>
                <div class="mb-0">
                  <label class="form-label">Status</label>
                  <select class="form-select" id="userStatus">
                    <option value="active">Active</option>
                    <option value="disabled">Disabled</option>
                  </select>
                </div>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                <button type="submit" class="btn btn-primary">Save User</button>
              </div>
            </form>
          </div>
        </div>
      </div>`;

    document.getElementById('settingsForm').addEventListener('submit', e => {
      e.preventDefault();
      const settings = Storage.get('settings') || {};
      settings.schoolName = document.getElementById('schoolName').value;
      settings.principalName = document.getElementById('principalName').value;
      settings.address = document.getElementById('address').value;
      settings.phone = document.getElementById('phone').value;
      settings.email = document.getElementById('email').value;
      settings.academicSession = document.getElementById('session').value;
      settings.currency = document.getElementById('currency').value;
      settings.passingPercentage = parseInt(document.getElementById('passPct').value) || 50;
      Storage.set('settings', settings);
      Toast.show('Settings saved', 'success');
    });

    document.getElementById('resetDemo')?.addEventListener('click', async () => {
      if (!(await Utils.confirmDelete('This will clear ALL data and re-seed demo data. Continue?'))) return;
      Storage.clearAll();
      DemoData.seed();
      Toast.show('Demo data reset. Reloading...', 'success');
      setTimeout(() => location.reload(), 1000);
    });

    document.getElementById('clearLoginHistory')?.addEventListener('click', async () => {
      if (!(await Utils.confirmDelete('Clear all login history?'))) return;
      localStorage.removeItem('smps_loginHistory');
      localStorage.removeItem('smps_lastLogin');
      Toast.show('Login history cleared', 'success');
      setTimeout(() => location.reload(), 500);
    });

    if (isAdmin) {
      this.renderUsers();
      document.getElementById('btnAddUser')?.addEventListener('click', () => this.openUserModal());
      document.getElementById('userForm')?.addEventListener('submit', e => this.saveUser(e));
    }
  },

  getUsersList() {
    if (typeof Auth !== 'undefined' && Auth.getUsers) return Auth.getUsers();
    try {
      return JSON.parse(localStorage.getItem('smps_users') || '[]') || [];
    } catch (e) {
      return [];
    }
  },

  saveUsersList(users) {
    if (typeof Storage !== 'undefined' && Storage.saveAll) Storage.saveAll('users', users);
    localStorage.setItem('smps_users', JSON.stringify(users));
  },

  renderUsers() {
    const tbody = document.getElementById('usersTableBody');
    if (!tbody) return;
    const users = this.getUsersList();
    if (!users.length) {
      tbody.innerHTML = '<tr><td colspan="6" class="text-center text-muted">No users</td></tr>';
      return;
    }
    tbody.innerHTML = users.map(u => `
      <tr>
        <td class="fw-medium">${this.esc(u.name)}</td>
        <td><code>${this.esc(u.username)}</code></td>
        <td>${this.esc(u.email || '-')}</td>
        <td><span class="badge bg-primary">${this.esc(u.role)}</span></td>
        <td>${Utils.getStatusBadge(u.status || 'active')}</td>
        <td>
          <button class="btn btn-sm btn-outline-primary" onclick="PageModule.openUserModal('${u.id}')"><i class="fas fa-edit"></i></button>
          <button class="btn btn-sm btn-outline-danger" onclick="PageModule.deleteUser('${u.id}')"><i class="fas fa-trash"></i></button>
        </td>
      </tr>`).join('');
  },

  openUserModal(id = null) {
    document.getElementById('userForm').reset();
    document.getElementById('userEditId').value = id || '';
    document.getElementById('userModalTitle').textContent = id ? 'Edit User' : 'Add User';
    if (id) {
      const u = this.getUsersList().find(x => x.id === id);
      if (u) {
        document.getElementById('userName').value = u.name || '';
        document.getElementById('userUsername').value = u.username || '';
        document.getElementById('userEmail').value = u.email || '';
        document.getElementById('userPhone').value = u.phone || '';
        document.getElementById('userPassword').value = u.password || '';
        document.getElementById('userRole').value = u.role || 'teacher';
        document.getElementById('userStatus').value = u.status || 'active';
      }
    }
    new bootstrap.Modal(document.getElementById('userModal')).show();
  },

  saveUser(e) {
    e.preventDefault();
    const id = document.getElementById('userEditId').value;
    const username = document.getElementById('userUsername').value.trim();
    const password = document.getElementById('userPassword').value;
    const name = document.getElementById('userName').value.trim();
    const email = document.getElementById('userEmail').value.trim();
    const phone = document.getElementById('userPhone').value.trim();
    const role = document.getElementById('userRole').value;
    const status = document.getElementById('userStatus').value;

    if (!username || !password || !name) {
      Toast.show('Name, username and password required', 'warning');
      return;
    }

    let users = this.getUsersList();
    const duplicate = users.find(u => u.username === username && u.id !== id);
    if (duplicate) {
      Toast.show('Username already exists', 'error');
      return;
    }

    if (id) {
      users = users.map(u => u.id === id ? { ...u, name, username, email, phone, password, role, status } : u);
      Toast.show('User updated', 'success');
    } else {
      users.push({
        id: 'u_' + Date.now(),
        name, username, email, phone, password, role, status,
        avatar: null
      });
      Toast.show('User added', 'success');
    }
    this.saveUsersList(users);
    bootstrap.Modal.getInstance(document.getElementById('userModal')).hide();
    this.renderUsers();
  },

  async deleteUser(id) {
    const users = this.getUsersList();
    const u = users.find(x => x.id === id);
    if (u && u.username === 'admin') {
      Toast.show('Cannot delete main admin account', 'warning');
      return;
    }
    if (!(await Utils.confirmDelete('Delete this user?'))) return;
    this.saveUsersList(users.filter(x => x.id !== id));
    Toast.show('User deleted', 'success');
    this.renderUsers();
  },

  formatDateTime(iso) {
    if (!iso) return '-';
    try {
      const d = new Date(iso);
      if (isNaN(d)) return iso;
      return d.toLocaleString('en-PK', {
        day: '2-digit', month: 'short', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
      });
    } catch (e) { return iso; }
  },

  esc(v) {
    return String(v || '').replace(/"/g, '&quot;').replace(/</g, '&lt;');
  }
};
