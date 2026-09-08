/**
 * Storage Module - LocalStorage persistence for School Management System
 * DEMO ONLY - Replace with Firebase/Supabase/MySQL API calls later
 */

const STORAGE_PREFIX = 'smps_';
const COLLECTIONS = [
  'students', 'teachers', 'staff', 'parents', 'classes', 'sections',
  'subjects', 'attendance', 'teacherAttendance', 'timetable', 'homework',
  'exams', 'results', 'fees', 'feePayments', 'admissions', 'leaves',
  'notices', 'notifications', 'users', 'settings', 'feeStructure'
];

const Storage = {
  get(key) {
    try {
      const raw = localStorage.getItem(STORAGE_PREFIX + key);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      console.error('Storage get error:', key, e);
      return null;
    }
  },

  set(key, data) {
    try {
      localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(data));
      return true;
    } catch (e) {
      console.error('Storage set error:', key, e);
      return false;
    }
  },

  remove(key) {
    localStorage.removeItem(STORAGE_PREFIX + key);
  },

  getAll(collection) {
    return this.get(collection) || [];
  },

  saveAll(collection, data) {
    return this.set(collection, data);
  },

  getById(collection, id) {
    const items = this.getAll(collection);
    return items.find(item => item.id === id) || null;
  },

  add(collection, item) {
    const items = this.getAll(collection);
    if (!item.id) item.id = this.generateId(collection);
    items.push(item);
    this.saveAll(collection, items);
    return item;
  },

  update(collection, id, updates) {
    const items = this.getAll(collection);
    const idx = items.findIndex(item => item.id === id);
    if (idx === -1) return null;
    items[idx] = { ...items[idx], ...updates, updatedAt: new Date().toISOString() };
    this.saveAll(collection, items);
    return items[idx];
  },

  delete(collection, id) {
    let items = this.getAll(collection);
    const before = items.length;
    items = items.filter(item => item.id !== id);
    this.saveAll(collection, items);
    return items.length < before;
  },

  generateId(prefix = 'id') {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  },

  clearAll() {
    COLLECTIONS.forEach(c => this.remove(c));
    localStorage.removeItem(STORAGE_PREFIX + 'initialized');
    localStorage.removeItem(STORAGE_PREFIX + 'currentUser');
  },

  isInitialized() {
    return !!localStorage.getItem(STORAGE_PREFIX + 'initialized');
  },

  markInitialized() {
    localStorage.setItem(STORAGE_PREFIX + 'initialized', 'true');
  }
};

window.Storage = Storage;
