/**
 * Students Module - Full CRUD
 */

const Students = {
  page: 1,
  perPage: 10,
  filters: { search: '', classId: '', gender: '', status: '' },

  init() {
    this.populateFilters();
    this.bindEvents();
    this.render();
  },

  populateFilters() {
    const classes = Storage.getAll('classes');
    const sel = document.getElementById('filterClass');
    const classSel = document.getElementById('classId');
    classes.forEach(c => {
      sel.innerHTML += `<option value="${c.id}">${c.name}</option>`;
      if (classSel) classSel.innerHTML += `<option value="${c.id}">${c.name}</option>`;
    });
  },

  bindEvents() {
    document.getElementById('btnAddStudent')?.addEventListener('click', () => this.openModal());
    document.getElementById('btnAddStudentEmpty')?.addEventListener('click', () => this.openModal());
    document.getElementById('exportStudents')?.addEventListener('click', () => this.exportData());
    document.getElementById('searchStudent')?.addEventListener('input', Utils.debounce(e => {
      this.filters.search = e.target.value.trim().toLowerCase();
      this.page = 1;
      this.render();
    }, 250));
    document.getElementById('filterClass')?.addEventListener('change', e => {
      this.filters.classId = e.target.value;
      this.page = 1;
      this.render();
    });
    document.getElementById('filterGender')?.addEventListener('change', e => {
      this.filters.gender = e.target.value;
      this.page = 1;
      this.render();
    });
    document.getElementById('filterStatus')?.addEventListener('change', e => {
      this.filters.status = e.target.value;
      this.page = 1;
      this.render();
    });
    document.getElementById('classId')?.addEventListener('change', e => this.updateSections(e.target.value));
    document.getElementById('studentForm')?.addEventListener('submit', e => this.save(e));
  },

  getFiltered() {
    let list = Storage.getAll('students');
    const { search, classId, gender, status } = this.filters;
    if (search) {
      list = list.filter(s =>
        s.fullName.toLowerCase().includes(search) ||
        s.admissionNo.toLowerCase().includes(search) ||
        (s.fatherName || '').toLowerCase().includes(search)
      );
    }
    if (classId) list = list.filter(s => s.classId === classId);
    if (gender) list = list.filter(s => s.gender === gender);
    if (status) list = list.filter(s => s.status === status);
    return list;
  },

  render() {
    const list = this.getFiltered();
    const total = list.length;
    const start = (this.page - 1) * this.perPage;
    const pageData = list.slice(start, start + this.perPage);
    const tbody = document.getElementById('studentsBody');
    const empty = document.getElementById('studentsEmpty');
    const table = document.getElementById('studentsTable');

    if (total === 0) {
      tbody.innerHTML = '';
      table?.classList.add('d-none');
      empty?.classList.remove('d-none');
      document.getElementById('paginationArea').classList.add('d-none');
      return;
    }
    table?.classList.remove('d-none');
    empty?.classList.add('d-none');
    document.getElementById('paginationArea').classList.remove('d-none');

    tbody.innerHTML = pageData.map(s => `
      <tr>
        <td><code>${s.admissionNo}</code></td>
        <td class="fw-medium">${s.fullName}</td>
        <td>${s.className || '-'}</td>
        <td>${s.section || '-'}</td>
        <td>${s.rollNo || '-'}</td>
        <td>${s.gender}</td>
        <td>${s.phone || '-'}</td>
        <td>${Utils.getStatusBadge(s.status)}</td>
        <td class="no-print">
          <div class="action-btns">
            <button class="btn btn-sm btn-outline-info" title="View" onclick="Students.view('${s.id}')"><i class="fas fa-eye"></i></button>
            <button class="btn btn-sm btn-outline-primary" title="Edit" onclick="Students.openModal('${s.id}')"><i class="fas fa-edit"></i></button>
            <button class="btn btn-sm btn-outline-danger" title="Delete" onclick="Students.remove('${s.id}')"><i class="fas fa-trash"></i></button>
          </div>
        </td>
      </tr>`).join('');

    this.renderPagination(total);
  },

  renderPagination(total) {
    const pages = Math.ceil(total / this.perPage) || 1;
    document.getElementById('pageInfo').textContent = `Showing ${Math.min((this.page - 1) * this.perPage + 1, total)}-${Math.min(this.page * this.perPage, total)} of ${total}`;
    const ul = document.getElementById('pagination');
    let html = `<li class="page-item ${this.page === 1 ? 'disabled' : ''}"><a class="page-link" href="#" data-p="${this.page - 1}">Prev</a></li>`;
    for (let i = 1; i <= pages; i++) {
      if (pages > 7 && Math.abs(i - this.page) > 2 && i !== 1 && i !== pages) {
        if (i === 2 || i === pages - 1) html += `<li class="page-item disabled"><span class="page-link">…</span></li>`;
        continue;
      }
      html += `<li class="page-item ${i === this.page ? 'active' : ''}"><a class="page-link" href="#" data-p="${i}">${i}</a></li>`;
    }
    html += `<li class="page-item ${this.page === pages ? 'disabled' : ''}"><a class="page-link" href="#" data-p="${this.page + 1}">Next</a></li>`;
    ul.innerHTML = html;
    ul.querySelectorAll('a[data-p]').forEach(a => {
      a.addEventListener('click', e => {
        e.preventDefault();
        const p = parseInt(a.dataset.p);
        if (p >= 1 && p <= pages) { this.page = p; this.render(); }
      });
    });
  },

  updateSections(classId) {
    const cls = Storage.getById('classes', classId);
    const sel = document.getElementById('section');
    sel.innerHTML = '<option value="">Select</option>';
    if (cls) cls.sections.forEach(s => { sel.innerHTML += `<option value="${s}">${s}</option>`; });
  },

  openModal(id = null) {
    const form = document.getElementById('studentForm');
    form.reset();
    form.classList.remove('was-validated');
    document.getElementById('studentId').value = id || '';
    document.getElementById('studentModalTitle').textContent = id ? 'Edit Student' : 'Add Student';
    document.getElementById('admissionDate').value = new Date().toISOString().slice(0, 10);

    if (id) {
      const s = Storage.getById('students', id);
      if (!s) return;
      document.getElementById('fullName').value = s.fullName;
      document.getElementById('fatherName').value = s.fatherName || '';
      document.getElementById('motherName').value = s.motherName || '';
      document.getElementById('dob').value = s.dob || '';
      document.getElementById('gender').value = s.gender || '';
      document.getElementById('classId').value = s.classId || '';
      this.updateSections(s.classId);
      document.getElementById('section').value = s.section || '';
      document.getElementById('rollNo').value = s.rollNo || '';
      document.getElementById('phone').value = s.phone || '';
      document.getElementById('email').value = s.email || '';
      document.getElementById('address').value = s.address || '';
      document.getElementById('city').value = s.city || '';
      document.getElementById('bloodGroup').value = s.bloodGroup || '';
      document.getElementById('admissionDate').value = s.admissionDate || '';
      document.getElementById('status').value = s.status || 'active';
      document.getElementById('previousSchool').value = s.previousSchool || '';
      document.getElementById('emergencyContact').value = s.emergencyContact || '';
    }
    new bootstrap.Modal(document.getElementById('studentModal')).show();
  },

  save(e) {
    e.preventDefault();
    const form = e.target;
    if (!form.checkValidity()) {
      form.classList.add('was-validated');
      return;
    }
    const id = document.getElementById('studentId').value;
    const classId = document.getElementById('classId').value;
    const cls = Storage.getById('classes', classId);

    const data = {
      fullName: document.getElementById('fullName').value.trim(),
      fatherName: document.getElementById('fatherName').value.trim(),
      motherName: document.getElementById('motherName').value.trim(),
      dob: document.getElementById('dob').value,
      gender: document.getElementById('gender').value,
      classId,
      className: cls ? cls.name : '',
      section: document.getElementById('section').value,
      rollNo: document.getElementById('rollNo').value.trim(),
      phone: document.getElementById('phone').value.trim(),
      email: document.getElementById('email').value.trim(),
      address: document.getElementById('address').value.trim(),
      city: document.getElementById('city').value.trim(),
      bloodGroup: document.getElementById('bloodGroup').value,
      admissionDate: document.getElementById('admissionDate').value,
      status: document.getElementById('status').value,
      previousSchool: document.getElementById('previousSchool').value.trim(),
      emergencyContact: document.getElementById('emergencyContact').value.trim()
    };

    if (id) {
      Storage.update('students', id, data);
      Toast.show('Student updated successfully', 'success');
    } else {
      data.admissionNo = Utils.generateAdmissionNo();
      data.createdAt = new Date().toISOString();
      Storage.add('students', data);
      Toast.show('Student added successfully', 'success');
    }
    bootstrap.Modal.getInstance(document.getElementById('studentModal')).hide();
    this.render();
  },

  async remove(id) {
    const ok = await Utils.confirmDelete('Are you sure you want to delete this student? This action cannot be undone.');
    if (!ok) return;
    Storage.delete('students', id);
    Toast.show('Student deleted', 'success');
    this.render();
  },

  view(id) {
    const s = Storage.getById('students', id);
    if (!s) return;
    const att = Storage.getAll('attendance').filter(a => a.studentId === id);
    const present = att.filter(a => a.status === 'present').length;
    const total = att.length;
    const pct = total ? Math.round((present / total) * 100) : 0;
    const fees = Storage.getAll('feePayments').filter(f => f.studentId === id);
    const pending = fees.filter(f => f.status === 'pending').reduce((s, f) => s + (f.remaining || 0), 0);

    document.getElementById('viewStudentBody').innerHTML = `
      <div class="row">
        <div class="col-md-3 text-center mb-3">
          <div class="user-avatar mx-auto" style="width:80px;height:80px;font-size:1.8rem;">${s.fullName.charAt(0)}</div>
          <h5 class="mt-2 mb-0">${s.fullName}</h5>
          <code>${s.admissionNo}</code>
          <div class="mt-1">${Utils.getStatusBadge(s.status)}</div>
        </div>
        <div class="col-md-9">
          <div class="row g-2 small">
            <div class="col-6"><strong>Father:</strong> ${s.fatherName || '-'}</div>
            <div class="col-6"><strong>Mother:</strong> ${s.motherName || '-'}</div>
            <div class="col-6"><strong>DOB:</strong> ${Utils.formatDate(s.dob)}</div>
            <div class="col-6"><strong>Gender:</strong> ${s.gender}</div>
            <div class="col-6"><strong>Class:</strong> ${s.className} - ${s.section}</div>
            <div class="col-6"><strong>Roll No:</strong> ${s.rollNo || '-'}</div>
            <div class="col-6"><strong>Phone:</strong> ${s.phone || '-'}</div>
            <div class="col-6"><strong>Blood Group:</strong> ${s.bloodGroup || '-'}</div>
            <div class="col-12"><strong>Address:</strong> ${s.address || '-'}, ${s.city || ''}</div>
            <div class="col-6"><strong>Admission:</strong> ${Utils.formatDate(s.admissionDate)}</div>
            <div class="col-6"><strong>Previous School:</strong> ${s.previousSchool || '-'}</div>
          </div>
          <hr>
          <div class="row g-2">
            <div class="col-4">
              <div class="stat-card p-2">
                <small class="text-muted">Attendance</small>
                <div class="fw-bold">${pct}%</div>
                <div class="progress mt-1"><div class="progress-bar bg-success" style="width:${pct}%"></div></div>
              </div>
            </div>
            <div class="col-4">
              <div class="stat-card p-2">
                <small class="text-muted">Pending Fees</small>
                <div class="fw-bold">${Utils.formatCurrency(pending)}</div>
              </div>
            </div>
            <div class="col-4">
              <div class="stat-card p-2">
                <small class="text-muted">Records</small>
                <div class="fw-bold">${att.length} days</div>
              </div>
            </div>
          </div>
        </div>
      </div>`;
    new bootstrap.Modal(document.getElementById('viewStudentModal')).show();
  },

  exportData() {
    const data = this.getFiltered().map(s => ({
      AdmissionNo: s.admissionNo,
      Name: s.fullName,
      Father: s.fatherName,
      Class: s.className,
      Section: s.section,
      Roll: s.rollNo,
      Gender: s.gender,
      Phone: s.phone,
      Status: s.status
    }));
    Utils.exportCSV(data, 'students');
  }
};

window.Students = Students;
