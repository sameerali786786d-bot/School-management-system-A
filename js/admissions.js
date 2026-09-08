const PageModule = {
  init() {
    document.getElementById('pageTitle').textContent = 'Admissions';
    const list = Storage.getAll('admissions');
    document.getElementById('tableHead').innerHTML = '<tr><th>App No</th><th>Student</th><th>Father</th><th>Class</th><th>Phone</th><th>Date</th><th>Status</th></tr>';
    if (!list.length) { document.getElementById('emptyState').classList.remove('d-none'); return; }
    document.getElementById('tableBody').innerHTML = list.map(a => `
      <tr><td><code>${a.applicationNo}</code></td><td class="fw-medium">${a.studentName}</td><td>${a.fatherName}</td>
      <td>${a.applyingClass}</td><td>${a.phone}</td><td>${Utils.formatDate(a.applicationDate)}</td>
      <td>${Utils.getStatusBadge(a.status)}</td></tr>`).join('');
  }
};

