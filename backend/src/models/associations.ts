import { User } from './User';
import { BloodRequest } from './BloodRequest';
import { StudentOptIn } from './StudentOptIn';
import { Notification } from './Notification';

// User associations
User.hasMany(StudentOptIn, { foreignKey: 'studentId', as: 'optIns' });
User.hasMany(BloodRequest, { foreignKey: 'assignedDonorId', as: 'assignedRequests' });
User.hasMany(Notification, { foreignKey: 'userId', as: 'notifications' });

// BloodRequest associations
BloodRequest.belongsTo(User, { foreignKey: 'assignedDonorId', as: 'assignedDonor' });
BloodRequest.hasMany(StudentOptIn, { foreignKey: 'requestId', as: 'optedInStudents' });

// StudentOptIn associations
StudentOptIn.belongsTo(User, { foreignKey: 'studentId', as: 'student' });
StudentOptIn.belongsTo(BloodRequest, { foreignKey: 'requestId', as: 'request' });

// Notification associations
Notification.belongsTo(User, { foreignKey: 'userId', as: 'user' });

export {
  User,
  BloodRequest,
  StudentOptIn,
  Notification,
};