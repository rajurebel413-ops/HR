# Full Stack HR Management System - Setup Guide

## Overview

This is a complete full-stack HR Management System with:
- **Frontend**: React + TypeScript + Vite
- **Backend**: Node.js + Express
- **Database**: MongoDB

## Prerequisites

Before you begin, ensure you have the following installed:

1. **Node.js** (v18 or higher)
   - Download from: https://nodejs.org/

2. **MongoDB** (v6.0 or higher)
   - **Option 1 - Local Installation**: Download from https://www.mongodb.com/try/download/community
   - **Option 2 - MongoDB Atlas**: Use cloud-hosted MongoDB at https://www.mongodb.com/cloud/atlas

3. **Git** (for cloning the repository)
   - Download from: https://git-scm.com/

## Quick Start

### 1. Install Dependencies

Install all dependencies for both frontend and backend:

```bash
npm run install:all
```

Or manually:

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
cd ..
```

### 2. Configure MongoDB

#### Option A: Using Local MongoDB

1. Start MongoDB service on your machine:
   ```bash
   # On macOS (using Homebrew)
   brew services start mongodb-community

   # On Ubuntu/Debian
   sudo systemctl start mongod

   # On Windows
   net start MongoDB
   ```

2. The default MongoDB URI in `server/.env` is already configured for local MongoDB:
   ```
   MONGODB_URI=mongodb://localhost:27017/hr_management_system
   ```

#### Option B: Using MongoDB Atlas (Cloud)

1. Create a free account at https://www.mongodb.com/cloud/atlas
2. Create a new cluster
3. Get your connection string
4. Update `server/.env` with your MongoDB Atlas URI:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/hr_management_system
   ```

### 3. Configure Environment Variables

#### Backend Configuration (`server/.env`)

The backend `.env` file is already created with default values. Update these if needed:

```env
# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/hr_management_system

# JWT Secret (CHANGE THIS IN PRODUCTION!)
JWT_SECRET=your_jwt_secret_key_change_in_production_to_a_long_random_string

# Server Configuration
PORT=5000
NODE_ENV=development

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173

# Email Configuration (Optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_specific_password
EMAIL_FROM=noreply@hrms.com

# Session Configuration
SESSION_SECRET=your_session_secret_change_in_production
```

#### Frontend Configuration (`.env`)

The frontend `.env` file is already created:

```env
VITE_API_URL=http://localhost:5000/api
```

### 4. Seed the Database (Optional)

To populate the database with sample data:

```bash
cd server
npm run seed
cd ..
```

This will create:
- Sample users (admin, HR, managers, employees)
- Departments
- Employee records
- Attendance records
- Leave requests
- Payroll records

### 5. Start the Application

#### Option A: Run Full Stack (Frontend + Backend together)

```bash
npm run dev:fullstack
```

This will start:
- Frontend on http://localhost:5173
- Backend on http://localhost:5000

#### Option B: Run Frontend and Backend Separately

**Terminal 1 - Backend:**
```bash
npm run server:dev
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

### 6. Access the Application

Open your browser and navigate to: **http://localhost:5173**

#### Default Login Credentials (after seeding)

**Admin User:**
- Email: `admin@hrms.com`
- Password: `password`

**HR User:**
- Email: `hr@hrms.com`
- Password: `password`

**Manager User:**
- Email: `manager@hrms.com`
- Password: `password`

**Employee User:**
- Email: `employee@hrms.com`
- Password: `password`

> **Note**: On first login, you'll need to set up MFA (Multi-Factor Authentication)

## Project Structure

```
hr-management-system/
├── components/           # React components
│   ├── common/          # Reusable UI components
│   ├── dashboard/       # Dashboard widgets
│   ├── employees/       # Employee management
│   ├── departments/     # Department management
│   ├── leave/          # Leave management
│   ├── layout/         # Layout components (Sidebar, Topbar)
│   └── pages/          # Page components
├── services/            # API service layer
│   ├── api.ts          # Axios configuration
│   ├── authService.ts  # Authentication API
│   ├── employeeService.ts
│   ├── departmentService.ts
│   ├── attendanceService.ts
│   ├── leaveService.ts
│   ├── payrollService.ts
│   └── notificationService.ts
├── server/              # Backend application
│   ├── config/         # Database configuration
│   ├── middleware/     # Express middleware
│   ├── models/         # Mongoose models
│   ├── routes/         # API routes
│   ├── utils/          # Utility functions
│   └── server.js       # Express server
├── types.ts            # TypeScript type definitions
├── App.tsx             # Main React component
└── package.json        # Project dependencies
```

## Available Scripts

### Root Level Scripts

- `npm run dev` - Start frontend development server
- `npm run build` - Build frontend for production
- `npm run server` - Start backend server (production)
- `npm run server:dev` - Start backend server (development with auto-reload)
- `npm run dev:fullstack` - Start both frontend and backend
- `npm run install:all` - Install all dependencies

### Backend Scripts (in `server/` directory)

- `npm start` - Start backend server
- `npm run dev` - Start backend with auto-reload
- `npm run seed` - Seed database with sample data

## Features

### User Management
- User authentication with JWT
- Multi-Factor Authentication (MFA)
- Role-based access control (Admin, HR, Manager, Employee)
- Password reset functionality

### Employee Management
- Add, edit, and delete employees
- View employee details and profiles
- Department assignment
- Avatar management

### Department Management
- Create and manage departments
- Assign department heads
- View department statistics

### Attendance Management
- Clock in/out functionality
- Weekly work hour tracking
- Attendance history
- Admin attendance management

### Leave Management
- Apply for leaves
- Leave balance tracking
- Leave approval workflow
- Holiday calendar

### Payroll Management
- Generate payroll records
- Salary calculations
- Deductions and bonuses
- Payroll history

### Reports & Analytics
- Employee reports
- Attendance reports
- Leave reports
- Payroll reports
- Department analytics

## API Documentation

The backend API is documented in `API_DOCUMENTATION.md`. Key endpoints include:

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/mfa/setup` - Setup MFA
- `POST /api/auth/mfa/verify` - Verify MFA token
- `GET /api/auth/me` - Get current user

