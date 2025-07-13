import React, { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, Link } from 'react-router-dom';
import { Heart, ArrowLeft, MapPin, Calendar, Clock, Droplets } from 'lucide-react';
import { Input } from '../../components/shared/Input';
import Select from '../../components/shared/Select';
import { Button } from '../../components/shared/Button';
import { Card } from '../../components/shared/Card';
import { useRequests } from '../../hooks/useRequests';
import { BLOOD_GROUPS } from '../../config/constants';

const schema = z.object({
  requestorName: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  bloodGroup: z.string().min(1, 'Blood group is required'),
  units: z.number().min(1, 'At least 1 unit is required').max(10, 'Maximum 10 units allowed'),
  dateTime: z.string().min(1, 'Date and time is required').refine((val) => {
    const date = new Date(val);
    const now = new Date();
    return date > now;
  }, 'Date and time must be in the future'),
  hospitalName: z.string().min(2, 'Hospital name is required'),
  location: z.string().min(5, 'Location must be at least 5 characters'),
  urgency: z.enum(['low', 'medium', 'high', 'critical']),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export const BloodRequestForm: React.FC = () => {
  const navigate = useNavigate();
  const { createRequest, isCreating } = useRequests();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitSuccessful },
    watch,
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      urgency: 'medium',
      units: 1,
    }
  });

  const watchUrgency = watch('urgency');

  // Memoized submit handler to prevent recreation on every render
  const onSubmit = useCallback(async (data: FormData) => {
    // Prevent double submission
    if (isSubmitting || isCreating || isSubmitSuccessful) {
      console.log('Submission blocked - already in progress or completed');
      return;
    }

    setIsSubmitting(true);
    
    try {
      console.log('Submitting form data:', data);
      
      // Format the data to match backend expectations
      const requestData = {
        requestorName: data.requestorName.trim(),
        email: data.email.trim().toLowerCase(),
        phone: data.phone.trim(),
        bloodGroup: data.bloodGroup,
        units: Number(data.units),
        dateTime: data.dateTime, // Keep as ISO string
        hospitalName: data.hospitalName.trim(),
        location: data.location.trim(),
        urgency: data.urgency,
        notes: data.notes?.trim() || undefined,
      };

      console.log('Formatted request data:', requestData);

      await createRequest(requestData, {
        onSuccess: () => {
          console.log('Request created successfully');
          // Reset form to prevent resubmission
          reset();
          navigate('/', { 
            state: { 
              message: 'Blood request submitted successfully! Our admin team will review and contact you soon.' 
            }
          });
        },
        onError: (error) => {
          console.error('Failed to create request:', error);
          setIsSubmitting(false);
        }
      });
    } catch (error) {
      console.error('Submit error:', error);
      setIsSubmitting(false);
    }
  }, [createRequest, navigate, reset, isSubmitting, isCreating, isSubmitSuccessful]);

  // Prevent form submission if already submitted
  const handleFormSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting || isCreating || isSubmitSuccessful) {
      console.log('Form submission prevented - already processing');
      return false;
    }
    
    handleSubmit(onSubmit)(e);
  }, [handleSubmit, onSubmit, isSubmitting, isCreating, isSubmitSuccessful]);

  const bloodGroupOptions = BLOOD_GROUPS.map(group => ({
    value: group,
    label: group
  }));

  const urgencyOptions = [
    { value: 'low', label: 'Low - Routine' },
    { value: 'medium', label: 'Medium - Within 24 hours' },
    { value: 'high', label: 'High - Within 12 hours' },
    { value: 'critical', label: 'Critical - Immediate' },
  ];

  const urgencyColors = {
    low: 'text-green-600 bg-green-50 border-green-200',
    medium: 'text-yellow-600 bg-yellow-50 border-yellow-200',
    high: 'text-orange-600 bg-orange-50 border-orange-200',
    critical: 'text-red-600 bg-red-50 border-red-200',
  };

  const isFormDisabled = isSubmitting || isCreating || isSubmitSuccessful;

  // Get minimum datetime (current time + 1 hour)
  const getMinDateTime = () => {
    const now = new Date();
    now.setHours(now.getHours() + 1);
    return now.toISOString().slice(0, 16);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
          
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-primary-100 rounded-full">
                <Heart className="h-8 w-8 text-primary-600" />
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Request Blood Donation
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Fill out the form below to submit your blood request. Our admin team will verify 
              and match you with eligible donors in your area.
            </p>
          </div>
        </div>

        {/* Success Message */}
        {isSubmitSuccessful && (
          <div className="max-w-2xl mx-auto mb-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-green-800 font-medium">
                ✅ Request submitted successfully! Redirecting...
              </p>
            </div>
          </div>
        )}

        {/* Form */}
        <Card className="max-w-2xl mx-auto">
          <form onSubmit={handleFormSubmit} className="space-y-6">
            {/* Personal Information */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <MapPin className="h-5 w-5 mr-2 text-primary-600" />
                Personal Information
              </h2>
              
              <div className="grid md:grid-cols-2 gap-4">
                <Input
                  label="Full Name"
                  {...register('requestorName')}
                  error={errors.requestorName?.message}
                  placeholder="Enter your full name"
                  disabled={isFormDisabled}
                  required
                />
                
                <Input
                  label="Email Address"
                  type="email"
                  {...register('email')}
                  error={errors.email?.message}
                  placeholder="your.email@example.com"
                  disabled={isFormDisabled}
                  required
                />
              </div>
              
              <Input
                label="Phone Number"
                type="tel"
                {...register('phone')}
                error={errors.phone?.message}
                placeholder="+91 9952810338"
                disabled={isFormDisabled}
                required
              />
            </div>

            {/* Blood Requirements */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Droplets className="h-5 w-5 mr-2 text-primary-600" />
                Blood Requirements
              </h2>
              
              <div className="grid md:grid-cols-2 gap-4">
                <Select
                  label="Blood Group Required"
                  options={bloodGroupOptions}
                  {...register('bloodGroup')}
                  error={errors.bloodGroup?.message}
                  disabled={isFormDisabled}
                  required
                />
                
                <Input
                  label="Number of Units"
                  type="number"
                  min="1"
                  max="10"
                  {...register('units', { valueAsNumber: true })}
                  error={errors.units?.message}
                  disabled={isFormDisabled}
                  required
                />
              </div>
              
              <Select
                label="Urgency Level"
                options={urgencyOptions}
                {...register('urgency')}
                error={errors.urgency?.message}
                disabled={isFormDisabled}
                required
              />
              
              {watchUrgency && (
                <div className={`p-3 rounded-lg border ${urgencyColors[watchUrgency]}`}>
                  <p className="text-sm font-medium">
                    {watchUrgency === 'critical' && '🚨 Critical: Immediate medical attention required'}
                    {watchUrgency === 'high' && '⚠️ High: Required within 12 hours'}
                    {watchUrgency === 'medium' && '📅 Medium: Required within 24 hours'}
                    {watchUrgency === 'low' && '📋 Low: Routine requirement, planned procedure'}
                  </p>
                </div>
              )}
            </div>

            {/* Location & Timing */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-primary-600" />
                Location & Timing
              </h2>
              
              <Input
                label="Date & Time Required"
                type="datetime-local"
                {...register('dateTime')}
                error={errors.dateTime?.message}
                min={getMinDateTime()}
                disabled={isFormDisabled}
                required
              />
              
              <Input
                label="Hospital Name"
                {...register('hospitalName')}
                error={errors.hospitalName?.message}
                placeholder="City General Hospital"
                disabled={isFormDisabled}
                required
              />
              
              <Input
                label="Pickup Location / Address"
                {...register('location')}
                error={errors.location?.message}
                placeholder="Full address including city and postal code"
                disabled={isFormDisabled}
                required
              />
            </div>

            {/* Additional Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Notes (Optional)
              </label>
              <textarea
                {...register('notes')}
                rows={4}
                disabled={isFormDisabled}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                placeholder="Any additional information that might help donors (e.g., medical condition, specific requirements, etc.)"
              />
              {errors.notes && (
                <p className="mt-1 text-sm text-red-600">{errors.notes.message}</p>
              )}
            </div>

            {/* Important Notice */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-medium text-blue-900 mb-2">Important Notice</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Your request will be reviewed by our medical admin team</li>
                <li>• Eligible donors will be notified automatically</li>
                <li>• You'll receive donor contact information once someone opts in</li>
                <li>• All donor information is verified and secure</li>
                <li>• Emergency requests are prioritized for faster matching</li>
              </ul>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center pt-4">
              <Button
                type="submit"
                size="lg"
                loading={isSubmitting || isCreating}
                disabled={isFormDisabled}
                className="w-full md:w-auto px-8"
              >
                {(isSubmitting || isCreating) ? 'Submitting Request...' : 'Submit Blood Request'}
              </Button>
            </div>

            {/* Debug info - Remove in production */}
            {process.env.NODE_ENV === 'development' && (
              <div className="text-xs text-gray-500 bg-gray-100 p-2 rounded">
                Debug: isSubmitting: {isSubmitting.toString()}, isCreating: {isCreating.toString()}, 
                isSubmitSuccessful: {isSubmitSuccessful.toString()}
              </div>
            )}
          </form>
        </Card>

        {/* Emergency Contact */}
        <div className="mt-8 text-center">
          <Card className="max-w-md mx-auto bg-red-50 border-red-200">
            <div className="text-center">
              <Clock className="h-8 w-8 text-red-600 mx-auto mb-2" />
              <h3 className="font-semibold text-red-900 mb-2">Emergency?</h3>
              <p className="text-sm text-red-800 mb-3">
                For critical situations requiring immediate blood, contact our emergency line:
              </p>
              <a
                href="tel:+15551234567"
                className="inline-flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                📞 +91 9952810338
              </a>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};