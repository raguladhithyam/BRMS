import React, { useState, useEffect } from 'react';
import { Heart, Clock, CheckCircle, AlertCircle, Calendar, MapPin, Phone, Award, Download, Users, Zap, Target, Activity } from 'lucide-react';
import { Card } from './Card';
import { Button } from './Button';
import { Badge } from './Badge';
import { LoadingSpinner } from './LoadingSpinner';
import { EmptyState } from './EmptyState';
import { ProgressBar } from './ProgressBar';
import { format, addMonths } from 'date-fns';

interface EnhancedDashboardProps {
  user: any;
  matchingRequests: any[];
  optIns: any[];
  certificates: any[];
  isLoading: boolean;
  onOptIn: (requestId: string) => void;
  onDonationCompleted: (requestId: string) => void;
  isOptingIn: boolean;
}

export const EnhancedDashboard: React.FC<EnhancedDashboardProps> = ({
  user,
  matchingRequests,
  optIns,
  certificates,
  isLoading,
  onOptIn,
  onDonationCompleted,
  isOptingIn
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [animatedStats, setAnimatedStats] = useState({
    donations: 0,
    livesSaved: 0,
    streak: 0,
    rank: 0
  });

  useEffect(() => {
    // Animate stats on load
    const timer = setTimeout(() => {
      setAnimatedStats({
        donations: certificates?.length || 0,
        livesSaved: (certificates?.length || 0) * 3, // Assume 3 lives saved per donation
        streak: 2,
        rank: 15
      });
    }, 500);
    return () => clearTimeout(timer);
  }, [certificates]);

  const getNextDonationDate = () => {
    if (!user?.lastDonationDate) return null;
    return addMonths(new Date(user.lastDonationDate), 3);
  };

  const isEligibleForDonation = () => {
    if (!user?.lastDonationDate) return true;
    const nextDate = getNextDonationDate();
    return nextDate ? new Date() >= nextDate : true;
  };

  const isOptedIn = (requestId: string) => {
    return optIns?.some(optIn => optIn.request.id === requestId);
  };

  const isAssignedDonor = (request: any) => {
    return user && request.assignedDonorId && request.assignedDonorId === user.id;
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const nextDonationDate = getNextDonationDate();
  const eligible = isEligibleForDonation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Enhanced Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent mb-2">
              Welcome back, {user?.name}! 👋
            </h1>
            <p className="text-gray-600 text-lg">
              Your blood type <Badge variant="primary" className="text-lg px-3 py-1">{user?.bloodGroup}</Badge> can help save lives
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-gradient-to-r from-red-500 to-pink-500 rounded-full">
              <Heart className="h-6 w-6 text-white" />
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">Donor Rank</div>
              <div className="text-2xl font-bold text-gray-900">#{animatedStats.rank}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-red-50 to-pink-50 border-red-200 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-600 mb-1">Total Donations</p>
              <p className="text-3xl font-bold text-red-700">{animatedStats.donations}</p>
            </div>
            <div className="p-3 bg-red-100 rounded-full">
              <Heart className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600 mb-1">Lives Saved</p>
              <p className="text-3xl font-bold text-green-700">{animatedStats.livesSaved}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <Users className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600 mb-1">Current Streak</p>
              <p className="text-3xl font-bold text-blue-700">{animatedStats.streak} days</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Zap className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600 mb-1">Available Requests</p>
              <p className="text-3xl font-bold text-purple-700">{matchingRequests?.length || 0}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <Target className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Donation Status Card */}
      <Card className={`mb-8 ${eligible ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200' : 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200'}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className={`p-4 rounded-2xl ${eligible ? 'bg-green-100' : 'bg-yellow-100'}`}>
              <Heart className={`h-8 w-8 ${eligible ? 'text-green-600' : 'text-yellow-600'}`} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Donation Status</h2>
              <div className="flex items-center space-x-3">
                <Badge variant={eligible ? 'success' : 'warning'} className="text-lg px-4 py-2">
                  {eligible ? '✅ Ready to Donate' : '⏳ Not Yet Eligible'}
                </Badge>
                {user?.lastDonationDate && (
                  <span className="text-gray-600">
                    Last donation: {format(new Date(user.lastDonationDate), 'MMM dd, yyyy')}
                  </span>
                )}
              </div>
              {!eligible && nextDonationDate && (
                <div className="mt-3">
                  <p className="text-sm text-yellow-700 mb-2">
                    Next eligible: {format(nextDonationDate, 'MMMM dd, yyyy')}
                  </p>
                  <ProgressBar 
                    value={100 - (Math.max(0, (nextDonationDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) / 90) * 100} 
                    max={100} 
                    label="Eligibility Progress" 
                  />
                </div>
              )}
            </div>
          </div>
          {eligible && (
            <div className="text-right">
              <div className="text-2xl font-bold text-green-600">Ready!</div>
              <div className="text-sm text-green-600">You can help save lives</div>
            </div>
          )}
        </div>
      </Card>

      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-8 bg-gray-100 p-1 rounded-xl">
        {[
          { id: 'overview', label: 'Overview', icon: Activity },
          { id: 'requests', label: 'Blood Requests', icon: Heart },
          { id: 'history', label: 'My History', icon: Award }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-white text-red-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Matching Requests */}
          <div className="lg:col-span-2">
            <Card>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Matching Blood Requests</h2>
                <Badge variant="info" className="text-lg px-3 py-1">
                  {eligible ? (matchingRequests?.length || 0) : 0} Available
                </Badge>
              </div>
              
              <div className="space-y-4">
                {eligible && matchingRequests && matchingRequests.length > 0 ? (
                  matchingRequests
                    .filter(request => isAssignedDonor(request))
                    .map((request) => (
                      <div
                        key={request.id}
                        className="border border-gray-200 rounded-xl p-6 hover:border-red-300 hover:shadow-md transition-all duration-300 bg-gradient-to-r from-white to-red-50"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-3">
                              <h3 className="text-xl font-semibold text-gray-900">
                                {request.requestorName}
                              </h3>
                              <Badge variant="primary" className="text-sm">{request.bloodGroup}</Badge>
                              <Badge className={`text-sm ${getUrgencyColor(request.urgency)}`}>
                                {request.urgency}
                              </Badge>
                              {isAssignedDonor(request) && (
                                <Badge variant="success" className="text-sm">🎯 Assigned to You</Badge>
                              )}
                            </div>
                            
                            <div className="grid md:grid-cols-2 gap-4 mb-4">
                              <div className="flex items-center text-gray-600">
                                <MapPin className="h-5 w-5 mr-2 text-red-500" />
                                <span>{request.hospitalName}, {request.location}</span>
                              </div>
                              <div className="flex items-center text-gray-600">
                                <Calendar className="h-5 w-5 mr-2 text-red-500" />
                                <span>{format(new Date(request.dateTime), 'MMM dd, yyyy HH:mm')}</span>
                              </div>
                              <div className="flex items-center text-gray-600">
                                <Heart className="h-5 w-5 mr-2 text-red-500" />
                                <span>{request.units} unit(s) needed</span>
                              </div>
                              <div className="flex items-center text-gray-600">
                                <Clock className="h-5 w-5 mr-2 text-red-500" />
                                <span>Urgent: {request.urgency}</span>
                              </div>
                            </div>
                            
                            {request.notes && (
                              <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-red-200">
                                <p className="text-gray-700">{request.notes}</p>
                              </div>
                            )}
                          </div>
                          
                          <div className="ml-6">
                            <Button
                              size="lg"
                              onClick={() => onOptIn(request.id)}
                              loading={isOptingIn}
                              disabled={isOptedIn(request.id) || request.status !== 'approved'}
                              className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white border-0 px-6 py-3 rounded-xl"
                            >
                              {isOptedIn(request.id) ? '✅ Opted In' : '🤝 Help Now'}
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))
                ) : (
                  <EmptyState
                    icon={<Heart className="h-16 w-16 text-gray-300" />}
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
            {/* Recent Opt-ins */}
            <Card>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Recent Opt-ins</h2>
              
              <div className="space-y-3">
                {optIns && optIns.length > 0 ? (
                  optIns.slice(0, 3).map((optIn) => {
                    const hasCertificate = certificates && certificates.some(
                      (cert) => cert.requestId === optIn.request.id
                    );
                    const assigned = isAssignedDonor(optIn.request);
                    return (
                      <div
                        key={optIn.id}
                        className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <p className="font-semibold text-green-900">
                              {optIn.request.requestorName}
                            </p>
                            <p className="text-sm text-green-700">
                              {optIn.request.bloodGroup} • {optIn.request.hospitalName}
                            </p>
                          </div>
                          {assigned ? (
                            <Badge variant="success" className="text-xs">🎯 Assigned</Badge>
                          ) : (
                            <Badge variant="success" className="text-xs">✅ Opted In</Badge>
                          )}
                        </div>
                        {assigned && !hasCertificate && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onDonationCompleted(optIn.request.id)}
                            className="w-full mt-2 border-green-300 text-green-700 hover:bg-green-100"
                          >
                            <Award className="h-4 w-4 mr-2" />
                            Mark as Completed
                          </Button>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-6 text-gray-500">
                    <CheckCircle className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                    <p className="text-sm">No opt-ins yet</p>
                  </div>
                )}
              </div>
            </Card>

            {/* Donation Tips */}
            <Card>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">💡 Donation Tips</h2>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-blue-100 rounded-full">
                    <Clock className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Stay Hydrated</p>
                    <p className="text-sm text-gray-600">Drink plenty of water 24 hours before donation</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-green-100 rounded-full">
                    <Heart className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Eat Iron-Rich Foods</p>
                    <p className="text-sm text-gray-600">Include spinach, beans, and lean meats</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-yellow-100 rounded-full">
                    <AlertCircle className="h-5 w-5 text-yellow-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Get Good Sleep</p>
                    <p className="text-sm text-gray-600">Aim for 7-8 hours the night before</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Emergency Contact */}
            <Card className="bg-gradient-to-r from-red-50 to-pink-50 border-red-200">
              <h2 className="text-lg font-semibold text-red-900 mb-3">🚨 Emergency Contact</h2>
              <div className="space-y-3">
                <div className="flex items-center text-red-800">
                  <Phone className="h-5 w-5 mr-3 text-red-600" />
                  <span className="font-medium">+91 9952810338</span>
                </div>
                <p className="text-sm text-red-700">
                  Available 24/7 for critical blood requests
                </p>
              </div>
            </Card>
          </div>
        </div>
      )}

      {activeTab === 'requests' && (
        <div className="space-y-6">
          <Card>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">All Blood Requests</h2>
            <div className="space-y-4">
              {matchingRequests && matchingRequests.length > 0 ? (
                matchingRequests.map((request) => (
                  <div
                    key={request.id}
                    className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-all duration-300"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-xl font-semibold text-gray-900">
                            {request.requestorName}
                          </h3>
                          <Badge variant="primary">{request.bloodGroup}</Badge>
                          <Badge className={getUrgencyColor(request.urgency)}>
                            {request.urgency}
                          </Badge>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4 text-gray-600">
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-2" />
                            {request.hospitalName}, {request.location}
                          </div>
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2" />
                            {format(new Date(request.dateTime), 'MMM dd, yyyy HH:mm')}
                          </div>
                          <div className="flex items-center">
                            <Heart className="h-4 w-4 mr-2" />
                            {request.units} unit(s) needed
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-2" />
                            Status: {request.status}
                          </div>
                        </div>
                      </div>
                      <div className="ml-6">
                        <Button
                          onClick={() => onOptIn(request.id)}
                          loading={isOptingIn}
                          disabled={isOptedIn(request.id) || request.status !== 'approved' || !eligible}
                          className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white border-0"
                        >
                          {isOptedIn(request.id) ? '✅ Opted In' : '🤝 Help Now'}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <EmptyState
                  icon={<Heart className="h-16 w-16 text-gray-300" />}
                  title="No Requests Available"
                  description="No blood requests are currently available. Check back later or contact us for emergency requests."
                />
              )}
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'history' && (
        <div className="space-y-6">
          <Card>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Donation History</h2>
            <div className="space-y-4">
              {certificates && certificates.length > 0 ? (
                certificates.map((certificate) => (
                  <div
                    key={certificate.id}
                    className="border border-gray-200 rounded-xl p-6 bg-gradient-to-r from-green-50 to-emerald-50"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="p-3 bg-green-100 rounded-full">
                          <Award className="h-6 w-6 text-green-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            Donation at {certificate.hospitalName}
                          </h3>
                          <p className="text-gray-600">
                            {format(new Date(certificate.donationDate), 'MMMM dd, yyyy')} • 
                            {certificate.bloodGroup} • {certificate.units} unit(s)
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Badge variant="success" className="text-sm">
                          {certificate.status === 'generated' ? '✅ Completed' : '⏳ Processing'}
                        </Badge>
                        {certificate.status === 'generated' && (
                          <Button size="sm" variant="outline" className="border-green-300 text-green-700">
                            <Download className="h-4 w-4 mr-2" />
                            Download Certificate
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <EmptyState
                  icon={<Award className="h-16 w-16 text-gray-300" />}
                  title="No Donation History"
                  description="You haven't completed any donations yet. Start by opting in to help with blood requests!"
                />
              )}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
