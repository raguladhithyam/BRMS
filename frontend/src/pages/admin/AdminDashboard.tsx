import React from 'react';
import { Users, FileText, Clock, CheckCircle, AlertTriangle, Heart, TrendingUp, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom'; // Add this import
import { Card } from '../../components/shared/Card';
import { Badge } from '../../components/shared/Badge';
import { LoadingSpinner } from '../../components/shared/LoadingSpinner';
import { useDashboard, useDonationStatistics } from '../../hooks/useDashboard';
import { useAdminRequests } from '../../hooks/useRequests';
import { cn } from '../../utils/cn';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate(); // Add navigation hook
  const { stats, bloodGroupStats, isLoading } = useDashboard();
  const { data: donationStats, isLoading: isDonationStatsLoading } = useDonationStatistics();
  const { requests } = useAdminRequests({ limit: 5, page: 1 });

  // Navigation handlers
  const handleReviewRequests = () => {
    navigate('/admin/requests');
  };

  const handleManageDonors = () => {
    navigate('/admin/students');
  };

  // Add this function to handle Excel report download
  const handleDownloadReport = async () => {
    try {
      const response = await fetch('/api/admin/dashboard/donation-report', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (!response.ok) throw new Error('Failed to download report');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'donation-report.xlsx';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      alert('Failed to download report.');
    }
  };

  if (isLoading || isDonationStatsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Requests',
      value: stats?.totalRequests || 0,
      icon: FileText,
      color: 'text-blue-600 bg-blue-100',
      trend: '+12%',
    },
    {
      title: 'Pending Review',
      value: stats?.pendingRequests || 0,
      icon: Clock,
      color: 'text-yellow-600 bg-yellow-100',
      trend: '+5%',
    },
    {
      title: 'Approved Today',
      value: stats?.approvedRequests || 0,
      icon: CheckCircle,
      color: 'text-green-600 bg-green-100',
      trend: '+8%',
    },
    {
      title: 'Active Donors',
      value: stats?.availableStudents || 0,
      icon: Users,
      color: 'text-primary-600 bg-primary-100',
      trend: '+15%',
    },
  ];

  // Colors for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28CF6', '#FF6699', '#FFB347', '#B6E880'];

  // Fulfillment rate data
  const fulfillmentData = [
    { name: 'Pending', value: stats?.pendingRequests || 0 },
    { name: 'Approved', value: stats?.approvedRequests || 0 },
    { name: 'Total', value: stats?.totalRequests || 0 },
  ];

  // Blood group distribution
  const bloodGroupData = (bloodGroupStats || []).map((group, idx) => ({
    name: group.bloodGroup,
    Available: group.availableStudents,
    Requests: group.totalRequests,
    fill: COLORS[idx % COLORS.length],
  }));

  // Donation summary (bar)
  const donationSummary = [
    { name: 'Total Donations', value: donationStats?.totalDonations || 0 },
    { name: 'Unique Donors', value: donationStats?.totalUniqueDonors || 0 },
    { name: 'Total Requests', value: donationStats?.totalRequests || 0 },
    { name: 'Units Donated', value: donationStats?.totalUnitsDonated || 0 },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">
          Monitor blood requests, manage donors, and save lives through efficient coordination.
        </p>
      </div>

      {/* Donation Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} hover className="relative overflow-hidden">
              <div className="flex items-center">
                <div className={cn("p-3 rounded-lg", stat.color)}>
                  <Icon className="h-6 w-6" />
                </div>
                <div className="ml-4 flex-1">
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <div className="flex items-center">
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <span className="ml-2 text-xs font-medium text-green-600 flex items-center">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      {stat.trend}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Blood Group Distribution */}
        <Card>
          <h2 className="text-lg font-semibold mb-2">Blood Group Distribution</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={bloodGroupData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Available" fill="#00C49F" />
              <Bar dataKey="Requests" fill="#0088FE" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
        {/* Fulfillment Rate */}
        <Card>
          <h2 className="text-lg font-semibold mb-2">Request Fulfillment</h2>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={fulfillmentData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={70}
                label
              >
                {fulfillmentData.map((_, idx) => (
                  <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Card>
        {/* Donation Summary */}
        <Card>
          <h2 className="text-lg font-semibold mb-2">Donation Summary</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={donationSummary} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="value" fill="#FF8042" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Requests */}
        <div className="lg:col-span-2">
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Recent Blood Requests</h2>
              <Badge variant="info">{requests?.data?.length || 0} Pending</Badge>
            </div>
            
            <div className="space-y-4">
              {requests?.data?.map((request) => (
                <div
                  key={request.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-primary-100 rounded-full">
                      <Heart className="h-4 w-4 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{request.requestorName}</h3>
                      <p className="text-sm text-gray-600">
                        {request.bloodGroup} • {request.units} unit(s) • {request.hospitalName}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Badge
                      variant={
                        request.urgency === 'critical' ? 'danger' :
                        request.urgency === 'high' ? 'warning' :
                        request.urgency === 'medium' ? 'info' : 'secondary'
                      }
                    >
                      {request.urgency}
                    </Badge>
                    
                    <Badge
                      variant={
                        request.status === 'pending' ? 'warning' :
                        request.status === 'approved' ? 'info' :
                        request.status === 'fulfilled' ? 'success' : 'danger'
                      }
                    >
                      {request.status}
                    </Badge>
                  </div>
                </div>
              ))}
              
              {(!requests?.data || requests.data.length === 0) && (
                <div className="text-center py-8 text-gray-500">
                  <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No recent requests to display</p>
                </div>
              )}
            </div>
          </Card>
          {/* Quick Actions - moved here */}
          <Card className="mt-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
            
            <div className="space-y-3">
              <button 
                onClick={handleReviewRequests}
                className="w-full p-3 text-left bg-primary-50 hover:bg-primary-100 rounded-lg transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <FileText className="h-5 w-5 text-primary-600" />
                  <span className="font-medium text-primary-700">Review Pending Requests</span>
                </div>
              </button>
              
              <button 
                onClick={handleManageDonors}
                className="w-full p-3 text-left bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <Users className="h-5 w-5 text-blue-600" />
                  <span className="font-medium text-blue-700">Manage Donors</span>
                </div>
              </button>
              {/* Download Excel Report Button */}
              <button
                onClick={handleDownloadReport}
                className="w-full p-3 text-left bg-green-50 hover:bg-green-100 rounded-lg transition-colors flex items-center space-x-3"
              >
                <Download className="h-5 w-5 text-green-600" />
                <span className="font-medium text-green-700">Download Donation Excel Report</span>
              </button>
            </div>
          </Card>
        </div>
        {/* Blood Group Statistics */}
        <div>
          <Card>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Blood Group Availability</h2>
            
            <div className="space-y-4">
              {bloodGroupStats?.map((group) => (
                <div key={group.bloodGroup} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-primary-600">
                        {group.bloodGroup}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{group.bloodGroup}</p>
                      <p className="text-xs text-gray-600">
                        {group.availableStudents} available
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {group.totalRequests} requests
                    </p>
                    <div className="w-16 bg-gray-200 rounded-full h-1.5 mt-1">
                      <div
                        className="bg-primary-600 h-1.5 rounded-full"
                        style={{
                          width: `${Math.min(
                            (group.availableStudents / Math.max(group.totalRequests, 1)) * 100,
                            100
                          )}%`
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
              
              {(!bloodGroupStats || bloodGroupStats.length === 0) && (
                <div className="text-center py-8 text-gray-500">
                  <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No blood group data available</p>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};