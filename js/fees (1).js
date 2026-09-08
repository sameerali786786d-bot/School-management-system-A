const Fees = {
  filters: { search: '', status: '' },
  init() {
    this.bindEvents();
    this.renderStats();
    this.render();
    this.populateStudents();
  },
  bindEvents() {
    document.getElementById('btnCollectFee')?.addEventListener('click', () => {
      document.getElementById('feeForm').reset();
      new bootstrap.Modal(document.getElementById('feeModal')).show();
    });
    document.getElementById('searchFee')?.addEventListener('input', Utils.debounce(e => { this.filters.search = e.target.value.toLowerCase(); this.render(); }, 250));
    document.getElementById('filterFeeStatus')?.addEventListener('change', e => { this.filters.status = e.target.value; this.render(); });
    document.getElementById('exportFees')?.addEventListener('click', () => this.exportData());
    document.getElementById('feeForm')?.addEventListener('submit', e => this.collect(e));
    document.getElementById('feeStudent')?.addEventListener('change', e => {
      const st = Storage.getById('students', e.target.value);
      if (st) {
        const fs = Storage.getAll('feeStructure').find(f => f.classId === st.classId);
        if (fs) document.getElementById('feeAmount').value = fs.tuitionFee;
      }
    });
  },
  populateStudents() {
    const sel = document.getElementById('feeStudent');
    if (!sel) return;
    sel.innerHTML = '<option value="">Select Student</option>';
    Storage.getAll('students').filter(s => s.status === 'active').forEach(s => {
      sel.innerHTML += `<option value="${s.id}">${s.fullName} (${s.admissionNo}) - ${s.className}</option>`;
    });
  },
  renderStats() {
    const payments = Storage.getAll('feePayments');
    const collected = payments.filter(p => p.status === 'paid').reduce((s, p) => s + (p.paidAmount || 0), 0);
    const pending = payments.filter(p => p.status === 'pending').reduce((s, p) => s + (p.remaining || p.amount || 0), 0);
    document.getElementById('feeCollected').textContent = Utils.formatCurrency(collected).replace('PKR ', '');
    document.getElementById('feePending').textContent = Utils.formatCurrency(pending).replace('PKR ', '');
    document.getElementById('feeCount').textContent = payments.length;
  },
  getFiltered() {
    let list = Storage.getAll('feePayments');
    if (this.filters.search) list = list.filter(p => (p.studentName||'').toLowerCase().includes(this.filters.search) || (p.invoiceNo||'').toLowerCase().includes(this.filters.search));
    if (this.filters.status) list = list.filter(p => p.status === this.filters.status);
    return list;
  },
  render() {
    const list = this.getFiltered();
    const tbody = document.getElementById('feesBody');
    const empty = document.getElementById('feesEmpty');
    if (!list.length) { tbody.innerHTML = ''; empty.classList.remove('d-none'); return; }
    empty.classList.add('d-none');
    tbody.innerHTML = list.map(p => `
      <tr>
        <td><code>${p.invoiceNo}</code></td>
        <td>${p.studentName}</td>
        <td>${p.className || '-'} ${p.section || ''}</td>
        <td>${p.month}</td>
        <td>${Utils.formatCurrency(p.amount)}</td>
        <td>${Utils.formatCurrency(p.paidAmount)}</td>
        <td>${Utils.formatCurrency(p.remaining)}</td>
        <td>${Utils.getStatusBadge(p.status)}</td>
        <td>
          <button class="btn btn-sm btn-outline-info" onclick="Fees.showReceipt('${p.id}')"><i class="fas fa-receipt"></i></button>
        </td>
      </tr>`).join('');
  },
  collect(e) {
    e.preventDefault();
    const form = e.target;
    if (!form.checkValidity()) { form.classList.add('was-validated'); return; }
    const studentId = document.getElementById('feeStudent').value;
    const st = Storage.getById('students', studentId);
    const amount = parseFloat(document.getElementById('feeAmount').value) || 0;
    const discount = parseFloat(document.getElementById('feeDiscount').value) || 0;
    const paid = parseFloat(document.getElementById('feePaid').value) || 0;
    const remaining = Math.max(0, amount - discount - paid);
    const payment = {
      studentId, studentName: st.fullName, admissionNo: st.admissionNo,
      className: st.className, section: st.section,
      invoiceNo: Utils.generateInvoiceNo(),
      month: document.getElementById('feeMonth').value,
      feeType: document.getElementById('feeType').value,
      amount, discount, paidAmount: paid, remaining,
      paymentMethod: document.getElementById('feeMethod').value,
      paymentDate: new Date().toISOString().slice(0,10),
      status: remaining > 0 ? 'pending' : 'paid',
      createdAt: new Date().toISOString()
    };
    Storage.add('feePayments', payment);
    bootstrap.Modal.getInstance(document.getElementById('feeModal')).hide();
    Toast.show('Fee collected successfully', 'success');
    this.renderStats();
    this.render();
    this.showReceipt(payment.id);
  },
  showReceipt(id) {
    const p = Storage.getById('feePayments', id);
    if (!p) return;
    const settings = Storage.get('settings') || {};
    document.getElementById('receiptBody').innerHTML = `
      <div class="text-center mb-3">
        <h5 class="mb-0">${settings.schoolName || 'THE SMART MODERN PUBLIC SCHOOL QAMBER'}</h5>
        <small class="text-muted">${settings.address || ''}</small>
        <h6 class="mt-2">FEE RECEIPT</h6>
      </div>
      <table class="table table-sm table-borderless">
        <tr><td>Receipt No:</td><td class="fw-bold">${p.invoiceNo}</td></tr>
        <tr><td>Date:</td><td>${Utils.formatDate(p.paymentDate)}</td></tr>
        <tr><td>Student:</td><td>${p.studentName}</td></tr>
        <tr><td>Admission No:</td><td>${p.admissionNo}</td></tr>
        <tr><td>Class:</td><td>${p.className} - ${p.section || ''}</td></tr>
        <tr><td>Month:</td><td>${p.month}</td></tr>
        <tr><td>Fee Type:</td><td>${p.feeType}</td></tr>
        <tr><td>Amount:</td><td>${Utils.formatCurrency(p.amount)}</td></tr>
        <tr><td>Discount:</td><td>${Utils.formatCurrency(p.discount)}</td></tr>
        <tr><td>Paid:</td><td class="fw-bold text-success">${Utils.formatCurrency(p.paidAmount)}</td></tr>
        <tr><td>Remaining:</td><td>${Utils.formatCurrency(p.remaining)}</td></tr>
        <tr><td>Method:</td><td>${p.paymentMethod || '-'}</td></tr>
      </table>
      <div class="text-end mt-4 small text-muted">Accountant Signature</div>`;
    new bootstrap.Modal(document.getElementById('receiptModal')).show();
  },
  exportData() {
    const data = this.getFiltered().map(p => ({
      Invoice: p.invoiceNo, Student: p.studentName, Class: p.className, Month: p.month,
      Amount: p.amount, Paid: p.paidAmount, Remaining: p.remaining, Status: p.status
    }));
    Utils.exportCSV(data, 'fee_payments');
  }
};
window.Fees = Fees;
