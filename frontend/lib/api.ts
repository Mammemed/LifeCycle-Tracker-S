import axios from 'axios'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// إضافة interceptor لإرسال التوكن مع كل طلب
api.interceptors.request.use(
  (config) => {
    // الحصول على التوكن من localStorage
    const token = localStorage.getItem('token')
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// إضافة interceptor للتعامل مع أخطاء التوكن
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // إذا كان خطأ 401 (غير مصرح)، احذف التوكن وانتقل للصفحة الرئيسية
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Types
export interface Entity {
  _id: string
  title: string
  description: string
  type: string
  currentStatus: string
  statusHistory: StatusHistoryEntry[]
  versions: Version[]
  contributors: Contributor[]
  comments: Comment[]
  createdAt: string
  updatedAt: string
  owner: string // تأكد من إضافته
}

export interface StatusHistoryEntry {
  fromStatus: string | null
  toStatus: string
  changedAt: string
  changedBy: string
  comment?: string
}

export interface Version {
  versionNumber: number
  content: {
    title: string
    description: string
    type: string
  }
  createdAt: string
  createdBy: string
  changeSummary: string
}

export interface Contributor {
  name: string
  role: string
  lastActiveAt: string
}

export interface Comment {
  author: string
  text: string
  createdAt: string
  linkedToVersion?: number | null
  linkedToStatus?: string | null
}

export interface StatisticsSummary {
  totalActiveEntities: number
  totalReviewsToday: number
  totalReviewsThisWeek: number
  successRate: number
}

export interface StatisticsAnalytics {
  averageTimePerStatus: Record<string, number>
  averageNumberOfStatesPerEntity: number
  minStatesPerEntity: number
  maxStatesPerEntity: number
  successRate: number
  distributionByStatus: Record<string, number>
  stagesCountPerEntity: Record<number, number>
  userActivityOverTime: Record<string, number>
}

// Entity API - إزالة التوكن من الباراميترات
export const getEntities = async (): Promise<Entity[]> => {
  const response = await api.get('/entities')
  return response.data
}

export const getEntityById = async (id: string): Promise<Entity> => {
  const response = await api.get(`/entities/${id}`)
  return response.data
}

export const createEntity = async (data: {
  title: string
  description?: string
  initialStatus?: string
  type?: string
}): Promise<Entity> => {
  const response = await api.post('/entities', data)
  return response.data
}

export const changeEntityStatus = async (
  id: string,
  data: {
    toStatus: string
    comment?: string
  }
): Promise<Entity> => {
  const response = await api.patch(`/entities/${id}/status`, data)
  return response.data
}

export const addComment = async (
  id: string,
  data: {
    text: string
    linkedToVersion?: number
    linkedToStatus?: string
  }
): Promise<Entity> => {
  const response = await api.post(`/entities/${id}/comments`, data)
  return response.data
}

export const createVersion = async (
  id: string,
  data: {
    content?: {
      title: string
      description: string
      type: string
    }
    changeSummary?: string
  }
): Promise<Entity> => {
  const response = await api.post(`/entities/${id}/versions`, data)
  return response.data
}

export const getVersions = async (id: string): Promise<Version[]> => {
  const response = await api.get(`/entities/${id}/versions`)
  return response.data
}

export const compareVersions = async (
  id: string,
  from: number,
  to: number
): Promise<any> => {
  const response = await api.get(`/entities/${id}/versions/compare`, {
    params: { from, to }
  })
  return response.data
}

// Statistics API - إزالة التوكن من الباراميترات
export const getStatisticsSummary = async (): Promise<StatisticsSummary> => {
  const response = await api.get('/statistics/summary')
  return response.data
}

export const getStatisticsAnalytics = async (): Promise<StatisticsAnalytics> => {
  const response = await api.get('/statistics/analytics')
  return response.data
}

// Auth API
// تحديث AuthResponse interface
export interface AuthResponse {
  token: string;
  name: string;
  email: string;
  role: string; // أضف role
  userId: string;
}

// تحديث signupUser ليقبل role
export const signupUser = async (
  name: string,
  email: string,
  password: string,
  role?: string
): Promise<AuthResponse> => {
  const response = await api.post('/auth/signup', { 
    name, 
    email, 
    password,
    role: role || 'contributor'
  });
  
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
  }
  
  return response.data;
};

// إضافة دالة للحصول على role من التوكن
export const getUserRoleFromToken = (): string | null => {
  const token = localStorage.getItem('token');
  if (!token) return null;
  
  try {
    // التوكن يحتوي على 3 أجزاء مفصولة بنقطة: header.payload.signature
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.role || null;
  } catch (error) {
    console.error('Error parsing token:', error);
    return null;
  }
};

// دالة للتحقق من الصلاحيات
export const hasPermission = (requiredRole: string): boolean => {
  const userRole = getUserRoleFromToken();
  if (!userRole) return false;
  
  // ترتيب الصلاحيات من الأعلى إلى الأدنى
  const roleHierarchy = {
    'admin': 4,
    'manager': 3,
    'editor': 2,
    'contributor': 1,
    'viewer': 0
  };
  
  const userLevel = roleHierarchy[userRole as keyof typeof roleHierarchy] || 0;
  const requiredLevel = roleHierarchy[requiredRole as keyof typeof roleHierarchy] || 0;
  
  return userLevel >= requiredLevel;
};
export const loginUser = async (
  email: string,
  password: string
): Promise<AuthResponse> => {
  const response = await api.post('/auth/login', { email, password })
  
  // حفظ التوكن تلقائياً بعد تسجيل الدخول
  if (response.data.token) {
    localStorage.setItem('token', response.data.token)
  }
  
  return response.data
}

// دالة تسجيل الخروج
export const logout = () => {
  localStorage.removeItem('token')
}

// دالة للتحقق من وجود توكن
export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem('token')
}

