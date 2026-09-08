const PageModule = {
  init() {
    document.getElementById('pageTitle').textContent = 'Homework';
    const list = Storage.getAll('homework');
    document.getElementById('tableHead').innerHTML = '<tr><th>Title</th><th>Subject</th><th>Class</th><th>Teacher</th><th>Assigned</th><th>Due</th><th>Status</th></tr>';
    if (!list.length) { document.getElementById('emptyState').classList.remove('d-none'); return; }
    document.getElementById('tableBody').innerHTML = list.map(h => `
      <tr><td class="fw-medium">${h.title}</td><td>${h.subjectName}</td><td>${h.className} - ${h.section}</td>
      <td>${h.teacherName}</td><td>${Utils.formatDate(h.assignedDate)}</td><td>${Utils.formatDate(h.dueDate)}</td>
      <td>${Utils.getStatusBadge(h.status)}</td></tr>`).join('');
  }
};
