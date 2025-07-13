export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';
export const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3001';

export const BLOOD_GROUPS = [
  'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'
] as const;

export const URGENCY_LEVELS = [
  { value: 'low', label: 'Low', color: 'bg-green-100 text-green-800' },
  { value: 'medium', label: 'Medium', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'high', label: 'High', color: 'bg-orange-100 text-orange-800' },
  { value: 'critical', label: 'Critical', color: 'bg-red-100 text-red-800' },
] as const;

export const REQUEST_STATUS = [
  { value: 'pending', label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'approved', label: 'Approved', color: 'bg-blue-100 text-blue-800' },
  { value: 'rejected', label: 'Rejected', color: 'bg-red-100 text-red-800' },
  { value: 'fulfilled', label: 'Fulfilled', color: 'bg-green-100 text-green-800' },
] as const;

export const QUERY_KEYS = {
  USER: 'user',
  BLOOD_REQUESTS: 'bloodRequests',
  STUDENTS: 'students',
  ADMINS: 'admins',
  NOTIFICATIONS: 'notifications',
  DASHBOARD_STATS: 'dashboardStats',
  BLOOD_GROUP_STATS: 'bloodGroupStats',
  MATCHING_REQUESTS: 'matchingRequests',
  OPT_INS: 'optIns',
} as const;