/**
 * Demo Data Seeder - Realistic sample data for THE SMART MODERN PUBLIC SCHOOL QAMBER
 * DEMO ONLY
 */

const DemoData = {
  seed() {
    if (Storage.isInitialized()) return;

    // Settings
    Storage.set('settings', {
      schoolName: 'THE SMART MODERN PUBLIC SCHOOL QAMBER',
      shortName: 'SMPS Qamber',
      address: 'Main Road, Qamber Ali Khan, Sindh, Pakistan',
      phone: '+92-74-XXXXXXX',
      email: 'info@smartschoolqamber.edu.pk',
      website: 'www.smartschoolqamber.edu.pk',
      principalName: 'Dr. Muhammad Ali Khan',
      registrationNo: 'EDU-SIN-2018-042',
      academicSession: '2025-2026',
      currency: 'PKR',
      dateFormat: 'DD/MM/YYYY',
      timeFormat: '12h',
      passingPercentage: 50,
      logo: null,
      gradeSystem: [
        { min: 90, grade: 'A+', remark: 'Outstanding' },
        { min: 80, grade: 'A', remark: 'Excellent' },
        { min: 70, grade: 'B', remark: 'Very Good' },
        { min: 60, grade: 'C', remark: 'Good' },
        { min: 50, grade: 'D', remark: 'Satisfactory' },
        { min: 0, grade: 'F', remark: 'Fail' }
      ]
    });

    // Classes & Sections
    const classes = [
      { id: 'c1', name: 'Grade 1', sections: ['A', 'B'], status: 'active' },
      { id: 'c2', name: 'Grade 2', sections: ['A', 'B'], status: 'active' },
      { id: 'c3', name: 'Grade 3', sections: ['A', 'B', 'C'], status: 'active' },
      { id: 'c4', name: 'Grade 4', sections: ['A', 'B'], status: 'active' },
      { id: 'c5', name: 'Grade 5', sections: ['A', 'B'], status: 'active' },
      { id: 'c6', name: 'Grade 6', sections: ['A', 'B'], status: 'active' }
    ];
    Storage.saveAll('classes', classes);

    const sections = [];
    classes.forEach(c => {
      c.sections.forEach(s => {
        sections.push({
          id: `sec_${c.id}_${s}`,
          classId: c.id,
          className: c.name,
          name: s,
          capacity: 40,
          classTeacherId: null
        });
      });
    });
    Storage.saveAll('sections', sections);

    // Subjects
    const subjects = [
      { id: 'sub1', name: 'English', code: 'ENG', maxMarks: 100, passMarks: 40 },
      { id: 'sub2', name: 'Urdu', code: 'URD', maxMarks: 100, passMarks: 40 },
      { id: 'sub3', name: 'Mathematics', code: 'MATH', maxMarks: 100, passMarks: 40 },
      { id: 'sub4', name: 'Science', code: 'SCI', maxMarks: 100, passMarks: 40 },
      { id: 'sub5', name: 'Social Studies', code: 'SST', maxMarks: 100, passMarks: 40 },
      { id: 'sub6', name: 'Islamic Studies', code: 'ISL', maxMarks: 100, passMarks: 40 },
      { id: 'sub7', name: 'Computer', code: 'COMP', maxMarks: 50, passMarks: 20 },
      { id: 'sub8', name: 'Art & Craft', code: 'ART', maxMarks: 50, passMarks: 20 }
    ];
    Storage.saveAll('subjects', subjects);

    // Teachers
    const teachers = [
      { id: 't1', name: 'Mrs. Fatima Zahra', fatherName: 'Ahmed Khan', gender: 'Female', dob: '1985-03-15', cnic: '43201-XXXXXXX-1', phone: '0300-1234567', email: 'fatima@smartschool.pk', address: 'Qamber City', qualification: 'M.A Education', experience: 12, joiningDate: '2018-08-01', designation: 'Senior Teacher', subjects: ['sub1', 'sub5'], classes: ['c1', 'c2'], salary: 65000, status: 'active' },
      { id: 't2', name: 'Mr. Ali Raza', fatherName: 'Ghulam Hussain', gender: 'Male', dob: '1982-07-22', cnic: '43201-XXXXXXX-2', phone: '0301-2345678', email: 'ali@smartschool.pk', address: 'Qamber', qualification: 'M.Sc Mathematics', experience: 10, joiningDate: '2019-03-15', designation: 'Math Teacher', subjects: ['sub3'], classes: ['c3', 'c4', 'c5'], salary: 60000, status: 'active' },
      { id: 't3', name: 'Ms. Ayesha Malik', fatherName: 'Malik Saleem', gender: 'Female', dob: '1990-11-05', cnic: '43201-XXXXXXX-3', phone: '0302-3456789', email: 'ayesha@smartschool.pk', address: 'Qamber Ali Khan', qualification: 'B.Ed, M.A Urdu', experience: 6, joiningDate: '2020-09-01', designation: 'Urdu Teacher', subjects: ['sub2'], classes: ['c1', 'c2', 'c3'], salary: 52000, status: 'active' },
      { id: 't4', name: 'Mr. Hassan Ali', fatherName: 'Ali Nawaz', gender: 'Male', dob: '1988-01-18', cnic: '43201-XXXXXXX-4', phone: '0303-4567890', email: 'hassan@smartschool.pk', address: 'Near Bus Stand, Qamber', qualification: 'M.Sc Physics', experience: 8, joiningDate: '2019-08-20', designation: 'Science Teacher', subjects: ['sub4'], classes: ['c4', 'c5', 'c6'], salary: 58000, status: 'active' },
      { id: 't5', name: 'Mrs. Sanaullah Begum', fatherName: 'Abdul Sattar', gender: 'Female', dob: '1980-05-30', cnic: '43201-XXXXXXX-5', phone: '0304-5678901', email: 'sana@smartschool.pk', address: 'Qamber', qualification: 'M.A Islamic Studies', experience: 15, joiningDate: '2018-04-01', designation: 'Islamic Studies', subjects: ['sub6'], classes: ['c1', 'c2', 'c3', 'c4'], salary: 55000, status: 'active' },
      { id: 't6', name: 'Mr. Kamran Shah', fatherName: 'Shahid Hussain', gender: 'Male', dob: '1992-09-12', cnic: '43201-XXXXXXX-6', phone: '0305-6789012', email: 'kamran@smartschool.pk', address: 'Qamber', qualification: 'BS Computer Science', experience: 5, joiningDate: '2021-01-10', designation: 'Computer Teacher', subjects: ['sub7'], classes: ['c3', 'c4', 'c5', 'c6'], salary: 50000, status: 'active' },
      { id: 't7', name: 'Ms. Nadia Khan', fatherName: 'Asif Khan', gender: 'Female', dob: '1993-02-25', cnic: '43201-XXXXXXX-7', phone: '0306-7890123', email: 'nadia@smartschool.pk', address: 'Qamber', qualification: 'B.Ed', experience: 4, joiningDate: '2022-03-01', designation: 'Class Teacher', subjects: ['sub1', 'sub8'], classes: ['c1'], salary: 45000, status: 'active' },
      { id: 't8', name: 'Mr. Usman Ghani', fatherName: 'Ghani Bakhsh', gender: 'Male', dob: '1987-12-08', cnic: '43201-XXXXXXX-8', phone: '0307-8901234', email: 'usman@smartschool.pk', address: 'Qamber', qualification: 'M.A History', experience: 9, joiningDate: '2019-11-15', designation: 'SST Teacher', subjects: ['sub5'], classes: ['c5', 'c6'], salary: 54000, status: 'active' },
      { id: 't9', name: 'Mrs. Rabia Anwar', fatherName: 'Anwar Ali', gender: 'Female', dob: '1986-06-14', cnic: '43201-XXXXXXX-9', phone: '0308-9012345', email: 'rabia@smartschool.pk', address: 'Qamber', qualification: 'M.Ed', experience: 11, joiningDate: '2018-09-01', designation: 'Senior Teacher', subjects: ['sub1', 'sub3'], classes: ['c2', 'c3'], salary: 62000, status: 'active' },
      { id: 't10', name: 'Mr. Tariq Mehmood', fatherName: 'Mehmood Khan', gender: 'Male', dob: '1984-04-03', cnic: '43201-XXXXXXX-0', phone: '0309-0123456', email: 'tariq@smartschool.pk', address: 'Qamber', qualification: 'M.Sc Chemistry', experience: 13, joiningDate: '2018-05-15', designation: 'Science Teacher', subjects: ['sub4'], classes: ['c6'], salary: 60000, status: 'active' }
    ];
    Storage.saveAll('teachers', teachers);

    // Assign class teachers
    const secs = Storage.getAll('sections');
    secs[0].classTeacherId = 't7';
    secs[2].classTeacherId = 't1';
    secs[4].classTeacherId = 't3';
    Storage.saveAll('sections', secs);

    // Staff
    const staff = [
      { id: 'st1', name: 'Mr. Bilal Ahmed', position: 'Accountant', phone: '0310-1112233', email: 'bilal@smartschool.pk', joiningDate: '2019-01-15', salary: 45000, status: 'active' },
      { id: 'st2', name: 'Mr. Imran Shah', position: 'Clerk', phone: '0311-2223344', email: 'imran@smartschool.pk', joiningDate: '2020-06-01', salary: 35000, status: 'active' },
      { id: 'st3', name: 'Ms. Saima Noor', position: 'Librarian', phone: '0312-3334455', email: 'saima@smartschool.pk', joiningDate: '2021-02-10', salary: 38000, status: 'active' },
      { id: 'st4', name: 'Mr. Rafiq Ahmed', position: 'Receptionist', phone: '0313-4445566', email: 'rafiq@smartschool.pk', joiningDate: '2022-08-01', salary: 32000, status: 'active' },
      { id: 'st5', name: 'Mr. Ghulam Mustafa', position: 'Security', phone: '0314-5556677', email: '', joiningDate: '2018-03-01', salary: 28000, status: 'active' }
    ];
    Storage.saveAll('staff', staff);

    // Parents
    const parents = [
      { id: 'p1', fatherName: 'Muhammad Aslam', motherName: 'Shaheen Bibi', phone: '0300-9876543', email: 'aslam@email.com', address: 'Village Qamber', occupation: 'Farmer', children: [] },
      { id: 'p2', fatherName: 'Abdul Ghafoor', motherName: 'Nasreen', phone: '0301-8765432', email: 'ghafoor@email.com', address: 'Qamber City', occupation: 'Shopkeeper', children: [] },
      { id: 'p3', fatherName: 'Sikandar Ali', motherName: 'Razia', phone: '0302-7654321', email: 'sikandar@email.com', address: 'Near Main Bazaar', occupation: 'Teacher', children: [] },
      { id: 'p4', fatherName: 'Niaz Hussain', motherName: 'Farzana', phone: '0303-6543210', email: 'niaz@email.com', address: 'Qamber', occupation: 'Business', children: [] },
      { id: 'p5', fatherName: 'Ghulam Shabbir', motherName: 'Parveen', phone: '0304-5432109', email: 'shabbir@email.com', address: 'Qamber Ali Khan', occupation: 'Government Employee', children: [] },
      { id: 'p6', fatherName: 'Allah Dino', motherName: 'Zainab', phone: '0305-4321098', email: '', address: 'Village Area', occupation: 'Farmer', children: [] },
      { id: 'p7', fatherName: 'Mumtaz Ali', motherName: 'Safia', phone: '0306-3210987', email: 'mumtaz@email.com', address: 'Qamber', occupation: 'Driver', children: [] },
      { id: 'p8', fatherName: 'Riaz Ahmed', motherName: 'Shazia', phone: '0307-2109876', email: 'riaz@email.com', address: 'City Qamber', occupation: 'Engineer', children: [] },
      { id: 'p9', fatherName: 'Karim Bakhsh', motherName: 'Sultana', phone: '0308-1098765', email: '', address: 'Qamber', occupation: 'Labor', children: [] },
      { id: 'p10', fatherName: 'Yar Muhammad', motherName: 'Hameeda', phone: '0309-0987654', email: 'yar@email.com', address: 'Qamber', occupation: 'Shopkeeper', children: [] }
    ];
    Storage.saveAll('parents', parents);

    // Students (20+)
    const firstNames = ['Ahmed', 'Ali', 'Hassan', 'Usman', 'Bilal', 'Hamza', 'Omar', 'Zain', 'Ayesha', 'Fatima', 'Sana', 'Hira', 'Maryam', 'Noor', 'Zara', 'Sara', 'Ibrahim', 'Yusuf', 'Amina', 'Khadija', 'Rayan', 'Daniyal'];
    const lastNames = ['Khan', 'Ali', 'Ahmed', 'Hussain', 'Shah', 'Malik', 'Raza', 'Siddiqui', 'Memon', 'Qureshi'];
    const students = [];
    const genders = ['Male', 'Female'];
    let parentIdx = 0;

    for (let i = 1; i <= 24; i++) {
      const gender = i % 3 === 0 ? 'Female' : (i % 2 === 0 ? 'Male' : 'Female');
      const fname = gender === 'Male' ? firstNames[i % 8] : firstNames[8 + (i % 8)];
      const lname = lastNames[i % lastNames.length];
      const classIdx = Math.floor((i - 1) / 4) % 6;
      const cls = classes[classIdx];
      const sec = cls.sections[i % cls.sections.length];
      const parent = parents[parentIdx % parents.length];
      parentIdx++;

      const student = {
        id: `s${i}`,
        admissionNo: `ADM-2025-${String(i).padStart(4, '0')}`,
        fullName: `${fname} ${lname}`,
        fatherName: parent.fatherName,
        motherName: parent.motherName,
        dob: `${2014 - classIdx}-${String((i % 12) + 1).padStart(2, '0')}-${String((i % 28) + 1).padStart(2, '0')}`,
        gender,
        classId: cls.id,
        className: cls.name,
        section: sec,
        rollNo: String((i % 4) + 1).padStart(2, '0'),
        phone: parent.phone,
        email: '',
        address: parent.address,
        city: 'Qamber',
        admissionDate: '2025-04-01',
        previousSchool: i > 15 ? 'Govt. Primary School' : '',
        bloodGroup: ['A+', 'B+', 'O+', 'AB+', 'A-', 'B-'][i % 6],
        emergencyContact: parent.phone,
        photo: null,
        parentId: parent.id,
        status: 'active',
        createdAt: new Date().toISOString()
      };
      students.push(student);
      if (!parent.children.includes(student.id)) parent.children.push(student.id);
    }
    Storage.saveAll('students', students);
    Storage.saveAll('parents', parents);

    // Fee Structure
    const feeStructure = classes.map(c => ({
      id: `fs_${c.id}`,
      classId: c.id,
      className: c.name,
      admissionFee: 5000,
      tuitionFee: 2500 + (parseInt(c.name.replace('Grade ', '')) * 200),
      examFee: 800,
      computerFee: 500,
      transportFee: 1500,
      otherFee: 300,
      discount: 0
    }));
    Storage.saveAll('feeStructure', feeStructure);

    // Fee Payments (some paid, some pending)
    const feePayments = [];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August'];
    students.slice(0, 18).forEach((st, idx) => {
      const fs = feeStructure.find(f => f.classId === st.classId);
      const tuition = fs ? fs.tuitionFee : 3000;
      const paid = idx % 3 !== 0;
      feePayments.push({
        id: `fp${idx + 1}`,
        studentId: st.id,
        studentName: st.fullName,
        admissionNo: st.admissionNo,
        className: st.className,
        section: st.section,
        invoiceNo: `INV-2025-${String(idx + 1).padStart(5, '0')}`,
        month: months[idx % 8],
        feeType: 'Tuition Fee',
        amount: tuition,
        discount: idx % 5 === 0 ? 200 : 0,
        paidAmount: paid ? tuition - (idx % 5 === 0 ? 200 : 0) : 0,
        remaining: paid ? 0 : tuition,
        paymentMethod: paid ? (idx % 2 === 0 ? 'Cash' : 'Bank Transfer') : null,
        paymentDate: paid ? `2025-0${(idx % 8) + 1}-15` : null,
        status: paid ? 'paid' : 'pending',
        createdAt: new Date().toISOString()
      });
    });
    Storage.saveAll('feePayments', feePayments);

    // Attendance (today + some history)
    const today = new Date().toISOString().slice(0, 10);
    const attendance = [];
    students.forEach((st, idx) => {
      const status = idx % 11 === 0 ? 'absent' : (idx % 15 === 0 ? 'leave' : 'present');
      attendance.push({
        id: `att_${st.id}_${today}`,
        studentId: st.id,
        studentName: st.fullName,
        classId: st.classId,
        className: st.className,
        section: st.section,
        date: today,
        status,
        markedBy: 't1',
        createdAt: new Date().toISOString()
      });
    });
    Storage.saveAll('attendance', attendance);

    // Teacher Attendance
    const teacherAttendance = teachers.map((t, idx) => ({
      id: `tatt_${t.id}_${today}`,
      teacherId: t.id,
      teacherName: t.name,
      date: today,
      status: idx === 9 ? 'leave' : (idx === 8 ? 'halfday' : 'present'),
      createdAt: new Date().toISOString()
    }));
    Storage.saveAll('teacherAttendance', teacherAttendance);

    // Homework
    const homework = [
      { id: 'hw1', subjectId: 'sub3', subjectName: 'Mathematics', classId: 'c3', className: 'Grade 3', section: 'A', teacherId: 't2', teacherName: 'Mr. Ali Raza', title: 'Chapter 5 Exercises', description: 'Solve exercises 5.1 to 5.3 from textbook. Show all working.', assignedDate: '2025-09-01', dueDate: '2025-09-08', status: 'active' },
      { id: 'hw2', subjectId: 'sub1', subjectName: 'English', classId: 'c2', className: 'Grade 2', section: 'A', teacherId: 't1', teacherName: 'Mrs. Fatima Zahra', title: 'Essay Writing', description: 'Write a short essay on "My School" (100-150 words).', assignedDate: '2025-09-02', dueDate: '2025-09-09', status: 'active' },
      { id: 'hw3', subjectId: 'sub4', subjectName: 'Science', classId: 'c5', className: 'Grade 5', section: 'A', teacherId: 't4', teacherName: 'Mr. Hassan Ali', title: 'Plant Parts Diagram', description: 'Draw and label parts of a plant. Bring colored pencils.', assignedDate: '2025-09-03', dueDate: '2025-09-10', status: 'active' },
      { id: 'hw4', subjectId: 'sub2', subjectName: 'Urdu', classId: 'c1', className: 'Grade 1', section: 'A', teacherId: 't3', teacherName: 'Ms. Ayesha Malik', title: 'Urdu Alphabet Practice', description: 'Practice writing alif to yeh 5 times each.', assignedDate: '2025-09-04', dueDate: '2025-09-07', status: 'active' }
    ];
    Storage.saveAll('homework', homework);

    // Exams
    const exams = [
      { id: 'ex1', name: 'Monthly Test - August', type: 'Monthly Test', startDate: '2025-08-20', endDate: '2025-08-25', status: 'completed' },
      { id: 'ex2', name: 'Mid Term Examination', type: 'Mid Term', startDate: '2025-10-15', endDate: '2025-10-25', status: 'upcoming' },
      { id: 'ex3', name: 'Final Term Examination', type: 'Final Term', startDate: '2026-03-01', endDate: '2026-03-15', status: 'upcoming' }
    ];
    Storage.saveAll('exams', exams);

    // Exam Schedule
    const examSchedule = [
      { id: 'es1', examId: 'ex2', examName: 'Mid Term Examination', classId: 'c3', className: 'Grade 3', subjectId: 'sub3', subjectName: 'Mathematics', date: '2025-10-16', startTime: '09:00', endTime: '11:00', room: 'Hall A' },
      { id: 'es2', examId: 'ex2', examName: 'Mid Term Examination', classId: 'c3', className: 'Grade 3', subjectId: 'sub1', subjectName: 'English', date: '2025-10-17', startTime: '09:00', endTime: '11:00', room: 'Hall A' },
      { id: 'es3', examId: 'ex2', examName: 'Mid Term Examination', classId: 'c5', className: 'Grade 5', subjectId: 'sub4', subjectName: 'Science', date: '2025-10-18', startTime: '09:00', endTime: '12:00', room: 'Hall B' }
    ];
    Storage.saveAll('examSchedule', examSchedule);

    // Results (for completed exam)
    const results = [];
    students.filter(s => s.classId === 'c3').forEach((st, idx) => {
      subjects.slice(0, 6).forEach((sub, sidx) => {
        const obtained = 40 + Math.floor(Math.random() * 55);
        const percentage = (obtained / sub.maxMarks) * 100;
        const { grade, remark } = Utils.calculateGrade(percentage);
        results.push({
          id: `res_${st.id}_${sub.id}`,
          examId: 'ex1',
          examName: 'Monthly Test - August',
          studentId: st.id,
          studentName: st.fullName,
          className: st.className,
          section: st.section,
          rollNo: st.rollNo,
          subjectId: sub.id,
          subjectName: sub.name,
          maxMarks: sub.maxMarks,
          obtainedMarks: obtained,
          percentage: Math.round(percentage * 10) / 10,
          grade,
          remark,
          status: obtained >= sub.passMarks ? 'pass' : 'fail'
        });
      });
    });
    Storage.saveAll('results', results);

    // Timetable sample
    const timetable = [];
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const periods = [
      { period: 1, start: '08:00', end: '08:45' },
      { period: 2, start: '08:45', end: '09:30' },
      { period: 3, start: '09:45', end: '10:30' },
      { period: 4, start: '10:30', end: '11:15' },
      { period: 5, start: '11:30', end: '12:15' },
      { period: 6, start: '12:15', end: '13:00' }
    ];
    const subjectCycle = ['sub1', 'sub3', 'sub2', 'sub4', 'sub6', 'sub7'];
    days.forEach((day, dIdx) => {
      periods.forEach((p, pIdx) => {
        const subId = subjectCycle[(dIdx + pIdx) % subjectCycle.length];
        const sub = subjects.find(s => s.id === subId);
        const teacher = teachers.find(t => t.subjects.includes(subId)) || teachers[0];
        timetable.push({
          id: `tt_c3_A_${day}_${p.period}`,
          classId: 'c3',
          className: 'Grade 3',
          section: 'A',
          day,
          period: p.period,
          startTime: p.start,
          endTime: p.end,
          subjectId: subId,
          subjectName: sub.name,
          teacherId: teacher.id,
          teacherName: teacher.name,
          room: 'Room 3A'
        });
      });
    });
    Storage.saveAll('timetable', timetable);

    // Notices
    const notices = [
      { id: 'n1', title: 'Mid Term Examination Schedule', description: 'Mid Term exams will commence from 15th October 2025. Parents are requested to ensure students prepare well.', date: '2025-09-01', audience: 'Everyone', priority: 'high', status: 'active', createdBy: 'admin' },
      { id: 'n2', title: 'Parent-Teacher Meeting', description: 'PTM will be held on 20th September 2025 from 10:00 AM to 1:00 PM. All parents are requested to attend.', date: '2025-09-05', audience: 'Parents', priority: 'medium', status: 'active', createdBy: 'principal' },
      { id: 'n3', title: 'School will remain closed', description: 'School will remain closed on 14th August for Independence Day celebrations.', date: '2025-08-10', audience: 'Everyone', priority: 'medium', status: 'active', createdBy: 'admin' },
      { id: 'n4', title: 'Fee Collection Reminder', description: 'Please clear pending tuition fees by 10th of every month to avoid fine.', date: '2025-09-01', audience: 'Parents', priority: 'high', status: 'active', createdBy: 'accountant' },
      { id: 'n5', title: 'Sports Day 2025', description: 'Annual Sports Day will be held on 25th November 2025. Students interested in participating should contact sports teacher.', date: '2025-09-03', audience: 'Students', priority: 'low', status: 'active', createdBy: 'admin' }
    ];
    Storage.saveAll('notices', notices);

    // Notifications
    const notifications = [
      { id: 'nt1', title: 'Fee Due Reminder', message: 'Tuition fee for September is pending for some students.', type: 'fee', read: false, createdAt: new Date().toISOString() },
      { id: 'nt2', title: 'New Homework Assigned', message: 'Mathematics homework assigned to Grade 3-A.', type: 'homework', read: false, createdAt: new Date().toISOString() },
      { id: 'nt3', title: 'Exam Schedule Published', message: 'Mid Term exam schedule is now available.', type: 'exam', read: true, createdAt: new Date(Date.now() - 86400000).toISOString() },
      { id: 'nt4', title: 'New Notice', message: 'Parent-Teacher Meeting announced for 20th September.', type: 'notice', read: false, createdAt: new Date().toISOString() }
    ];
    Storage.saveAll('notifications', notifications);

    // Admissions
    const admissions = [
      { id: 'ad1', applicationNo: 'APP-2025-001', studentName: 'Zainab Ali', fatherName: 'Ali Hassan', motherName: 'Saima', dob: '2018-05-12', gender: 'Female', previousSchool: 'ABC Montessori', applyingClass: 'Grade 1', phone: '0315-1112233', email: '', address: 'Qamber', applicationDate: '2025-03-10', status: 'approved' },
      { id: 'ad2', applicationNo: 'APP-2025-002', studentName: 'Ahmed Raza', fatherName: 'Raza Khan', motherName: 'Nadia', dob: '2017-08-20', gender: 'Male', previousSchool: '', applyingClass: 'Grade 2', phone: '0316-2223344', email: 'raza@email.com', address: 'Qamber City', applicationDate: '2025-03-15', status: 'pending' },
      { id: 'ad3', applicationNo: 'APP-2025-003', studentName: 'Hira Fatima', fatherName: 'Tariq Mehmood', motherName: 'Bushra', dob: '2016-11-03', gender: 'Female', previousSchool: 'Little Stars', applyingClass: 'Grade 3', phone: '0317-3334455', email: '', address: 'Village', applicationDate: '2025-03-20', status: 'rejected' }
    ];
    Storage.saveAll('admissions', admissions);

    // Leaves
    const leaves = [
      { id: 'lv1', applicantType: 'student', applicantId: 's5', applicantName: 'Sana Khan', leaveType: 'Sick Leave', fromDate: '2025-09-05', toDate: '2025-09-06', reason: 'Fever', status: 'approved', approvedBy: 't1' },
      { id: 'lv2', applicantType: 'teacher', applicantId: 't10', applicantName: 'Mr. Tariq Mehmood', leaveType: 'Casual Leave', fromDate: '2025-09-08', toDate: '2025-09-08', reason: 'Personal work', status: 'pending', approvedBy: null },
      { id: 'lv3', applicantType: 'staff', applicantId: 'st2', applicantName: 'Mr. Imran Shah', leaveType: 'Annual Leave', fromDate: '2025-09-10', toDate: '2025-09-12', reason: 'Family function', status: 'approved', approvedBy: 'admin' }
    ];
    Storage.saveAll('leaves', leaves);

    Auth.init();
    Storage.markInitialized();
    console.log('Demo data seeded successfully for THE SMART MODERN PUBLIC SCHOOL QAMBER');
  }
};

window.DemoData = DemoData;
