import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { User, Settings, Heart, Phone, Mail, Calendar } from 'lucide-react';
import { Card } from '../../components/shared/Card';
import { Button } from '../../components/shared/Button';
import { Input } from '../../components/shared/Input';
import Select from '../../components/shared/Select';
import { Badge } from '../../components/shared/Badge';
import { useAuth } from '../../hooks/useAuth';
import { useStudentProfile } from '../../hooks/useStudents';
import { BLOOD_GROUPS } from '../../config/constants';
import { format } from 'date-fns';

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits').optional(),
  bloodGroup: z.string().optional(),
  rollNo: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export const ProfilePage: React.FC = () => {
  const { user, updateProfile, isUpdateLoading } = useAuth();
  const { updateAvailability, isUpdatingAvailability } = useStudentProfile();

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

  const onSubmit = (data: ProfileFormData) => {
    updateProfile(data);
  };

  const handleToggleAvailability = () => {
    if (user) {
      updateAvailability(!user.availability);
    }
  };

  const bloodGroupOptions = BLOOD_GROUPS.map(group => ({
    value: group,
    label: group
  }));

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
                <h3 className="text-lg font-semibold text-gray-900">Donor Settings</h3>
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
                    <p className="font-medium text-gray-900">Availability Status</p>
                    <p className="text-sm text-gray-600">
                      {user.availability ? 'Ready to donate' : 'Currently unavailable'}
                    </p>
                  </div>
                  <Badge variant={user.availability ? 'success' : 'danger'}>
                    {user.availability ? 'Available' : 'Unavailable'}
                  </Badge>
                </div>
                
                <Button
                  onClick={handleToggleAvailability}
                  loading={isUpdatingAvailability}
                  variant={user.availability ? 'outline' : 'primary'}
                  className="w-full"
                >
                  {user.availability ? 'Mark as Unavailable' : 'Mark as Available'}
                </Button>
              </div>
            </Card>
          )}

          {/* Account Security */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Security</h3>
            
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                Change Password
              </Button>
              
              <Button variant="outline" className="w-full justify-start">
                Two-Factor Authentication
              </Button>
              
              <Button variant="outline" className="w-full justify-start">
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
    </div>
  );
};