const Teachers = {
  filters: { search: '', status: '' },
  init() {
    this.bindEvents();
    this.render();
  },
  bindEvents() {
    document.getElementById('btnAddTeacher')?.addEventListener('click', () => this.openModal());
    document.getElementById('searchTeacher')?.addEventListener('input', Utils.debounce(e => { this.filters.search = e.target.value.toLowerCase(); this.render(); }, 250));
    document.getElementById('filterStatus')?.addEventListener('change', e => { this.filters.status = e.target.value; this.render(); });
    document.getElementById('teacherForm')?.addEventListener('submit', e => this.save(e));
  },
  getFiltered() {
    let list = Storage.getAll('teachers');
    if (this.filters.search) list = list.filter(t => t.name.toLowerCase().includes(this.filters.search) || (t.email||'').toLowerCase().includes(this.filters.search));
    if (this.filters.status) list = list.filter(t => t.status === this.filters.status);
    return list;
  },
  render() {
    const list = this.getFiltered();
    const tbody = document.getElementById('teachersBody');
    const empty = document.getElementById('teachersEmpty');
    if (!list.length) { tbody.innerHTML = ''; empty.classList.remove('d-none'); return; }
    empty.classList.add('d-none');
    tbody.innerHTML = list.map(t => `
      <tr>
        <td class="fw-medium">${t.name}</td>
        <td>${t.designation || '-'}</td>
        <td>${t.phone || '-'}</td>
        <td>${t.email || '-'}</td>
        <td>${Utils.formatDate(t.joiningDate)}</td>
        <td>${Utils.formatCurrency(t.salary)}</td>
        <td>${Utils.getStatusBadge(t.status)}</td>
        <td>
          <div class="action-btns">
            <button class="btn btn-sm btn-outline-primary" onclick="Teachers.openModal('${t.id}')"><i class="fas fa-edit"></i></button>
            <button class="btn btn-sm btn-outline-danger" onclick="Teachers.remove('${t.id}')"><i class="fas fa-trash"></i></button>
          </div>
        </td>
      </tr>`).join('');
  },
  openModal(id = null) {
    const form = document.getElementById('teacherForm');
    form.reset(); form.classList.remove('was-validated');
    document.getElementById('teacherId').value = id || '';
    document.getElementById('teacherModalTitle').textContent = id ? 'Edit Teacher' : 'Add Teacher';
    if (id) {
      const t = Storage.getById('teachers', id);
      if (!t) return;
      document.getElementById('tName').value = t.name;
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
    }
    new bootstrap.Modal(document.getElementById('teacherModal')).show();
  },
  save(e) {
    e.preventDefault();
    const form = e.target;
    if (!form.checkValidity()) { form.classList.add('was-validated'); return; }
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
      experience: parseInt(document.getElementById('tExperience').value) || 0,
      salary: parseInt(document.getElementById('tSalary').value) || 0,
      joiningDate: document.getElementById('tJoining').value,
      status: document.getElementById('tStatus').value,
      address: document.getElementById('tAddress').value.trim(),
      subjects: [], classes: []
    };
    if (id) { Storage.update('teachers', id, data); Toast.show('Teacher updated', 'success'); }
    else { Storage.add('teachers', data); Toast.show('Teacher added', 'success'); }
    bootstrap.Modal.getInstance(document.getElementById('teacherModal')).hide();
    this.render();
  },
  async remove(id) {
    if (!(await Utils.confirmDelete('Delete this teacher?'))) return;
    Storage.delete('teachers', id);
    Toast.show('Teacher deleted', 'success');
    this.render();
  }
};
window.Teachers = Teachers;
