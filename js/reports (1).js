const PageModule = {
  init() {
    document.getElementById('pageTitle').textContent = 'Reports';
    document.querySelector('.card-body').innerHTML = `
      <div class="row g-3">
        <div class="col-md-4"><div class="card border h-100"><div class="card-body text-center">
          <i class="fas fa-user-graduate fa-2x text-primary mb-2"></i>
          <h6>Student List</h6>
          <button class="btn btn-sm btn-outline-primary" onclick="Reports.exportStudents()">Export CSV</button>
        </div></div></div>
        <div class="col-md-4"><div class="card border h-100"><div class="card-body text-center">
          <i class="fas fa-calendar-check fa-2x text-success mb-2"></i>
          <h6>Attendance Report</h6>
          <button class="btn btn-sm btn-outline-success" onclick="Reports.exportAttendance()">Export CSV</button>
        </div></div></div>
        <div class="col-md-4"><div class="card border h-100"><div class="card-body text-center">
          <i class="fas fa-money-bill-wave fa-2x text-warning mb-2"></i>
          <h6>Fee Collection</h6>
          <button class="btn btn-sm btn-outline-warning" onclick="Reports.exportFees()">Export CSV</button>
        </div></div></div>
        <div class="col-md-4"><div class="card border h-100"><div class="card-body text-center">
          <i class="fas fa-file-alt fa-2x text-info mb-2"></i>
          <h6>Exam Results</h6>
          <button class="btn btn-sm btn-outline-info" onclick="Reports.exportResults()">Export CSV</button>
        </div></div></div>
        <div class="col-md-4"><div class="card border h-100"><div class="card-body text-center">
          <i class="fas fa-chalkboard-teacher fa-2x text-secondary mb-2"></i>
          <h6>Teachers List</h6>
          <button class="btn btn-sm btn-outline-secondary" onclick="Reports.exportTeachers()">Export CSV</button>
        </div></div></div>
        <div class="col-md-4"><div class="card border h-100"><div class="card-body text-center">
          <i class="fas fa-user-plus fa-2x text-danger mb-2"></i>
          <h6>Admissions Report</h6>
          <button class="btn btn-sm btn-outline-danger" onclick="Reports.exportAdmissions()">Export CSV</button>
        </div></div></div>
      </div>`;
  }
};
const Reports = {
  exportStudents() {
    Utils.exportCSV(Storage.getAll('students').map(s => ({AdmissionNo:s.admissionNo,Name:s.fullName,Class:s.className,Section:s.section,Gender:s.gender,Phone:s.phone,Status:s.status})), 'students_report');
  },
  exportAttendance() {
    Utils.exportCSV(Storage.getAll('attendance').map(a => ({Date:a.date,Student:a.studentName,Class:a.className,Section:a.section,Status:a.status})), 'attendance_report');
  },
  exportFees() {
    Utils.exportCSV(Storage.getAll('feePayments').map(p => ({Invoice:p.invoiceNo,Student:p.studentName,Month:p.month,Amount:p.amount,Paid:p.paidAmount,Status:p.status})), 'fees_report');
  },
  exportResults() {
    Utils.exportCSV(Storage.getAll('results').map(r => ({Student:r.studentName,Exam:r.examName,Subject:r.subjectName,Obtained:r.obtainedMarks,Max:r.maxMarks,Grade:r.grade})), 'results_report');
  },
  exportTeachers() {
    Utils.exportCSV(Storage.getAll('teachers').map(t => ({Name:t.name,Designation:t.designation,Phone:t.phone,Email:t.email,Status:t.status})), 'teachers_report');
  },
  exportAdmissions() {
    Utils.exportCSV(Storage.getAll('admissions').map(a => ({AppNo:a.applicationNo,Name:a.studentName,Class:a.applyingClass,Status:a.status})), 'admissions_report');
  }
};
window.Reports = Reports;
