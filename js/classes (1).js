const PageModule = {
  init() {
    document.getElementById('pageTitle').textContent = 'Classes & Sections';
    const classes = Storage.getAll('classes');
    const sections = Storage.getAll('sections');
    document.getElementById('tableHead').innerHTML = '<tr><th>Class</th><th>Sections</th><th>Students</th><th>Status</th></tr>';
    if (!classes.length) { document.getElementById('emptyState').classList.remove('d-none'); return; }
    const students = Storage.getAll('students');
    document.getElementById('tableBody').innerHTML = classes.map(c => {
      const count = students.filter(s => s.classId === c.id).length;
      return `<tr><td class="fw-medium">${c.name}</td><td>${(c.sections||[]).join(', ')}</td><td>${count}</td><td>${Utils.getStatusBadge(c.status)}</td></tr>`;
    }).join('');
  }
};
