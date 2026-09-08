const PageModule = {
  init() {
    document.getElementById('pageTitle').textContent = 'Exams & Results';
    const exams = Storage.getAll('exams');
    const results = Storage.getAll('results');
    document.getElementById('tableHead').innerHTML = '<tr><th>Exam</th><th>Type</th><th>Start</th><th>End</th><th>Status</th></tr>';
    if (!exams.length) { document.getElementById('emptyState').classList.remove('d-none'); return; }
    document.getElementById('tableBody').innerHTML = exams.map(e => `
      <tr><td class="fw-medium">${e.name}</td><td>${e.type}</td><td>${Utils.formatDate(e.startDate)}</td>
      <td>${Utils.formatDate(e.endDate)}</td><td>${Utils.getStatusBadge(e.status)}</td></tr>`).join('');
    // Show results summary
    if (results.length) {
      document.querySelector('.card-body').insertAdjacentHTML('beforeend',
        `<hr><h6 class="mb-2">Recent Results (${results.length} records)</h6>
        <p class="text-muted small">Results are available for completed exams. Use Reports module for detailed analysis.</p>`);
    }
  }
};