### Employees
- `GET /api/employees` - Get all employees
- `POST /api/employees` - Create employee
- `PUT /api/employees/:id` - Update employee
- `DELETE /api/employees/:id` - Delete employee

### Departments
- `GET /api/departments` - Get all departments
- `POST /api/departments` - Create department
- `PUT /api/departments/:id` - Update department
- `DELETE /api/departments/:id` - Delete department

### Attendance
- `POST /api/attendance/clock-in` - Clock in
- `POST /api/attendance/clock-out` - Clock out
- `GET /api/attendance` - Get all attendance records
- `GET /api/attendance/today` - Get today's attendance

### Leaves
- `GET /api/leaves` - Get all leave requests
- `POST /api/leaves` - Create leave request
- `PUT /api/leaves/:id/status` - Update leave status
- `GET /api/leaves/balance/:employeeId` - Get leave balance

### Payroll
- `GET /api/payroll` - Get all payroll records
- `POST /api/payroll` - Create payroll record
- `POST /api/payroll/process` - Process payroll

## Troubleshooting

### MongoDB Connection Issues

**Problem**: Cannot connect to MongoDB

**Solutions**:
1. Ensure MongoDB is running: `mongod --version`
2. Check MongoDB service: `brew services list` (macOS) or `sudo systemctl status mongod` (Linux)
3. Verify the `MONGODB_URI` in `server/.env`
4. Try using MongoDB Atlas instead of local MongoDB

### Port Already in Use

**Problem**: Port 5000 or 5173 is already in use

**Solutions**:
1. Change the port in `server/.env` (for backend):
   ```
   PORT=5001
   ```
2. For frontend, Vite will automatically suggest a different port

### CORS Issues

**Problem**: Frontend cannot communicate with backend

**Solutions**:
1. Verify `FRONTEND_URL` in `server/.env` matches your frontend URL
2. Check that `VITE_API_URL` in `.env` matches your backend URL

### Missing Dependencies

**Problem**: Module not found errors

**Solutions**:
```bash
# Reinstall all dependencies
npm run install:all

# Or manually
npm install
cd server && npm install && cd ..
```

## Production Deployment

### Backend Deployment

1. Set environment variables for production:
   ```env
   NODE_ENV=production
   MONGODB_URI=your_production_mongodb_uri
   JWT_SECRET=strong_random_secret
   PORT=5000
   ```

2. Build and start:
   ```bash
   cd server
   npm start
   ```

### Frontend Deployment

1. Build the frontend:
   ```bash
   npm run build
   ```

2. Deploy the `dist/` folder to your hosting service (Vercel, Netlify, etc.)

3. Update the `.env` file with production API URL:
   ```env
   VITE_API_URL=https://your-api-domain.com/api
   ```

## Security Considerations

1. **Change default secrets**: Update `JWT_SECRET` and `SESSION_SECRET` in production
2. **Use HTTPS**: Always use HTTPS in production
3. **Secure MongoDB**: Use authentication and enable firewall rules
4. **Environment variables**: Never commit `.env` files to version control
5. **Rate limiting**: Consider adding rate limiting for API endpoints
6. **Input validation**: The app includes validation, but review for your use case

## API Integration

The project includes a complete API service layer in the `services/` directory. The frontend currently uses mock data for stability, but you can integrate the real API by following the [API_INTEGRATION_GUIDE.md](./API_INTEGRATION_GUIDE.md).

### Quick API Integration Example

```typescript
import { authService, employeeService } from './services';

// Authentication
const { user } = await authService.login({ email, password });

// Fetch employees
const employees = await employeeService.getAllEmployees();

// Create employee
const newEmployee = await employeeService.createEmployee(data);
```

For complete integration patterns and best practices, see [API_INTEGRATION_GUIDE.md](./API_INTEGRATION_GUIDE.md).

## Support

For issues, questions, or contributions:
1. Check existing documentation
2. Review the `API_DOCUMENTATION.md` file
3. Review the `API_INTEGRATION_GUIDE.md` for frontend integration
4. Check MongoDB connection and logs
5. Review browser console for frontend errors
6. Check server logs for backend errors

## License

This project is licensed under the MIT License.

## Contributors

Developed as a complete HR Management System with modern web technologies.

---

**Happy Coding! 🚀**
