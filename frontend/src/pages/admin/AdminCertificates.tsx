import React, { useState } from 'react';
import { 
  FileText, 
  Search, 
  Eye, 
  CheckCircle, 
  Download,
  Clock,
  Award,
  Users,
  Calendar,
  MapPin,
  Heart
} from 'lucide-react';
import { Card } from '@/components/shared/Card';
import { Button } from '@/components/shared/Button';
import { Input } from '@/components/shared/Input';
import Select from '@/components/shared/Select';
import { Badge } from '@/components/shared/Badge';
import { Modal } from '@/components/shared/Modal';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { EmptyState } from '@/components/shared/EmptyState';
import { useAdminCertificates } from '@/hooks/useCertificates';
import { Certificate } from '@/types';
import { cn } from '@/utils/cn';
import { format } from 'date-fns';

export const AdminCertificates: React.FC = () => {
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'pending' | 'all'>('pending');
  const [filters, setFilters] = useState({
    status: '',
    search: '',
  });

  const { 
    pendingCertificates, 
    allCertificates, 
    isLoading, 
    approveCertificate, 
    generateCertificate,
    downloadCertificate,
    isApproving,
    isGenerating
  } = useAdminCertificates();

  const currentCertificates = activeTab === 'pending' ? pendingCertificates : allCertificates;

  // Apply filters
  const filteredCertificates = currentCertificates.filter(certificate => {
    const matchesSearch = !filters.search || 
      certificate.donorName.toLowerCase().includes(filters.search.toLowerCase()) ||
      certificate.certificateNumber.toLowerCase().includes(filters.search.toLowerCase()) ||
      certificate.hospitalName.toLowerCase().includes(filters.search.toLowerCase());
    
    const matchesStatus = !filters.status || certificate.status === filters.status;
    
    return matchesSearch && matchesStatus;
  });

  const handleViewDetails = (certificate: Certificate) => {
    setSelectedCertificate(certificate);
    setShowDetailsModal(true);
  };

  const handleApprove = async (certificateId: string) => {
    try {
      await approveCertificate(certificateId);
    } catch (error) {
      console.error('Approve certificate error:', error);
    }
  };

  const handleGenerate = async (certificateId: string) => {
    try {
      await generateCertificate(certificateId);
    } catch (error) {
      console.error('Generate certificate error:', error);
    }
  };



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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Certificate Management</h1>
        <p className="text-gray-600">
          Review, approve, and generate blood donation certificates.
        </p>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('pending')}
              className={cn(
                'py-2 px-1 border-b-2 font-medium text-sm',
                activeTab === 'pending'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              )}
            >
              Pending Certificates ({pendingCertificates.length})
            </button>
            <button
              onClick={() => setActiveTab('all')}
              className={cn(
                'py-2 px-1 border-b-2 font-medium text-sm',
                activeTab === 'all'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              )}
            >
              All Certificates ({allCertificates.length})
            </button>
          </nav>
        </div>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by donor name, certificate number, or hospital..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="pl-10"
              />
            </div>
          </div>
          
          <Select
            options={[
              { value: '', label: 'All Statuses' },
              { value: 'pending', label: 'Pending' },
              { value: 'approved', label: 'Approved' },
              { value: 'generated', label: 'Generated' }
            ]}
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            label="Status"
          />
        </div>
      </Card>

      {/* Certificates List */}
      <Card padding={false}>
        {filteredCertificates.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Certificate
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Donor Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Donation Info
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
                {filteredCertificates.map((certificate) => (
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
                        <div className="text-sm font-medium text-gray-900">
                          {certificate.donorName}
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant="primary">{certificate.bloodGroup}</Badge>
                          <span className="text-sm text-gray-600">{certificate.units} unit(s)</span>
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{certificate.hospitalName}</div>
                      <div className="text-sm text-gray-500">
                        {format(new Date(certificate.donationDate), 'MMM dd, yyyy')}
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge className={cn("flex items-center space-x-1", getStatusColor(certificate.status))}>
                        {getStatusIcon(certificate.status)}
                        <span>{certificate.status}</span>
                      </Badge>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewDetails(certificate)}
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      
                      {certificate.status === 'pending' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleApprove(certificate.id)}
                          loading={isApproving}
                          className="text-green-600 hover:text-green-700"
                          title="Approve Certificate"
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                      )}
                      
                      {certificate.status === 'approved' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleGenerate(certificate.id)}
                          loading={isGenerating}
                          className="text-blue-600 hover:text-blue-700"
                          title="Generate PDF"
                        >
                          <Award className="h-4 w-4 mr-1" />
                          Generate
                        </Button>
                      )}
                      
                      {certificate.status === 'generated' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownload(certificate.id)}
                          className="text-green-600 hover:text-green-700"
                          title="Download Certificate"
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState
            icon={<FileText className="h-12 w-12" />}
            title={`No ${activeTab === 'pending' ? 'Pending' : ''} Certificates Found`}
            description={`No certificates match your current filters. Try adjusting your search criteria.`}
          />
        )}
      </Card>

      {/* Certificate Details Modal */}
      <Modal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        title="Certificate Details"
        size="lg"
      >
        {selectedCertificate && (
          <div className="space-y-6">
            {/* Certificate Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                <Award className="h-5 w-5 mr-2 text-primary-600" />
                Certificate Information
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Certificate Number</p>
                  <p className="font-medium">{selectedCertificate.certificateNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <Badge className={cn("flex items-center space-x-1", getStatusColor(selectedCertificate.status))}>
                    {getStatusIcon(selectedCertificate.status)}
                    <span>{selectedCertificate.status}</span>
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Created Date</p>
                  <p className="font-medium">
                    {format(new Date(selectedCertificate.createdAt), 'MMM dd, yyyy HH:mm')}
                  </p>
                </div>
                {selectedCertificate.adminApprovedAt && (
                  <div>
                    <p className="text-sm text-gray-600">Approved Date</p>
                    <p className="font-medium">
                      {format(new Date(selectedCertificate.adminApprovedAt), 'MMM dd, yyyy HH:mm')}
                    </p>
                  </div>
                )}
                {selectedCertificate.generatedAt && (
                  <div>
                    <p className="text-sm text-gray-600">Generated Date</p>
                    <p className="font-medium">
                      {format(new Date(selectedCertificate.generatedAt), 'MMM dd, yyyy HH:mm')}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Donor Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                <Users className="h-5 w-5 mr-2 text-primary-600" />
                Donor Information
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Donor Name</p>
                  <p className="font-medium">{selectedCertificate.donorName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Blood Group</p>
                  <Badge variant="primary">{selectedCertificate.bloodGroup}</Badge>
                </div>
              </div>
            </div>

            {/* Donation Details */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                <Heart className="h-5 w-5 mr-2 text-primary-600" />
                Donation Details
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Hospital</p>
                  <p className="font-medium flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    {selectedCertificate.hospitalName}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Units Donated</p>
                  <p className="font-medium">{selectedCertificate.units} unit(s)</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Donation Date</p>
                  <p className="font-medium flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {format(new Date(selectedCertificate.donationDate), 'MMM dd, yyyy')}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Request ID</p>
                  <p className="font-medium text-sm">{selectedCertificate.requestId}</p>
                </div>
              </div>
            </div>

            {/* Geotag/Donation Photo */}
            {selectedCertificate.request?.geotagPhoto && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Donation Proof Photo</h3>
                <a href={`/api/uploads/${selectedCertificate.request.geotagPhoto}`} target="_blank" rel="noopener noreferrer">
                  <img
                    src={`/api/uploads/${selectedCertificate.request.geotagPhoto}`}
                    alt="Donation Proof"
                    className="max-w-xs rounded border border-gray-300 shadow"
                  />
                </a>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-4 border-t">
              {selectedCertificate.status === 'pending' && (
                <Button
                  onClick={() => {
                    handleApprove(selectedCertificate.id);
                    setShowDetailsModal(false);
                  }}
                  loading={isApproving}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Approve Certificate
                </Button>
              )}
              
              {selectedCertificate.status === 'approved' && (
                <Button
                  onClick={() => {
                    handleGenerate(selectedCertificate.id);
                    setShowDetailsModal(false);
                  }}
                  loading={isGenerating}
                >
                  <Award className="h-4 w-4 mr-2" />
                  Generate PDF
                </Button>
              )}
              
              {selectedCertificate.status === 'generated' && (
                <Button
                  onClick={() => {
                    handleDownload(selectedCertificate.id);
                    setShowDetailsModal(false);
                  }}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Certificate
                </Button>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}; 