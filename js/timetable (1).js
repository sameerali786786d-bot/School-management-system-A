const PageModule = {
  init() {
    document.getElementById('pageTitle').textContent = 'Timetable';
    const list = Storage.getAll('timetable');
    document.getElementById('tableHead').innerHTML = '<tr><th>Day</th><th>Period</th><th>Time</th><th>Subject</th><th>Teacher</th><th>Room</th></tr>';
    if (!list.length) { document.getElementById('emptyState').classList.remove('d-none'); return; }
    // Show Grade 3-A timetable
    const filtered = list.filter(t => t.classId === 'c3' && t.section === 'A');
    document.querySelector('.card-body').insertAdjacentHTML('afterbegin', '<p class="text-muted small mb-2">Showing: <strong>Grade 3 - Section A</strong></p>');
    document.getElementById('tableBody').innerHTML = filtered.map(t => `
      <tr><td>${t.day}</td><td>${t.period}</td><td>${t.startTime} - ${t.endTime}</td>
      <td class="fw-medium">${t.subjectName}</td><td>${t.teacherName}</td><td>${t.room}</td></tr>`).join('');
  }
};
