import React, { useState } from 'react';
import { Heart, Clock, CheckCircle, AlertCircle, Calendar, MapPin, Phone, AlertTriangle, Award } from 'lucide-react';
import { Card } from '../../components/shared/Card';
import { Button } from '../../components/shared/Button';
import { Badge } from '../../components/shared/Badge';
import { LoadingSpinner } from '../../components/shared/LoadingSpinner';
import { EmptyState } from '../../components/shared/EmptyState';
import { DonationCompletionModal } from '../../components/shared/DonationCompletionModal';
import { useAuth } from '../../hooks/useAuth';
import { useStudentRequests } from '../../hooks/useRequests';
import { useCertificates } from '../../hooks/useCertificates';
import { format, addMonths } from 'date-fns';

export const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const { matchingRequests, optIns, isLoading, optIn, isOptingIn } = useStudentRequests();
  const { createCertificateRequest } = useCertificates();
  const [showDonationModal, setShowDonationModal] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOptIn = (requestId: string) => {
    optIn(requestId);
  };

  const handleDonationCompleted = (requestId: string) => {
    setSelectedRequestId(requestId);
    setShowDonationModal(true);
  };

  const handleDonationSubmit = async (geotagPhoto: File) => {
    if (!selectedRequestId) return;
    
    setIsSubmitting(true);
    try {
      // First complete the donation with geotag photo
      const formData = new FormData();
      formData.append('geotagPhoto', geotagPhoto);
      
      await fetch(`${import.meta.env.VITE_API_URL}/admin/requests/${selectedRequestId}/complete-donation`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData,
      });

      // Then create certificate request
      await createCertificateRequest(selectedRequestId);
      setShowDonationModal(false);
      setSelectedRequestId(null);
    } catch (error) {
      console.error('Complete donation error:', error);
    } finally {
      setIsSubmitting(false);
    }
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

  const getNextDonationDate = () => {
    if (!user?.lastDonationDate) return null;
    return addMonths(new Date(user.lastDonationDate), 3);
  };

  const isEligibleForDonation = () => {
    if (!user?.lastDonationDate) return true;
    const nextDate = getNextDonationDate();
    return nextDate ? new Date() >= nextDate : true;
  };

  // Add this function to check if the user has already opted in to a request
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

  const nextDonationDate = getNextDonationDate();
  const eligible = isEligibleForDonation();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-gray-600">
          Your blood type <Badge variant="primary">{user?.bloodGroup}</Badge> can help save lives. 
          {eligible ? ' Check out matching requests below.' : ' You will be eligible to donate again soon.'}
        </p>
      </div>

      {/* Donation Status Card */}
      <Card className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className={`p-3 rounded-full ${eligible ? 'bg-green-100' : 'bg-yellow-100'}`}>
              <Heart className={`h-8 w-8 ${eligible ? 'text-green-600' : 'text-yellow-600'}`} />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Donation Status</h2>
              <div className="space-y-1">
                <p className="text-gray-600">
                  You are currently{' '}
                  <Badge variant={eligible ? 'success' : 'warning'}>
                    {eligible ? 'Eligible for Donation' : 'Not Eligible'}
                  </Badge>
                </p>
                {user?.lastDonationDate && (
                  <p className="text-sm text-gray-500">
                    Last donation: {format(new Date(user.lastDonationDate), 'MMM dd, yyyy')}
                  </p>
                )}
                {!eligible && nextDonationDate && (
                  <p className="text-sm text-yellow-700">
                    Next eligible date: {format(nextDonationDate, 'MMM dd, yyyy')}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Eligibility Notice */}
      {!eligible && (
        <Card className="mb-6 bg-yellow-50 border-yellow-200">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="h-5 w-5 text-yellow-600" />
            <div>
              <h3 className="font-medium text-yellow-900">Donation Eligibility</h3>
              <p className="text-sm text-yellow-800">
                For your health and safety, you must wait 3 months between blood donations. 
                You'll be automatically eligible again on {nextDonationDate && format(nextDonationDate, 'MMMM dd, yyyy')}.
              </p>
            </div>
          </div>
        </Card>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Matching Blood Requests */}
        <div className="lg:col-span-2">
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Matching Blood Requests
              </h2>
              <Badge variant="info">
                {eligible ? (matchingRequests?.length || 0) : 0} Available
              </Badge>
            </div>
            
            <div className="space-y-4">
              {eligible && matchingRequests && matchingRequests.length > 0 ? (
                matchingRequests.map((request) => (
                  <div
                    key={request.id}
                    className="border border-gray-200 rounded-lg p-4 hover:border-primary-300 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-medium text-gray-900">
                            {request.requestorName}
                          </h3>
                          <Badge variant="primary">{request.bloodGroup}</Badge>
                          <Badge className={getUrgencyColor(request.urgency)}>
                            {request.urgency}
                          </Badge>
                        </div>
                        
                        <div className="space-y-1 text-sm text-gray-600">
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            {request.hospitalName}, {request.location}
                          </div>
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            Required: {format(new Date(request.dateTime), 'MMM dd, yyyy HH:mm')}
                          </div>
                          <div className="flex items-center">
                            <Heart className="h-4 w-4 mr-1" />
                            {request.units} unit(s) needed
                          </div>
                        </div>
                        
                        {request.notes && (
                          <p className="mt-2 text-sm text-gray-700 bg-gray-50 p-2 rounded">
                            {request.notes}
                          </p>
                        )}
                      </div>
                      
                      <div className="ml-4">
                        <Button
                          size="sm"
                          onClick={() => handleOptIn(request.id)}
                          loading={isOptingIn}
                          disabled={isOptedIn(request.id) || request.status !== 'approved'}
                        >
                          Opt In to Help
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <EmptyState
                  icon={<Heart className="h-12 w-12" />}
                  title={eligible ? "No Matching Requests" : "Not Eligible for Donation"}
                  description={
                    eligible 
                      ? "No blood requests match your blood type at the moment. We'll notify you when new requests arrive."
                      : `You'll be eligible to donate again on ${nextDonationDate && format(nextDonationDate, 'MMMM dd, yyyy')}.`
                  }
                />
              )}
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Your Opt-ins */}
          <Card>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Recent Opt-ins</h2>
            
            <div className="space-y-3">
              {optIns && optIns.length > 0 ? (
                optIns.slice(0, 5).map((optIn) => (
                  <div
                    key={optIn.id}
                    className="p-3 bg-green-50 rounded-lg"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="font-medium text-green-900">
                          {optIn.request.requestorName}
                        </p>
                        <p className="text-sm text-green-700">
                          {optIn.request.bloodGroup} • {optIn.request.hospitalName}
                        </p>
                      </div>
                      <Badge variant="success">Opted In</Badge>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDonationCompleted(optIn.request.id)}
                      className="w-full mt-2"
                    >
                      <Award className="h-4 w-4 mr-2" />
                      Donation Completed
                    </Button>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-gray-500">
                  <CheckCircle className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                  <p className="text-sm">No opt-ins yet</p>
                </div>
              )}
            </div>
          </Card>

          {/* Donation Tips */}
          <Card>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Donation Tips</h2>
            
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="p-1 bg-blue-100 rounded-full">
                  <Clock className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Stay Hydrated</p>
                  <p className="text-xs text-gray-600">Drink plenty of water before donation</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="p-1 bg-green-100 rounded-full">
                  <Heart className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Eat Well</p>
                  <p className="text-xs text-gray-600">Have a good meal before donating</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="p-1 bg-yellow-100 rounded-full">
                  <AlertCircle className="h-4 w-4 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Rest After</p>
                  <p className="text-xs text-gray-600">Take it easy for a few hours post-donation</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Emergency Contact */}
          <Card className="bg-red-50 border-red-200">
            <h2 className="text-lg font-semibold text-red-900 mb-3">Emergency Contact</h2>
            <div className="space-y-2">
              <div className="flex items-center text-red-800">
                <Phone className="h-4 w-4 mr-2" />
                <span className="text-sm">+91 9952810338</span>
              </div>
              <p className="text-xs text-red-700">
                Available 24/7 for critical blood requests
              </p>
            </div>
          </Card>
        </div>
      </div>

      {/* Donation Completion Modal */}
      <DonationCompletionModal
        isOpen={showDonationModal}
        onClose={() => {
          setShowDonationModal(false);
          setSelectedRequestId(null);
        }}
        onSubmit={handleDonationSubmit}
        isLoading={isSubmitting}
      />
    </div>
  );
};