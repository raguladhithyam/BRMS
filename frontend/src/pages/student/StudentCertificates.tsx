import React from 'react';
import { 
  FileText, 
  Download,
  Award,
  Clock,
  CheckCircle,
  Calendar,
  MapPin,
  Heart
} from 'lucide-react';
import { Card } from '../../components/shared/Card';
import { Button } from '../../components/shared/Button';
import { Badge } from '../../components/shared/Badge';
import { LoadingSpinner } from '../../components/shared/LoadingSpinner';
import { EmptyState } from '../../components/shared/EmptyState';
import { useCertificates } from '../../hooks/useCertificates';
import { cn } from '../../utils/cn';
import { format } from 'date-fns';

export const StudentCertificates: React.FC = () => {
  const { 
    certificates, 
    isLoading, 
    downloadCertificate 
  } = useCertificates();

  const handleDownload = async (certificateId: string) => {
    try {
      await downloadCertificate(certificateId);
    } catch (error) {
      console.error('Download certificate error:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-blue-100 text-blue-800';
      case 'generated': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'approved': return <CheckCircle className="h-4 w-4" />;
      case 'generated': return <Award className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Pending Approval';
      case 'approved': return 'Approved - Generating PDF';
      case 'generated': return 'Ready for Download';
      default: return status;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Certificates</h1>
        <p className="text-gray-600">
          View and download your blood donation certificates.
        </p>
      </div>

      {/* Certificates List */}
      <Card padding={false}>
        {certificates.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Certificate
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Donation Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {certificates.map((certificate) => (
                  <tr key={certificate.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {certificate.certificateNumber}
                        </div>
                        <div className="text-sm text-gray-500">
                          {format(new Date(certificate.createdAt), 'MMM dd, yyyy')}
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="flex items-center space-x-2 mb-1">
                          <Badge variant="primary">{certificate.bloodGroup}</Badge>
                          <span className="text-sm text-gray-600">{certificate.units} unit(s)</span>
                        </div>
                        <div className="text-sm text-gray-900">{certificate.hospitalName}</div>
                        <div className="text-sm text-gray-500">
                          {format(new Date(certificate.donationDate), 'MMM dd, yyyy')}
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge className={cn("flex items-center space-x-1", getStatusColor(certificate.status))}>
                        {getStatusIcon(certificate.status)}
                        <span>{getStatusText(certificate.status)}</span>
                      </Badge>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {certificate.status === 'generated' && (
                        <Button
                          size="sm"
                          onClick={() => handleDownload(certificate.id)}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      )}
                      {certificate.status === 'pending' && (
                        <span className="text-gray-500 text-sm">
                          Awaiting admin approval
                        </span>
                      )}
                      {certificate.status === 'approved' && (
                        <span className="text-blue-600 text-sm">
                          PDF being generated...
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState
            icon={<Award className="h-12 w-12" />}
            title="No Certificates Yet"
            description="You haven't completed any blood donations yet. Once you complete a donation and it's approved by an admin, your certificate will appear here."
          />
        )}
      </Card>

      {/* Certificate Details Cards (Alternative View) */}
      {certificates.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Certificate Details</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {certificates.map((certificate) => (
              <Card key={certificate.id} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {certificate.certificateNumber}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {format(new Date(certificate.createdAt), 'MMM dd, yyyy')}
                    </p>
                  </div>
                  <Badge className={cn("flex items-center space-x-1", getStatusColor(certificate.status))}>
                    {getStatusIcon(certificate.status)}
                    <span className="text-xs">{getStatusText(certificate.status)}</span>
                  </Badge>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Heart className="h-4 w-4 text-red-500" />
                    <span className="text-sm text-gray-600">
                      {certificate.bloodGroup} • {certificate.units} unit(s)
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{certificate.hospitalName}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      {format(new Date(certificate.donationDate), 'MMM dd, yyyy')}
                    </span>
                  </div>
                </div>

                {certificate.status === 'generated' && (
                  <div className="mt-4 pt-4 border-t">
                    <Button
                      size="sm"
                      onClick={() => handleDownload(certificate.id)}
                      className="w-full"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download Certificate
                    </Button>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}; 