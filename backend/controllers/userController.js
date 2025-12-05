const User = require('../models/userModel');
const mongoose = require('mongoose');

// الحصول على جميع المستخدمين
exports.getAllUsers = async (req, res) => {
  try {
    // تحقق من صلاحيات المستخدم
    if (req.user.role !== 'admin' && req.user.role !== 'manager') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const users = await User.find({})
      .select('-password')
      .sort({ createdAt: -1 });
    
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// الحصول على مستخدم واحد
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // تحقق من الصلاحيات
    if (req.user.role !== 'admin' && req.user.role !== 'manager' && req.user.id !== req.params.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// إنشاء مستخدم جديد
exports.createUser = async (req, res) => {
  try {
    // تحقق من صلاحيات المستخدم
    if (req.user.role !== 'admin' && req.user.role !== 'manager') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const { email } = req.body;
    
    // التحقق من وجود المستخدم
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const user = new User({
      ...req.body,
      status: 'active',
      isVerified: true
    });

    await user.save();
    
    // إرجاع البيانات بدون كلمة المرور
    const userResponse = user.toObject();
    delete userResponse.password;
    
    res.status(201).json(userResponse);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// تحديث مستخدم
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    // تحقق من الصلاحيات
    if (req.user.role !== 'admin' && req.user.role !== 'manager' && req.user.id !== id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const updates = req.body;
    
    // منع تغيير بعض الحقول إلا للمسؤول
    if (req.user.role !== 'admin' && updates.role) {
      return res.status(403).json({ error: 'Only admin can change roles' });
    }

    // تحديث المستخدم
    const user = await User.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// تحديث الصلاحيات
exports.updatePermissions = async (req, res) => {
  try {
    // تحقق من الصلاحيات
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Only admin can update permissions' });
    }

    const { id } = req.params;
    const { permissions } = req.body;

    const user = await User.findByIdAndUpdate(
      id,
      { $set: { permissions } },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// تغيير حالة المستخدم
exports.changeStatus = async (req, res) => {
  try {
    // تحقق من الصلاحيات
    if (req.user.role !== 'admin' && req.user.role !== 'manager') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const { id } = req.params;
    const { status } = req.body;

    const user = await User.findByIdAndUpdate(
      id,
      { $set: { status } },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// حذف مستخدم
exports.deleteUser = async (req, res) => {
  try {
    // تحقق من الصلاحيات
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Only admin can delete users' });
    }

    const { id } = req.params;

    // منع حذف المستخدم نفسه
    if (req.user.id === id) {
      return res.status(400).json({ error: 'Cannot delete your own account' });
    }

    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// البحث عن مستخدمين
exports.searchUsers = async (req, res) => {
  try {
    const { query } = req.query;

    const users = await User.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } },
        { jobTitle: { $regex: query, $options: 'i' } },
        { department: { $regex: query, $options: 'i' } }
      ]
    }).select('-password').limit(20);

    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// إحصائيات المستخدمين
exports.getUserStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ status: 'active' });
    const pendingUsers = await User.countDocuments({ status: 'pending' });
    
    const roleDistribution = await User.aggregate([
      { $group: { _id: '$role', count: { $sum: 1 } } }
    ]);

    const departmentDistribution = await User.aggregate([
      { $group: { _id: '$department', count: { $sum: 1 } } }
    ]);

    res.json({
      totalUsers,
      activeUsers,
      pendingUsers,
      roleDistribution,
      departmentDistribution,
      lastUpdated: new Date()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

