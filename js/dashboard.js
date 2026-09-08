/**
 * Dashboard Module
 */

const Dashboard = {
  charts: {},

  init() {
    const user = Auth.getCurrentUser();
    if (user) {
      document.getElementById('welcomeText').textContent = `Welcome back, ${user.name}`;
    }
    document.getElementById('currentDate').textContent = new Date().toLocaleDateString('en-PK', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
    this.loadStats();
    this.renderCharts();
    this.loadNotices();
    this.loadExams();
  },

  loadStats() {
    const students = Storage.getAll('students').filter(s => s.status === 'active');
    const teachers = Storage.getAll('teachers').filter(t => t.status === 'active');
    const staff = Storage.getAll('staff').filter(s => s.status === 'active');
    const classes = Storage.getAll('classes');
    const today = new Date().toISOString().slice(0, 10);
    const att = Storage.getAll('attendance').filter(a => a.date === today);
    const present = att.filter(a => a.status === 'present').length;
    const absent = att.filter(a => a.status === 'absent').length;
    const payments = Storage.getAll('feePayments');
    const collected = payments.filter(p => p.status === 'paid').reduce((s, p) => s + (p.paidAmount || 0), 0);
    const pending = payments.filter(p => p.status === 'pending').reduce((s, p) => s + (p.remaining || p.amount || 0), 0);

    document.getElementById('statStudents').textContent = students.length;
    document.getElementById('statTeachers').textContent = teachers.length;
    document.getElementById('statStaff').textContent = staff.length;
    document.getElementById('statClasses').textContent = classes.length;
    document.getElementById('statPresent').textContent = present;
    document.getElementById('statAbsent').textContent = absent;
    document.getElementById('statCollected').textContent = Utils.formatCurrency(collected).replace('PKR ', '');
    document.getElementById('statPending').textContent = Utils.formatCurrency(pending).replace('PKR ', '');
  },

  renderCharts() {
    const students = Storage.getAll('students').filter(s => s.status === 'active');
    const boys = students.filter(s => s.gender === 'Male').length;
    const girls = students.filter(s => s.gender === 'Female').length;

    const today = new Date().toISOString().slice(0, 10);
    const att = Storage.getAll('attendance').filter(a => a.date === today);
    const present = att.filter(a => a.status === 'present').length;
    const absent = att.filter(a => a.status === 'absent').length;
    const leave = att.filter(a => a.status === 'leave').length;

    const payments = Storage.getAll('feePayments');
    const paid = payments.filter(p => p.status === 'paid').length;
    const pending = payments.filter(p => p.status === 'pending').length;

    // Gender
    this.charts.gender = new Chart(document.getElementById('genderChart'), {
      type: 'doughnut',
      data: {
        labels: ['Boys', 'Girls'],
        datasets: [{ data: [boys, girls], backgroundColor: ['#3b82f6', '#ec4899'], borderWidth: 0 }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { position: 'bottom' } }
      }
    });

    // Attendance
    this.charts.attendance = new Chart(document.getElementById('attendanceChart'), {
      type: 'doughnut',
      data: {
        labels: ['Present', 'Absent', 'Leave'],
        datasets: [{ data: [present, absent, leave], backgroundColor: ['#059669', '#dc2626', '#0891b2'], borderWidth: 0 }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { position: 'bottom' } }
      }
    });

    // Fees
    this.charts.fees = new Chart(document.getElementById('feeChart'), {
      type: 'doughnut',
      data: {
        labels: ['Paid', 'Pending'],
        datasets: [{ data: [paid, pending], backgroundColor: ['#059669', '#d97706'], borderWidth: 0 }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { position: 'bottom' } }
      }
    });
  },

  loadNotices() {
    const notices = Storage.getAll('notices').filter(n => n.status === 'active').slice(0, 5);
    const el = document.getElementById('noticesList');
    if (!notices.length) {
      el.innerHTML = '<div class="empty-state py-4"><i class="fas fa-bullhorn"></i><p>No notices</p></div>';
      return;
    }
    el.innerHTML = notices.map(n => `
      <div class="d-flex align-items-start gap-3 p-3 border-bottom">
        <div class="stat-icon ${n.priority === 'high' ? 'red' : n.priority === 'medium' ? 'orange' : 'blue'}" style="width:36px;height:36px;font-size:.9rem;">
          <i class="fas fa-bullhorn"></i>
        </div>
        <div class="flex-grow-1">
          <div class="fw-semibold">${n.title}</div>
          <div class="text-muted small text-truncate" style="max-width:100%;">${n.description}</div>
          <div class="text-muted small mt-1">${Utils.formatDate(n.date)} • ${n.audience}</div>
        </div>
      </div>`).join('');
  },

  loadExams() {
    const exams = Storage.getAll('exams').filter(e => e.status === 'upcoming').slice(0, 5);
    const el = document.getElementById('examsList');
    if (!exams.length) {
      el.innerHTML = '<div class="empty-state py-4"><i class="fas fa-file-alt"></i><p>No upcoming exams</p></div>';
      return;
    }
    el.innerHTML = exams.map(e => `
      <div class="d-flex align-items-center justify-content-between p-3 border-bottom">
        <div>
          <div class="fw-semibold">${e.name}</div>
          <div class="text-muted small">${e.type} • ${Utils.formatDate(e.startDate)} - ${Utils.formatDate(e.endDate)}</div>
        </div>
        <span class="badge bg-info">Upcoming</span>
      </div>`).join('');
  }
};

window.Dashboard = Dashboard;
