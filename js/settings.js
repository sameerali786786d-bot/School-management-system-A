const PageModule = {
  init() {
    document.getElementById('pageTitle').textContent = 'Settings';
    const s = Storage.get('settings') || {};
    document.querySelector('.card-body').innerHTML = `
      <form id="settingsForm" class="row g-3">
        <div class="col-12"><h6 class="text-primary">School Profile</h6></div>
        <div class="col-md-6"><label class="form-label">School Name</label><input class="form-control" id="schoolName" value="${s.schoolName||''}"></div>
        <div class="col-md-6"><label class="form-label">Principal Name</label><input class="form-control" id="principalName" value="${s.principalName||''}"></div>
        <div class="col-md-6"><label class="form-label">Address</label><input class="form-control" id="address" value="${s.address||''}"></div>
        <div class="col-md-3"><label class="form-label">Phone</label><input class="form-control" id="phone" value="${s.phone||''}"></div>
        <div class="col-md-3"><label class="form-label">Email</label><input class="form-control" id="email" value="${s.email||''}"></div>
        <div class="col-12"><hr><h6 class="text-primary">Academic</h6></div>
        <div class="col-md-4"><label class="form-label">Academic Session</label><input class="form-control" id="session" value="${s.academicSession||''}"></div>
        <div class="col-md-4"><label class="form-label">Currency</label><input class="form-control" id="currency" value="${s.currency||'PKR'}"></div>
        <div class="col-md-4"><label class="form-label">Passing %</label><input type="number" class="form-control" id="passPct" value="${s.passingPercentage||50}"></div>
        <div class="col-12"><button type="submit" class="btn btn-primary">Save Settings</button>
          <button type="button" class="btn btn-outline-danger ms-2" id="resetDemo">Reset Demo Data</button></div>
      </form>
      <div class="alert alert-warning mt-3 small"><i class="fas fa-info-circle me-1"></i> DEMO MODE — Settings are stored in LocalStorage only.</div>`;
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
  }
};
