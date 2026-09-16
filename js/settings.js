const PageModule = {
  init() {
    document.getElementById('pageTitle').textContent = 'Settings';
    const s = Storage.get('settings') || {};

    let lastLogin = null;
    let history = [];
    try {
      lastLogin = JSON.parse(localStorage.getItem('smps_lastLogin') || 'null');
    } catch (e) {}
    try {
      history = JSON.parse(localStorage.getItem('smps_loginHistory') || '[]');
      if (!Array.isArray(history)) history = [];
    } catch (e) {}

    const lastLoginHtml = lastLogin
      ? `<div class="row g-2 small">
          <div class="col-md-4"><strong>User:</strong> ${lastLogin.name || lastLogin.username || '-'}</div>
          <div class="col-md-4"><strong>Role:</strong> ${lastLogin.role || '-'}</div>
          <div class="col-md-4"><strong>Time:</strong> ${this.formatDateTime(lastLogin.loginAt)}</div>
        </div>`
      : '<p class="text-muted small mb-0">No login recorded yet.</p>';

    const historyRows = history.length
      ? history.map((h, i) => `
        <tr>
          <td>${i + 1}</td>
          <td>${h.name || h.username || '-'}</td>
          <td><code>${h.username || '-'}</code></td>
          <td><span class="badge bg-secondary">${h.role || '-'}</span></td>
          <td>${this.formatDateTime(h.loginAt)}</td>
        </tr>`).join('')
      : '<tr><td colspan="5" class="text-center text-muted">No login history yet</td></tr>';

    document.querySelector('.card-body').innerHTML = `
      <ul class="nav nav-tabs mb-3" role="tablist">
        <li class="nav-item"><button class="nav-link active" data-bs-toggle="tab" data-bs-target="#tabSchool" type="button">School Settings</button></li>
        <li class="nav-item"><button class="nav-link" data-bs-toggle="tab" data-bs-target="#tabLogin" type="button">Login History</button></li>
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
            <strong>Profile Photo</strong> alag hai — top-right menu se <em>Profile Photo</em> kholen (Settings se alag).
          </div>
          <div class="alert alert-warning mt-2 small mb-0"><i class="fas fa-info-circle me-1"></i> DEMO MODE — Settings LocalStorage mein save hoti hain.</div>
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
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Username</th>
                  <th>Role</th>
                  <th>Login Time</th>
                </tr>
              </thead>
              <tbody>${historyRows}</tbody>
            </table>
          </div>
          <p class="text-muted small mb-0">Last 30 logins save hoti hain. Future logins yahan automatically add hongi.</p>
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

    document.getElementById('resetDemo').addEventListener('click', async () => {
      if (!(await Utils.confirmDelete('This will clear ALL data and re-seed demo data. Continue?'))) return;
      Storage.clearAll();
      DemoData.seed();
      Toast.show('Demo data reset. Reloading...', 'success');
      setTimeout(() => location.reload(), 1000);
    });

    document.getElementById('clearLoginHistory').addEventListener('click', async () => {
      if (!(await Utils.confirmDelete('Clear all login history?'))) return;
      localStorage.removeItem('smps_loginHistory');
      localStorage.removeItem('smps_lastLogin');
      Toast.show('Login history cleared', 'success');
      setTimeout(() => location.reload(), 500);
    });
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
    } catch (e) {
      return iso;
    }
  },

  esc(v) {
    return String(v || '').replace(/"/g, '&quot;').replace(/</g, '&lt;');
  }
};
