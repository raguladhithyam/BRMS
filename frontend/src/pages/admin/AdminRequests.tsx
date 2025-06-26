import React, { useState, useMemo } from 'react';
import { 
  FileText, 
  Search, 
  Eye, 
  CheckCircle, 
  XCircle, 
  MapPin,
  Phone,
  Mail,
  Calendar,
  Heart,
  Users
} from 'lucide-react';
import { Card } from '../../components/shared/Card';
import { Button } from '../../components/shared/Button';
import { Input } from '../../components/shared/Input';
import Select from '../../components/shared/Select';
import { Badge } from '../../components/shared/Badge';
import { Modal } from '../../components/shared/Modal';
import { LoadingSpinner } from '../../components/shared/LoadingSpinner';
import { EmptyState } from '../../components/shared/EmptyState';
import { useAdminRequests } from '../../hooks/useRequests';
// import { useStudents } from '../../hooks/useStudents';
import { BloodRequest } from '../../types';
import { REQUEST_STATUS, URGENCY_LEVELS, BLOOD_GROUPS } from '../../config/constants';
import { cn } from '../../utils/cn';
import { format } from 'date-fns';

export const AdminRequests: React.FC = () => {
  const [selectedRequest, setSelectedRequest] = useState<BloodRequest | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showFulfillModal, setShowFulfillModal] = useState(false);
  const [selectedDonor, setSelectedDonor] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    bloodGroup: '',
    urgency: '',
    search: '',
  });

  const { 
    requests, 
    isLoading, 
    approveRequest, 
    rejectRequest, 
    fulfillRequest,
    isApproving,
    isRejecting,
    isFulfilling
  } = useAdminRequests();

  // const { students } = useStudents({ availability: true });

  // Deduplicate requests to prevent showing duplicates
  const uniqueRequests = useMemo(() => {
    if (!requests?.data) return [];
    
    // Remove duplicates based on request ID
    const seen = new Set();
    return requests.data.filter(request => {
      if (seen.has(request.id)) {
        return false;
      }
      seen.add(request.id);
      return true;
    });
  }, [requests?.data]);

  // Apply filters to the deduplicated requests
  const filteredRequests = useMemo(() => {
    return uniqueRequests.filter(request => {
      const matchesSearch = !filters.search || 
        request.requestorName.toLowerCase().includes(filters.search.toLowerCase()) ||
        request.email.toLowerCase().includes(filters.search.toLowerCase()) ||
        request.hospitalName.toLowerCase().includes(filters.search.toLowerCase());
      
      const matchesStatus = !filters.status || request.status === filters.status;
      const matchesBloodGroup = !filters.bloodGroup || request.bloodGroup === filters.bloodGroup;
      const matchesUrgency = !filters.urgency || request.urgency === filters.urgency;
      
      return matchesSearch && matchesStatus && matchesBloodGroup && matchesUrgency;
    });
  }, [uniqueRequests, filters]);

  const handleViewDetails = (request: BloodRequest) => {
    setSelectedRequest(request);
    setShowDetailsModal(true);
  };

  const handleApprove = (id: string) => {
    approveRequest(id);
  };

  const handleReject = (id: string) => {
    rejectRequest({ id, reason: 'Request did not meet criteria' });
  };

  const handleFulfill = (request: BloodRequest) => {
    setSelectedRequest(request);
    setShowFulfillModal(true);
  };

  const handleFulfillSubmit = () => {
    if (selectedRequest && selectedDonor) {
      fulfillRequest({ id: selectedRequest.id, donorId: selectedDonor });
      setShowFulfillModal(false);
      setSelectedDonor('');
    }
  };

  const getStatusColor = (status: string) => {
    const statusConfig = REQUEST_STATUS.find(s => s.value === status);
    return statusConfig?.color || 'bg-gray-100 text-gray-800';
  };

  const getUrgencyColor = (urgency: string) => {
    const urgencyConfig = URGENCY_LEVELS.find(u => u.value === urgency);
    return urgencyConfig?.color || 'bg-gray-100 text-gray-800';
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Blood Requests Management</h1>
        <p className="text-gray-600">
          Review, approve, and manage blood donation requests from the community.
        </p>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="lg:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by name, email, or hospital..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="pl-10"
              />
            </div>
          </div>
          
          <Select
            options={[
              { value: '', label: 'All Statuses' },
              ...REQUEST_STATUS.map(status => ({ value: status.value, label: status.label }))
            ]}
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            label="Status"
          />
          
          <Select
            options={[
              { value: '', label: 'All Blood Groups' },
              ...BLOOD_GROUPS.map(group => ({ value: group, label: group }))
            ]}
            value={filters.bloodGroup}
            onChange={(e) => setFilters({ ...filters, bloodGroup: e.target.value })}
            label="Blood Group"
          />
          
          <Select
            options={[
              { value: '', label: 'All Urgencies' },
              ...URGENCY_LEVELS.map(level => ({ value: level.value, label: level.label }))
            ]}
            value={filters.urgency}
            onChange={(e) => setFilters({ ...filters, urgency: e.target.value })}
            label="Urgency"
          />
        </div>
      </Card>

      {/* Debug info - Remove this in production */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mb-4 p-2 bg-yellow-100 text-yellow-800 text-sm rounded">
          Debug: Total requests: {requests?.data?.length || 0}, 
          Unique requests: {uniqueRequests.length}, 
          Filtered requests: {filteredRequests.length}
        </div>
      )}

      {/* Requests List */}
      <Card padding={false}>
        {filteredRequests.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Requestor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Blood Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location & Date
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
                {filteredRequests.map((request) => (
                  <tr key={request.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {request.requestorName}
                        </div>
                        <div className="text-sm text-gray-500">{request.email}</div>
                        <div className="text-sm text-gray-500">{request.phone}</div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <Badge variant="primary">{request.bloodGroup}</Badge>
                        <span className="text-sm text-gray-600">{request.units} unit(s)</span>
                      </div>
                      <div className="mt-1">
                        <Badge 
                          className={cn("text-xs", getUrgencyColor(request.urgency))}
                        >
                          {request.urgency}
                        </Badge>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{request.hospitalName}</div>
                      <div className="text-sm text-gray-500">{request.location}</div>
                      <div className="text-sm text-gray-500">
                        {format(new Date(request.dateTime), 'MMM dd, yyyy HH:mm')}
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge className={getStatusColor(request.status)}>
                        {request.status}
                      </Badge>
                      {request.optedInStudents && request.optedInStudents.length > 0 && (
                        <div className="mt-1 text-xs text-blue-600">
                          {request.optedInStudents.length} opted in
                        </div>
                      )}
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewDetails(request)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      
                      {request.status === 'pending' && (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleApprove(request.id)}
                            loading={isApproving}
                            className="text-green-600 hover:text-green-700"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleReject(request.id)}
                            loading={isRejecting}
                            className="text-red-600 hover:text-red-700"
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                      
                      {request.status === 'approved' && request.optedInStudents && request.optedInStudents.length > 0 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleFulfill(request)}
                          className="text-blue-600 hover:text-blue-700"
                        >
                          <Users className="h-4 w-4" />
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
            title="No Blood Requests Found"
            description="No blood requests match your current filters. Try adjusting your search criteria."
          />
        )}
      </Card>

      {/* Request Details Modal */}
      <Modal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        title="Blood Request Details"
        size="lg"
      >
        {selectedRequest && (
          <div className="space-y-6">
            {/* Requestor Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                <Heart className="h-5 w-5 mr-2 text-primary-600" />
                Requestor Information
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Full Name</p>
                  <p className="font-medium">{selectedRequest.requestorName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Blood Group</p>
                  <Badge variant="primary">{selectedRequest.bloodGroup}</Badge>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium flex items-center">
                    <Mail className="h-4 w-4 mr-1" />
                    {selectedRequest.email}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Phone</p>
                  <p className="font-medium flex items-center">
                    <Phone className="h-4 w-4 mr-1" />
                    {selectedRequest.phone}
                  </p>
                </div>
              </div>
            </div>

            {/* Medical Details */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Medical Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Units Required</p>
                  <p className="font-medium">{selectedRequest.units} unit(s)</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Urgency Level</p>
                  <Badge className={getUrgencyColor(selectedRequest.urgency)}>
                    {selectedRequest.urgency}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Required Date & Time</p>
                  <p className="font-medium flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {format(new Date(selectedRequest.dateTime), 'MMM dd, yyyy HH:mm')}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <Badge className={getStatusColor(selectedRequest.status)}>
                    {selectedRequest.status}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Location Details */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Location Details</h3>
              <div className="space-y-2">
                <div>
                  <p className="text-sm text-gray-600">Hospital Name</p>
                  <p className="font-medium">{selectedRequest.hospitalName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Location</p>
                  <p className="font-medium flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    {selectedRequest.location}
                  </p>
                </div>
              </div>
            </div>

            {/* Additional Notes */}
            {selectedRequest.notes && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Additional Notes</h3>
                <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">
                  {selectedRequest.notes}
                </p>
              </div>
            )}

            {/* Opted In Students */}
            {selectedRequest.optedInStudents && selectedRequest.optedInStudents.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Opted In Donors ({selectedRequest.optedInStudents.length})
                </h3>
                <div className="space-y-2">
                  {selectedRequest.optedInStudents.map((optIn) => (
                    <div key={optIn.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div>
                        <p className="font-medium">{optIn.student.name}</p>
                        <p className="text-sm text-gray-600">{optIn.student.email}</p>
                      </div>
                      <div className="text-sm text-gray-500">
                        Opted in: {format(new Date(optIn.optedAt), 'MMM dd, HH:mm')}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-4 border-t">
              {selectedRequest.status === 'pending' && (
                <>
                  <Button
                    variant="outline"
                    onClick={() => {
                      handleReject(selectedRequest.id);
                      setShowDetailsModal(false);
                    }}
                    loading={isRejecting}
                  >
                    Reject Request
                  </Button>
                  <Button
                    onClick={() => {
                      handleApprove(selectedRequest.id);
                      setShowDetailsModal(false);
                    }}
                    loading={isApproving}
                  >
                    Approve Request
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </Modal>

      {/* Fulfill Request Modal */}
      <Modal
        isOpen={showFulfillModal}
        onClose={() => setShowFulfillModal(false)}
        title="Assign Donor"
      >
        {selectedRequest && (
          <div className="space-y-4">
            <p className="text-gray-600">
              Select a donor to fulfill the blood request for {selectedRequest.requestorName}.
            </p>
            
            <Select
              label="Select Donor"
              options={
                selectedRequest.optedInStudents?.map(optIn => ({
                  value: optIn.student.id,
                  label: `${optIn.student.name} (${optIn.student.bloodGroup}) - ${optIn.student.email}`
                })) || []
              }
              value={selectedDonor}
              onChange={(e) => setSelectedDonor(e.target.value)}
              required
            />
            
            <div className="flex justify-end space-x-3 pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setShowFulfillModal(false);
                  setSelectedDonor('');
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleFulfillSubmit}
                loading={isFulfilling}
                disabled={!selectedDonor}
              >
                Assign Donor
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};