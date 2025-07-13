import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, ArrowLeft, UserPlus } from 'lucide-react';
import { Input } from '../../components/shared/Input';
import Select from '../../components/shared/Select';
import { Button } from '../../components/shared/Button';
import { Card } from '../../components/shared/Card';
import { useAuth } from '../../hooks/useAuth';
import { BLOOD_GROUPS } from '../../config/constants';

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  bloodGroup: z.string().min(1, 'Blood group is required'),
  rollNo: z.string().min(1, 'Roll number is required'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
});

type FormData = z.infer<typeof schema>;

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { register: registerUser, isRegisterLoading } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: FormData) => {
    registerUser(
      { ...data, role: 'student' },
      {
        onSuccess: () => {
          navigate('/student');
        }
      }
    );
  };

  const bloodGroupOptions = BLOOD_GROUPS.map(group => ({
    value: group,
    label: group
  }));

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Back to Home */}
        <Link
          to="/"
          className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Link>

        {/* Logo and Title */}
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-primary-100 rounded-full">
              <UserPlus className="h-8 w-8 text-primary-600" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Join as Student Donor
          </h2>
          <p className="text-gray-600">
            Create your account to help save lives in your community
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Input
              label="Full Name"
              {...register('name')}
              error={errors.name?.message}
              placeholder="Enter your full name"
              required
            />
            
            <Input
              label="Email Address"
              type="email"
              {...register('email')}
              error={errors.email?.message}
              placeholder="your.email@university.edu"
              required
            />

            <div className="grid grid-cols-2 gap-4">
              <Select
                label="Blood Group"
                options={bloodGroupOptions}
                {...register('bloodGroup')}
                error={errors.bloodGroup?.message}
                required
              />
              
              <Input
                label="Roll Number"
                {...register('rollNo')}
                error={errors.rollNo?.message}
                placeholder="CS2021001"
                required
              />
            </div>
            
            <Input
              label="Phone Number"
              type="tel"
              {...register('phone')}
              error={errors.phone?.message}
              placeholder="+91 9952810338"
              required
            />

            {/* Info about password email */}
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-800">
                After registration, you will receive a temporary password by email. Please check your inbox and use the credentials to log in.
              </p>
            </div>

            {/* Terms and Conditions */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-xs text-gray-600">
                By creating an account, you agree to:
              </p>
              <ul className="text-xs text-gray-600 mt-2 space-y-1">
                <li>• Provide accurate medical information</li>
                <li>• Be available for blood donation when possible</li>
                <li>• Follow all safety and screening protocols</li>
                <li>• Maintain updated contact information</li>
              </ul>
            </div>

            <Button
              type="submit"
              loading={isRegisterLoading}
              className="w-full"
            >
              Create Student Account
            </Button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Already have an account?</span>
              </div>
            </div>

            <div className="mt-6">
              <Link to="/login">
                <Button variant="outline" className="w-full">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </Card>

        {/* Important Notice */}
        <div className="mt-6">
          <Card className="bg-blue-50 border-blue-200">
            <div className="flex items-start space-x-3">
              <Heart className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h3 className="text-sm font-medium text-blue-900">
                  Student Donor Benefits
                </h3>
                <p className="text-xs text-blue-800 mt-1">
                  Join a community of student heroes, get priority notifications for matching blood types, 
                  and help save lives in your local area through our verified platform.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};