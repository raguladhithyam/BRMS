import React, { useState } from 'react';
import { Heart, Calendar, MapPin, Clock, Phone, Mail, CheckCircle, AlertTriangle } from 'lucide-react';
import { Card } from '../../components/shared/Card';
import { Button } from '../../components/shared/Button';
import { Badge } from '../../components/shared/Badge';
import { Modal } from '../../components/shared/Modal';
import { LoadingSpinner } from '../../components/shared/LoadingSpinner';
import { EmptyState } from '../../components/shared/EmptyState';
import { useStudentRequests } from '../../hooks/useRequests';
import { useAuth } from '../../hooks/useAuth';
import { BloodRequest } from '../../types';
import { format } from 'date-fns';

export const StudentRequests: React.FC = () => {
  const { user } = useAuth();
  const { matchingRequests, optIns, isLoading, optIn, isOptingIn } = useStudentRequests();
  const [selectedRequest, setSelectedRequest] = useState<BloodRequest | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const handleOptIn = (requestId: string) => {
    optIn(requestId);
  };

  const handleViewDetails = (request: BloodRequest) => {
    setSelectedRequest(request);
    setShowDetailsModal(true);
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const isOptedIn = (requestId: string) => {
    return optIns?.some(optIn => optIn.request.id === requestId);
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Blood Requests</h1>
        <p className="text-gray-600">
          Help save lives by responding to blood requests matching your blood type{' '}
          <Badge variant="primary">{user?.bloodGroup}</Badge>
        </p>
      </div>

      {/* Availability Notice */}
      {!user?.availability && (
        <Card className="mb-6 bg-yellow-50 border-yellow-200">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="h-5 w-5 text-yellow-600" />
            <div>
              <h3 className="font-medium text-yellow-900">You're currently marked as unavailable</h3>
              <p className="text-sm text-yellow-800">
                Update your availability status to see and respond to blood requests.
              </p>
            </div>
          </div>
        </Card>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Available Requests */}
        <div className="lg:col-span-2">
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Available Blood Requests
              </h2>
              <Badge variant="info">
                {matchingRequests?.length || 0} Matching
              </Badge>
            </div>
            
            <div className="space-y-4">
              {matchingRequests && matchingRequests.length > 0 ? (
                matchingRequests.map((request) => (
                  <div
                    key={request.id}
                    className="border border-gray-200 rounded-lg p-6 hover:border-primary-300 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-primary-100 rounded-full">
                          <Heart className="h-5 w-5 text-primary-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {request.requestorName}
                          </h3>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant="primary">{request.bloodGroup}</Badge>
                            <Badge className={getUrgencyColor(request.urgency)}>
                              {request.urgency} priority
                            </Badge>
                          </div>
                        </div>
                      </div>
                      
                      {isOptedIn(request.id) ? (
                        <Badge variant="success" className="flex items-center">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Opted In
                        </Badge>
                      ) : (
                        <Button
                          size="sm"
                          onClick={() => handleOptIn(request.id)}
                          loading={isOptingIn}
                          disabled={!user?.availability}
                        >
                          Opt In to Help
                        </Button>
                      )}
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div className="space-y-2">
                        <div className="flex items-center text-gray-600">
                          <MapPin className="h-4 w-4 mr-2" />
                          <span className="text-sm">{request.hospitalName}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Calendar className="h-4 w-4 mr-2" />
                          <span className="text-sm">
                            {format(new Date(request.dateTime), 'MMM dd, yyyy HH:mm')}
                          </span>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center text-gray-600">
                          <Heart className="h-4 w-4 mr-2" />
                          <span className="text-sm">{request.units} unit(s) needed</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Clock className="h-4 w-4 mr-2" />
                          <span className="text-sm">
                            Submitted {format(new Date(request.createdAt), 'MMM dd, HH:mm')}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <p className="text-sm text-gray-600">
                        Location: {request.location}
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewDetails(request)}
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <EmptyState
                  icon={<Heart className="h-12 w-12" />}
                  title="No Matching Requests"
                  description={
                    user?.availability 
                      ? "No blood requests match your blood type at the moment. We'll notify you when new requests arrive."
                      : "Mark yourself as available to see matching blood requests."
                  }
                />
              )}
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Your Opt-ins History */}
          <Card>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Opt-ins</h2>
            
            <div className="space-y-3">
              {optIns && optIns.length > 0 ? (
                optIns.map((optIn) => (
                  <div
                    key={optIn.id}
                    className="p-3 bg-green-50 rounded-lg border border-green-200"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-green-900">
                        {optIn.request.requestorName}
                      </h4>
                      <Badge variant="success" size="sm">
                        {optIn.request.status}
                      </Badge>
                    </div>
                    
                    <div className="space-y-1 text-sm text-green-800">
                      <div className="flex items-center">
                        <Heart className="h-3 w-3 mr-1" />
                        {optIn.request.bloodGroup} • {optIn.request.units} unit(s)
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-3 w-3 mr-1" />
                        {optIn.request.hospitalName}
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        Opted in: {format(new Date(optIn.optedAt), 'MMM dd, HH:mm')}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-gray-500">
                  <CheckCircle className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                  <p className="text-sm">No opt-ins yet</p>
                  <p className="text-xs">Start helping by opting into requests</p>
                </div>
              )}
            </div>
          </Card>

          {/* Blood Donation Guidelines */}
          <Card>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Donation Guidelines</h2>
            
            <div className="space-y-3 text-sm">
              <div className="p-3 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-1">Before Donation</h4>
                <ul className="text-blue-800 space-y-1">
                  <li>• Get adequate sleep (6-8 hours)</li>
                  <li>• Eat a healthy meal</li>
                  <li>• Drink plenty of water</li>
                  <li>• Avoid alcohol for 24 hours</li>
                </ul>
              </div>
              
              <div className="p-3 bg-green-50 rounded-lg">
                <h4 className="font-medium text-green-900 mb-1">After Donation</h4>
                <ul className="text-green-800 space-y-1">
                  <li>• Rest for 10-15 minutes</li>
                  <li>• Drink fluids regularly</li>
                  <li>• Avoid heavy lifting for 24 hours</li>
                  <li>• Eat iron-rich foods</li>
                </ul>
              </div>
            </div>
          </Card>

          {/* Emergency Contact */}
          <Card className="bg-red-50 border-red-200">
            <h2 className="text-lg font-semibold text-red-900 mb-3">Emergency Contact</h2>
            <div className="space-y-2">
              <div className="flex items-center text-red-800">
                <Phone className="h-4 w-4 mr-2" />
                <span className="text-sm font-medium">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center text-red-800">
                <Mail className="h-4 w-4 mr-2" />
                <span className="text-sm">emergency@bloodconnect.org</span>
              </div>
              <p className="text-xs text-red-700 mt-2">
                Available 24/7 for critical blood requests and donor support
              </p>
            </div>
          </Card>
        </div>
      </div>

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
                  <Badge variant="info">{selectedRequest.status}</Badge>
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

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => setShowDetailsModal(false)}
              >
                Close
              </Button>
              
              {!isOptedIn(selectedRequest.id) && user?.availability && (
                <Button
                  onClick={() => {
                    handleOptIn(selectedRequest.id);
                    setShowDetailsModal(false);
                  }}
                  loading={isOptingIn}
                >
                  Opt In to Help
                </Button>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};