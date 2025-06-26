import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, ArrowLeft, Home } from 'lucide-react';
import { Button } from '../../components/shared/Button';
import { Card } from '../../components/shared/Card';

export const UnauthorizedPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <Card className="max-w-md w-full text-center">
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-red-100 rounded-full">
            <Shield className="h-12 w-12 text-red-600" />
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Access Denied
        </h1>
        
        <p className="text-gray-600 mb-8">
          You don't have permission to access this page. Please contact your administrator 
          if you believe this is an error.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/">
            <Button variant="outline" className="flex items-center">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
          </Link>
          
          <Link to="/">
            <Button className="flex items-center">
              <Home className="h-4 w-4 mr-2" />
              Home
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
};