const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  // الحقول الأساسية
  name: { 
    type: String, 
    required: [true, 'Name is required'] 
  },
  email: { 
    type: String, 
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true
  },
  password: { 
    type: String, 
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters']
  },
  
  // الحقول المهنية
  avatar: { 
    type: String, 
    default: '' 
  },
  bio: { 
    type: String, 
    default: '' 
  },
  phone: { 
    type: String, 
    default: '' 
  },
  company: { 
    type: String, 
    default: '' 
  },
  jobTitle: { 
    type: String, 
    default: '' 
  },
  department: {
    type: String,
    enum: ['Development', 'Design', 'Marketing', 'Management', 'Support', 'Other'],
    default: 'Other'
  },
  
  // إدارة الأدوار والصلاحيات
  role: {
    type: String,
    enum: ['admin', 'manager', 'editor', 'contributor', 'viewer'],
    default: 'contributor'
  },
  permissions: {
    canCreate: { type: Boolean, default: false },
    canEdit: { type: Boolean, default: false },
    canDelete: { type: Boolean, default: false },
    canReview: { type: Boolean, default: false },
    canApprove: { type: Boolean, default: false },
    canExport: { type: Boolean, default: false },
    canManageUsers: { type: Boolean, default: false }
  },
  
  // ✅ **إضافة هذه الحقول الجديدة:**
  adminSecretKey: {
    type: String,
    default: '',
    select: false // إخفاء عند جلب البيانات إلا إذا طلبناها صراحة
  },
  hasAdminKey: {
    type: Boolean,
    default: false
  },
  adminKeyCreatedAt: {
    type: Date
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },

  
  // الحالة والتفعيل
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended', 'pending'],
    default: 'pending'
  },
  isVerified: { 
    type: Boolean, 
    default: false 
  },
  lastLogin: { 
    type: Date 
  },
  loginAttempts: {
    type: Number,
    default: 0
  },
  
  // إعدادات المراسلة
  notificationPreferences: {
    emailNotifications: { type: Boolean, default: true },
    pushNotifications: { type: Boolean, default: true },
    dailyDigest: { type: Boolean, default: false },
    weeklyReport: { type: Boolean, default: true }
  },
  
  // التواريخ
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  },
  
  // إحصائيات المستخدم
  stats: {
    totalEntities: { type: Number, default: 0 },
    totalReviews: { type: Number, default: 0 },
    totalComments: { type: Number, default: 0 },
    lastActive: { type: Date }
  }
});

// تحديث updatedAt قبل الحفظ
userSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  
  if (!this.isModified('password')) return next();
  
  // تشفير كلمة المرور
  const salt = bcrypt.genSaltSync(10);
  this.password = bcrypt.hashSync(this.password, salt);
  
  // ✅ إذا كان هناك adminSecretKey، قم بتشفيره أيضاً
  if (this.isModified('adminSecretKey') && this.adminSecretKey) {
    this.adminSecretKey = bcrypt.hashSync(this.adminSecretKey, salt);
  }
  
  next();
});

// التحقق من كلمة المرور
userSchema.methods.comparePassword = function(password) {
  return bcrypt.compareSync(password, this.password);
};

// ✅ التحقق من مفتاح Admin
userSchema.methods.compareAdminKey = function(adminKey) {
  if (!this.adminSecretKey) return false;
  return bcrypt.compareSync(adminKey, this.adminSecretKey);
};

// تحديث آخر وقت تسجيل دخول
userSchema.methods.updateLastLogin = function() {
  this.lastLogin = Date.now();
  this.loginAttempts = 0;
  return this.save();
};

// زيادة محاولات تسجيل الدخول الفاشلة
userSchema.methods.incrementLoginAttempts = function() {
  this.loginAttempts += 1;
  if (this.loginAttempts >= 5) {
    this.status = 'suspended';
  }
  return this.save();
};

module.exports = mongoose.model('User', userSchema);