// دالة للحصول على التوكن
export const getToken = (): string | null => {
  return localStorage.getItem('token')
}

// Types جديدة
export interface UserProfile {
  _id: string;
  name: string;
  email: string;
  avatar: string;
  bio: string;
  phone: string;
  company: string;
  jobTitle: string;
  location: string;
  website: string;
  socialLinks: {
    twitter: string;
    linkedin: string;
    github: string;
  };
  preferences: {
    theme: string;
    notifications: boolean;
    language: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfileData {
  name?: string;
  bio?: string;
  phone?: string;
  company?: string;
  jobTitle?: string;
  location?: string;
  website?: string;
  avatar?: string;
  socialLinks?: {
    twitter?: string;
    linkedin?: string;
    github?: string;
  };
  preferences?: {
    theme?: string;
    notifications?: boolean;
    language?: string;
  };
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

// دوال API جديدة
export const getProfile = async (): Promise<UserProfile> => {
  const response = await api.get('/auth/profile');
  return response.data;
};

export const updateProfile = async (data: UpdateProfileData): Promise<UserProfile> => {
  const response = await api.put('/auth/profile', data);
  return response.data;
};

export const changePassword = async (data: ChangePasswordData): Promise<{ message: string }> => {
  const response = await api.put('/auth/change-password', data);
  return response.data;
};

// Types جديدة
export interface User {
  _id: string;
  name: string;
  email: string;
  avatar: string;
  bio: string;
  phone: string;
  company: string;
  jobTitle: string;
  department: string;
  role: 'admin' | 'manager' | 'editor' | 'viewer' | 'contributor';
  permissions: {
    canCreate: boolean;
    canEdit: boolean;
    canDelete: boolean;
    canReview: boolean;
    canApprove: boolean;
    canExport: boolean;
    canManageUsers: boolean;
  };
  status: 'active' | 'inactive' | 'suspended' | 'pending';
  isVerified: boolean;
  lastLogin: string;
  createdAt: string;
  updatedAt: string;
  stats: {
    totalEntities: number;
    totalReviews: number;
    totalComments: number;
    lastActive: string;
  };
}

export interface CreateUserData {
  name: string;
  email: string;
  password: string;
  role?: User['role'];
  department?: string;
  jobTitle?: string;
  phone?: string;
  company?: string;
}

export interface UpdateUserData {
  name?: string;
  email?: string;
  role?: User['role'];
  department?: string;
  jobTitle?: string;
  phone?: string;
  company?: string;
  bio?: string;
  avatar?: string;
}

export interface UpdatePermissionsData {
  permissions: Partial<User['permissions']>;
}

export interface UpdateStatusData {
  status: User['status'];
}

export interface UserStats {
  totalUsers: number;
  activeUsers: number;
  pendingUsers: number;
  roleDistribution: Array<{ _id: string; count: number }>;
  departmentDistribution: Array<{ _id: string; count: number }>;
  lastUpdated: string;
}

// دوال API للمستخدمين
export const getUsers = async (): Promise<User[]> => {
  const response = await api.get('/users');
  return response.data;
};

export const getUserStats = async (): Promise<UserStats> => {
  const response = await api.get('/users/stats');
  return response.data;
};

export const searchUsers = async (query: string): Promise<User[]> => {
  const response = await api.get('/users/search', { params: { query } });
  return response.data;
};

export const getUserById = async (id: string): Promise<User> => {
  const response = await api.get(`/users/${id}`);
  return response.data;
};

export const createUser = async (data: CreateUserData): Promise<User> => {
  const response = await api.post('/users', data);
  return response.data;
};

export const updateUser = async (id: string, data: UpdateUserData): Promise<User> => {
  const response = await api.put(`/users/${id}`, data);
  return response.data;
};

export const updateUserPermissions = async (id: string, data: UpdatePermissionsData): Promise<User> => {
  const response = await api.patch(`/users/${id}/permissions`, data);
  return response.data;
};

export const updateUserStatus = async (id: string, data: UpdateStatusData): Promise<User> => {
  const response = await api.patch(`/users/${id}/status`, data);
  return response.data;
};

export const deleteUser = async (id: string): Promise<{ message: string }> => {
  const response = await api.delete(`/users/${id}`);
  return response.data;
};

// إضافة هذه الوظائف
export const getCurrentUser = async (): Promise<User> => {
  const response = await api.get('/auth/profile');
  return response.data;
};

export const getUserRole = (): string | null => {
  // يمكنك تخزين role في localStorage أو جلبها من الـ token
  const token = localStorage.getItem('token');
  if (!token) return null;
  
  try {
    // تحليل التوكن لاستخراج البيانات
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.role || null;
  } catch (error) {
    console.error('Error parsing token:', error);
    return null;
  }
};

// في lib/api.ts

// دالة للتحقق من role المستخدم الحالي
export const getCurrentUserRole = (): string | null => {
  const token = localStorage.getItem('token');
  if (!token) return null;
  
  try {
    // تحليل التوكن لاستخراج البيانات
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(window.atob(base64));
    return payload.role || null;
  } catch (error) {
    console.error('Error parsing token:', error);
    return null;
  }
};

// دالة للتحقق من الصلاحيات
export const checkPermission = (requiredRole: string): boolean => {
  const userRole = getCurrentUserRole();
  if (!userRole) return false;
  
  // هرمية الصلاحيات (من الأعلى إلى الأدنى)
  const roleHierarchy = {
    'admin': 4,
    'manager': 3,
    'editor': 2,
    'contributor': 1,
    'viewer': 0
  };
  
  const userLevel = roleHierarchy[userRole as keyof typeof roleHierarchy] || 0;
  const requiredLevel = roleHierarchy[requiredRole as keyof typeof roleHierarchy] || 0;
  
  return userLevel >= requiredLevel;
};

// في lib/api.ts
// في lib/api.ts - أضف هذه الدوال

// إحصائيات فريق المستخدم الحالي فقط
export const getMyTeamStats = async (): Promise<{
  totalUsers: number;
  activeUsers: number;
  pendingUsers: number;
  roleDistribution: Array<{ _id: string; count: number }>;
  adminId: string;
  lastUpdated: string;
}> => {
  const response = await api.get('/users/my-team/stats');
  return response.data;
};

// الحصول على فريق المستخدم الحالي فقط
export const getMyTeam = async (): Promise<User[]> => {
  const response = await api.get('/users/my-team');
  return response.data;
};
