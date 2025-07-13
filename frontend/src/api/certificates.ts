import api from '@/utils/api';
import { Certificate, ApiResponse } from '@/types';

// Create certificate request (student marks donation as completed)
export const createCertificateRequest = async (requestId: string): Promise<ApiResponse<Certificate>> => {
  const response = await api.post('/certificates/request', { requestId });
  return response.data;
};

// Get certificates for current donor (student dashboard)
export const getMyCertificates = async (): Promise<ApiResponse<Certificate[]>> => {
  const response = await api.get('/certificates/my-certificates');
  return response.data;
};

// Get pending certificates (admin dashboard)
export const getPendingCertificates = async (): Promise<ApiResponse<Certificate[]>> => {
  const response = await api.get('/certificates/admin/pending');
  return response.data;
};

// Get all certificates (admin dashboard)
export const getAllCertificates = async (): Promise<ApiResponse<Certificate[]>> => {
  const response = await api.get('/certificates/admin/all');
  return response.data;
};

// Approve certificate (admin)
export const approveCertificate = async (certificateId: string): Promise<ApiResponse<Certificate>> => {
  const response = await api.post(`/certificates/admin/${certificateId}/approve`);
  return response.data;
};

// Generate certificate PDF (admin)
export const generateCertificate = async (certificateId: string): Promise<ApiResponse<{ certificate: Certificate; downloadUrl: string }>> => {
  const response = await api.post(`/certificates/admin/${certificateId}/generate`);
  return response.data;
};

// Approve and generate certificate in one step (admin)
export const approveAndGenerateCertificate = async (certificateId: string): Promise<ApiResponse<{ certificate: Certificate; downloadUrl: string }>> => {
  const response = await api.post(`/admin/certificates/${certificateId}/approve-and-generate`);
  return response.data;
};

// Get certificate by ID
export const getCertificateById = async (certificateId: string): Promise<ApiResponse<Certificate>> => {
  const response = await api.get(`/certificates/${certificateId}`);
  return response.data;
};

// Download certificate PDF
export const downloadCertificate = async (certificateId: string): Promise<Blob> => {
  const response = await api.get(`/certificates/${certificateId}/download`, {
    responseType: 'blob',
  });
  return response.data;
}; 