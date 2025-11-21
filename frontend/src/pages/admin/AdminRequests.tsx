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
  Users,
  Trash2,
  Camera
} from 'lucide-react';
import { Card } from '@/components/shared/Card';
import { Button } from '@/components/shared/Button';
import { Input } from '@/components/shared/Input';
import Select from '@/components/shared/Select';
import { Badge } from '@/components/shared/Badge';
import { Modal } from '@/components/shared/Modal';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { EmptyState } from '@/components/shared/EmptyState';
import { useAdminRequests } from '@/hooks/useRequests';
// import { useStudents } from '@/hooks/useStudents';
import { BloodRequest } from '@/types';
import { REQUEST_STATUS, URGENCY_LEVELS, BLOOD_GROUPS } from '@/config/constants';
import { cn } from '@/utils/cn';
import { format } from 'date-fns';

export const AdminRequests: React.FC = () => {
  const [selectedRequest, setSelectedRequest] = useState<BloodRequest | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showFulfillModal, setShowFulfillModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showCompleteDonationModal, setShowCompleteDonationModal] = useState(false);
  const [selectedDonor, setSelectedDonor] = useState('');
  const [geotagPhoto, setGeotagPhoto] = useState<File | null>(null);
  const [filters, setFilters] = useState({
    status: '',
    bloodGroup: '',
    urgency: '',
    search: '',
  });
  const [showDonorModal, setShowDonorModal] = useState(false);
  const [donorActionType, setDonorActionType] = useState<'assign' | 'change'>('assign');
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState<any>(null);

  // Bulk selection state
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const { 
    requests, 
    isLoading, 
    approveRequest, 
    rejectRequest, 
    fulfillRequest,
    completeDonation,
    deleteRequest,
    updateRequest,
    isApproving,
    isRejecting,
    isFulfilling,
    isCompletingDonation,
    isDeleting,
    updateAssignedDonor,
    isUpdatingDonor
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

  // Helper: only allow selection of pending requests
  const pendingRequestIds = filteredRequests.filter(r => r.status === 'pending').map(r => r.id);
  const allSelected = pendingRequestIds.length > 0 && pendingRequestIds.every(id => selectedIds.includes(id));
  const toggleSelectAll = () => {
    if (allSelected) setSelectedIds(ids => ids.filter(id => !pendingRequestIds.includes(id)));
    else setSelectedIds(ids => Array.from(new Set([...ids, ...pendingRequestIds])));
  };
  const toggleSelect = (id: string) => {
    setSelectedIds(ids => ids.includes(id) ? ids.filter(x => x !== id) : [...ids, id]);
  };
  const handleBulkApprove = () => {
    pendingRequestIds.filter(id => selectedIds.includes(id)).forEach(id => approveRequest(id));
    setSelectedIds(ids => ids.filter(id => !pendingRequestIds.includes(id)));
  };
  const handleBulkReject = () => {
    pendingRequestIds.filter(id => selectedIds.includes(id)).forEach(id => rejectRequest({ id, reason: 'Bulk rejected by admin' }));
    setSelectedIds(ids => ids.filter(id => !pendingRequestIds.includes(id)));
  };

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

  // const handleFulfill = (request: BloodRequest) => {
  //   setSelectedRequest(request);
  //   setShowFulfillModal(true);
  // };

  const handleFulfillSubmit = () => {
    if (selectedRequest && selectedDonor) {
      fulfillRequest({ id: selectedRequest.id, donorId: selectedDonor });
      setShowFulfillModal(false);
      setSelectedDonor('');
    }
  };

  const handleDeleteRequest = (request: BloodRequest) => {
    setSelectedRequest(request);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    if (selectedRequest) {
      deleteRequest(selectedRequest.id);
      setShowDeleteModal(false);
      setSelectedRequest(null);
    }
  };

  const handleCompleteDonation = (request: BloodRequest) => {
    setSelectedRequest(request);
    setShowCompleteDonationModal(true);
  };

  const handleCompleteDonationSubmit = () => {
    if (selectedRequest && geotagPhoto) {
      completeDonation({ requestId: selectedRequest.id, geotagPhoto });
      setShowCompleteDonationModal(false);
      setGeotagPhoto(null);
    }
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setEditForm((prev: any) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateRequest({ id: editForm.id, data: editForm });
    setShowEditModal(false);
  };

  const getStatusColor = (status: string) => {
    const statusConfig = REQUEST_STATUS.find(s => s.value === status);
    return statusConfig?.color || 'bg-gray-100 text-gray-800';
  };

  const getUrgencyColor = (urgency: string) => {
    const urgencyConfig = URGENCY_LEVELS.find(u => u.value === urgency);
    return urgencyConfig?.color || 'bg-gray-100 text-gray-800';
  };

  // Update: Only allow donor change if more than 3 hours before request date/time
  const isFutureRequest = (dateTime: string) => {
    const requestTime = new Date(dateTime).getTime();
    const now = Date.now();
    const threeHoursMs = 3 * 60 * 60 * 1000;
    return requestTime - now > threeHoursMs;
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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-2">
              Blood Requests Management
            </h1>
            <p className="text-gray-600 text-lg">
              Review, approve, and manage blood donation requests from the community.
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <Card className="mb-6 border-2 border-gray-200/50 shadow-lg">
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


      {/* Requests List */}
      <Card padding={false} className="border-2 border-gray-200/50 shadow-lg overflow-hidden">
        {/* Bulk action bar */}
        {pendingRequestIds.length > 0 && (
          <div className="flex items-center gap-2 px-6 py-3 border-b border-gray-200/50 bg-gradient-to-r from-primary-50 to-blue-50">
            <input
              type="checkbox"
              checked={allSelected}
              onChange={toggleSelectAll}
              className="mr-2 h-4 w-4 text-primary-600 border-gray-300 rounded"
            />
            <span className="text-sm text-gray-700 mr-4">Select All Pending</span>
            <Button size="sm" variant="outline" onClick={handleBulkApprove} disabled={selectedIds.length === 0}>
              <CheckCircle className="h-4 w-4 mr-1" /> Approve Selected
            </Button>
            <Button size="sm" variant="outline" onClick={handleBulkReject} disabled={selectedIds.length === 0}>
              <XCircle className="h-4 w-4 mr-1" /> Reject Selected
            </Button>
            {selectedIds.length > 0 && (
              <span className="ml-2 text-xs text-gray-500">{selectedIds.length} selected</span>
            )}
          </div>
        )}
        {/* Table */}
        {filteredRequests.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200/50">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100/50">
                <tr>
                  <th className="px-2 py-3">
                    <input
                      type="checkbox"
                      checked={allSelected}
                      onChange={toggleSelectAll}
                      className="h-4 w-4 text-primary-600 border-gray-300 rounded"
                    />
                  </th>
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
              <tbody className="bg-white divide-y divide-gray-200/50">
                {filteredRequests.map((request) => (
                  <tr key={request.id} className="hover:bg-gradient-to-r hover:from-primary-50/50 hover:to-blue-50/50 transition-all duration-200">
                    <td className="px-2 py-4">
                      {request.status === 'pending' && (
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(request.id)}
                          onChange={() => toggleSelect(request.id)}
                          className="h-4 w-4 text-primary-600 border-gray-300 rounded"
                        />
                      )}
                    </td>
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
                    
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex flex-wrap gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewDetails(request)}
                          className="text-blue-600 hover:text-blue-700"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        
                        {request.status === 'pending' && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleApprove(request.id)}
                              loading={isApproving}
                              className="text-green-600 hover:text-green-700"
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Approve
                            </Button>
                            
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleReject(request.id)}
                              loading={isRejecting}
                              className="text-red-600 hover:text-red-700"
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              Reject
                            </Button>
                          </>
                        )}
                        
                        {request.status === 'approved' && !request.assignedDonorId && request.optedInStudents && request.optedInStudents.length > 0 && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedRequest(request);
                              setDonorActionType('assign');
                              setShowDonorModal(true);
                            }}
                            className="text-blue-600 hover:text-blue-700"
                            loading={isUpdatingDonor}
                          >
                            <Users className="h-4 w-4 mr-1" />
                            Assign Donor
                          </Button>
                        )}
                        {request.status === 'approved' && request.assignedDonorId && isFutureRequest(request.dateTime) && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedRequest(request);
                              setDonorActionType('change');
                              setShowDonorModal(true);
                            }}
                            className="text-orange-600 hover:text-orange-700"
                            loading={isUpdatingDonor}
                          >
                            <Users className="h-4 w-4 mr-1" />
                            Change Assigned Donor
                          </Button>
                        )}

                        {request.status === 'approved' && request.assignedDonorId && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleCompleteDonation(request)}
                            className="text-purple-600 hover:text-purple-700"
                          >
                            <Camera className="h-4 w-4 mr-1" />
                            Complete Donation
                          </Button>
                        )}

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteRequest(request)}
                          loading={isDeleting}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      </div>
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

            {/* Assigned Donor */}
            {selectedRequest.assignedDonor && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <Users className="h-5 w-5 mr-2 text-blue-600" />
                  Assigned Donor
                </h3>
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-blue-900">{selectedRequest.assignedDonor.name}</p>
                      <p className="text-sm text-blue-700">{selectedRequest.assignedDonor.email}</p>
                      <p className="text-sm text-blue-600">Blood Group: {selectedRequest.assignedDonor.bloodGroup}</p>
                    </div>
                    <Badge variant="primary" className="bg-blue-600 text-white">
                      Assigned
                    </Badge>
                  </div>
                </div>
              </div>
            )}

            {/* Opted In Students */}
            {selectedRequest.optedInStudents && selectedRequest.optedInStudents.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <Heart className="h-5 w-5 mr-2 text-green-600" />
                  Opted In Donors ({selectedRequest.optedInStudents.length})
                </h3>
                <div className="max-h-80 overflow-y-auto border border-gray-200 rounded-lg">
                  <div className="space-y-2 p-2">
                    {selectedRequest.optedInStudents.slice(0, 10).map((optIn) => (
                      <div key={optIn.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                        <div>
                          <p className="font-medium text-green-900">{optIn.student.name}</p>
                          <p className="text-sm text-green-700">{optIn.student.email}</p>
                          <p className="text-sm text-green-600">Blood Group: {optIn.student.bloodGroup}</p>
                        </div>
                        <div className="text-sm text-green-600">
                          Opted in: {format(new Date(optIn.optedAt), 'MMM dd, HH:mm')}
                        </div>
                      </div>
                    ))}
                    {selectedRequest.optedInStudents.length > 10 && (
                      <div className="text-center py-2 text-sm text-gray-500 bg-gray-50 rounded-lg">
                        +{selectedRequest.optedInStudents.length - 10} more opted in donors
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Geotag/Donation Photo */}
            {selectedRequest.geotagPhoto && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Donation Proof Photo</h3>
                <a href={`/api/uploads/${selectedRequest.geotagPhoto}`} target="_blank" rel="noopener noreferrer">
                  <img
                    src={`/api/uploads/${selectedRequest.geotagPhoto}`}
                    alt="Donation Proof"
                    className="max-w-xs rounded border border-gray-300 shadow"
                  />
                </a>
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

      {/* Complete Donation Modal */}
      <Modal
        isOpen={showCompleteDonationModal}
        onClose={() => setShowCompleteDonationModal(false)}
        title="Complete Donation"
      >
        {selectedRequest && (
          <div className="space-y-4">
            <p className="text-gray-600">
              Please provide a geotag photo to complete the donation for {selectedRequest.requestorName}.
            </p>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Geotag Photo URL
              </label>
              <Input
                placeholder="Enter photo URL with location data"
                value={geotagPhoto ? geotagPhoto.name : ''}
                onChange={() => {
                  // This input is for URL, but the state is File.
                  // If you need to handle a File object, you'd need a different approach.
                  // For now, it's just for display if a File is selected.
                }}
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Please provide a photo URL that includes location/geotag information
              </p>
            </div>
            
            <div className="flex justify-end space-x-3 pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setShowCompleteDonationModal(false);
                  setGeotagPhoto(null);
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleCompleteDonationSubmit}
                loading={isCompletingDonation}
                disabled={!geotagPhoto}
              >
                Complete Donation
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Request"
      >
        {selectedRequest && (
          <div className="space-y-4">
            <p className="text-gray-600">
              Are you sure you want to delete the blood request for {selectedRequest.requestorName}?
              This action cannot be undone.
            </p>
            
            <div className="flex justify-end space-x-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={handleConfirmDelete}
                loading={isDeleting}
              >
                Delete Request
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Donor Assignment Modal */}
      <Modal
        isOpen={showDonorModal}
        onClose={() => setShowDonorModal(false)}
        title={donorActionType === 'assign' ? 'Assign Donor' : 'Change Assigned Donor'}
        size="md"
      >
        {selectedRequest && (
          <div>
            <div className="mb-4">
              <div className="font-medium mb-2">Select a donor from opted-in students:</div>
              <select
                className="w-full border rounded p-2"
                value={selectedDonor}
                onChange={e => setSelectedDonor(e.target.value)}
              >
                <option value="">Select Donor</option>
                {selectedRequest.optedInStudents?.map(optIn => (
                  <option key={optIn.student.id} value={optIn.student.id}>
                    {optIn.student.name} ({optIn.student.email}) - {optIn.student.bloodGroup}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowDonorModal(false)}>Cancel</Button>
              <Button
                variant="primary"
                loading={isFulfilling || isUpdatingDonor}
                disabled={!selectedDonor}
                onClick={() => {
                  if (!selectedRequest || !selectedDonor) return;
                  if (donorActionType === 'assign') {
                    fulfillRequest({ id: selectedRequest.id, donorId: selectedDonor });
                  } else {
                    updateAssignedDonor({ requestId: selectedRequest.id, donorId: selectedDonor });
                  }
                  setShowDonorModal(false);
                  setSelectedDonor('');
                }}
              >
                {donorActionType === 'assign' ? 'Assign Donor' : 'Change Donor'}
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Blood Request"
        size="lg"
      >
        {editForm && (
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <input name="requestorName" value={editForm.requestorName} onChange={handleEditChange} className="mt-1 block w-full border rounded p-2" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input name="email" value={editForm.email} onChange={handleEditChange} className="mt-1 block w-full border rounded p-2" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone</label>
                <input name="phone" value={editForm.phone} onChange={handleEditChange} className="mt-1 block w-full border rounded p-2" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Blood Group</label>
                <select name="bloodGroup" value={editForm.bloodGroup} onChange={handleEditChange} className="mt-1 block w-full border rounded p-2" required>
                  <option value="">Select</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Units</label>
                <input name="units" type="number" min="1" max="10" value={editForm.units} onChange={handleEditChange} className="mt-1 block w-full border rounded p-2" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Date & Time</label>
                <input name="dateTime" type="datetime-local" value={editForm.dateTime?.slice(0,16)} onChange={handleEditChange} className="mt-1 block w-full border rounded p-2" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Hospital Name</label>
                <input name="hospitalName" value={editForm.hospitalName} onChange={handleEditChange} className="mt-1 block w-full border rounded p-2" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Location</label>
                <input name="location" value={editForm.location} onChange={handleEditChange} className="mt-1 block w-full border rounded p-2" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Urgency</label>
                <select name="urgency" value={editForm.urgency} onChange={handleEditChange} className="mt-1 block w-full border rounded p-2" required>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700">Notes</label>
                <textarea name="notes" value={editForm.notes || ''} onChange={handleEditChange} className="mt-1 block w-full border rounded p-2" rows={2} />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setShowEditModal(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                Save Changes
              </Button>
            </div>
          </form>
        )}
      </Modal>

      {/* Assigned Donor and Geotagged Image for Completed Requests */}
      {selectedRequest && selectedRequest.status === 'completed' && (
        <Modal
          isOpen={showDetailsModal} // Reusing showDetailsModal for this specific section
          onClose={() => setShowDetailsModal(false)}
          title="Blood Request Details"
          size="lg"
        >
          {selectedRequest && (
            <div className="space-y-6">
              {/* Donor Info */}
              {selectedRequest.assignedDonor && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                    <Users className="h-5 w-5 mr-2 text-blue-600" />
                    Donor Who Donated
                  </h3>
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-blue-900">{selectedRequest.assignedDonor.name}</p>
                        <p className="text-sm text-blue-700">{selectedRequest.assignedDonor.email}</p>
                        <p className="text-sm text-blue-600">Blood Group: {selectedRequest.assignedDonor.bloodGroup}</p>
                      </div>
                      <Badge variant="primary" className="bg-blue-600 text-white">
                        Donated
                      </Badge>
                    </div>
                  </div>
                </div>
              )}
              {/* Geotagged Image */}
              {selectedRequest.geotagPhoto && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Donation Geotagged Photo</h3>
                  <a href={`/api/uploads/${selectedRequest.geotagPhoto}`} target="_blank" rel="noopener noreferrer">
                    <img
                      src={`/api/uploads/${selectedRequest.geotagPhoto}`}
                      alt="Donation Geotagged Proof"
                      className="max-w-xs rounded border border-gray-300 shadow"
                    />
                  </a>
                </div>
              )}
            </div>
          )}
        </Modal>
      )}
    </div>
  );
};