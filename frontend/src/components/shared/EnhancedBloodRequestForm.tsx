import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { 
  Heart, 
  User, 
  MapPin, 
  AlertTriangle, 
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Shield,
  Zap
} from 'lucide-react';
import { Button } from './Button';
import { Input } from './Input';
import { Card } from './Card';
import { Badge } from './Badge';
import { cn } from '../../utils/cn';
import { BLOOD_GROUPS } from '../../config/constants';

const schema = z.object({
  requestorName: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  bloodGroup: z.string().min(1, 'Blood group is required'),
  units: z.number().min(1, 'At least 1 unit required').max(10, 'Maximum 10 units allowed'),
  dateTime: z.string().min(1, 'Date and time is required'),
  hospitalName: z.string().min(2, 'Hospital name is required'),
  location: z.string().min(5, 'Location must be at least 5 characters'),
  urgency: z.enum(['low', 'medium', 'high', 'critical']),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface EnhancedBloodRequestFormProps {
  onSubmit: (data: FormData) => void;
  isLoading?: boolean;
  className?: string;
}

export const EnhancedBloodRequestForm: React.FC<EnhancedBloodRequestFormProps> = ({
  onSubmit,
  isLoading = false,
  className
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isEmergency, setIsEmergency] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    trigger
  } = useForm<FormData>({
    defaultValues: {
      urgency: 'medium',
      units: 1
    }
  });

  const watchedValues = watch();

  const steps = [
    { id: 1, title: 'Personal Info', icon: User },
    { id: 2, title: 'Blood Details', icon: Heart },
    { id: 3, title: 'Location & Time', icon: MapPin },
    { id: 4, title: 'Review & Submit', icon: CheckCircle }
  ];

  const bloodGroupOptions = BLOOD_GROUPS.map(group => ({
    value: group,
    label: group
  }));

  const urgencyOptions = [
    { value: 'low', label: 'Low - Can wait 24-48 hours', color: 'text-green-600 bg-green-100' },
    { value: 'medium', label: 'Medium - Needs within 12-24 hours', color: 'text-yellow-600 bg-yellow-100' },
    { value: 'high', label: 'High - Needs within 6-12 hours', color: 'text-orange-600 bg-orange-100' },
    { value: 'critical', label: 'Critical - Emergency situation', color: 'text-red-600 bg-red-100' }
  ];

  const nextStep = async () => {
    const isValid = await trigger();
    if (isValid && currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleEmergencyToggle = () => {
    setIsEmergency(!isEmergency);
    if (!isEmergency) {
      setValue('urgency', 'critical');
    }
  };

  const getStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div className="text-center mb-6">
              <User className="h-12 w-12 mx-auto mb-4 text-primary-600" />
              <h2 className="text-2xl font-bold text-gray-900">Personal Information</h2>
              <p className="text-gray-600">Tell us about yourself</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Full Name"
                {...register('requestorName')}
                error={errors.requestorName?.message}
                placeholder="Enter your full name"
                required
              />
              
              <Input
                label="Email Address"
                type="email"
                {...register('email')}
                error={errors.email?.message}
                placeholder="your.email@example.com"
                required
              />
              
              <Input
                label="Phone Number"
                type="tel"
                {...register('phone')}
                error={errors.phone?.message}
                placeholder="+91 9876543210"
                required
              />
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div className="text-center mb-6">
              <Heart className="h-12 w-12 mx-auto mb-4 text-red-600" />
              <h2 className="text-2xl font-bold text-gray-900">Blood Requirements</h2>
              <p className="text-gray-600">Specify your blood needs</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Blood Group
                </label>
                <select
                  {...register('bloodGroup')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">Select blood group</option>
                  {bloodGroupOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {errors.bloodGroup && (
                  <p className="mt-1 text-sm text-red-600">{errors.bloodGroup.message}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Units
                </label>
                <select
                  {...register('units', { valueAsNumber: true })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                    <option key={num} value={num}>{num} unit{num > 1 ? 's' : ''}</option>
                  ))}
                </select>
                {errors.units && (
                  <p className="mt-1 text-sm text-red-600">{errors.units.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                Urgency Level
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {urgencyOptions.map((option) => (
                  <label
                    key={option.value}
                    className={cn(
                      "flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all",
                      watchedValues.urgency === option.value
                        ? "border-primary-500 bg-primary-50"
                        : "border-gray-200 hover:border-gray-300"
                    )}
                  >
                    <input
                      type="radio"
                      value={option.value}
                      {...register('urgency')}
                      className="sr-only"
                    />
                    <div className="flex items-center space-x-3">
                      <div className={cn("w-3 h-3 rounded-full", option.color.split(' ')[0])} />
                      <span className="text-sm font-medium">{option.label}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Emergency Toggle */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  <div>
                    <h3 className="font-medium text-red-900">Emergency Request</h3>
                    <p className="text-sm text-red-700">Check this if this is a life-threatening emergency</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleEmergencyToggle}
                  className={cn(
                    "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
                    isEmergency ? "bg-red-600" : "bg-gray-200"
                  )}
                >
                  <span
                    className={cn(
                      "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                      isEmergency ? "translate-x-6" : "translate-x-1"
                    )}
                  />
                </button>
              </div>
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div className="text-center mb-6">
              <MapPin className="h-12 w-12 mx-auto mb-4 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900">Location & Timing</h2>
              <p className="text-gray-600">Where and when do you need the blood?</p>
            </div>

            <div className="space-y-6">
              <Input
                label="Hospital/Clinic Name"
                {...register('hospitalName')}
                error={errors.hospitalName?.message}
                placeholder="Enter hospital or clinic name"
                required
              />
              
              <Input
                label="Location/Address"
                {...register('location')}
                error={errors.location?.message}
                placeholder="Enter full address"
                required
              />
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Required Date & Time
                </label>
                <input
                  type="datetime-local"
                  {...register('dateTime')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  min={new Date().toISOString().slice(0, 16)}
                />
                {errors.dateTime && (
                  <p className="mt-1 text-sm text-red-600">{errors.dateTime.message}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Notes (Optional)
                </label>
                <textarea
                  {...register('notes')}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Any additional information that might help donors..."
                />
              </div>
            </div>
          </motion.div>
        );

      case 4:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div className="text-center mb-6">
              <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-600" />
              <h2 className="text-2xl font-bold text-gray-900">Review & Submit</h2>
              <p className="text-gray-600">Please review your information before submitting</p>
            </div>

            <Card className="p-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium text-gray-900">Personal Information</h3>
                    <p className="text-sm text-gray-600">{watchedValues.requestorName}</p>
                    <p className="text-sm text-gray-600">{watchedValues.email}</p>
                    <p className="text-sm text-gray-600">{watchedValues.phone}</p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-gray-900">Blood Requirements</h3>
                    <p className="text-sm text-gray-600">{watchedValues.bloodGroup} - {watchedValues.units} unit{watchedValues.units > 1 ? 's' : ''}</p>
                    <Badge
                      variant={
                        watchedValues.urgency === 'critical' ? 'danger' :
                        watchedValues.urgency === 'high' ? 'warning' :
                        watchedValues.urgency === 'medium' ? 'info' : 'success'
                      }
                    >
                      {watchedValues.urgency} priority
                    </Badge>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium text-gray-900">Location & Timing</h3>
                  <p className="text-sm text-gray-600">{watchedValues.hospitalName}</p>
                  <p className="text-sm text-gray-600">{watchedValues.location}</p>
                  <p className="text-sm text-gray-600">
                    {new Date(watchedValues.dateTime).toLocaleString()}
                  </p>
                </div>
                
                {watchedValues.notes && (
                  <div>
                    <h3 className="font-medium text-gray-900">Additional Notes</h3>
                    <p className="text-sm text-gray-600">{watchedValues.notes}</p>
                  </div>
                )}
              </div>
            </Card>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h3 className="font-medium text-blue-900">Privacy & Security</h3>
                  <p className="text-sm text-blue-700 mt-1">
                    Your information is secure and will only be shared with verified donors after admin approval.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={cn("max-w-4xl mx-auto", className)}>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;
              
              return (
                <div key={step.id} className="flex items-center">
                  <div className="flex items-center">
                    <div className={cn(
                      "flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all",
                      isActive ? "border-primary-500 bg-primary-500 text-white" :
                      isCompleted ? "border-green-500 bg-green-500 text-white" :
                      "border-gray-300 bg-white text-gray-500"
                    )}>
                      {isCompleted ? (
                        <CheckCircle className="h-5 w-5" />
                      ) : (
                        <Icon className="h-5 w-5" />
                      )}
                    </div>
                    <div className="ml-3">
                      <p className={cn(
                        "text-sm font-medium",
                        isActive ? "text-primary-600" :
                        isCompleted ? "text-green-600" :
                        "text-gray-500"
                      )}>
                        {step.title}
                      </p>
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={cn(
                      "flex-1 h-0.5 mx-4",
                      isCompleted ? "bg-green-500" : "bg-gray-300"
                    )} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Step Content */}
        <Card className="p-8">
          <AnimatePresence mode="wait">
            {getStepContent()}
          </AnimatePresence>
        </Card>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <Button
            type="button"
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Previous</span>
          </Button>

          {currentStep < steps.length ? (
            <Button
              type="button"
              onClick={nextStep}
              className="flex items-center space-x-2"
            >
              <span>Next</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              type="submit"
              loading={isLoading}
              className="flex items-center space-x-2 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600"
            >
              <Zap className="h-4 w-4" />
              <span>Submit Request</span>
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};