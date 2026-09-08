const PageModule = {
  init() {
    document.getElementById('pageTitle').textContent = 'Parents';
    const list = Storage.getAll('parents');
    document.getElementById('tableHead').innerHTML = '<tr><th>Father/Guardian</th><th>Mother</th><th>Phone</th><th>Email</th><th>Occupation</th><th>Children</th></tr>';
    if (!list.length) { document.getElementById('emptyState').classList.remove('d-none'); return; }
    document.getElementById('tableBody').innerHTML = list.map(p => `
      <tr><td class="fw-medium">${p.fatherName}</td><td>${p.motherName||'-'}</td><td>${p.phone||'-'}</td>
      <td>${p.email||'-'}</td><td>${p.occupation||'-'}</td><td>${(p.children||[]).length}</td></tr>`).join('');
  }
};
