const PageModule = {
  init() {
    document.getElementById('pageTitle').textContent = 'Notices & Announcements';
    const list = Storage.getAll('notices');
    document.getElementById('tableHead').innerHTML = '<tr><th>Title</th><th>Audience</th><th>Date</th><th>Priority</th><th>Status</th></tr>';
    if (!list.length) { document.getElementById('emptyState').classList.remove('d-none'); return; }
    document.getElementById('tableBody').innerHTML = list.map(n => `
      <tr><td class="fw-medium">${n.title}</td><td>${n.audience}</td><td>${Utils.formatDate(n.date)}</td>
      <td><span class="badge bg-${n.priority==='high'?'danger':n.priority==='medium'?'warning':'secondary'}">${n.priority}</span></td>
      <td>${Utils.getStatusBadge(n.status)}</td></tr>`).join('');
  }
};
