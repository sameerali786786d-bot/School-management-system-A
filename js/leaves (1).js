const PageModule = {
  init() {
    document.getElementById('pageTitle').textContent = 'Leave Management';
    const list = Storage.getAll('leaves');
    document.getElementById('tableHead').innerHTML = '<tr><th>Applicant</th><th>Type</th><th>Leave Type</th><th>From</th><th>To</th><th>Reason</th><th>Status</th></tr>';
    if (!list.length) { document.getElementById('emptyState').classList.remove('d-none'); return; }
    document.getElementById('tableBody').innerHTML = list.map(l => `
      <tr><td class="fw-medium">${l.applicantName}</td><td>${l.applicantType}</td><td>${l.leaveType}</td>
      <td>${Utils.formatDate(l.fromDate)}</td><td>${Utils.formatDate(l.toDate)}</td><td>${l.reason}</td>
      <td>${Utils.getStatusBadge(l.status)}</td></tr>`).join('');
  }
};
