# 🩸 Blood Request Management System

A comprehensive blood donation management platform that connects blood requestors with willing student donors through an admin-controlled workflow.

## 🎯 Features

### For Requestors (Public)
- Submit blood requests with detailed information
- Specify urgency levels and requirements
- Receive donor contact information after admin approval

### For Students (Donors)
- Register as blood donors with profile information
- Receive notifications for matching blood requests
- Opt-in to help with specific requests
- Manage availability status

### For Admins
- Review and approve/reject blood requests
- Manage student donor database
- Match requestors with suitable donors
- Send notifications and manage communications
- View analytics and reports

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development
- **Tailwind CSS** for styling
- **React Query** for state management
- **React Hook Form** with Zod validation
- **Socket.IO** for real-time notifications

### Backend
- **Node.js** with Express and TypeScript
- **PostgreSQL** database with Sequelize ORM
- **Redis** for caching and sessions
- **JWT** authentication
- **Socket.IO** for real-time features
- **Nodemailer** for email notifications

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- PostgreSQL 12+
- Redis (optional, for caching)

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd blood-request-management-system
```

2. **Install dependencies**
```bash
# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
```

3. **Setup environment variables**

Backend (.env):
```env
NODE_ENV=development
PORT=3001

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=blood_request_db
DB_USER=your_username
DB_PASSWORD=your_password

# Redis (optional)
REDIS_HOST=localhost
REDIS_PORT=6379

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
FROM_EMAIL=noreply@bloodconnect.org
FROM_NAME=BloodConnect

# Frontend URL
FRONTEND_URL=http://localhost:5173

# Admin Credentials
ADMIN_EMAIL=admin@bloodconnect.org
ADMIN_PASSWORD=admin123
```

Frontend (.env):
```env
VITE_API_BASE_URL=http://localhost:3001/api
VITE_SOCKET_URL=http://localhost:3001
VITE_APP_NAME=BloodConnect
VITE_APP_VERSION=1.0.0
```

4. **Setup database**
```bash
cd backend

# Create database
npm run db:create

# Run migrations
npm run migrate

# Seed initial data
npm run seed
```

5. **Start the application**

Option 1 - Start both frontend and backend together:
```bash
cd frontend
npm run full:dev
```

Option 2 - Start separately:
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

6. **Access the application**
- Frontend: http://localhost:5173
- Backend API: http://localhost:3001
- Health Check: http://localhost:3001/health

## 👥 Default Accounts

### Admin Account
- Email: `admin@bloodconnect.org`
- Password: `admin123`

### Student Account
- Email: `john.doe@university.edu`
- Password: `student123`

## 📁 Project Structure

```
blood-request-management-system/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── api/            # API service functions
│   │   ├── utils/          # Utility functions
│   │   └── types/          # TypeScript type definitions
│   └── package.json
├── backend/                 # Node.js backend application
│   ├── src/
│   │   ├── controllers/    # Route controllers
│   │   ├── models/         # Database models
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Express middleware
│   │   ├── services/       # Business logic services
│   │   ├── config/         # Configuration files
│   │   ├── migrations/     # Database migrations
│   │   └── seeders/        # Database seeders
│   └── package.json
└── README.md
```

## 🔄 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new student
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile
- `POST /api/auth/logout` - Logout

### Blood Requests
- `POST /api/requests` - Submit blood request (public)
- `GET /api/requests/matching` - Get matching requests (student)
- `POST /api/requests/:id/opt-in` - Opt-in to request (student)

### Admin
- `GET /api/admin/requests` - Get all requests
- `POST /api/admin/requests/:id/approve` - Approve request
- `POST /api/admin/requests/:id/reject` - Reject request
- `POST /api/admin/requests/:id/fulfill` - Assign donor
- `GET /api/admin/students` - Get all students
- `POST /api/admin/students` - Create student
- `PUT /api/admin/students/:id` - Update student
- `DELETE /api/admin/students/:id` - Delete student

## 🔧 Development

### Database Operations
```bash
# Create new migration
npx sequelize-cli migration:generate --name migration-name

# Run migrations
npm run migrate

# Create new seeder
npx sequelize-cli seed:generate --name seeder-name

# Run seeders
npm run seed
```

### Code Quality
```bash
# Frontend linting
cd frontend
npm run lint

# Backend type checking
cd backend
npm run build
```

## 🚀 Deployment

### Backend Deployment
1. Set production environment variables
2. Run database migrations
3. Build the application: `npm run build`
4. Start with: `npm start`

### Frontend Deployment
1. Set production environment variables
2. Build the application: `npm run build`
3. Serve the `dist` folder with a web server

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes and commit: `git commit -m 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.
Railway - Yug Fac Chrome

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Email: support@bloodconnect.org
- Emergency: +1 (555) 123-4567

## 🙏 Acknowledgments

- Built with ❤️ for saving lives through technology
- Thanks to all blood donors who make this possible
- Special thanks to the open-source community

---

**Remember: Every donation saves lives. Every line of code makes a difference.** 🩸❤️