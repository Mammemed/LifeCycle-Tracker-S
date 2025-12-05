// controllers/authController.js
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

// تسجيل مستخدم جديد مع role افتراضي
exports.signup = async (req, res) => {
  const { name, email, password, role } = req.body; // أضف role هنا
  
  try {
    // التحقق من وجود مستخدم بنفس البريد
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    // إنشاء مستخدم جديد
    const newUser = new User({ 
      name, 
      email, 
      password,
      role: role || 'contributor', // إذا لم يتم إرسال role، استخدم contributor
      status: 'active'
    });
    
    await newUser.save();
    
    // إنشاء التوكن مع role
    const token = jwt.sign(
      { 
        id: newUser._id, 
        name: newUser.name, 
        email: newUser.email,
        role: newUser.role, // أضف role هنا
        avatar: newUser.avatar
      },
      'secretkey',
      { expiresIn: '1d' }
    );
    
    res.status(201).json({ 
      token, 
      name: newUser.name,
      email: newUser.email,
      role: newUser.role, // أضف role في الاستجابة
      userId: newUser._id 
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// تسجيل الدخول
exports.login = async (req, res) => {
  const { email, password } = req.body;
  
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // تحديث آخر تسجيل دخول
    user.lastLogin = new Date();
    await user.save();

    // إنشاء التوكن مع role
    const token = jwt.sign(
      { 
        id: user._id, 
        name: user.name, 
        email: user.email,
        role: user.role, // أضف role هنا
        avatar: user.avatar
      },
      'secretkey',
      { expiresIn: '1d' }
    );
    
    res.json({ 
      token, 
      name: user.name,
      email: user.email,
      role: user.role, // أضف role في الاستجابة
      avatar: user.avatar,
      userId: user._id 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// الحصول على الملف الشخصي
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// أضف هذه الدوال إلى controllers/authController.js

// تحديث الملف الشخصي
exports.updateProfile = async (req, res) => {
  try {
    const { name, bio, phone, company, jobTitle, location, website, avatar } = req.body;
    
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // تحديث الحقول المسموح بها
    if (name) user.name = name;
    if (bio !== undefined) user.bio = bio;
    if (phone !== undefined) user.phone = phone;
    if (company !== undefined) user.company = company;
    if (jobTitle !== undefined) user.jobTitle = jobTitle;
    if (location !== undefined) user.location = location;
    if (website !== undefined) user.website = website;
    if (avatar !== undefined) user.avatar = avatar;

    await user.save();
    
    // إرجاع البيانات بدون كلمة المرور
    const userResponse = user.toObject();
    delete userResponse.password;
    
    res.json(userResponse);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// تغيير كلمة المرور
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // التحقق من كلمة المرور الحالية
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ error: 'Current password is incorrect' });
    }

    // تحديث كلمة المرور
    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};