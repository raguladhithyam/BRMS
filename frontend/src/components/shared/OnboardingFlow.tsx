import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, 
  Users, 
  Shield, 
  Zap, 
  CheckCircle, 
  ArrowRight, 
  ArrowLeft,
  Award,
  Clock,
  MapPin,
  Bell,
  FileText,
  X
} from 'lucide-react';
import { Button } from './Button';
import { Card } from './Card';

interface OnboardingStep {
  id: number;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  content: React.ReactNode;
}

interface OnboardingFlowProps {
  onComplete: () => void;
  onSkip: () => void;
  userRole?: 'admin' | 'student';
}

export const OnboardingFlow: React.FC<OnboardingFlowProps> = ({
  onComplete,
  onSkip,
  userRole = 'student'
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const studentSteps: OnboardingStep[] = [
    {
      id: 1,
      title: "Welcome to BloodConnect!",
      description: "You're about to join a community of life-savers",
      icon: Heart,
      content: (
        <div className="text-center space-y-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-20 h-20 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center mx-auto"
          >
            <Heart className="h-10 w-10 text-white" />
          </motion.div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to BloodConnect!</h2>
            <p className="text-gray-600">
              You're joining a community of compassionate students who are ready to save lives through blood donation.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-4 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">500+</div>
              <div className="text-sm text-gray-600">Active Donors</div>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">200+</div>
              <div className="text-sm text-gray-600">Lives Saved</div>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">50+</div>
              <div className="text-sm text-gray-600">Partner Hospitals</div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 2,
      title: "How BloodConnect Works",
      description: "Simple steps to save lives",
      icon: Zap,
      content: (
        <div className="space-y-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">How BloodConnect Works</h2>
            <p className="text-gray-600">It's simple and life-saving</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-center p-6 bg-blue-50 rounded-lg"
            >
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold mb-2">1. Blood Request</h3>
              <p className="text-sm text-gray-600">Someone needs blood and submits a request</p>
            </motion.div>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-center p-6 bg-green-50 rounded-lg"
            >
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bell className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold mb-2">2. Get Notified</h3>
              <p className="text-sm text-gray-600">You receive a notification if you match</p>
            </motion.div>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-center p-6 bg-purple-50 rounded-lg"
            >
              <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold mb-2">3. Save a Life</h3>
              <p className="text-sm text-gray-600">Donate blood and help save someone's life</p>
            </motion.div>
          </div>
        </div>
      )
    },
    {
      id: 3,
      title: "Your Dashboard",
      description: "Everything you need in one place",
      icon: Users,
      content: (
        <div className="space-y-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Dashboard</h2>
            <p className="text-gray-600">Everything you need to manage your donations</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <FileText className="h-5 w-5 text-blue-600" />
                </div>
                <h3 className="font-semibold">Blood Requests</h3>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                View and respond to blood requests that match your blood type
              </p>
              <div className="space-y-2">
                <div className="flex items-center text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  <span>See matching requests</span>
                </div>
                <div className="flex items-center text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  <span>Opt-in to help</span>
                </div>
                <div className="flex items-center text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  <span>Track your responses</span>
                </div>
              </div>
            </Card>
            <Card className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <Award className="h-5 w-5 text-green-600" />
                </div>
                <h3 className="font-semibold">Certificates</h3>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Earn certificates for your donations and track your impact
              </p>
              <div className="space-y-2">
                <div className="flex items-center text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  <span>Download certificates</span>
                </div>
                <div className="flex items-center text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  <span>Track donation history</span>
                </div>
                <div className="flex items-center text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  <span>View achievements</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )
    },
    {
      id: 4,
      title: "Safety & Privacy",
      description: "Your safety and privacy are our priority",
      icon: Shield,
      content: (
        <div className="space-y-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Safety & Privacy</h2>
            <p className="text-gray-600">Your safety and privacy are our top priorities</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6 border-l-4 border-l-green-500">
              <div className="flex items-center space-x-3 mb-4">
                <Shield className="h-6 w-6 text-green-600" />
                <h3 className="font-semibold text-green-900">Verified System</h3>
              </div>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  All requests verified by admin team
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Secure donor matching system
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Medical eligibility checks
                </li>
              </ul>
            </Card>
            <Card className="p-6 border-l-4 border-l-blue-500">
              <div className="flex items-center space-x-3 mb-4">
                <Users className="h-6 w-6 text-blue-600" />
                <h3 className="font-semibold text-blue-900">Privacy Protection</h3>
              </div>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-blue-500 mr-2" />
                  Contact info shared only after admin approval
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-blue-500 mr-2" />
                  Secure data encryption
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-blue-500 mr-2" />
                  No spam or unwanted contacts
                </li>
              </ul>
            </Card>
          </div>
        </div>
      )
    },
    {
      id: 5,
      title: "You're All Set!",
      description: "Ready to start saving lives",
      icon: CheckCircle,
      content: (
        <div className="text-center space-y-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-20 h-20 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto"
          >
            <CheckCircle className="h-10 w-10 text-white" />
          </motion.div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">You're All Set!</h2>
            <p className="text-gray-600">
              You're now ready to start saving lives. We'll notify you when there are blood requests that match your blood type.
            </p>
          </div>
          <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-lg p-6">
            <h3 className="font-semibold text-gray-900 mb-2">Quick Tips for Success</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
              <div className="flex items-start space-x-3">
                <Clock className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-sm">Quick Response</h4>
                  <p className="text-xs text-gray-600">Respond quickly to increase your chances</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-sm">Location Matters</h4>
                  <p className="text-xs text-gray-600">Consider distance when opting in</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Bell className="h-5 w-5 text-purple-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-sm">Stay Notified</h4>
                  <p className="text-xs text-gray-600">Keep notifications enabled</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Heart className="h-5 w-5 text-red-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-sm">Be Ready</h4>
                  <p className="text-xs text-gray-600">Ensure you're eligible to donate</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    }
  ];

  const adminSteps: OnboardingStep[] = [
    {
      id: 1,
      title: "Admin Dashboard",
      description: "Manage the blood donation system",
      icon: Users,
      content: (
        <div className="text-center space-y-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto"
          >
            <Users className="h-10 w-10 text-white" />
          </motion.div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to Admin Dashboard</h2>
            <p className="text-gray-600">
              You have full access to manage blood requests, donors, and the entire system.
            </p>
          </div>
        </div>
      )
    },
    // Add more admin-specific steps...
  ];

  const steps = userRole === 'admin' ? adminSteps : studentSteps;

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCompletedSteps([...completedSteps, currentStep]);
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const skipOnboarding = () => {
    onSkip();
  };

  const currentStepData = steps[currentStep];
  const Icon = currentStepData.icon;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                <Icon className="h-5 w-5 text-primary-600" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">{currentStepData.title}</h1>
                <p className="text-sm text-gray-600">{currentStepData.description}</p>
              </div>
            </div>
            <button
              onClick={skipOnboarding}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                Step {currentStep + 1} of {steps.length}
              </span>
              <span className="text-sm text-gray-500">
                {Math.round(((currentStep + 1) / steps.length) * 100)}% Complete
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                className="bg-primary-500 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {currentStepData.content}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 0}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Previous</span>
            </Button>
            
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                onClick={skipOnboarding}
              >
                Skip Tour
              </Button>
              <Button
                onClick={nextStep}
                className="flex items-center space-x-2"
              >
                <span>{currentStep === steps.length - 1 ? 'Get Started' : 'Next'}</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};