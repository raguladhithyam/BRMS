import React, { useState } from 'react';
import { Camera, Upload, X, AlertCircle } from 'lucide-react';
import { Modal } from './Modal';
import { Button } from './Button';
import { Input } from './Input';

interface DonationCompletionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (geotagPhoto: File) => void;
  isLoading?: boolean;
}

export const DonationCompletionModal: React.FC<DonationCompletionModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
}) => {
  const [geotagPhoto, setGeotagPhoto] = useState<File | null>(null);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!geotagPhoto) {
      setError('Please upload a geotagged photo');
      return;
    }

    setError('');
    onSubmit(geotagPhoto);
  };

  const handleClose = () => {
    setGeotagPhoto(null);
    setError('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="md">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <Camera className="h-5 w-5 mr-2 text-red-500" />
            Complete Donation
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <p className="text-sm text-gray-600 mb-4">
              To complete your donation, please provide a geotagged photo as proof of your donation location. 
              This helps verify the donation process and maintain transparency.
            </p>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-blue-700">
                  <p className="font-medium mb-1">How to get a geotagged photo:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Take a photo at the donation center/hospital</li>
                    <li>Ensure location services are enabled on your device</li>
                    <li>Upload the photo to a cloud service (Google Drive, Onedrive, etc.)</li>
                    <li>Provide the public link with VIEW Access to the photo below</li>
                  </ul>
                </div>
              </div>
            </div>

            <label htmlFor="geotagPhoto" className="block text-sm font-medium text-gray-700 mb-2">
              Upload Geotagged Photo
            </label>
            <input
              id="geotagPhoto"
              type="file"
              accept="image/*"
              onChange={(e) => setGeotagPhoto(e.target.files?.[0] || null)}
              className="block w-full text-sm text-gray-700 border border-gray-300 rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            {error && (
              <p className="mt-2 text-sm text-red-600 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {error}
              </p>
            )}
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={isLoading}
              disabled={!geotagPhoto}
            >
              Complete Donation
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}; 