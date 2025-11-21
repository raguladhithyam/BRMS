import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  FileText, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  Heart, 
  TrendingUp, 
  Download,
  Activity,
  Award,
  BarChart3,
  PieChart,
  RefreshCw
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card } from './Card';
import { Badge } from './Badge';
import { Button } from './Button';
import { LoadingSpinner } from './LoadingSpinner';
import { useDashboard, useDonationStatistics } from '../../hooks/useDashboard';
import { useAdminRequests } from '../../hooks/useRequests';
import { cn } from '../../utils/cn';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell, Legend } from 'recharts';

interface EnhancedAdminDashboardProps {
  className?: string;
}

export const EnhancedAdminDashboard: React.FC<EnhancedAdminDashboardProps> = ({ className }) => {
  const navigate = useNavigate();
  const { stats, bloodGroupStats, isLoading } = useDashboard();
  const { data: donationStats, isLoading: isDonationStatsLoading } = useDonationStatistics();
  const { requests } = useAdminRequests({ limit: 5, page: 1 });
  // Auto-refresh data every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      // Trigger data refresh
      window.location.reload();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    window.location.reload();
  };

  const handleReviewRequests = () => {
    navigate('/admin/requests');
  };

  const handleManageDonors = () => {
    navigate('/admin/students');
  };

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
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <LoadingSpinner size="lg" />
        </motion.div>
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
      change: 'positive'
    },
    {
      title: 'Pending Review',
      value: stats?.pendingRequests || 0,
      icon: Clock,
      color: 'text-yellow-600 bg-yellow-100',
      trend: '+5%',
      change: 'neutral'
    },
    {
      title: 'Approved Today',
      value: stats?.approvedRequests || 0,
      icon: CheckCircle,
      color: 'text-green-600 bg-green-100',
      trend: '+8%',
      change: 'positive'
    },
    {
      title: 'Active Donors',
      value: stats?.availableStudents || 0,
      icon: Users,
      color: 'text-primary-600 bg-primary-100',
      trend: '+15%',
      change: 'positive'
    },
  ];

  // Colors for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28CF6', '#FF6699', '#FFB347', '#B6E880'];

  // Blood group distribution
  const bloodGroupData = (bloodGroupStats || []).map((group, idx) => ({
    name: group.bloodGroup,
    Available: group.availableStudents,
    Requests: group.totalRequests,
    fill: COLORS[idx % COLORS.length],
  }));

  // Donation summary
  const donationSummary = [
    { name: 'Total Donations', value: donationStats?.totalDonations || 0 },
    { name: 'Unique Donors', value: donationStats?.totalUniqueDonors || 0 },
    { name: 'Total Requests', value: donationStats?.totalRequests || 0 },
    { name: 'Units Donated', value: donationStats?.totalUnitsDonated || 0 },
  ];

  // Recent activity data
  const recentActivity = [
    { time: '2 min ago', action: 'New blood request', type: 'request', urgent: true },
    { time: '5 min ago', action: 'Donor assigned', type: 'assignment', urgent: false },
    { time: '10 min ago', action: 'Request approved', type: 'approval', urgent: false },
    { time: '15 min ago', action: 'Donation completed', type: 'completion', urgent: false },
  ];

  return (
    <div className={cn("w-full", className)}>
      {/* Header with refresh button */}
      <motion.div 
        className="mb-8 flex justify-between items-center"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600 text-lg">
            Monitor blood requests, manage donors, and save lives through efficient coordination.
          </p>
        </div>
        <Button
          onClick={handleRefresh}
          variant="outline"
          className="flex items-center space-x-2"
        >
          <RefreshCw className="h-4 w-4" />
          <span>Refresh</span>
        </Button>
      </motion.div>

      {/* Enhanced Stats Cards */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.1 + index * 0.1 }}
              whileHover={{ scale: 1.02, y: -2 }}
            >
              <Card hover className="relative overflow-hidden group border-2 border-gray-200/50 shadow-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={cn("p-4 rounded-xl transition-all duration-300 shadow-md", stat.color, "group-hover:scale-110 group-hover:shadow-lg")}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="ml-4 flex-1">
                      <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">{stat.title}</p>
                      <div className="flex items-baseline space-x-2 mt-1">
                        <p className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">{stat.value}</p>
                        <span className={cn(
                          "text-xs font-semibold flex items-center px-2 py-0.5 rounded-full",
                          stat.change === 'positive' ? 'bg-green-100 text-green-700' : 
                          stat.change === 'negative' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
                        )}>
                          <TrendingUp className="h-3 w-3 mr-1" />
                          {stat.trend}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Animated background */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              </Card>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Analytics Charts */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        {/* Blood Group Distribution */}
        <Card className="hover:shadow-xl transition-all duration-300 border-2 border-gray-200/50">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-200/50">
            <h2 className="text-xl font-bold text-gray-900">Blood Group Distribution</h2>
            <div className="p-2 bg-blue-100 rounded-lg">
              <BarChart3 className="h-5 w-5 text-blue-600" />
            </div>
          </div>
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

        {/* Donation Summary */}
        <Card className="hover:shadow-xl transition-all duration-300 border-2 border-gray-200/50">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-200/50">
            <h2 className="text-xl font-bold text-gray-900">Donation Summary</h2>
            <div className="p-2 bg-purple-100 rounded-lg">
              <PieChart className="h-5 w-5 text-purple-600" />
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <RechartsPieChart>
              <Pie
                data={donationSummary}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={70}
                label
              >
                {donationSummary.map((_, idx) => (
                  <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </RechartsPieChart>
          </ResponsiveContainer>
        </Card>

        {/* Recent Activity */}
        <Card className="hover:shadow-xl transition-all duration-300 border-2 border-gray-200/50">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-200/50">
            <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
            <div className="p-2 bg-green-100 rounded-lg">
              <Activity className="h-5 w-5 text-green-600" />
            </div>
          </div>
          <div className="space-y-3">
            {recentActivity.map((activity, index) => (
              <motion.div
                key={index}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className={cn(
                  "w-2 h-2 rounded-full",
                  activity.urgent ? "bg-red-500" : "bg-green-500"
                )} />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
                <Badge variant={activity.urgent ? "danger" : "success"} className="text-xs">
                  {activity.type}
                </Badge>
              </motion.div>
            ))}
          </div>
        </Card>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Requests */}
        <motion.div 
          className="lg:col-span-2"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Card className="hover:shadow-xl transition-all duration-300 border-2 border-gray-200/50">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200/50">
              <h2 className="text-2xl font-bold text-gray-900">Recent Blood Requests</h2>
              <Badge variant="info" size="md">{requests?.data?.length || 0} Pending</Badge>
            </div>
            
            <div className="space-y-4">
              {requests?.data?.map((request, index) => (
                <motion.div
                  key={request.id}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
                >
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-primary-100 rounded-full group-hover:scale-110 transition-transform">
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
                </motion.div>
              ))}
              
              {(!requests?.data || requests.data.length === 0) && (
                <div className="text-center py-8 text-gray-500">
                  <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No recent requests to display</p>
                </div>
              )}
            </div>
          </Card>

          {/* Quick Actions */}
          <Card className="mt-6 hover:shadow-xl transition-all duration-300 border-2 border-gray-200/50">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-3 border-b border-gray-200/50">Quick Actions</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <motion.button 
                onClick={handleReviewRequests}
                className="p-5 text-left bg-gradient-to-br from-primary-50 to-primary-100/50 hover:from-primary-100 hover:to-primary-200 rounded-xl transition-all duration-200 group border-2 border-primary-200/50 hover:border-primary-300 shadow-sm hover:shadow-md"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-primary-500 rounded-lg group-hover:scale-110 transition-transform">
                    <FileText className="h-5 w-5 text-white" />
                  </div>
                  <span className="font-semibold text-primary-700 text-base">Review Pending Requests</span>
                </div>
              </motion.button>
              
              <motion.button 
                onClick={handleManageDonors}
                className="p-5 text-left bg-gradient-to-br from-blue-50 to-blue-100/50 hover:from-blue-100 hover:to-blue-200 rounded-xl transition-all duration-200 group border-2 border-blue-200/50 hover:border-blue-300 shadow-sm hover:shadow-md"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-500 rounded-lg group-hover:scale-110 transition-transform">
                    <Users className="h-5 w-5 text-white" />
                  </div>
                  <span className="font-semibold text-blue-700 text-base">Manage Donors</span>
                </div>
              </motion.button>
              
              <motion.button
                onClick={handleDownloadReport}
                className="p-5 text-left bg-gradient-to-br from-green-50 to-green-100/50 hover:from-green-100 hover:to-green-200 rounded-xl transition-all duration-200 group border-2 border-green-200/50 hover:border-green-300 shadow-sm hover:shadow-md"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-500 rounded-lg group-hover:scale-110 transition-transform">
                    <Download className="h-5 w-5 text-white" />
                  </div>
                  <span className="font-semibold text-green-700 text-base">Download Report</span>
                </div>
              </motion.button>

              <motion.button
                onClick={() => navigate('/admin/certificates')}
                className="p-5 text-left bg-gradient-to-br from-purple-50 to-purple-100/50 hover:from-purple-100 hover:to-purple-200 rounded-xl transition-all duration-200 group border-2 border-purple-200/50 hover:border-purple-300 shadow-sm hover:shadow-md"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-purple-500 rounded-lg group-hover:scale-110 transition-transform">
                    <Award className="h-5 w-5 text-white" />
                  </div>
                  <span className="font-semibold text-purple-700 text-base">Manage Certificates</span>
                </div>
              </motion.button>
            </div>
          </Card>
        </motion.div>

        {/* Blood Group Statistics */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <Card className="hover:shadow-xl transition-all duration-300 border-2 border-gray-200/50">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-3 border-b border-gray-200/50">Blood Group Availability</h2>
            
            <div className="space-y-4">
              {bloodGroupStats?.map((group, index) => (
                <motion.div
                  key={group.bloodGroup}
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
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
                      <motion.div
                        className="bg-primary-600 h-1.5 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ 
                          width: `${Math.min(
                            (group.availableStudents / Math.max(group.totalRequests, 1)) * 100,
                            100
                          )}%`
                        }}
                        transition={{ duration: 1, delay: index * 0.1 }}
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
              
              {(!bloodGroupStats || bloodGroupStats.length === 0) && (
                <div className="text-center py-8 text-gray-500">
                  <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No blood group data available</p>
                </div>
              )}
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};