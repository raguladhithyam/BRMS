import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Phone,
  Calendar,
  Shield
} from 'lucide-react';
import { Card } from '@/components/shared/Card';
import { Button } from '@/components/shared/Button';
import { Input } from '@/components/shared/Input';
import { Badge } from '@/components/shared/Badge';
import { Modal } from '@/components/shared/Modal';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { EmptyState } from '@/components/shared/EmptyState';
import AlertDialog from '@/components/shared/AlertDialog';
import { useAlertDialog } from '@/hooks/useAlertDialog';
import { useAdmins } from '@/hooks/useAdmins';
import { User } from '@/types';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';

const adminSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type AdminFormData = z.infer<typeof adminSchema>;

export const AdminManagement: React.FC = () => {
  const [selectedAdmin, setSelectedAdmin] = useState<User | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
  });
  
  // AlertDialog hook
  const alertDialog = useAlertDialog();

  const { 
    admins, 
    isLoading, 
    createAdmin, 
    updateAdmin, 
    deleteAdmin,
    isCreating,
    isUpdating,
    isDeleting
  } = useAdmins();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue
  } = useForm<AdminFormData>({
    resolver: zodResolver(adminSchema),
  });

  // Apply filters
  const filteredAdmins = admins?.filter(admin => {
    const matchesSearch = !filters.search || 
      admin.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      admin.email.toLowerCase().includes(filters.search.toLowerCase()) ||
      admin.phone?.toLowerCase().includes(filters.search.toLowerCase());
    
    return matchesSearch;
  }) || [];

  const handleAddAdmin = async (data: AdminFormData) => {
    try {
      await createAdmin(data);
      alertDialog.showAlert('Success', 'Admin added successfully', 'success');
      setShowAddModal(false);
      reset();
    } catch (error) {
      console.error('Error adding admin:', error);
      alertDialog.showAlert('Error', 'Failed to add admin. Please try again.', 'error');
    }
  };

  const handleEditAdmin = async (data: AdminFormData) => {
    if (!selectedAdmin) return;
    
    try {
      await updateAdmin({ id: selectedAdmin.id, data });
      alertDialog.showAlert('Success', 'Admin updated successfully', 'success');
      setShowEditModal(false);
      reset();
      setSelectedAdmin(null);
    } catch (error) {
      console.error('Error updating admin:', error);
      alertDialog.showAlert('Error', 'Failed to update admin. Please try again.', 'error');
    }
  };

  const handleDeleteAdmin = async (id: string) => {
    try {
      await deleteAdmin(id);
      alertDialog.showAlert('Success', 'Admin deleted successfully', 'success');
      setShowDeleteModal(false);
      setSelectedAdmin(null);
    } catch (error) {
      console.error('Error deleting admin:', error);
      alertDialog.showAlert('Error', 'Failed to delete admin. Please try again.', 'error');
    }
  };

  const handleEditClick = (admin: User) => {
    setSelectedAdmin(admin);
    setValue('name', admin.name);
    setValue('email', admin.email);
    setValue('phone', admin.phone || '');
    setValue('password', ''); // Don't populate password
    setShowEditModal(true);
  };

  const handleDeleteClick = (admin: User) => {
    setSelectedAdmin(admin);
    setShowDeleteModal(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Management</h1>
        <p className="text-gray-600">
          Manage admin users and their permissions.
        </p>
      </div>

      {/* Filters and Actions */}
      <Card className="mb-6">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search admins..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="pl-10"
              />
            </div>
          </div>
          
          <Button
            onClick={() => setShowAddModal(true)}
            className="flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Admin
          </Button>
        </div>
      </Card>

      {/* Admins List */}
      <Card padding={false}>
        {filteredAdmins.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Admin
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAdmins.map((admin) => (
                  <tr key={admin.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {admin.name}
                        </div>
                        <div className="text-sm text-gray-500">{admin.email}</div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <Phone className="h-4 w-4 mr-1" />
                        {admin.phone || 'N/A'}
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant="primary" className="flex items-center">
                        <Shield className="h-3 w-3 mr-1" />
                        {admin.role}
                      </Badge>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {format(new Date(admin.createdAt), 'MMM dd, yyyy')}
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex flex-wrap gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditClick(admin)}
                          className="text-orange-600 hover:text-orange-700"
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteClick(admin)}
                          loading={isDeleting}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState
            icon={<Users className="h-12 w-12" />}
            title="No Admins Found"
            description="No admins match your current filters. Try adjusting your search criteria."
          />
        )}
      </Card>

      {/* Add Admin Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Admin"
      >
        <form onSubmit={handleSubmit(handleAddAdmin)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            <Input
              {...register('name')}
              placeholder="Enter full name"
              error={errors.name?.message}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <Input
              {...register('email')}
              type="email"
              placeholder="Enter email address"
              error={errors.email?.message}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone
            </label>
            <Input
              {...register('phone')}
              placeholder="Enter phone number"
              error={errors.phone?.message}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <Input
              {...register('password')}
              type="password"
              placeholder="Enter password"
              error={errors.password?.message}
            />
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
            <Button
              type="submit"
              loading={isCreating}
            >
              Add Admin
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit Admin Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Admin"
      >
        <form onSubmit={handleSubmit(handleEditAdmin)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            <Input
              {...register('name')}
              placeholder="Enter full name"
              error={errors.name?.message}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <Input
              {...register('email')}
              type="email"
              placeholder="Enter email address"
              error={errors.email?.message}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone
            </label>
            <Input
              {...register('phone')}
              placeholder="Enter phone number"
              error={errors.phone?.message}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New Password (leave blank to keep current)
            </label>
            <Input
              {...register('password')}
              type="password"
              placeholder="Enter new password"
              error={errors.password?.message}
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setShowEditModal(false);
                reset();
                setSelectedAdmin(null);
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={isUpdating}
            >
              Update Admin
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Admin"
      >
        {selectedAdmin && (
          <div className="space-y-4">
            <p className="text-gray-600">
              Are you sure you want to delete admin {selectedAdmin.name}?
              This action cannot be undone.
            </p>
            
            <div className="flex justify-end space-x-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={() => handleDeleteAdmin(selectedAdmin.id)}
                loading={isDeleting}
              >
                Delete Admin
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* AlertDialog */}
      <AlertDialog
        open={alertDialog.open}
        onOpenChange={alertDialog.onOpenChange}
        title={alertDialog.title}
        description={alertDialog.description}
        type={alertDialog.type}
        confirmText={alertDialog.confirmText}
        cancelText={alertDialog.cancelText}
        onConfirm={alertDialog.onConfirm}
        onCancel={alertDialog.onCancel}
        showCancel={alertDialog.showCancel}
      />
    </div>
  );
}; 