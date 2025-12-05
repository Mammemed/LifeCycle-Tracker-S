// controllers/authController.js - تحديث signup
exports.signup = async (req, res) => {
  const { name, email, password, role, adminSecretKey } = req.body;
  
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    const userData = { 
      name, 
      email, 
      password,
      role: role || 'contributor',
      status: 'active'
    };

    // إذا كان admin وقدم مفتاحاً
    if (role === 'admin' && adminSecretKey) {
      userData.adminSecretKey = adminSecretKey;
      userData.hasAdminKey = true;
      userData.adminKeyCreatedAt = new Date();
    }

    const newUser = new User(userData);
    await newUser.save();
    
    const token = jwt.sign(
      { 
        id: newUser._id, 
        name: newUser.name, 
        email: newUser.email,
        role: newUser.role
      },
      'secretkey',
      { expiresIn: '1d' }
    );
    
    res.status(201).json({ 
      token, 
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      userId: newUser._id,
      hasAdminKey: newUser.hasAdminKey
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};