# WEintegrity HR Management System

## 🚀 Complete Full-Stack HR Management Application

A comprehensive, production-ready Human Resources Management System built with modern technologies, featuring complete authentication, role-based access control, approval workflows, and advanced reporting capabilities.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [System Architecture](#system-architecture)
- [Installation & Setup](#installation--setup)
- [API Documentation](#api-documentation)
- [User Roles & Permissions](#user-roles--permissions)
- [Security Features](#security-features)
- [Testing](#testing)
- [Deployment](#deployment)

## 🎯 Overview

WEintegrity is an enterprise-grade HR Management System designed to streamline all HR operations including employee management, leave tracking, payroll processing, attendance monitoring, exit interviews, and comprehensive reporting.

### Key Highlights

- **Complete Authentication System** with MFA (Multi-Factor Authentication)
- **Role-Based Access Control** (Admin, HR, Manager, Employee)
- **Approval Workflows** for Leaves, Payroll, and Exit Interviews
- **Real-time Notifications** (Email + In-app)
- **Advanced Reporting** with export capabilities
- **Secure & Scalable** architecture
- **Modern UI/UX** with responsive design

## ✨ Features

### Epic 1: User Authentication and Authorization

#### User Story 1: Login Page ✅
- Secure login with email/password
- **Forgot password** functionality with email reset link
- Email format and password strength validation
- Automatic redirection to role-specific dashboards
- **Account locking** after 5 failed login attempts (30-minute lockout)
- **Login attempt tracking** with email notifications

#### User Story 2: Role-Based Access Control (RBAC) ✅
- Four distinct roles: **Admin, HR, Manager, Employee**
- Hierarchical permissions system
- Feature-level access restrictions
- Automatic UI adaptation based on role

### Epic 2: User Approvals Workflow

#### User Story 3: Leave Request Approval Process ✅
- Employee leave request submission (type, dates, reason)
- **Email notifications** to managers on new requests
- Real-time leave balance display
- Manager approval/rejection with reasons
- **Automatic leave balance updates**
- **Email notifications** to employees on status changes

#### User Story 4: Payroll Approval Process ✅
- Payroll generation with automatic calculations
- **Multi-stage approval workflow** (Pending → Approved → Paid)
- Salary, bonuses, and deductions management
- **Approval tracking** with timestamps and approver info
- **Automated payslip generation**
- **Email notifications** on payroll status changes
- **Rejection workflow** with reason tracking

#### User Story 5: Exit Interview Approval ✅
- **Complete exit interview module** with questionnaire
- Multiple rating categories (Management, Work Environment, Compensation, Career Growth)
- **HR Admin approval/rejection workflow**
- **Feedback analysis** and reporting
- **Email notifications** on status changes
- **Rejection with re-submission** option

### Epic 3: Employee Management

#### User Story 6: Employee Registration and Profile Creation ✅
- Comprehensive employee registration by HR Admin
- **Automatic employee ID generation** (EMP0001, EMP0002, etc.)
- **Automatic user account creation**
- **Welcome email** with auto-generated credentials
- Document upload support (ID, certifications)
- **Automatic leave balance initialization**

#### User Story 7: Employee Role Assignment ✅
- Role assignment during registration
- **Automatic permission configuration**
- Role-based feature access control

### Epic 4: Employee Self-Service Portal

#### User Story 8: Self-Service Dashboard ✅
- Personalized employee dashboard
- Leave balance and history viewing
- **Payslip download** functionality
- Profile management (contact details, emergency contacts)
- Leave request submission
- **Performance review access**

### Epic 5: Time and Attendance Management

#### User Story 9: Time Logging (Clock In/Clock Out) ✅
- Simple clock in/out functionality
- **Automatic working hours calculation**
- Attendance history with overtime tracking
- **Timestamp validation** and storage
- Absence tracking

### Epic 6: Security and Data Protection

#### User Story 10: Multi-Factor Authentication (MFA) ✅
- **TOTP-based MFA** with QR code setup
- Support for Google Authenticator and similar apps
- **Mandatory MFA** for sensitive operations
- First-time setup workflow
- **MFA enforcement** for payroll and employee data access

### Epic 7: System Notifications and Alerts

#### User Story 11: System Notifications for Requests ✅
- **Email notifications** for all approval workflows
- **In-app notification center**
- Real-time status updates
- **Reminder notifications** for pending approvals
- Read/unread status tracking
- **Categorized notifications** (leave, payroll, exit interview)

### Epic 8: Reports and Analytics

#### User Story 12: Employee Reports ✅
- **Comprehensive reporting module** with multiple report types:
  - **Employee Reports** (by role, department, attendance, performance)
  - **Attendance Reports** (by date range, status, employee)
  - **Leave Reports** (by type, status, department)
  - **Payroll Reports** (by month/year, status)
  - **Exit Interview Reports** (with analytics and trends)
  - **Dashboard Statistics** (real-time metrics)
- **Customizable filters** (department, date range, status)
- **Export capabilities** (ready for PDF/CSV integration)
- **Visual analytics** with charts and graphs
- **Performance metrics** and KPIs

## 🛠️ Technology Stack

### Backend
- **Node.js** v18+ with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **Speakeasy** for MFA (TOTP)
- **Nodemailer** for email notifications
- **Bcrypt** for password hashing
- **Express Validator** for input validation

### Frontend
- **React** 19.2.0 with TypeScript
- **Vite** for build tooling
- **TailwindCSS** (implied from components)
- Modern component-based architecture
- Responsive design

### Security
- JWT-based authentication
- TOTP Multi-Factor Authentication
- Password hashing with bcrypt
- Account lockout mechanism
- Password reset with tokens
- Role-based access control
- Input validation and sanitization

### Email & Notifications
- Nodemailer with SMTP support
- Template-based email system
- Real-time in-app notifications
- Email notification for all workflows

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend (React + TS)                    │
│  ┌──────────┬──────────┬──────────┬──────────┬───────────┐ │
│  │Dashboard │Employees │  Leave   │ Payroll  │  Reports  │ │
│  └──────────┴──────────┴──────────┴──────────┴───────────┘ │
└─────────────────────────┬───────────────────────────────────┘
                          │ REST API
┌─────────────────────────▼───────────────────────────────────┐
│                Backend (Node.js + Express)                   │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Authentication Middleware                │  │
│  │         (JWT Validation, RBAC, MFA Check)            │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌─────────┬─────────┬─────────┬──────────┬─────────────┐ │
│  │  Auth   │Employee │  Leave  │ Payroll  │Exit Interview│ │
│  │ Routes  │ Routes  │ Routes  │  Routes  │   Routes     │ │
│  └─────────┴─────────┴─────────┴──────────┴─────────────┘ │
│  ┌─────────┬─────────┬─────────┬──────────┬─────────────┐ │
│  │Attendance│ Dept   │ Users   │ Notif.   │   Reports    │ │
│  │ Routes  │ Routes  │ Routes  │  Routes  │   Routes     │ │
│  └─────────┴─────────┴─────────┴──────────┴─────────────┘ │
└─────────────────────────┬───────────────────────────────────┘
                          │
┌─────────────────────────▼───────────────────────────────────┐
│                   MongoDB Database                           │
│  ┌──────┬────────┬──────┬────────┬─────────┬─────────────┐ │
│  │Users │Employee│Leaves│Payroll │Attendance│Exit Interview│ │
│  └──────┴────────┴──────┴────────┴─────────┴─────────────┘ │
│  ┌──────────┬──────────┬────────────┬──────────────────┐   │
│  │Department│Leave Bal.│Notification│Employee Documents│   │
│  └──────────┴──────────┴────────────┴──────────────────┘   │
└─────────────────────────────────────────────────────────────┘

External Services:
┌──────────────┐
│ SMTP Server  │ ← Email Notifications
└──────────────┘
```

## 📦 Installation & Setup

### Prerequisites
- Node.js v18 or higher
- MongoDB v6 or higher
- npm or yarn package manager

### Backend Setup

1. **Navigate to server directory:**
```bash
cd server
```

2. **Install dependencies:**
```bash
npm install
```

3. **Configure environment variables:**
```bash
cp .env.example .env
```

Edit `.env` file with your configuration:
```env
# Server Configuration
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:5173

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/hr_management_system

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d

# Email Configuration (SMTP)
SMTP_HOST=smtp.ethereal.email
SMTP_PORT=587
SMTP_USER=your-email@example.com
SMTP_PASS=your-password
SMTP_FROM=noreply@weintegrity.com

# Security Configuration
ACCOUNT_LOCK_DURATION=30
MAX_LOGIN_ATTEMPTS=5
PASSWORD_RESET_EXPIRE=3600000
```

4. **Start MongoDB:**
```bash
mongod
```

5. **Seed the database (optional):**
```bash
npm run seed
```

6. **Start the backend server:**
```bash
npm run dev
```

Backend will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to root directory:**
```bash
cd /workspace
```

2. **Install dependencies:**
```bash
npm install
```

3. **Configure environment variables:**
```bash
cp .env.example .env
```

Edit `.env` file:
```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=WEintegrity HR Management System
VITE_APP_VERSION=1.0.0
```

4. **Start the frontend:**
```bash
npm run dev
```

Frontend will run on `http://localhost:5173`

## 📚 API Documentation

### Authentication Endpoints

#### POST `/api/auth/login`
Login with email and password
```json
Request:
{
  "email": "user@example.com",
  "password": "password123"
}

Response:
{
  "user": {
    "id": "...",
    "name": "John Doe",
    "email": "user@example.com",
    "role": "Employee",
    "isMfaSetup": true
  }
}
```

#### POST `/api/auth/forgot-password`
Request password reset
```json
Request:
{
  "email": "user@example.com"
}

Response:
{
  "message": "Password reset instructions sent to your email."
}
```

#### POST `/api/auth/reset-password/:token`
Reset password with token
```json
Request:
{
  "password": "newpassword123"
}

Response:
{
  "message": "Password reset successful."
}
```

#### POST `/api/auth/mfa/setup`
Setup MFA for user
```json
Request:
{
  "userId": "..."
}

Response:
{
  "secret": "...",
  "qrCode": "data:image/png;base64,..."
}
```

#### POST `/api/auth/mfa/verify`
Verify MFA token
```json
Request:
{
  "userId": "...",
  "token": "123456",
  "isSetup": true
}

Response:
{
  "token": "jwt-token",
  "user": {...}
}
```

### Employee Endpoints

#### POST `/api/employees`
Create new employee (Admin, HR only)
```json
Request:
{
  "employeeId": "EMP0001",
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "departmentId": "...",
  "role": "Employee",
  "joinDate": "2025-01-01",
  "salary": 60000
}

Response:
{
  "employee": {...},
  "message": "Employee created successfully. Welcome email sent."
}
```

### Leave Endpoints

#### POST `/api/leaves`
Submit leave request
```json
Request:
{
  "employeeId": "...",
  "employeeName": "John Doe",
  "leaveType": "Sick Leave",
  "startDate": "2025-10-20",
  "endDate": "2025-10-22",
  "reason": "Medical appointment"
}
```

#### PUT `/api/leaves/:id`
Approve/Reject leave (Manager, HR, Admin only)
```json
Request:
{
  "status": "Approved"
}
```

### Payroll Endpoints

#### POST `/api/payroll/generate`
Generate payroll for month (Admin, HR only)
```json
Request:
{
  "month": 9,
  "year": 2025
}
```

#### PUT `/api/payroll/:id/approve`
Approve payroll (Admin, HR only)

#### PUT `/api/payroll/:id/reject`
Reject payroll with reason (Admin, HR only)
```json
Request:
{
  "rejectionReason": "Incorrect calculations"
}
```

### Exit Interview Endpoints

#### POST `/api/exit-interviews`
Submit exit interview
```json
Request:
{
  "resignationDate": "2025-10-15",
  "lastWorkingDay": "2025-10-30",
  "reasonForLeaving": "Better Opportunity",
  "overallExperience": 4,
  "managementRating": 5,
  "workEnvironmentRating": 4,
  "compensationRating": 3,
  "careerGrowthRating": 3,
  "wouldRecommend": true,
  "wouldRejoin": true,
  "improvements": "Better work-life balance",
  "positiveAspects": "Great team culture"
}
```

#### PUT `/api/exit-interviews/:id/approve`
Approve exit interview (Admin, HR only)

#### PUT `/api/exit-interviews/:id/reject`
Reject exit interview (Admin, HR only)

### Reports Endpoints

#### GET `/api/reports/employee`
Get employee report with filters
```
Query params:
- departmentId (optional)
- status (optional)
- employeeType (optional)
- startDate (optional)
- endDate (optional)
```

#### GET `/api/reports/attendance`
Get attendance report

#### GET `/api/reports/leave`
Get leave report

#### GET `/api/reports/payroll`
Get payroll report

#### GET `/api/reports/exit-interviews`
Get exit interviews report

#### GET `/api/reports/dashboard-stats`
Get dashboard statistics

## 👥 User Roles & Permissions

### Admin
- **Full System Access**
- Manage all employees
- Approve/Reject all requests
- Access all reports
- System configuration

### HR
- Employee management
- Payroll processing and approval
- Leave approval
- Exit interview management
- Generate reports
- Access employee data

### Manager
- View team members
- Approve/Reject team leave requests
- View team attendance
- Access team reports

### Employee
- View own profile
- Submit leave requests
- Clock in/out
- View payslips
- Update profile information
- Submit exit interview

## 🔒 Security Features

### Authentication & Authorization
- ✅ JWT-based token authentication
- ✅ TOTP Multi-Factor Authentication
- ✅ Password hashing with bcrypt (10 salt rounds)
- ✅ Role-based access control
- ✅ Protected routes and API endpoints

### Account Security
- ✅ **Account lockout** after 5 failed attempts
- ✅ **30-minute automatic unlock**
- ✅ Login attempt tracking
- ✅ Email alerts on account lock
- ✅ Password strength requirements
- ✅ Secure password reset with time-limited tokens (1 hour)

### Data Protection
- ✅ Input validation and sanitization
- ✅ CORS protection
- ✅ Environment variable configuration
- ✅ Sensitive data exclusion from responses
- ✅ Secure password storage (never stored in plain text)

### Email Security
- ✅ Secure SMTP with TLS
- ✅ Template-based emails (prevent injection)
- ✅ Rate limiting on email sending (recommended)

## 🧪 Testing

### Running Tests

```bash
# Backend tests
cd server
npm test

# Frontend tests
npm test

# E2E tests
npm run test:e2e
```

### Test Coverage
- Authentication flows
- RBAC enforcement
- Approval workflows
- Email notifications
- Data validation
- Security measures

## 🚀 Deployment

### Production Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Use strong JWT_SECRET (at least 32 characters)
- [ ] Configure production MongoDB instance
- [ ] Set up production SMTP service (SendGrid, AWS SES, etc.)
- [ ] Enable HTTPS/SSL certificates
- [ ] Configure CORS for production domain
- [ ] Set up MongoDB backups
- [ ] Configure log aggregation
- [ ] Set up monitoring and alerts
- [ ] Review and secure environment variables
- [ ] Enable rate limiting
- [ ] Configure CDN for static assets

### Recommended Hosting

**Backend:**
- AWS EC2 / AWS Lambda
- Google Cloud Run
- Heroku
- DigitalOcean

**Frontend:**
- Vercel
- Netlify
- AWS S3 + CloudFront
- Firebase Hosting

**Database:**
- MongoDB Atlas (recommended)
- AWS DocumentDB
- Self-hosted MongoDB with replicas

### Environment Variables for Production

```env
NODE_ENV=production
PORT=5000
FRONTEND_URL=https://yourapp.com

MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/hrms

JWT_SECRET=your-production-secret-minimum-32-characters-long
JWT_EXPIRE=7d

SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=your-sendgrid-api-key
SMTP_FROM=noreply@yourcompany.com
```

## 📄 License

This project is proprietary software. Unauthorized sharing or distribution is strictly prohibited.

**© 2025 WEintegrity. All rights reserved.**

## 🤝 Support

For support and inquiries, contact your HR system administrator.

## 📝 Sprint Planning

### Sprint 1: ✅ Complete
- Authentication (login, registration, MFA)
- Role-based access control
- Forgot password & account locking

### Sprint 2: ✅ Complete
- Leave approval workflows
- Payroll approval workflows
- Self-service dashboard
- Email notifications

### Sprint 3: ✅ Complete
- Time logging and attendance
- Exit interview module
- Notification system
- Reports generation

### Sprint 4: ✅ Complete
- Data protection features
- Employee profile management
- Advanced reporting with analytics
- System documentation

## 🎉 All Requirements Completed!

This system fully implements all 12 user stories across 8 epics as specified in the Product Requirements Document, with additional enterprise-grade features for production readiness.
