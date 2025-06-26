import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Heart, ArrowLeft } from 'lucide-react';
import { Input } from '../../components/shared/Input';
import { Button } from '../../components/shared/Button';
import { Card } from '../../components/shared/Card';
import { useAuth } from '../../hooks/useAuth';

const schema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type FormData = z.infer<typeof schema>;

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoginLoading } = useAuth();

  const from = location.state?.from?.pathname || '/';

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: FormData) => {
    login(data, {
      onSuccess: (response) => {
        const redirectPath = response.user.role === 'admin' ? '/admin' : '/student';
        navigate(redirectPath);
      }
    });
  };

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
              <Heart className="h-8 w-8 text-primary-600" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome Back
          </h2>
          <p className="text-gray-600">
            Sign in to your BloodConnect account
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Input
              label="Email Address"
              type="email"
              {...register('email')}
              error={errors.email?.message}
              placeholder="your.email@example.com"
              required
            />
            
            <Input
              label="Password"
              type="password"
              {...register('password')}
              error={errors.password?.message}
              placeholder="Enter your password"
              required
            />

            <Button
              type="submit"
              loading={isLoginLoading}
              className="w-full"
            >
              Sign In
            </Button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">New to BloodConnect?</span>
              </div>
            </div>

            <div className="mt-6">
              <Link to="/register">
                <Button variant="outline" className="w-full">
                  Create Student Account
                </Button>
              </Link>
            </div>
          </div>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="text-sm font-medium text-blue-900 mb-2">Demo Credentials</h3>
            <div className="text-xs text-blue-800 space-y-1">
              <div>
                <strong>Admin:</strong> admin@bloodconnect.org / admin123
              </div>
              <div>
                <strong>Student:</strong> student@university.edu / student123
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};