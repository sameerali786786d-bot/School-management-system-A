/**
 * Utility functions for School Management System
 */

const Utils = {
  formatDate(dateStr, format = 'DD/MM/YYYY') {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    if (isNaN(d)) return dateStr;
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    if (format === 'YYYY-MM-DD') return `${year}-${month}-${day}`;
    return `${day}/${month}/${year}`;
  },

  formatCurrency(amount) {
    const settings = Storage.get('settings') || {};
    const currency = settings.currency || 'PKR';
    return `${currency} ${Number(amount || 0).toLocaleString('en-PK')}`;
  },

  generateAdmissionNo() {
    const year = new Date().getFullYear();
    const students = Storage.getAll('students');
    const num = String(students.length + 1).padStart(4, '0');
    return `ADM-${year}-${num}`;
  },

  generateInvoiceNo() {
    const payments = Storage.getAll('feePayments');
    const num = String(payments.length + 1).padStart(5, '0');
    return `INV-${new Date().getFullYear()}-${num}`;
  },

  calculateGrade(percentage, gradeSystem) {
    const system = gradeSystem || [
      { min: 90, grade: 'A+', remark: 'Outstanding' },
      { min: 80, grade: 'A', remark: 'Excellent' },
      { min: 70, grade: 'B', remark: 'Very Good' },
      { min: 60, grade: 'C', remark: 'Good' },
      { min: 50, grade: 'D', remark: 'Satisfactory' },
      { min: 0, grade: 'F', remark: 'Fail' }
    ];
    for (const g of system) {
      if (percentage >= g.min) return { grade: g.grade, remark: g.remark };
    }
    return { grade: 'F', remark: 'Fail' };
  },

  validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email || '');
  },

  validatePhone(phone) {
    return /^(\+92|0)?3\d{9}$/.test((phone || '').replace(/[\s-]/g, '')) || /^0\d{10}$/.test((phone || '').replace(/[\s-]/g, ''));
  },

  debounce(fn, delay = 300) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), delay);
    };
  },

  exportCSV(data, filename) {
    if (!data || !data.length) {
      Toast.show('No data to export', 'warning');
      return;
    }
    const headers = Object.keys(data[0]);
    const rows = data.map(row => headers.map(h => {
      let val = row[h] ?? '';
      if (typeof val === 'object') val = JSON.stringify(val);
      return `"${String(val).replace(/"/g, '""')}"`;
    }).join(','));
    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${filename}_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
    Toast.show('CSV exported successfully', 'success');
  },

  printElement(selector) {
    const el = document.querySelector(selector);
    if (!el) return;
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html><head><title>Print</title>
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
      <link href="css/print.css" rel="stylesheet">
      <style>body{padding:20px;font-family:Arial,sans-serif}</style>
      </head><body>${el.innerHTML}
      <script>window.onload=()=>{window.print();window.close();}</script>
      </body></html>`);
    printWindow.document.close();
  },

  getStatusBadge(status) {
    const map = {
      active: 'success', present: 'success', approved: 'success', paid: 'success',
      inactive: 'secondary', absent: 'danger', rejected: 'danger', pending: 'warning',
      leave: 'info', halfday: 'warning', overdue: 'danger'
    };
    const cls = map[(status || '').toLowerCase()] || 'secondary';
    return `<span class="badge bg-${cls}">${status || '-'}</span>`;
  },

  confirmDelete(message = 'Are you sure you want to delete this item?') {
    return new Promise(resolve => {
      const modal = document.getElementById('confirmModal');
      if (!modal) {
        resolve(confirm(message));
        return;
      }
      document.getElementById('confirmModalBody').textContent = message;
      const bsModal = new bootstrap.Modal(modal);
      const okBtn = document.getElementById('confirmModalOk');
      const handler = () => {
        okBtn.removeEventListener('click', handler);
        bsModal.hide();
        resolve(true);
      };
      okBtn.addEventListener('click', handler);
      modal.addEventListener('hidden.bs.modal', () => resolve(false), { once: true });
      bsModal.show();
    });
  }
};

const Toast = {
  show(message, type = 'info', duration = 3500) {
    let container = document.getElementById('toastContainer');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toastContainer';
      container.className = 'toast-container position-fixed top-0 end-0 p-3';
      container.style.zIndex = '9999';
      document.body.appendChild(container);
    }
    const id = 'toast_' + Date.now();
    const bg = { success: 'bg-success', error: 'bg-danger', warning: 'bg-warning text-dark', info: 'bg-primary' }[type] || 'bg-primary';
    container.insertAdjacentHTML('beforeend', `
      <div id="${id}" class="toast align-items-center text-white ${bg} border-0" role="alert">
        <div class="d-flex">
          <div class="toast-body">${message}</div>
          <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
        </div>
      </div>`);
    const toastEl = document.getElementById(id);
    const toast = new bootstrap.Toast(toastEl, { delay: duration });
    toast.show();
    toastEl.addEventListener('hidden.bs.toast', () => toastEl.remove());
  }
};

window.Utils = Utils;
window.Toast = Toast;
