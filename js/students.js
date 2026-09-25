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
    document.getElementById('studentPhoto')?.addEventListener('change', e => this.onPhotoChange(e));
    document.getElementById('clearStudentPhoto')?.addEventListener('click', () => {
      this._pendingPhoto = null;
      this.updatePhotoPreview(null);
      const inp = document.getElementById('studentPhoto');
      if (inp) inp.value = '';
    });
    document.getElementById('printIdCard')?.addEventListener('click', () => window.print());
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
            <button class="btn btn-sm btn-outline-dark" title="ID Card" onclick="Students.showIdCard('${s.id}')"><i class="fas fa-id-card"></i></button>
            <button class="btn btn-sm btn-outline-primary" title="Edit" onclick="Students.openModal('${s.id}')"><i class="fas fa-edit"></i></button>
            ${Utils.whatsAppButton(s.phone)}
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
      this._pendingPhoto = s.photo || null;
      this.updatePhotoPreview(s.photo || null);
    } else {
      this._pendingPhoto = null;
      this.updatePhotoPreview(null);
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
      emergencyContact: document.getElementById('emergencyContact').value.trim(),
      photo: this._pendingPhoto || null
    };

    // Keep existing photo if user did not change it
    if (id && !this._pendingPhoto) {
      const existing = Storage.getById('students', id);
      if (existing && existing.photo) data.photo = existing.photo;
    }

    let ok = true;
    if (id) {
      const updated = Storage.update('students', id, data);
      ok = !!updated;
      if (ok && data.photo) {
        const check = Storage.getById('students', id);
        if (!check || !check.photo) ok = false;
      }
      if (ok) Toast.show(data.photo ? 'Student + photo saved' : 'Student updated', 'success');
      else Toast.show('Save failed — photo too large for browser storage. Use smaller photo.', 'error');
    } else {
      data.admissionNo = Utils.generateAdmissionNo();
      data.createdAt = new Date().toISOString();
      try {
        Storage.add('students', data);
        if (data.photo) {
          const list = Storage.getAll('students');
          const last = list.find(x => x.admissionNo === data.admissionNo);
          if (!last || !last.photo) {
            Toast.show('Saved but photo not stored — use smaller photo', 'warning');
          } else {
            Toast.show('Student + photo saved', 'success');
          }
        } else {
          Toast.show('Student added successfully', 'success');
        }
      } catch (err) {
        Toast.show('Save failed', 'error');
        ok = false;
      }
    }
    if (ok) {
      bootstrap.Modal.getInstance(document.getElementById('studentModal')).hide();
      this.render();
    }
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
          ${s.photo ? `<img src="${s.photo}" class="rounded-circle mx-auto d-block" style="width:80px;height:80px;object-fit:cover;">` : `<div class="user-avatar mx-auto" style="width:80px;height:80px;font-size:1.8rem;">${s.fullName.charAt(0)}</div>`}
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
            <div class="col-6"><strong>Phone:</strong> ${s.phone || '-'} ${s.phone ? Utils.whatsAppButton(s.phone) : ''}</div>
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
    const idBtn = document.getElementById('viewIdCardBtn');
    if (idBtn) idBtn.onclick = () => { bootstrap.Modal.getInstance(document.getElementById('viewStudentModal'))?.hide(); this.showIdCard(id); };
    new bootstrap.Modal(document.getElementById('viewStudentModal')).show();
  },


  onPhotoChange(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      Toast.show('Select an image file', 'warning');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      Toast.show('Photo too large (max 5MB)', 'warning');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      this.compressPhoto(reader.result, (dataUrl) => {
        this._pendingPhoto = dataUrl;
        this.updatePhotoPreview(dataUrl);
        Toast.show('Photo ready — Save Student dabayein', 'success');
      });
    };
    reader.onerror = () => Toast.show('Photo read failed', 'error');
    reader.readAsDataURL(file);
  },

  compressPhoto(dataUrl, callback) {
    const img = new Image();
    img.onload = () => {
      const max = 400;
      let w = img.width, h = img.height;
      if (w > max || h > max) {
        if (w > h) { h = Math.round(h * max / w); w = max; }
        else { w = Math.round(w * max / h); h = max; }
      }
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, w, h);
      let out = canvas.toDataURL('image/jpeg', 0.75);
      // if still huge, lower quality
      if (out.length > 120000) out = canvas.toDataURL('image/jpeg', 0.55);
      callback(out);
    };
    img.onerror = () => {
      Toast.show('Invalid image', 'error');
      callback(null);
    };
    img.src = dataUrl;
  },

  updatePhotoPreview(src) {
    const img = document.getElementById('studentPhotoPreview');
    const btn = document.getElementById('clearStudentPhoto');
    if (!img) return;
    if (src) {
      img.src = src;
      img.style.display = 'block';
      if (btn) btn.style.display = 'inline-block';
    } else {
      img.removeAttribute('src');
      img.style.display = 'none';
      if (btn) btn.style.display = 'none';
    }
  },

  getClassName(s) {
    if (s.className) return s.className;
    const c = Storage.getById('classes', s.classId);
    return c ? c.name : '-';
  },

  buildCardPayload(s) {
    return {
      n: s.fullName,
      a: s.admissionNo,
      cl: this.getClassName(s),
      sec: s.section,
      r: s.rollNo,
      g: s.gender,
      dob: s.dob,
      bg: s.bloodGroup,
      ph: s.phone,
      em: s.email,
      f: s.fatherName,
      m: s.motherName,
      ad: s.address,
      st: s.status
    };
  },

  encodePayload(obj) {
    try {
      const json = JSON.stringify(obj);
      const b64 = btoa(unescape(encodeURIComponent(json)));
      return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    } catch (e) {
      return '';
    }
  },

  async showIdCard(id) {
    let s = Storage.getById('students', id);
    if (!s) {
      Toast.show('Student not found', 'error');
      return;
    }
    // re-read to ensure latest photo
    const all = Storage.getAll('students') || [];
    s = all.find(x => x.id === id) || s;
    const logo = (typeof App !== 'undefined' && App.getSchoolLogo) ? App.getSchoolLogo() : 'assets/images/logo.jpg';
    const hasPhoto = !!(s.photo && String(s.photo).startsWith('data:image'));
    const photoHtml = hasPhoto
      ? '<img src="' + s.photo + '" alt="Photo">'
      : '<span>' + (s.fullName || 'S').charAt(0).toUpperCase() + '</span>';
    if (!hasPhoto) {
      console.warn('ID card: no photo on student', id, s.photo ? 'invalid photo data' : 'missing');
    }
    const payload = this.buildCardPayload(s);
    const enc = this.encodePayload(payload);
    const base = location.href.replace(/[^/]*$/, 'student-card.html');
    const url = base + '?id=' + encodeURIComponent(s.id) + (enc ? '&d=' + enc : '');
    const cls = this.getClassName(s);

    const body = document.getElementById('idCardBody');
    body.innerHTML = `
      <div class="id-card-set">
        <div class="sid-card" id="idCardFront">
          <span class="sid-label-tag">FRONT</span>
          <div class="sid-front-header">
            <div class="logo-row">
              <img src="${logo}" alt="Logo" onerror="this.style.display='none'">
            </div>
            <div class="school">Al Bilawal Soomro<br>Public School</div>
            <div class="tagline">QUEST FOR EXCELLENCE</div>
            <div class="sid-wave-accent"></div>
            <div class="sid-wave-top"></div>
          </div>
          <div class="sid-front-body">
            <div class="sid-photo">${photoHtml}</div>
            <div class="sid-name">${s.fullName || '-'}</div>
            <div class="sid-role">STUDENT${cls !== '-' ? ' · ' + cls : ''}</div>
            <div class="sid-details">
              <div><strong>ID</strong> : ${s.admissionNo || '-'}</div>
              <div><strong>Email</strong> : ${s.email || '-'}</div>
              <div><strong>Phone</strong> : ${s.phone || '-'}</div>
              <div><strong>Class</strong> : ${cls}${s.section ? ' (' + s.section + ')' : ''}</div>
              <div><strong>Roll</strong> : ${s.rollNo || '-'}</div>
            </div>
          </div>
          <div class="sid-front-footer"></div>
        </div>

        <div class="sid-card" id="idCardBack">
          <span class="sid-label-tag">BACK</span>
          <div class="sid-back-top">
            <div class="sid-qr-box"><canvas id="idQrCanvas"></canvas></div>
            <div class="sid-back-label">AL BILAWAL SOOMRO</div>
            <div class="sid-wave-back-accent"></div>
            <div class="sid-wave-back"></div>
          </div>
          <div class="sid-back-bottom">
            <h6>Terms &amp; Conditions</h6>
            <p>This identity card is the property of Al Bilawal Soomro Public School. If found, please return to the school office. Card is non-transferable.</p>
            <div class="sid-details" style="text-align:left;margin-top:8px;">
              <div><strong>DOB</strong> : ${s.dob || '-'}</div>
              <div><strong>Blood</strong> : ${s.bloodGroup || '-'}</div>
              <div><strong>Father</strong> : ${s.fatherName || '-'}</div>
            </div>
            <span class="sid-badge">Scan QR for full profile + photo</span>
          </div>
        </div>
      </div>`;

    new bootstrap.Modal(document.getElementById('idCardModal')).show();

    const canvas = document.getElementById('idQrCanvas');
    const drawFallback = () => {
      const img = document.createElement('img');
      img.width = 140; img.height = 140;
      img.alt = 'QR';
      img.src = 'https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=' + encodeURIComponent(url);
      if (canvas && canvas.parentNode) canvas.replaceWith(img);
    };
    if (typeof QRCode !== 'undefined' && canvas) {
      try {
        await QRCode.toCanvas(canvas, url, { width: 140, margin: 1, color: { dark: '#0b3a6e', light: '#ffffff' } });
      } catch (err) {
        drawFallback();
      }
    } else {
      drawFallback();
    }
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
