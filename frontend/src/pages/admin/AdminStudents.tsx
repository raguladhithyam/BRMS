import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Upload,
  Eye,
  XCircle,
  Mail,
  Phone
} from 'lucide-react';
import { Card } from '../../components/shared/Card';
import { Button } from '../../components/shared/Button';
import { Input } from '../../components/shared/Input';
import { Badge } from '../../components/shared/Badge';
import { Modal } from '../../components/shared/Modal';
import { LoadingSpinner } from '../../components/shared/LoadingSpinner';
import { EmptyState } from '../../components/shared/EmptyState';
import { useStudents } from '../../hooks/useStudents';
import { User } from '../../types';
import { BLOOD_GROUPS } from '../../config/constants';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const studentSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  bloodGroup: z.string().min(1, 'Blood group is required'),
  rollNo: z.string().min(1, 'Roll number is required'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  availability: z.boolean(),
});

type StudentFormData = z.infer<typeof studentSchema>;

export const AdminStudents: React.FC = () => {
  const [selectedStudent, setSelectedStudent] = useState<User | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showBulkUploadModal, setShowBulkUploadModal] = useState(false);
  const [bulkFile, setBulkFile] = useState<File | null>(null);
  
  // Separate local filters from API filters
  const [localFilters, setLocalFilters] = useState({
    bloodGroup: '',
    availability: '',
    search: '',
  });
  
  // Debounced filters that will be sent to API
  const [apiFilters, setApiFilters] = useState({
    bloodGroup: '',
    availability: '',
    search: '',
  });

  // Debounce the API filters to avoid too many requests
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setApiFilters(localFilters);
    }, 500); // 500ms debounce

    return () => clearTimeout(timeoutId);
  }, [localFilters]);

  // Fetch students data
  const {
    students,
    isLoading,
    error,
    createStudent,
    updateStudent,
    deleteStudent,
    bulkUpload,
    isCreating,
    isUpdating,
    isDeleting,
    isBulkUploading,
    // Removed refetch as it doesn't exist on the hook
  } = useStudents();

  // Debug logging
  useEffect(() => {
    console.group('🔍 AdminStudents Debug');
    console.log('Component mounted/updated');
    console.log('Local filters:', localFilters);
    console.log('API filters:', apiFilters);
    console.log('Students data:', students);
    console.log('Loading state:', isLoading);
    console.log('Error:', error);
    console.groupEnd();
  }, [localFilters, apiFilters, students, isLoading, error]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue
  } = useForm<StudentFormData>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      availability: true,
    }
  });

  // Filter students locally after fetching (as backup if API filtering doesn't work)
  const filteredStudents = React.useMemo(() => {
    if (!students?.data) return [];
    
    return students.data.filter(student => {
      // Search filter
      if (localFilters.search) {
        const searchTerm = localFilters.search.toLowerCase();
        const matchesSearch = 
          student.name?.toLowerCase().includes(searchTerm) ||
          student.email?.toLowerCase().includes(searchTerm) ||
          student.rollNo?.toLowerCase().includes(searchTerm);
        if (!matchesSearch) return false;
      }
      
      // Blood group filter
      if (localFilters.bloodGroup && student.bloodGroup !== localFilters.bloodGroup) {
        return false;
      }
      
      // Availability filter
      if (localFilters.availability !== '') {
        const isAvailable = localFilters.availability === 'true';
        if (student.availability !== isAvailable) return false;
      }
      
      return true;
    });
  }, [students?.data, localFilters]);

  const handleFilterChange = (filterType: string, value: string) => {
    console.log(`Filter changed: ${filterType} = ${value}`);
    setLocalFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const handleAddStudent = async (data: StudentFormData) => {
    console.log('Adding student:', data);
    try {
      await createStudent(data);
      console.log('Student added successfully');
      setShowAddModal(false);
      reset();
      // If you need to refresh data, you might need to add a manual refresh or use a different approach
    } catch (error) {
      console.error('Error adding student:', error);
    }
  };

  const handleEditStudent = async (data: StudentFormData) => {
    if (!selectedStudent) return;
    
    console.log('Editing student:', selectedStudent.id, data);
    try {
      // Fixed: Pass data in the correct format expected by updateStudent
      await updateStudent({ id: selectedStudent.id, data });
      console.log('Student updated successfully');
      setShowEditModal(false);
      reset();
      setSelectedStudent(null);
      // If you need to refresh data, you might need to add a manual refresh or use a different approach
    } catch (error) {
      console.error('Error updating student:', error);
    }
  };

  const handleDeleteStudent = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this student?')) return;
    
    console.log('Deleting student:', id);
    try {
      await deleteStudent(id);
      console.log('Student deleted successfully');
      // If you need to refresh data, you might need to add a manual refresh or use a different approach
    } catch (error) {
      console.error('Error deleting student:', error);
    }
  };

  const handleEditClick = (student: User) => {
    console.log('Edit clicked for student:', student);
    setSelectedStudent(student);
    setValue('name', student.name || '');
    setValue('email', student.email || '');
    setValue('bloodGroup', student.bloodGroup || '');
    setValue('rollNo', student.rollNo || '');
    setValue('phone', student.phone || '');
    setValue('availability', student.availability || false);
    setShowEditModal(true);
  };

  const handleBulkUpload = async () => {
    if (!bulkFile) return;
    
    console.log('Bulk uploading file:', bulkFile.name);
    try {
      await bulkUpload(bulkFile);
      console.log('Bulk upload successful');
      setShowBulkUploadModal(false);
      setBulkFile(null);
      // If you need to refresh data, you might need to add a manual refresh or use a different approach
    } catch (error) {
      console.error('Error in bulk upload:', error);
    }
  };

  const bloodGroupOptions = BLOOD_GROUPS.map(group => ({
    value: group,
    label: group
  }));

  const availabilityOptions = [
    { value: '', label: 'All' },
    { value: 'true', label: 'Available' },
    { value: 'false', label: 'Unavailable' },
  ];

  // Test API connection button
  const handleTestConnection = async () => {
    console.log('Testing API connection...');
    try {
      const response = await fetch('/api/health');
      const data = await response.json();
      console.log('API test result:', data);
      alert('API test successful! Check console for details.');
    } catch (error) {
      console.error('API test failed:', error);
      alert('API test failed! Check console for details.');
    }
  };

  // Show error state if there's an error
  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="border-red-200 bg-red-50">
          <div className="text-center py-8">
            <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-red-800 mb-2">Error Loading Students</h3>
            <p className="text-red-600 mb-4">
              {error?.message || 'Failed to fetch students from the database'}
            </p>
            <div className="space-x-4">
              <Button 
                onClick={() => window.location.reload()} 
                variant="outline"
                className="border-red-300 text-red-700 hover:bg-red-100"
              >
                Retry
              </Button>
              <Button 
                onClick={handleTestConnection}
                variant="outline"
                className="border-blue-300 text-blue-700 hover:bg-blue-100"
              >
                Test API
              </Button>
            </div>
            
            {/* Error Details */}
            <details className="mt-4 text-left">
              <summary className="cursor-pointer text-sm text-red-600">
                Error Details (Click to expand)
              </summary>
              <pre className="mt-2 text-xs bg-red-100 p-2 rounded overflow-auto">
                {JSON.stringify(error, null, 2)}
              </pre>
            </details>
          </div>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">Loading students from database...</p>
          <p className="mt-2 text-sm text-gray-500">
            If this takes too long, there might be a connection issue.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Debug Panel */}
      <Card className="mb-6 bg-blue-50 border-blue-200">
        <details>
          <summary className="cursor-pointer font-medium text-blue-800 mb-2">
            🔍 Debug Information (Click to expand)
          </summary>
          <div className="space-y-2 text-sm">
            <div><strong>Total Students:</strong> {students?.data?.length || 0}</div>
            <div><strong>Filtered Students:</strong> {filteredStudents?.length || 0}</div>
            <div><strong>Local Filters:</strong> {JSON.stringify(localFilters)}</div>
            <div><strong>API Filters:</strong> {JSON.stringify(apiFilters)}</div>
            <div><strong>Loading:</strong> {isLoading ? 'Yes' : 'No'}</div>
            <div><strong>Error:</strong> {error ? 'Yes' : 'No'}</div>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={handleTestConnection}
              className="mt-2"
            >
              Test API Connection
            </Button>
          </div>
        </details>
      </Card>

      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Student Donors Management</h1>
          <p className="text-gray-600">
            Manage student donor profiles, availability, and contact information.
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Total: {students?.data?.length || 0} | Filtered: {filteredStudents?.length || 0}
          </p>
        </div>
        
        <div className="flex space-x-3">
          <Button
            variant="outline"
            onClick={() => setShowBulkUploadModal(true)}
          >
            <Upload className="h-4 w-4 mr-2" />
            Bulk Upload
          </Button>
          
          <Button onClick={() => setShowAddModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Student
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by name, email, or roll number..."
                value={localFilters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <div>
            <select
              value={localFilters.bloodGroup}
              onChange={(e) => handleFilterChange('bloodGroup', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Blood Groups</option>
              {bloodGroupOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <select
              value={localFilters.availability}
              onChange={(e) => handleFilterChange('availability', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {availabilityOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        {/* Clear Filters Button */}
        {(localFilters.search || localFilters.bloodGroup || localFilters.availability) && (
          <div className="mt-4 pt-4 border-t">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setLocalFilters({ search: '', bloodGroup: '', availability: '' })}
            >
              Clear All Filters
            </Button>
          </div>
        )}
      </Card>

      {/* Students List */}
      <Card padding={false}>
        {filteredStudents && filteredStudents.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Blood Group
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Availability
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {student.name || 'N/A'}
                        </div>
                        <div className="text-sm text-gray-500">
                          Roll: {student.rollNo || 'N/A'}
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 flex items-center">
                        <Mail className="h-4 w-4 mr-1" />
                        {student.email || 'N/A'}
                      </div>
                      <div className="text-sm text-gray-500 flex items-center">
                        <Phone className="h-4 w-4 mr-1" />
                        {student.phone || 'N/A'}
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant="primary">{student.bloodGroup || 'N/A'}</Badge>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge
                        variant={student.availability ? 'success' : 'danger'}
                      >
                        {student.availability ? 'Available' : 'Unavailable'}
                      </Badge>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedStudent(student);
                          setShowDetailsModal(true);
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditClick(student)}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteStudent(student.id)}
                        loading={isDeleting}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState
            icon={<Users className="h-12 w-12" />}
            title={
              students?.data?.length === 0 
                ? "No Students Found" 
                : "No Students Match Filters"
            }
            description={
              students?.data?.length === 0 
                ? "No student donors found in the database. Add new students to get started."
                : `No students match your current filters. Try adjusting your search criteria. Total students: ${students?.data?.length || 0}`
            }
            action={
              <div className="space-x-4">
                <Button onClick={() => setShowAddModal(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Student
                </Button>
                {(localFilters.search || localFilters.bloodGroup || localFilters.availability) && (
                  <Button 
                    variant="outline"
                    onClick={() => setLocalFilters({ search: '', bloodGroup: '', availability: '' })}
                  >
                    Clear Filters
                  </Button>
                )}
              </div>
            }
          />
        )}
      </Card>

      {/* Add Student Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          reset();
        }}
        title="Add New Student Donor"
      >
        <form onSubmit={handleSubmit(handleAddStudent)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Full Name"
              {...register('name')}
              error={errors.name?.message}
              required
            />
            
            <Input
              label="Roll Number"
              {...register('rollNo')}
              error={errors.rollNo?.message}
              required
            />
          </div>
          
          <Input
            label="Email Address"
            type="email"
            {...register('email')}
            error={errors.email?.message}
            required
          />
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Blood Group *
              </label>
              <select
                {...register('bloodGroup')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Blood Group</option>
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
            
            <Input
              label="Phone Number"
              {...register('phone')}
              error={errors.phone?.message}
              required
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              {...register('availability')}
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <label className="text-sm font-medium text-gray-700">
              Available for donation
            </label>
          </div>
          
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setShowAddModal(false);
                reset();
              }}
            >
              Cancel
            </Button>
            <Button type="submit" loading={isCreating}>
              Add Student
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit Student Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          reset();
          setSelectedStudent(null);
        }}
        title="Edit Student Donor"
      >
        <form onSubmit={handleSubmit(handleEditStudent)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Full Name"
              {...register('name')}
              error={errors.name?.message}
              required
            />
            
            <Input
              label="Roll Number"
              {...register('rollNo')}
              error={errors.rollNo?.message}
              required
            />
          </div>
          
          <Input
            label="Email Address"
            type="email"
            {...register('email')}
            error={errors.email?.message}
            required
          />
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Blood Group *
              </label>
              <select
                {...register('bloodGroup')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Blood Group</option>
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
            
            <Input
              label="Phone Number"
              {...register('phone')}
              error={errors.phone?.message}
              required
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              {...register('availability')}
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <label className="text-sm font-medium text-gray-700">
              Available for donation
            </label>
          </div>
          
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setShowEditModal(false);
                reset();
                setSelectedStudent(null);
              }}
            >
              Cancel
            </Button>
            <Button type="submit" loading={isUpdating}>
              Update Student
            </Button>
          </div>
        </form>
      </Modal>

      {/* Student Details Modal */}
      <Modal
        isOpen={showDetailsModal}
        onClose={() => {
          setShowDetailsModal(false);
          setSelectedStudent(null);
        }}
        title="Student Details"
      >
        {selectedStudent && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Full Name</p>
                <p className="font-medium">{selectedStudent.name || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Roll Number</p>
                <p className="font-medium">{selectedStudent.rollNo || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-medium">{selectedStudent.email || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Phone</p>
                <p className="font-medium">{selectedStudent.phone || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Blood Group</p>
                <Badge variant="primary">{selectedStudent.bloodGroup || 'N/A'}</Badge>
              </div>
              <div>
                <p className="text-sm text-gray-600">Availability</p>
                <Badge variant={selectedStudent.availability ? 'success' : 'danger'}>
                  {selectedStudent.availability ? 'Available' : 'Unavailable'}
                </Badge>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Bulk Upload Modal */}
      <Modal
        isOpen={showBulkUploadModal}
        onClose={() => {
          setShowBulkUploadModal(false);
          setBulkFile(null);
        }}
        title="Bulk Upload Students"
      >
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-600 mb-2">
              Upload a CSV file with student information. The file should contain the following columns:
            </p>
            <div className="bg-gray-50 p-3 rounded-lg text-xs font-mono">
              name, email, bloodGroup, rollNo, phone, availability
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select CSV File
            </label>
            <input
              type="file"
              accept=".csv"
              onChange={(e) => setBulkFile(e.target.files?.[0] || null)}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
            />
          </div>
          
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              variant="outline"
              onClick={() => {
                setShowBulkUploadModal(false);
                setBulkFile(null);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleBulkUpload}
              loading={isBulkUploading}
              disabled={!bulkFile}
            >
              Upload Students
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};