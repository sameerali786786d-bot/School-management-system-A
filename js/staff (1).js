const PageModule = {
  init() {
    document.getElementById('pageTitle').textContent = 'Staff';
    const list = Storage.getAll('staff');
    document.getElementById('tableHead').innerHTML = '<tr><th>Name</th><th>Position</th><th>Phone</th><th>Email</th><th>Joining</th><th>Salary</th><th>Status</th></tr>';
    if (!list.length) { document.getElementById('emptyState').classList.remove('d-none'); return; }
    document.getElementById('tableBody').innerHTML = list.map(s => `
      <tr><td class="fw-medium">${s.name}</td><td>${s.position}</td><td>${s.phone||'-'}</td><td>${s.email||'-'}</td>
      <td>${Utils.formatDate(s.joiningDate)}</td><td>${Utils.formatCurrency(s.salary)}</td><td>${Utils.getStatusBadge(s.status)}</td></tr>`).join('');
  }
};
