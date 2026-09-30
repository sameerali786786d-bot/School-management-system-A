const Teachers = {
  filters: { search: '', status: '' },
  _pendingPhoto: null,

  init() {
    this.bindEvents();
    this.render();
  },

  bindEvents() {
    document.getElementById('btnAddTeacher')?.addEventListener('click', () => this.openModal());
    document.getElementById('searchTeacher')?.addEventListener('input', Utils.debounce(e => {
      this.filters.search = e.target.value.toLowerCase();
      this.render();
    }, 250));
    document.getElementById('filterStatus')?.addEventListener('change', e => {
      this.filters.status = e.target.value;
      this.render();
    });
    document.getElementById('teacherForm')?.addEventListener('submit', e => this.save(e));
    document.getElementById('teacherPhoto')?.addEventListener('change', e => this.onPhotoChange(e));
    document.getElementById('clearTeacherPhoto')?.addEventListener('click', () => {
      this._pendingPhoto = null;
      this.updatePhotoPreview(null);
      const inp = document.getElementById('teacherPhoto');
      if (inp) inp.value = '';
    });
    document.getElementById('printTeacherIdCard')?.addEventListener('click', () => window.print());
  },

  getFiltered() {
    let list = Storage.getAll('teachers') || [];
    if (this.filters.search) {
      list = list.filter(t =>
        (t.name || '').toLowerCase().includes(this.filters.search) ||
        (t.email || '').toLowerCase().includes(this.filters.search) ||
        (t.phone || '').includes(this.filters.search)
      );
    }
    if (this.filters.status) list = list.filter(t => t.status === this.filters.status);
    return list;
  },

  render() {
    const list = this.getFiltered();
    const tbody = document.getElementById('teachersBody');
    const empty = document.getElementById('teachersEmpty');
    if (!tbody) return;
    if (!list.length) {
      tbody.innerHTML = '';
      empty?.classList.remove('d-none');
      return;
    }
    empty?.classList.add('d-none');
    tbody.innerHTML = list.map(t => `
      <tr>
        <td class="fw-medium">${t.name || '-'}</td>
        <td>${t.designation || '-'}</td>
        <td>${t.phone || '-'}</td>
        <td>${t.email || '-'}</td>
        <td>${Utils.formatDate ? Utils.formatDate(t.joiningDate) : (t.joiningDate || '-')}</td>
        <td>${Utils.formatCurrency ? Utils.formatCurrency(t.salary) : (t.salary || '-')}</td>
        <td>${Utils.getStatusBadge ? Utils.getStatusBadge(t.status) : (t.status || '-')}</td>
        <td class="no-print">
          <div class="action-btns">
            <button class="btn btn-sm btn-outline-dark" title="ID Card" onclick="Teachers.showIdCard('${t.id}')"><i class="fas fa-id-card"></i></button>
            <button class="btn btn-sm btn-outline-primary" title="Edit" onclick="Teachers.openModal('${t.id}')"><i class="fas fa-edit"></i></button>
            ${Utils.whatsAppButton ? Utils.whatsAppButton(t.phone) : ''}
            <button class="btn btn-sm btn-outline-danger" title="Delete" onclick="Teachers.remove('${t.id}')"><i class="fas fa-trash"></i></button>
          </div>
        </td>
      </tr>`).join('');
  },

  openModal(id = null) {
    const form = document.getElementById('teacherForm');
    form.reset();
    form.classList.remove('was-validated');
    document.getElementById('teacherId').value = id || '';
    document.getElementById('teacherModalTitle').textContent = id ? 'Edit Teacher' : 'Add Teacher';
    this._pendingPhoto = null;
    this.updatePhotoPreview(null);
    const photoInp = document.getElementById('teacherPhoto');
    if (photoInp) photoInp.value = '';

    if (id) {
      const t = Storage.getById('teachers', id);
      if (!t) return;
      document.getElementById('tName').value = t.name || '';
      document.getElementById('tFather').value = t.fatherName || '';
      document.getElementById('tGender').value = t.gender || '';
      document.getElementById('tDob').value = t.dob || '';
      document.getElementById('tPhone').value = t.phone || '';
      document.getElementById('tEmail').value = t.email || '';
      document.getElementById('tDesignation').value = t.designation || '';
      document.getElementById('tQualification').value = t.qualification || '';
      document.getElementById('tExperience').value = t.experience || '';
      document.getElementById('tSalary').value = t.salary || '';
      document.getElementById('tJoining').value = t.joiningDate || '';
      document.getElementById('tStatus').value = t.status || 'active';
      document.getElementById('tAddress').value = t.address || '';
      this._pendingPhoto = t.photo || null;
      this.updatePhotoPreview(t.photo || null);
    }
    new bootstrap.Modal(document.getElementById('teacherModal')).show();
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
        if (!dataUrl) return;
        this._pendingPhoto = dataUrl;
        this.updatePhotoPreview(dataUrl);
        Toast.show('Photo ready — Save dabayein', 'success');
      });
    };
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
      canvas.width = w; canvas.height = h;
      canvas.getContext('2d').drawImage(img, 0, 0, w, h);
      let out = canvas.toDataURL('image/jpeg', 0.75);
      if (out.length > 120000) out = canvas.toDataURL('image/jpeg', 0.55);
      callback(out);
    };
    img.onerror = () => { Toast.show('Invalid image', 'error'); callback(null); };
    img.src = dataUrl;
  },

  updatePhotoPreview(src) {
    const img = document.getElementById('teacherPhotoPreview');
    const btn = document.getElementById('clearTeacherPhoto');
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

  save(e) {
    e.preventDefault();
    const form = e.target;
    if (!form.checkValidity()) {
      form.classList.add('was-validated');
      return;
    }
    const id = document.getElementById('teacherId').value;
    const data = {
      name: document.getElementById('tName').value.trim(),
      fatherName: document.getElementById('tFather').value.trim(),
      gender: document.getElementById('tGender').value,
      dob: document.getElementById('tDob').value,
      phone: document.getElementById('tPhone').value.trim(),
      email: document.getElementById('tEmail').value.trim(),
      designation: document.getElementById('tDesignation').value.trim(),
      qualification: document.getElementById('tQualification').value.trim(),
      experience: document.getElementById('tExperience').value,
      salary: Number(document.getElementById('tSalary').value) || 0,
      joiningDate: document.getElementById('tJoining').value,
      status: document.getElementById('tStatus').value,
      address: document.getElementById('tAddress').value.trim(),
      photo: this._pendingPhoto || null
    };

    if (id && !this._pendingPhoto) {
      const existing = Storage.getById('teachers', id);
      if (existing && existing.photo) data.photo = existing.photo;
    }

    if (id) {
      const updated = Storage.update('teachers', id, data);
      if (!updated) {
        Toast.show('Save failed — try smaller photo', 'error');
        return;
      }
      Toast.show(data.photo ? 'Teacher + photo saved' : 'Teacher updated', 'success');
    } else {
      data.createdAt = new Date().toISOString();
      Storage.add('teachers', data);
      Toast.show(data.photo ? 'Teacher + photo saved' : 'Teacher added', 'success');
    }
    bootstrap.Modal.getInstance(document.getElementById('teacherModal')).hide();
    this.render();
  },

  async remove(id) {
    const ok = await Utils.confirmDelete('Delete this teacher?');
    if (!ok) return;
    Storage.delete('teachers', id);
    Toast.show('Teacher deleted', 'success');
    this.render();
  },

  buildCardPayload(t) {
    return {
      n: t.name,
      des: t.designation,
      ph: t.phone,
      em: t.email,
      g: t.gender,
      dob: t.dob,
      f: t.fatherName,
      q: t.qualification,
      j: t.joiningDate,
      ad: t.address,
      st: t.status
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
    let t = Storage.getById('teachers', id);
    if (!t) {
      Toast.show('Teacher not found', 'error');
      return;
    }
    const all = Storage.getAll('teachers') || [];
    t = all.find(x => x.id === id) || t;

    const logo = (typeof App !== 'undefined' && App.getSchoolLogo) ? App.getSchoolLogo() : 'assets/images/logo.png';
    const hasPhoto = !!(t.photo && String(t.photo).startsWith('data:image'));
    const photoHtml = hasPhoto
      ? '<img src="' + t.photo + '" alt="Photo">'
      : '<span>' + (t.name || 'T').charAt(0).toUpperCase() + '</span>';

    const payload = this.buildCardPayload(t);
    const enc = this.encodePayload(payload);
    const base = location.href.replace(/[^/]*$/, 'teacher-card.html');
    const url = base + '?id=' + encodeURIComponent(t.id) + (enc ? '&d=' + enc : '');

    let expire = '-';
    try {
      if (t.joiningDate) {
        const d = new Date(t.joiningDate);
        d.setFullYear(d.getFullYear() + 1);
        expire = d.toISOString().slice(0, 10);
      }
    } catch (e) {}

    const body = document.getElementById('teacherIdCardBody');
    if (!body) {
      Toast.show('ID Card modal missing — upload teachers.html', 'error');
      return;
    }
    const titleEl = document.querySelector('#teacherIdCardModal .modal-title');
    if (titleEl) titleEl.textContent = 'Teacher ID Card';

    body.innerHTML = `
      <div class="id-card-set">
        <!-- FRONT: profile photo + school logo -->
        <div class="tid-card" id="teacherCardFront">
          <span class="sid-label-tag">FRONT</span>
          <div class="tid2-front">
            <div class="tid2-front-top">
              <div class="tid2-blob1"></div>
              <div class="tid2-blob2"></div>
              <img class="tid2-logo-sm" src="${logo}" alt="School Logo" onerror="this.style.display='none'">
              <div class="tid2-photo">${photoHtml}</div>
            </div>
            <div class="tid2-front-bottom">
              <div class="tid2-dots" style="top:12px;left:16px;"></div>
              <div class="tid2-dots" style="top:28px;left:22px;"></div>
              <div class="tid2-dots" style="bottom:40px;right:18px;"></div>
              <div class="tid2-dots" style="bottom:24px;right:28px;"></div>
              <div class="tid2-name">${t.name || '-'}</div>
              <div class="tid2-role">${t.designation || 'Teacher'}</div>
              <div class="tid2-info">
                <div><i class="fas fa-map-marker-alt"></i>${t.address || 'Al Bilawal Soomro Public School'}</div>
                <div><i class="fas fa-phone"></i>${t.phone || '-'}</div>
                <div><i class="fas fa-envelope"></i>${t.email || '-'}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- BACK: school logo + QR + dates -->
        <div class="tid-card" id="teacherCardBack">
          <span class="sid-label-tag">BACK</span>
          <div class="tid2-back">
            <div class="tid2-back-blob1"></div>
            <div class="tid2-back-blob2"></div>
            <img class="tid2-back-logo" src="${logo}" alt="School Logo" onerror="this.style.display='none'">
            <div class="tid2-back-school">Al Bilawal Soomro<br>Public School</div>
            <div class="tid2-back-dates">
              <span>JOIN : ${t.joiningDate || '-'}</span>
              <span>EXPIRED : ${expire}</span>
            </div>
            <div class="tid2-back-note">Official staff ID. Property of the school. If found, return to office. Non-transferable.</div>
            <div class="tid2-qr"><canvas id="teacherQrCanvas"></canvas></div>
            <div class="tid2-grid"></div>
          </div>
        </div>
      </div>`;

    new bootstrap.Modal(document.getElementById('teacherIdCardModal')).show();

    const canvas = document.getElementById('teacherQrCanvas');
    const drawFallback = () => {
      const img = document.createElement('img');
      img.width = 115; img.height = 115; img.alt = 'QR';
      img.src = 'https://api.qrserver.com/v1/create-qr-code/?size=115x115&data=' + encodeURIComponent(url);
      if (canvas && canvas.parentNode) canvas.replaceWith(img);
    };
    if (typeof QRCode !== 'undefined' && canvas) {
      try {
        await QRCode.toCanvas(canvas, url, { width: 115, margin: 1, color: { dark: '#1e3a8a', light: '#ffffff' } });
      } catch (err) { drawFallback(); }
    } else { drawFallback(); }
  }

};

window.Teachers = Teachers;
