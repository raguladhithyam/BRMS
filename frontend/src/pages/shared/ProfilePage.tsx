import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { User, Settings, Heart, Phone, Mail, Calendar, Shield, Clock, Eye } from 'lucide-react';
import { Card } from '../../components/shared/Card';
import { Button } from '../../components/shared/Button';
import { Input } from '../../components/shared/Input';
import Select from '../../components/shared/Select';
import { Badge } from '../../components/shared/Badge';
import { Modal } from '../../components/shared/Modal';
import { useAuth } from '../../hooks/useAuth';
import { authApi } from '../../api/auth';
import { BLOOD_GROUPS } from '../../config/constants';
import { format, addMonths } from 'date-fns';
import toast from 'react-hot-toast';

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits').optional(),
  bloodGroup: z.string().optional(),
  rollNo: z.string().optional(),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(6, 'New password must be at least 6 characters'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type ProfileFormData = z.infer<typeof profileSchema>;
type PasswordFormData = z.infer<typeof passwordSchema>;

export const ProfilePage: React.FC = () => {
  const { user, updateProfile, isUpdateLoading } = useAuth();
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showLoginHistoryModal, setShowLoginHistoryModal] = useState(false);
  const [loginHistory, setLoginHistory] = useState<any[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      bloodGroup: user?.bloodGroup || '',
      rollNo: user?.rollNo || '',
    }
  });

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors },
    reset: resetPassword,
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  });

  const onSubmit = (data: ProfileFormData) => {
    updateProfile(data);
  };

  const onPasswordSubmit = async (data: PasswordFormData) => {
    setIsChangingPassword(true);
    try {
      await authApi.changePassword(data.currentPassword, data.newPassword);
      toast.success('Password changed successfully!');
      setShowPasswordModal(false);
      resetPassword();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to change password');
    } finally {
      setIsChangingPassword(false);
    }
  };

  const loadLoginHistory = async () => {
    setIsLoadingHistory(true);
    try {
      const response = await authApi.getLoginHistory({ limit: 20 });
      setLoginHistory(response.data);
      setShowLoginHistoryModal(true);
    } catch (error) {
      toast.error('Failed to load login history');
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const bloodGroupOptions = BLOOD_GROUPS.map(group => ({
    value: group,
    label: group
  }));

  const getNextDonationDate = () => {
    if (!user?.lastDonationDate) return null;
    return addMonths(new Date(user.lastDonationDate), 3);
  };

  const isEligibleForDonation = () => {
    if (!user?.lastDonationDate) return true;
    const nextDate = getNextDonationDate();
    return nextDate ? new Date() >= nextDate : true;
  };

  const nextDonationDate = getNextDonationDate();
  const eligible = isEligibleForDonation();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
          <Settings className="h-8 w-8 mr-3 text-primary-600" />
          Profile Settings
        </h1>
        <p className="text-gray-600">
          Manage your account information and preferences.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Profile Information */}
        <div className="lg:col-span-2">
          <Card>
            <div className="flex items-center mb-6">
              <User className="h-6 w-6 mr-2 text-primary-600" />
              <h2 className="text-xl font-semibold text-gray-900">Personal Information</h2>
            </div>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <Input
                  label="Full Name"
                  {...register('name')}
                  error={errors.name?.message}
                  required
                />
                
                <Input
                  label="Email Address"
                  type="email"
                  {...register('email')}
                  error={errors.email?.message}
                  required
                />
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <Input
                  label="Phone Number"
                  type="tel"
                  {...register('phone')}
                  error={errors.phone?.message}
                />
                
                {user?.role === 'student' && (
                  <Input
                    label="Roll Number"
                    {...register('rollNo')}
                    error={errors.rollNo?.message}
                  />
                )}
              </div>
              
              {user?.role === 'student' && (
                <Select
                  label="Blood Group"
                  options={bloodGroupOptions}
                  {...register('bloodGroup')}
                  error={errors.bloodGroup?.message}
                />
              )}
              
              <div className="flex justify-end">
                <Button
                  type="submit"
                  loading={isUpdateLoading}
                >
                  Update Profile
                </Button>
              </div>
            </form>
          </Card>
        </div>

        {/* Profile Summary & Settings */}
        <div className="space-y-6">
          {/* Profile Summary */}
          <Card>
            <div className="text-center">
              <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="h-10 w-10 text-primary-600" />
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                {user?.name}
              </h3>
              
              <Badge variant="secondary" className="mb-3 capitalize">
                {user?.role}
              </Badge>
              
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center justify-center">
                  <Mail className="h-4 w-4 mr-2" />
                  {user?.email}
                </div>
                
                {user?.phone && (
                  <div className="flex items-center justify-center">
                    <Phone className="h-4 w-4 mr-2" />
                    {user.phone}
                  </div>
                )}
                
                <div className="flex items-center justify-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  Joined {format(new Date(user?.createdAt || ''), 'MMM yyyy')}
                </div>
              </div>
            </div>
          </Card>

          {/* Student-specific Settings */}
          {user?.role === 'student' && (
            <Card>
              <div className="flex items-center mb-4">
                <Heart className="h-5 w-5 mr-2 text-primary-600" />
                <h3 className="text-lg font-semibold text-gray-900">Donor Status</h3>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Blood Group</p>
                    <p className="text-sm text-gray-600">Your blood type for matching</p>
                  </div>
                  <Badge variant="primary">{user.bloodGroup}</Badge>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Donation Eligibility</p>
                    <p className="text-sm text-gray-600">
                      {eligible ? 'Ready to donate' : 'Must wait 3 months between donations'}
                    </p>
                  </div>
                  <Badge variant={eligible ? 'success' : 'warning'}>
                    {eligible ? 'Eligible' : 'Not Eligible'}
                  </Badge>
                </div>

                {user.lastDonationDate && (
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm font-medium text-blue-900">Last Donation</p>
                    <p className="text-sm text-blue-700">
                      {format(new Date(user.lastDonationDate), 'MMMM dd, yyyy')}
                    </p>
                    {!eligible && nextDonationDate && (
                      <p className="text-xs text-blue-600 mt-1">
                        Next eligible: {format(nextDonationDate, 'MMMM dd, yyyy')}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </Card>
          )}

          {/* Account Security */}
          <Card>
            <div className="flex items-center mb-4">
              <Shield className="h-5 w-5 mr-2 text-primary-600" />
              <h3 className="text-lg font-semibold text-gray-900">Account Security</h3>
            </div>
            
            <div className="space-y-3">
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => setShowPasswordModal(true)}
              >
                <Shield className="h-4 w-4 mr-2" />
                Change Password
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={loadLoginHistory}
                loading={isLoadingHistory}
              >
                <Clock className="h-4 w-4 mr-2" />
                Login History
              </Button>
            </div>
          </Card>

          {/* Danger Zone */}
          <Card className="border-red-200">
            <h3 className="text-lg font-semibold text-red-900 mb-4">Danger Zone</h3>
            
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start text-red-600 border-red-300 hover:bg-red-50">
                Deactivate Account
              </Button>
              
              <Button variant="danger" className="w-full justify-start">
                Delete Account
              </Button>
            </div>
            
            <p className="text-xs text-red-600 mt-2">
              These actions cannot be undone. Please be certain.
            </p>
          </Card>
        </div>
      </div>

      {/* Change Password Modal */}
      <Modal
        isOpen={showPasswordModal}
        onClose={() => {
          setShowPasswordModal(false);
          resetPassword();
        }}
        title="Change Password"
      >
        <form onSubmit={handlePasswordSubmit(onPasswordSubmit)} className="space-y-4">
          <Input
            label="Current Password"
            type="password"
            {...registerPassword('currentPassword')}
            error={passwordErrors.currentPassword?.message}
            required
          />
          
          <Input
            label="New Password"
            type="password"
            {...registerPassword('newPassword')}
            error={passwordErrors.newPassword?.message}
            required
          />
          
          <Input
            label="Confirm New Password"
            type="password"
            {...registerPassword('confirmPassword')}
            error={passwordErrors.confirmPassword?.message}
            required
          />
          
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setShowPasswordModal(false);
                resetPassword();
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={isChangingPassword}
            >
              Change Password
            </Button>
          </div>
        </form>
      </Modal>

      {/* Login History Modal */}
      <Modal
        isOpen={showLoginHistoryModal}
        onClose={() => setShowLoginHistoryModal(false)}
        title="Login History"
        size="lg"
      >
        <div className="space-y-4">
          {loginHistory.length > 0 ? (
            loginHistory.map((session) => (
              <div
                key={session.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-full ${session.isActive ? 'bg-green-100' : 'bg-gray-100'}`}>
                    <Eye className={`h-4 w-4 ${session.isActive ? 'text-green-600' : 'text-gray-600'}`} />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {format(new Date(session.loginTime), 'MMM dd, yyyy HH:mm')}
                    </p>
                    <p className="text-sm text-gray-600">
                      {session.ipAddress} • {session.userAgent.split(' ')[0]}
                    </p>
                    {session.logoutTime && (
                      <p className="text-xs text-gray-500">
                        Logged out: {format(new Date(session.logoutTime), 'MMM dd, yyyy HH:mm')}
                      </p>
                    )}
                  </div>
                </div>
                <Badge variant={session.isActive ? 'success' : 'secondary'}>
                  {session.isActive ? 'Active' : 'Ended'}
                </Badge>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Clock className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No login history available</p>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};