import React, { useState } from 'react';
import { Bell, Check, CheckCheck, Trash2, Filter, Search } from 'lucide-react';
import { Card } from '../../components/shared/Card';
import { Button } from '../../components/shared/Button';
import { Input } from '../../components/shared/Input';
import Select from '../../components/shared/Select';
import { Badge } from '../../components/shared/Badge';
import { LoadingSpinner } from '../../components/shared/LoadingSpinner';
import { EmptyState } from '../../components/shared/EmptyState';
import { useNotifications } from '../../hooks/useNotifications';
import { format } from 'date-fns';
import { cn } from '../../utils/cn';

export const NotificationsPage: React.FC = () => {
  const [filters, setFilters] = useState({
    unreadOnly: false,
    search: '',
  });

  const {
    notifications,
    isLoading,
    markAsRead,
    markAllAsRead,
  } = useNotifications(filters);

  const { markAsRead: markSingleAsRead } = useNotifications();

  const handleMarkAsRead = (id: string) => {
    markSingleAsRead(id);
  };

  const handleMarkAllAsRead = () => {
    markAllAsRead();
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'request_created':
        return '🩸';
      case 'request_approved':
        return '✅';
      case 'student_opted_in':
        return '🙋‍♂️';
      case 'donor_assigned':
        return '🤝';
      default:
        return '📢';
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'request_created':
        return 'border-l-red-500';
      case 'request_approved':
        return 'border-l-green-500';
      case 'student_opted_in':
        return 'border-l-blue-500';
      case 'donor_assigned':
        return 'border-l-purple-500';
      default:
        return 'border-l-gray-500';
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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
            <Bell className="h-8 w-8 mr-3 text-primary-600" />
            Notifications
          </h1>
          <p className="text-gray-600">
            Stay updated with blood requests, approvals, and donor responses.
          </p>
        </div>
        
        {notifications?.data && notifications.data.some(n => !n.read) && (
          <Button
            variant="outline"
            onClick={handleMarkAllAsRead}
            className="flex items-center"
          >
            <CheckCheck className="h-4 w-4 mr-2" />
            Mark All Read
          </Button>
        )}
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search notifications..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="unreadOnly"
              checked={filters.unreadOnly}
              onChange={(e) => setFilters({ ...filters, unreadOnly: e.target.checked })}
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <label htmlFor="unreadOnly" className="text-sm font-medium text-gray-700">
              Unread only
            </label>
          </div>
        </div>
      </Card>

      {/* Notifications List */}
      <div className="space-y-4">
        {notifications?.data && notifications.data.length > 0 ? (
          notifications.data.map((notification) => (
            <Card
              key={notification.id}
              className={cn(
                "border-l-4 transition-all duration-200",
                getNotificationColor(notification.type),
                !notification.read && "bg-blue-50 border-blue-200"
              )}
              hover
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  <div className="text-2xl">
                    {getNotificationIcon(notification.type)}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-semibold text-gray-900">
                        {notification.title}
                      </h3>
                      {!notification.read && (
                        <Badge variant="primary" size="sm">New</Badge>
                      )}
                    </div>
                    
                    <p className="text-gray-700 mb-2">
                      {notification.message}
                    </p>
                    
                    <p className="text-sm text-gray-500">
                      {format(new Date(notification.createdAt), 'MMM dd, yyyy HH:mm')}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 ml-4">
                  {!notification.read && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleMarkAsRead(notification.id)}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))
        ) : (
          <EmptyState
            icon={<Bell className="h-12 w-12" />}
            title="No Notifications"
            description={
              filters.unreadOnly 
                ? "You have no unread notifications at the moment."
                : "You haven't received any notifications yet. We'll notify you about blood requests and updates."
            }
          />
        )}
      </div>

      {/* Load More */}
      {notifications?.data && notifications.data.length > 0 && notifications.totalPages > 1 && (
        <div className="mt-8 text-center">
          <Button variant="outline">
            Load More Notifications
          </Button>
        </div>
      )}
    </div>
  );
};