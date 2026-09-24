const PageModule = {
  filters: { search: '', classId: '', hasPhone: '' },

  init() {
    document.getElementById('pageTitle').textContent = 'WhatsApp Sheet';
    this.fillClassFilter();
    document.getElementById('waSearch')?.addEventListener('input', Utils.debounce(e => {
      this.filters.search = (e.target.value || '').toLowerCase();
      this.renderAll();
    }, 250));
    document.getElementById('waClassFilter')?.addEventListener('change', e => {
      this.filters.classId = e.target.value;
      this.renderAll();
    });
    document.getElementById('waHasPhone')?.addEventListener('change', e => {
      this.filters.hasPhone = e.target.value;
      this.renderAll();
    });
    this.renderAll();
  },

  fillClassFilter() {
    const sel = document.getElementById('waClassFilter');
    if (!sel) return;
    const classes = Storage.getAll('classes') || [];
    classes.forEach(c => {
      const opt = document.createElement('option');
      opt.value = c.id;
      opt.textContent = c.name;
      sel.appendChild(opt);
    });
  },

  className(id) {
    const c = (Storage.getAll('classes') || []).find(x => x.id === id);
    return c ? c.name : '-';
  },

  matchPhone(phone) {
    const has = !!(phone && String(phone).replace(/\D/g, '').length >= 10);
    if (this.filters.hasPhone === 'yes') return has;
    if (this.filters.hasPhone === 'no') return !has;
    return true;
  },

  matchSearch(...fields) {
    if (!this.filters.search) return true;
    return fields.some(f => String(f || '').toLowerCase().includes(this.filters.search));
  },

  chatBtn(phone, name) {
    const link = Utils.whatsAppLink(phone);
    if (!link) {
      return '<span class="text-muted small">No number</span>';
    }
    const msg = encodeURIComponent('Assalamualaikum ' + (name || '') + ', THE SMART MODERN PUBLIC SCHOOL QAMBER');
    return `<a href="${link}?text=${msg}" target="_blank" rel="noopener noreferrer" class="btn btn-sm btn-success"><i class="fab fa-whatsapp me-1"></i>Chat</a>`;
  },

  renderAll() {
    let total = 0;
    total += this.renderStudents();
    total += this.renderTeachers();
    total += this.renderParents();
    total += this.renderStaff();
    const el = document.getElementById('waCount');
    if (el) el.textContent = total;
  },

  renderStudents() {
    let list = (Storage.getAll('students') || []).filter(s => s.status !== 'inactive');
    if (this.filters.classId) list = list.filter(s => s.classId === this.filters.classId);
    list = list.filter(s => this.matchSearch(s.fullName, s.phone, s.parentPhone, s.fatherName, s.motherName));
    list = list.filter(s => this.matchPhone(s.phone || s.parentPhone || s.emergencyContact));

    const body = document.getElementById('studentsBody');
    if (!body) return 0;
    if (!list.length) {
      body.innerHTML = '<tr><td colspan="6" class="text-center text-muted py-4">No students found</td></tr>';
      return 0;
    }
    body.innerHTML = list.map((s, i) => {
      const parentPhone = s.parentPhone || s.guardianPhone || s.emergencyContact || '';
      return `
      <tr>
        <td>${i + 1}</td>
        <td class="fw-medium">${s.fullName || '-'}</td>
        <td>${this.className(s.classId)}</td>
        <td>${s.phone || '-'}</td>
        <td>${parentPhone || '-'}</td>
        <td class="text-nowrap">
          ${this.chatBtn(s.phone, s.fullName)}
          ${parentPhone ? this.chatBtn(parentPhone, s.fatherName || 'Parent') : ''}
        </td>
      </tr>`;
    }).join('');
    return list.length;
  },

  renderTeachers() {
    let list = (Storage.getAll('teachers') || []).filter(t => t.status !== 'inactive');
    list = list.filter(t => this.matchSearch(t.name, t.phone, t.subject, t.email, t.designation));
    list = list.filter(t => this.matchPhone(t.phone));

    const body = document.getElementById('teachersBody');
    if (!body) return 0;
    if (!list.length) {
      body.innerHTML = '<tr><td colspan="5" class="text-center text-muted py-4">No teachers found</td></tr>';
      return 0;
    }
    body.innerHTML = list.map((t, i) => `
      <tr>
        <td>${i + 1}</td>
        <td class="fw-medium">${t.name || '-'}</td>
        <td>${t.designation || t.subject || (Array.isArray(t.subjects) ? t.subjects.join(', ') : t.subjects) || '-'}</td>
        <td>${t.phone || '-'}</td>
        <td>${this.chatBtn(t.phone, t.name)}</td>
      </tr>`).join('');
    return list.length;
  },

  renderParents() {
    let list = Storage.getAll('parents') || [];
    list = list.map(p => ({
      name: p.fatherName || p.name || p.fullName || 'Parent',
      phone: p.phone || '',
      student: (p.children && p.children.length) ? p.children.join(', ') : (p.studentName || p.student || '-'),
      motherName: p.motherName || ''
    }));
    const students = Storage.getAll('students') || [];
    const map = {};
    list.forEach(p => {
      const key = (p.name + '|' + p.phone).toLowerCase();
      map[key] = p;
    });
    students.forEach(s => {
      const phone = s.parentPhone || s.guardianPhone || s.emergencyContact || '';
      const name = s.fatherName || s.guardianName || s.motherName || 'Parent';
      if (!phone) return;
      const key = (name + '|' + phone).toLowerCase();
      if (!map[key]) map[key] = { name, phone, student: s.fullName || '-' };
      else if (map[key].student === '-') map[key].student = s.fullName || '-';
      else if (s.fullName && !String(map[key].student).includes(s.fullName)) {
        map[key].student += ', ' + s.fullName;
      }
    });
    list = Object.values(map);
    list = list.filter(p => this.matchSearch(p.name, p.phone, p.student, p.motherName));
    list = list.filter(p => this.matchPhone(p.phone));

    const body = document.getElementById('parentsBody');
    if (!body) return 0;
    if (!list.length) {
      body.innerHTML = '<tr><td colspan="5" class="text-center text-muted py-4">No parents found</td></tr>';
      return 0;
    }
    body.innerHTML = list.map((p, i) => `
      <tr>
        <td>${i + 1}</td>
        <td class="fw-medium">${p.name || '-'}</td>
        <td>${p.student || '-'}</td>
        <td>${p.phone || '-'}</td>
        <td>${this.chatBtn(p.phone, p.name)}</td>
      </tr>`).join('');
    return list.length;
  },

  renderStaff() {
    let list = (Storage.getAll('staff') || []).filter(s => s.status !== 'inactive');
    list = list.filter(s => this.matchSearch(s.name, s.phone, s.role, s.designation));
    list = list.filter(s => this.matchPhone(s.phone));

    const body = document.getElementById('staffBody');
    if (!body) return 0;
    if (!list.length) {
      body.innerHTML = '<tr><td colspan="5" class="text-center text-muted py-4">No staff found</td></tr>';
      return 0;
    }
    body.innerHTML = list.map((s, i) => `
      <tr>
        <td>${i + 1}</td>
        <td class="fw-medium">${s.name || '-'}</td>
        <td>${s.role || s.designation || '-'}</td>
        <td>${s.phone || '-'}</td>
        <td>${this.chatBtn(s.phone, s.name)}</td>
      </tr>`).join('');
    return list.length;
  }
};
