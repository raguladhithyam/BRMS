import React, { useState } from 'react';
import { useLogs } from '../../hooks/useLogs';
import { Card } from '../../components/shared/Card';
import { Button } from '../../components/shared/Button';
import { Input } from '../../components/shared/Input';
import { Select } from '../../components/shared/Select';
import { Badge } from '../../components/shared/Badge';
import { LoadingSpinner } from '../../components/shared/LoadingSpinner';
import { EmptyState } from '../../components/shared/EmptyState';
import { format } from 'date-fns';
import { 
  RefreshCw, 
  Download, 
  Search, 
  Filter, 
  Calendar,
  User,
  Monitor,
  Clock,
  Activity
} from 'lucide-react';

const LEVEL_OPTIONS = [
  { value: '', label: 'All Levels' },
  { value: 'INFO', label: 'Info' },
  { value: 'ERROR', label: 'Error' },
  { value: 'WARN', label: 'Warn' },
  { value: 'DEBUG', label: 'Debug' },
];

const AdminLogs: React.FC = () => {
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  
  const {
    logs,
    stats,
    pagination,
    isLoading,
    isExporting,
    error,
    filters,
    updateFilters,
    clearFilters,
    goToPage,
    refresh,
    exportLogs,
  } = useLogs(autoRefresh, 30000); // 30 seconds refresh interval

  const handleFilterChange = (key: string, value: string) => {
    updateFilters({ [key]: value });
  };

  const handleDateChange = (key: string, value: string) => {
    updateFilters({ [key]: value });
  };

  const formatTime = (timestamp: string) => {
    return format(new Date(timestamp), 'dd/MM/yyyy, hh:mm:ss a');
  };

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <div className="text-center py-8">
            <h2 className="text-xl font-semibold text-red-600 mb-2">Error Loading Logs</h2>
            <p className="text-gray-600 mb-4">
              {error instanceof Error ? error.message : 'An unexpected error occurred'}
            </p>
            <Button onClick={refresh} variant="primary">
              <RefreshCw className="w-4 h-4 mr-2" />
              Retry
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">System Logs</h1>
          <p className="text-gray-600 mt-1">Monitor user and system activities</p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => setAutoRefresh(!autoRefresh)}
            variant={autoRefresh ? "primary" : "secondary"}
            size="sm"
          >
            <Activity className="w-4 h-4 mr-2" />
            {autoRefresh ? 'Auto-refresh ON' : 'Auto-refresh OFF'}
          </Button>
          <Button onClick={refresh} variant="secondary" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <Card>
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Monitor className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Logs</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalLogs}</p>
              </div>
            </div>
          </Card>
          <Card>
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Clock className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Info</p>
                <p className="text-2xl font-bold text-gray-900">{stats.infoLogs}</p>
              </div>
            </div>
          </Card>
          <Card>
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Badge variant="warning">WARN</Badge>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Warnings</p>
                <p className="text-2xl font-bold text-gray-900">{stats.warnLogs}</p>
              </div>
            </div>
          </Card>
          <Card>
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <Badge variant="danger">ERROR</Badge>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Errors</p>
                <p className="text-2xl font-bold text-gray-900">{stats.errorLogs}</p>
              </div>
            </div>
          </Card>
          <Card>
            <div className="flex items-center">
              <div className="p-2 bg-gray-100 rounded-lg">
                <Badge variant="secondary">DEBUG</Badge>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Debug</p>
                <p className="text-2xl font-bold text-gray-900">{stats.debugLogs}</p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Filters and Actions */}
      <Card className="mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => setShowFilters(!showFilters)}
              variant="secondary"
              size="sm"
            >
              <Filter className="w-4 h-4 mr-2" />
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </Button>
            {showFilters && (
              <Button onClick={clearFilters} variant="outline" size="sm">
                Clear Filters
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => exportLogs('json')}
              disabled={isExporting}
              variant="secondary"
              size="sm"
            >
              <Download className="w-4 h-4 mr-2" />
              Export JSON
            </Button>
            <Button
              onClick={() => exportLogs('csv')}
              disabled={isExporting}
              variant="secondary"
              size="sm"
            >
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </div>
        {/* Filter Form */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Level
                </label>
                <Select
                  value={filters.level || ''}
                  onChange={e => handleFilterChange('level', e.target.value)}
                  options={LEVEL_OPTIONS}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  User
                </label>
                <Input
                  placeholder="Filter by user..."
                  value={filters.user || ''}
                  onChange={e => handleFilterChange('user', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <Input
                  type="date"
                  value={filters.startDate || ''}
                  onChange={e => handleDateChange('startDate', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date
                </label>
                <Input
                  type="date"
                  value={filters.endDate || ''}
                  onChange={e => handleDateChange('endDate', e.target.value)}
                />
              </div>
              <div className="md:col-span-2 lg:col-span-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Search
                </label>
                <Input
                  placeholder="Search logs..."
                  value={filters.search || ''}
                  onChange={e => handleFilterChange('search', e.target.value)}
                />
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Logs Table */}
      <Card>
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <LoadingSpinner />
          </div>
        ) : logs.length === 0 ? (
          <EmptyState
            icon={<Monitor className="w-12 h-12" />}
            title="No logs found"
            description="No system logs match your current filters."
            action={
              <Button onClick={clearFilters} variant="primary">
                Clear Filters
              </Button>
            }
          />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Level
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Message
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {logs.map((log) => (
                    <tr key={log.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatTime(log.timestamp)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <Badge variant={
                          log.level === 'ERROR' ? 'danger' :
                          log.level === 'WARN' ? 'warning' :
                          log.level === 'DEBUG' ? 'secondary' : 'info'
                        }>
                          {log.level}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {log.user}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {log.message}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-3 border-t border-gray-200">
                <div className="text-sm text-gray-700">
                  Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
                  {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
                  {pagination.total} results
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => goToPage(pagination.page - 1)}
                    disabled={pagination.page <= 1}
                    variant="outline"
                    size="sm"
                  >
                    Previous
                  </Button>
                  <span className="flex items-center px-3 py-2 text-sm text-gray-700">
                    Page {pagination.page} of {pagination.totalPages}
                  </span>
                  <Button
                    onClick={() => goToPage(pagination.page + 1)}
                    disabled={pagination.page >= pagination.totalPages}
                    variant="outline"
                    size="sm"
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </Card>
    </div>
  );
};

export default AdminLogs; 