import { useState, useEffect } from 'react';
import { Certificate } from '@/types';
import * as certificateApi from '@/api/certificates';
import toast from 'react-hot-toast';

export const useCertificates = () => {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCertificates = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await certificateApi.getMyCertificates();
      setCertificates(response.data);
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to fetch certificates';
      setError(errorMessage);
      console.error('Fetch certificates error:', err);
      
      // Show specific error messages based on status code
      if (err.response?.status >= 500) {
        toast.error('Server error. Please try again later.');
      } else if (err.response?.status === 404) {
        toast.error('No certificates found.');
      } else if (err.response?.status === 403) {
        toast.error('Access denied. You do not have permission to view certificates.');
      } else {
        toast.error('Failed to load certificates. Please try again later.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const createCertificateRequest = async (requestId: string) => {
    try {
      const response = await certificateApi.createCertificateRequest(requestId);
      setCertificates(prev => [response.data, ...prev]);
      toast.success('Certificate request created successfully');
      return response.data;
    } catch (err: any) {
      toast.error(err.message || 'Failed to create certificate request');
      throw err;
    }
  };

  const downloadCertificate = async (certificateId: string) => {
    try {
      const blob = await certificateApi.downloadCertificate(certificateId);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `certificate-${certificateId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success('Certificate downloaded successfully');
    } catch (err: any) {
      toast.error(err.message || 'Failed to download certificate');
      throw err;
    }
  };

  useEffect(() => {
    fetchCertificates();
  }, []);

  return {
    certificates,
    isLoading,
    error,
    fetchCertificates,
    createCertificateRequest,
    downloadCertificate,
  };
};

export const useAdminCertificates = () => {
  const [pendingCertificates, setPendingCertificates] = useState<Certificate[]>([]);
  const [allCertificates, setAllCertificates] = useState<Certificate[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isApproving, setIsApproving] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false); // <-- add isDeleting

  const fetchCertificates = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Make both API calls in parallel
      const [pendingResponse, allResponse] = await Promise.all([
        certificateApi.getPendingCertificates(),
        certificateApi.getAllCertificates()
      ]);
      
      setPendingCertificates(pendingResponse.data);
      setAllCertificates(allResponse.data);
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to fetch certificates';
      setError(errorMessage);
      console.error('Fetch certificates error:', err);
      
      // Only show one error toast with a more specific message
      if (err.response?.status >= 500) {
        toast.error('Server error. Please try again later.');
      } else if (err.response?.status === 404) {
        toast.error('Certificates not found.');
      } else if (err.response?.status === 403) {
        toast.error('Access denied. You do not have permission to view certificates.');
      } else {
        toast.error('Failed to load certificates. Please try again later.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const approveCertificate = async (certificateId: string) => {
    setIsApproving(true);
    try {
      const response = await certificateApi.approveCertificate(certificateId);
      // Update the certificate in both lists
      setPendingCertificates(prev => 
        prev.map(cert => 
          cert.id === certificateId ? response.data : cert
        )
      );
      setAllCertificates(prev => 
        prev.map(cert => 
          cert.id === certificateId ? response.data : cert
        )
      );
      toast.success('Certificate approved successfully');
      return response.data;
    } catch (err: any) {
      toast.error(err.message || 'Failed to approve certificate');
      throw err;
    } finally {
      setIsApproving(false);
    }
  };

  const generateCertificate = async (certificateId: string) => {
    setIsGenerating(true);
    try {
      const response = await certificateApi.generateCertificate(certificateId);
      // Update the certificate in both lists
      setPendingCertificates(prev => 
        prev.map(cert => 
          cert.id === certificateId ? response.data.certificate : cert
        )
      );
      setAllCertificates(prev => 
        prev.map(cert => 
          cert.id === certificateId ? response.data.certificate : cert
        )
      );
      toast.success('Certificate generated successfully');
      return response.data;
    } catch (err: any) {
      toast.error(err.message || 'Failed to generate certificate');
      throw err;
    } finally {
      setIsGenerating(false);
    }
  };

  const approveAndGenerateCertificate = async (certificateId: string) => {
    setIsApproving(true);
    try {
      const response = await certificateApi.approveAndGenerateCertificate(certificateId);
      // Update the certificate in both lists
      setPendingCertificates(prev => 
        prev.map(cert => 
          cert.id === certificateId ? response.data.certificate : cert
        )
      );
      setAllCertificates(prev => 
        prev.map(cert => 
          cert.id === certificateId ? response.data.certificate : cert
        )
      );
      toast.success('Certificate approved, generated, and emailed successfully');
      return response.data;
    } catch (err: any) {
      toast.error(err.message || 'Failed to approve and generate certificate');
      throw err;
    } finally {
      setIsApproving(false);
    }
  };

  const deleteCertificate = async (certificateId: string) => {
    setIsDeleting(true);
    try {
      await certificateApi.deleteCertificate(certificateId);
      setPendingCertificates(prev => prev.filter(cert => cert.id !== certificateId));
      setAllCertificates(prev => prev.filter(cert => cert.id !== certificateId));
      toast.success('Certificate request deleted successfully');
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete certificate request');
      throw err;
    } finally {
      setIsDeleting(false);
    }
  };

  const downloadCertificate = async (certificateId: string) => {
    try {
      const blob = await certificateApi.downloadCertificate(certificateId);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `certificate-${certificateId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success('Certificate downloaded successfully');
    } catch (err: any) {
      toast.error(err.message || 'Failed to download certificate');
      throw err;
    }
  };

  useEffect(() => {
    fetchCertificates();
  }, []);

  return {
    pendingCertificates,
    allCertificates,
    isLoading,
    error,
    isApproving,
    isGenerating,
    isDeleting,
    approveCertificate,
    generateCertificate,
    approveAndGenerateCertificate,
    deleteCertificate,
    downloadCertificate,
    fetchCertificates,
  };
}; 