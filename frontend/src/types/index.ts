export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'student';
  bloodGroup?: string;
  availability?: boolean;
  rollNo?: string;
  phone?: string;
  lastDonationDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BloodRequest {
  id: string;
  requestorName: string;
  email: string;
  phone: string;
  bloodGroup: string;
  units: number;
  dateTime: string;
  hospitalName: string;
  location: string;
  notes?: string;
  status: 'pending' | 'approved' | 'rejected' | 'fulfilled';
  urgency: 'low' | 'medium' | 'high' | 'critical';
  createdAt: string;
  updatedAt: string;
  assignedDonor?: User;
  optedInStudents?: StudentOptIn[];
}

export interface StudentOptIn {
  id: string;
  studentId: string;
  requestId: string;
  optedAt: string;
  student: User;
  request: BloodRequest;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'request_created' | 'request_approved' | 'student_opted_in' | 'donor_assigned';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  metadata?: any;
}

export interface LoginHistory {
  id: string;
  userId: string;
  ipAddress: string;
  userAgent: string;
  loginTime: string;
  logoutTime?: string;
  isActive: boolean;
  location?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface DashboardStats {
  totalRequests: number;
  pendingRequests: number;
  approvedRequests: number;
  totalStudents: number;
  availableStudents: number;
  recentOptIns: number;
}

export interface BloodGroupStats {
  bloodGroup: string;
  totalStudents: number;
  availableStudents: number;
  totalRequests: number;
}

export interface Certificate {
  id: string;
  donorId: string;
  requestId: string;
  certificateNumber: string;
  donorName: string;
  bloodGroup: string;
  donationDate: string;
  hospitalName: string;
  units: number;
  status: 'pending' | 'approved' | 'generated';
  adminApprovedAt?: string;
  generatedAt?: string;
  certificateUrl?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  donor?: User;
  request?: BloodRequest;
}