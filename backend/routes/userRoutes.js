const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

// جميع المسارات تتطلب مصادقة
router.use(authMiddleware);

// ✅ **GET /api/users - الحصول على المستخدمين الذين أنشأهم المستخدم الحالي فقط**
router.get('/', userController.getAllUsers);

// ✅ **GET /api/users/my-team - الحصول على فريق المستخدم الحالي فقط (اسم أوضح)**
router.get('/my-team', userController.getMyTeam);

// ✅ **GET /api/users/my-team/stats - إحصائيات فريق المستخدم الحالي**
router.get('/my-team/stats', userController.getMyTeamStats);

// ✅ **GET /api/users/all - الحصول على جميع المستخدمين (للمشرفين فقط)**
router.get('/all', userController.getAllUsersForSuperAdmin);

// ✅ **GET /api/users/stats - إحصائيات عامة (حسب الصلاحيات)**
router.get('/stats', userController.getUserStats);

// ✅ **GET /api/users/search - البحث عن مستخدمين (ضمن فريق المستخدم فقط)**
router.get('/search', userController.searchUsers);

// ✅ **POST /api/users - إنشاء مستخدم جديد مرتبط بالمستخدم الحالي**
router.post('/', userController.createUser);

// ✅ **GET /api/users/:id - الحصول على مستخدم (مع التحقق من الملكية)**
router.get('/:id', userController.getUserById);

// ✅ **PUT /api/users/:id - تحديث مستخدم (مع التحقق من الملكية)**
router.put('/:id', userController.updateUser);

// ✅ **PATCH /api/users/:id/permissions - تحديث الصلاحيات (مع التحقق من الملكية)**
router.patch('/:id/permissions', userController.updatePermissions);

// ✅ **PATCH /api/users/:id/status - تغيير حالة المستخدم (مع التحقق من الملكية)**
router.patch('/:id/status', userController.changeStatus);

// ✅ **DELETE /api/users/:id - حذف مستخدم (مع التحقق من الملكية)**
router.delete('/:id', userController.deleteUser);

module.exports = router;