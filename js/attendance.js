const Attendance = {
  currentStudents: [], marks: {},
  init() {
    document.getElementById('attDate').value = new Date().toISOString().slice(0,10);
    const classes = Storage.getAll('classes');
    const sel = document.getElementById('attClass');
    sel.innerHTML = '<option value="">Select Class</option>';
    classes.forEach(c => sel.innerHTML += `<option value="${c.id}">${c.name}</option>`);
    sel.addEventListener('change', () => {
      const cls = Storage.getById('classes', sel.value);
      const sec = document.getElementById('attSection');
      sec.innerHTML = '<option value="">Select</option>';
      if (cls) cls.sections.forEach(s => sec.innerHTML += `<option value="${s}">${s}</option>`);
    });
    document.getElementById('loadStudents').addEventListener('click', () => this.load());
    document.getElementById('markAllPresent').addEventListener('click', () => this.markAll('present'));
    document.getElementById('markAllAbsent').addEventListener('click', () => this.markAll('absent'));
    document.getElementById('saveAttendance').addEventListener('click', () => this.save());
  },
  load() {
    const date = document.getElementById('attDate').value;
    const classId = document.getElementById('attClass').value;
    const section = document.getElementById('attSection').value;
    if (!date || !classId || !section) { Toast.show('Please select date, class and section', 'warning'); return; }
    this.currentStudents = Storage.getAll('students').filter(s => s.classId === classId && s.section === section && s.status === 'active');
    this.marks = {};
    Storage.getAll('attendance').filter(a => a.date === date && a.classId === classId && a.section === section)
      .forEach(a => { this.marks[a.studentId] = a.status; });
    const tbody = document.getElementById('attBody');
    const empty = document.getElementById('attEmpty');
    if (!this.currentStudents.length) {
      tbody.innerHTML = ''; empty.classList.remove('d-none');
      empty.innerHTML = '<i class="fas fa-user-graduate"></i><h5>No students in this class/section</h5>';
      document.getElementById('saveAttendance').disabled = true; return;
    }
    empty.classList.add('d-none');
    document.getElementById('saveAttendance').disabled = false;
    tbody.innerHTML = this.currentStudents.map((s, i) => {
      const st = this.marks[s.id] || 'present';
      return `<tr><td>${i+1}</td><td class="fw-medium">${s.fullName}</td><td>${s.rollNo||'-'}</td>
        <td><div class="btn-group btn-group-sm">
          <button type="button" class="btn att-btn ${st==='present'?'active-present':'btn-outline-success'}" data-id="${s.id}" data-status="present">Present</button>
          <button type="button" class="btn att-btn ${st==='absent'?'active-absent':'btn-outline-danger'}" data-id="${s.id}" data-status="absent">Absent</button>
          <button type="button" class="btn att-btn ${st==='leave'?'active-leave':'btn-outline-info'}" data-id="${s.id}" data-status="leave">Leave</button>
        </div></td></tr>`;
    }).join('');
    tbody.querySelectorAll('.att-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.marks[btn.dataset.id] = btn.dataset.status;
        const row = btn.closest('tr');
        row.querySelectorAll('.att-btn').forEach(b => {
          b.className = 'btn att-btn btn-outline-' + (b.dataset.status==='present'?'success':b.dataset.status==='absent'?'danger':'info');
          if (b.dataset.status === btn.dataset.status) b.className = 'btn att-btn active-' + btn.dataset.status;
        });
      });
    });
  },
  markAll(status) {
    this.currentStudents.forEach(s => { this.marks[s.id] = status; });
    document.querySelectorAll('#attBody tr').forEach(row => {
      row.querySelectorAll('.att-btn').forEach(b => {
        b.className = 'btn att-btn btn-outline-' + (b.dataset.status==='present'?'success':b.dataset.status==='absent'?'danger':'info');
        if (b.dataset.status === status) b.className = 'btn att-btn active-' + status;
      });
    });
  },
  save() {
    const date = document.getElementById('attDate').value;
    const classId = document.getElementById('attClass').value;
    const section = document.getElementById('attSection').value;
    const cls = Storage.getById('classes', classId);
    let all = Storage.getAll('attendance').filter(a => !(a.date===date && a.classId===classId && a.section===section));
    this.currentStudents.forEach(s => {
      all.push({ id:`att_${s.id}_${date}`, studentId:s.id, studentName:s.fullName, classId, className:cls?.name||'', section, date,
        status: this.marks[s.id]||'present', markedBy: Auth.getCurrentUser()?.id, createdAt: new Date().toISOString() });
    });
    Storage.saveAll('attendance', all);
    Toast.show('Attendance saved successfully', 'success');
  }
};
window.Attendance = Attendance;
