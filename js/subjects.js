const PageModule = {
  init() {
    document.getElementById('pageTitle').textContent = 'Subjects';
    const list = Storage.getAll('subjects');
    document.getElementById('tableHead').innerHTML = '<tr><th>Code</th><th>Name</th><th>Max Marks</th><th>Pass Marks</th></tr>';
    if (!list.length) { document.getElementById('emptyState').classList.remove('d-none'); return; }
    document.getElementById('tableBody').innerHTML = list.map(s => `
      <tr><td><code>${s.code}</code></td><td class="fw-medium">${s.name}</td><td>${s.maxMarks}</td><td>${s.passMarks}</td></tr>`).join('');
  }
};
