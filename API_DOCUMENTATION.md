# WEintegrity HR Management System - API Documentation

## Base URL

```
Development: http://localhost:5000/api
Production: https://api.yourdomain.com/api
```

## Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## Response Format

### Success Response
```json
{
  "data": {},
  "message": "Success message"
}
```

### Error Response
```json
{
  "message": "Error message",
  "errors": []
}
```

## HTTP Status Codes

- `200` - OK
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `423` - Locked (Account locked)
- `500` - Internal Server Error

---

## Authentication Endpoints

### POST /auth/login
Login with email and password

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "user@example.com",
    "role": "Employee",
    "avatarUrl": "https://...",
    "isMfaSetup": true
  }
}
```

**Response (423 - Account Locked):**
```json
{
  "message": "Account locked due to multiple failed login attempts. Please try again in 30 minutes.",
  "lockedUntil": "2025-10-13T15:30:00.000Z"
}
```

**Response (401 - Failed Attempt):**
```json
{
  "message": "Invalid email or password. 3 attempts remaining.",
  "attemptsRemaining": 3
}
```

---

### POST /auth/forgot-password
Request password reset email

**Request:**
```json
{
  "email": "user@example.com"
}
```

**Response (200):**
```json
{
  "message": "Password reset instructions sent to your email."
}
```

---

### POST /auth/reset-password/:token
Reset password using token from email

**Parameters:**
- `token` (URL parameter) - Password reset token

**Request:**
```json
{
  "password": "newSecurePassword123"
}
```

**Response (200):**
```json
{
  "message": "Password reset successful. You can now login with your new password."
}
```

**Response (400):**
```json
{
  "message": "Invalid or expired reset token"
}
```

---

### POST /auth/change-password
Change password for logged-in user

**Headers:** `Authorization: Bearer <token>` (Required)

**Request:**
```json
{
  "currentPassword": "oldPassword123",
  "newPassword": "newSecurePassword123"
}
```

**Response (200):**
```json
{
  "message": "Password changed successfully"
}
```

---

### POST /auth/mfa/setup
Setup MFA for user

**Request:**
```json
{
  "userId": "507f1f77bcf86cd799439011"
}
```

**Response (200):**
```json
{
  "secret": "JBSWY3DPEHPK3PXP",
  "qrCode": "data:image/png;base64,iVBORw0KGgoAAAANS..."
}
```

---

### POST /auth/mfa/verify
Verify MFA token

**Request:**
```json
{
  "userId": "507f1f77bcf86cd799439011",
  "token": "123456",
  "isSetup": false
}
```

**Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "user@example.com",
    "role": "Employee",
    "avatarUrl": "https://...",
    "isMfaSetup": true
  }
}
```

---

### GET /auth/me
Get current authenticated user

**Headers:** `Authorization: Bearer <token>` (Required)

**Response (200):**
```json
{
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "user@example.com",
    "role": "Employee",
    "avatarUrl": "https://...",
    "isMfaSetup": true
  }
}
```

---

## Employee Endpoints

### GET /employees
Get all employees

**Headers:** `Authorization: Bearer <token>` (Required)

**Response (200):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "employeeId": "EMP0001",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "departmentId": {
      "_id": "...",
      "name": "Engineering"
    },
    "role": "Software Engineer",
    "joinDate": "2025-01-01T00:00:00.000Z",
    "status": "Active",
    "employeeType": "Permanent",
    "salary": 60000,
    "createdAt": "2025-01-01T00:00:00.000Z"
  }
]
```

---

### GET /employees/:id
Get employee by ID

**Headers:** `Authorization: Bearer <token>` (Required)

**Parameters:**
- `id` (URL parameter) - Employee ID

**Response (200):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "employeeId": "EMP0001",
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "departmentId": {
    "_id": "...",
    "name": "Engineering"
  },
  "userId": {
    "_id": "...",
    "email": "john@example.com",
    "role": "Employee"
  },
  "role": "Software Engineer",
  "joinDate": "2025-01-01T00:00:00.000Z",
  "status": "Active",
  "employeeType": "Permanent",
  "salary": 60000
}
```

---

### POST /employees
Create new employee (Admin, HR only)

**Headers:** `Authorization: Bearer <token>` (Required)

**Roles:** Admin, HR

**Request:**
```json
{
  "employeeId": "EMP0001",
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "departmentId": "507f1f77bcf86cd799439011",
  "role": "Software Engineer",
  "joinDate": "2025-01-01",
  "employeeType": "Permanent",
  "salary": 60000,
  "password": "optional-password"
}
```

**Response (201):**
```json
{
  "employee": {
    "_id": "...",
    "employeeId": "EMP0001",
    "name": "John Doe",
    ...
  },
  "message": "Employee created successfully. Welcome email sent with login credentials."
}
```

---

### PUT /employees/:id
Update employee

**Headers:** `Authorization: Bearer <token>` (Required)

**Roles:** Admin, HR

**Request:**
```json
{
  "name": "John Updated Doe",
  "phone": "+0987654321",
  "salary": 65000,
  "status": "Active"
}
```

**Response (200):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "employeeId": "EMP0001",
  "name": "John Updated Doe",
  ...
}
```

---

### DELETE /employees/:id
Delete employee (Admin, HR only)

**Headers:** `Authorization: Bearer <token>` (Required)

**Roles:** Admin, HR

**Response (200):**
```json
{
  "message": "Employee removed"
}
```

---

## Leave Management Endpoints

### GET /leaves
Get all leave requests (with filters)

**Headers:** `Authorization: Bearer <token>` (Required)

**Query Parameters:**
- `employeeId` (optional) - Filter by employee
- `status` (optional) - Filter by status (Pending, Approved, Rejected)

**Response (200):**
```json
[
  {
    "_id": "...",
    "employeeId": {
      "_id": "...",
      "name": "John Doe"
    },
    "employeeName": "John Doe",
    "leaveType": "Sick Leave",
    "startDate": "2025-10-20T00:00:00.000Z",
    "endDate": "2025-10-22T00:00:00.000Z",
    "days": 3,
    "reason": "Medical appointment",
    "status": "Pending",
    "createdAt": "2025-10-13T00:00:00.000Z"
  }
]
```

---

### GET /leaves/balance/:employeeId
Get leave balance for employee

**Headers:** `Authorization: Bearer <token>` (Required)

**Response (200):**
```json
{
  "_id": "...",
  "employeeId": "...",
  "balances": [
    {
      "type": "Sick Leave",
      "total": 10,
      "used": 2,
      "pending": 1
    },
    {
      "type": "Casual Leave",
      "total": 12,
      "used": 3,
      "pending": 0
    },
    {
      "type": "Annual Leave",
      "total": 20,
      "used": 5,
      "pending": 2
    }
  ]
}
```

---

### POST /leaves
Submit leave request

**Headers:** `Authorization: Bearer <token>` (Required)

**Request:**
```json
{
  "employeeId": "507f1f77bcf86cd799439011",
  "employeeName": "John Doe",
  "leaveType": "Sick Leave",
  "startDate": "2025-10-20",
  "endDate": "2025-10-22",
  "reason": "Medical appointment"
}
```

**Response (201):**
```json
{
  "_id": "...",
  "employeeId": {...},
  "leaveType": "Sick Leave",
  "startDate": "2025-10-20T00:00:00.000Z",
  "endDate": "2025-10-22T00:00:00.000Z",
  "days": 3,
  "reason": "Medical appointment",
  "status": "Pending"
}
```

---

### PUT /leaves/:id
Approve or reject leave request (Manager, HR, Admin only)

**Headers:** `Authorization: Bearer <token>` (Required)

**Roles:** Manager, HR, Admin

**Request:**
```json
{
  "status": "Approved"
}
```

**Response (200):**
```json
{
  "_id": "...",
  "status": "Approved",
  ...
}
```

---

### DELETE /leaves/:id
Delete leave request (pending only)

**Headers:** `Authorization: Bearer <token>` (Required)

**Response (200):**
```json
{
  "message": "Leave request removed"
}
```

---

## Payroll Endpoints

### GET /payroll
Get all payroll records

**Headers:** `Authorization: Bearer <token>` (Required)

**Query Parameters:**
- `employeeId` (optional)
- `month` (optional) - 0-11
- `year` (optional)

**Response (200):**
```json
[
  {
    "_id": "...",
    "employeeId": {...},
    "month": 9,
    "year": 2025,
    "basic": 2500,
    "allowances": {
      "hra": 1000,
      "special": 500
    },
    "deductions": {
      "tax": 300,
      "providentFund": 300,
      "absence": 0
    },
    "grossPay": 4000,
    "netPay": 3400,
    "status": "Approved",
    "approvedBy": {...},
    "approvedAt": "2025-10-01T00:00:00.000Z"
  }
]
```

---

### POST /payroll/generate
Generate payroll for month (Admin, HR only)

**Headers:** `Authorization: Bearer <token>` (Required)

**Roles:** Admin, HR

**Request:**
```json
{
  "month": 9,
  "year": 2025
}
```

**Response (201):**
```json
[
  {
    "_id": "...",
    "employeeId": {...},
    "month": 9,
    "year": 2025,
    "grossPay": 4000,
    "netPay": 3400,
    "status": "Pending Approval"
  }
]
```

---

### PUT /payroll/:id/approve
Approve payroll (Admin, HR only)

**Headers:** `Authorization: Bearer <token>` (Required)

**Roles:** Admin, HR

**Response (200):**
```json
{
  "_id": "...",
  "status": "Approved",
  "approvedBy": {...},
  "approvedAt": "2025-10-13T12:00:00.000Z"
}
```

---

### PUT /payroll/:id/reject
Reject payroll (Admin, HR only)

**Headers:** `Authorization: Bearer <token>` (Required)

**Roles:** Admin, HR

**Request:**
```json
{
  "rejectionReason": "Incorrect tax calculation"
}
```

**Response (200):**
```json
{
  "_id": "...",
  "status": "Rejected",
  "rejectionReason": "Incorrect tax calculation",
  "approvedBy": {...},
  "approvedAt": "2025-10-13T12:00:00.000Z"
}
```

---

## Exit Interview Endpoints

### GET /exit-interviews
Get all exit interviews (Admin, HR only)

**Headers:** `Authorization: Bearer <token>` (Required)

**Roles:** Admin, HR

**Query Parameters:**
- `status` (optional) - Pending, Approved, Rejected

**Response (200):**
```json
[
  {
    "_id": "...",
    "employeeId": {...},
    "userId": {...},
    "resignationDate": "2025-10-15T00:00:00.000Z",
    "lastWorkingDay": "2025-10-30T00:00:00.000Z",
    "reasonForLeaving": "Better Opportunity",
    "overallExperience": 4,
    "managementRating": 5,
    "workEnvironmentRating": 4,
    "compensationRating": 3,
    "careerGrowthRating": 3,
    "wouldRecommend": true,
    "wouldRejoin": true,
    "improvements": "Better work-life balance",
    "positiveAspects": "Great team culture",
    "status": "Pending",
    "createdAt": "2025-10-13T00:00:00.000Z"
  }
]
```

---

### GET /exit-interviews/my
Get exit interview for logged-in employee

**Headers:** `Authorization: Bearer <token>` (Required)

**Response (200):**
```json
{
  "_id": "...",
  "resignationDate": "2025-10-15T00:00:00.000Z",
  ...
}
```

---

### POST /exit-interviews
Submit exit interview

**Headers:** `Authorization: Bearer <token>` (Required)

**Request:**
```json
{
  "resignationDate": "2025-10-15",
  "lastWorkingDay": "2025-10-30",
  "reasonForLeaving": "Better Opportunity",
  "newEmployer": "Tech Corp",
  "overallExperience": 4,
  "managementRating": 5,
  "workEnvironmentRating": 4,
  "compensationRating": 3,
  "careerGrowthRating": 3,
  "wouldRecommend": true,
  "wouldRejoin": true,
  "improvements": "Better work-life balance",
  "positiveAspects": "Great team culture",
  "additionalComments": "Thank you for the opportunity"
}
```

**Response (201):**
```json
{
  "_id": "...",
  "status": "Pending",
  ...
}
```

---

### PUT /exit-interviews/:id/approve
Approve exit interview (Admin, HR only)

**Headers:** `Authorization: Bearer <token>` (Required)

**Roles:** Admin, HR

**Response (200):**
```json
{
  "_id": "...",
  "status": "Approved",
  "reviewedBy": {...},
  "reviewedAt": "2025-10-13T12:00:00.000Z"
}
```

---

### PUT /exit-interviews/:id/reject
Reject exit interview (Admin, HR only)

**Headers:** `Authorization: Bearer <token>` (Required)

**Roles:** Admin, HR

**Request:**
```json
{
  "rejectionReason": "Please provide more details"
}
```

**Response (200):**
```json
{
  "_id": "...",
  "status": "Rejected",
  "rejectionReason": "Please provide more details",
  "reviewedBy": {...},
  "reviewedAt": "2025-10-13T12:00:00.000Z"
}
```

---

## Reports Endpoints

### GET /reports/employee
Get employee report (Admin, HR, Manager only)

**Headers:** `Authorization: Bearer <token>` (Required)

**Roles:** Admin, HR, Manager

**Query Parameters:**
- `departmentId` (optional)
- `status` (optional)
- `employeeType` (optional)
- `startDate` (optional)
- `endDate` (optional)

**Response (200):**
```json
{
  "totalEmployees": 50,
  "byDepartment": {
    "Engineering": 20,
    "HR": 5,
    "Sales": 15,
    "Marketing": 10
  },
  "byStatus": {
    "Active": 48,
    "Inactive": 2
  },
  "byEmployeeType": {
    "Permanent": 40,
    "Contract": 8,
    "Intern": 2
  },
  "employees": [...]
}
```

---

### GET /reports/attendance
Get attendance report (Admin, HR, Manager only)

**Headers:** `Authorization: Bearer <token>` (Required)

**Roles:** Admin, HR, Manager

**Query Parameters:**
- `employeeId` (optional)
- `startDate` (optional)
- `endDate` (optional)
- `status` (optional)

**Response (200):**
```json
{
  "totalRecords": 150,
  "byStatus": {
    "Present": 120,
    "Absent": 10,
    "Half Day": 15,
    "On Leave": 5
  },
  "totalWorkingHours": 1200,
  "averageWorkingHours": "8.00",
  "records": [...]
}
```

---

### GET /reports/leave
Get leave report (Admin, HR, Manager only)

**Headers:** `Authorization: Bearer <token>` (Required)

**Roles:** Admin, HR, Manager

**Query Parameters:**
- `employeeId` (optional)
- `status` (optional)
- `leaveType` (optional)
- `startDate` (optional)
- `endDate` (optional)

**Response (200):**
```json
{
  "totalRequests": 75,
  "byStatus": {
    "Pending": 10,
    "Approved": 55,
    "Rejected": 10
  },
  "byLeaveType": {
    "Sick Leave": 20,
    "Casual Leave": 30,
    "Annual Leave": 25
  },
  "totalDays": 225,
  "requests": [...]
}
```

---

### GET /reports/payroll
Get payroll report (Admin, HR only)

**Headers:** `Authorization: Bearer <token>` (Required)

**Roles:** Admin, HR

**Query Parameters:**
- `month` (optional)
- `year` (optional)
- `status` (optional)

**Response (200):**
```json
{
  "totalRecords": 50,
  "byStatus": {
    "Pending Approval": 5,
    "Approved": 40,
    "Paid": 5
  },
  "totalGrossPay": 200000,
  "totalNetPay": 170000,
  "totalDeductions": 30000,
  "records": [...]
}
```

---

### GET /reports/exit-interviews
Get exit interviews report (Admin, HR only)

**Headers:** `Authorization: Bearer <token>` (Required)

**Roles:** Admin, HR

**Query Parameters:**
- `status` (optional)
- `startDate` (optional)
- `endDate` (optional)

**Response (200):**
```json
{
  "totalInterviews": 15,
  "byReason": {
    "Better Opportunity": 7,
    "Career Growth": 3,
    "Relocation": 2,
    "Personal Reasons": 3
  },
  "byStatus": {
    "Pending": 2,
    "Approved": 12,
    "Rejected": 1
  },
  "averageRatings": {
    "overall": "3.80",
    "management": "4.20",
    "workEnvironment": "4.00",
    "compensation": "3.50",
    "careerGrowth": "3.40"
  },
  "wouldRecommendCount": 12,
  "wouldRejoinCount": 8,
  "interviews": [...]
}
```

---

### GET /reports/dashboard-stats
Get dashboard statistics (Admin, HR, Manager only)

**Headers:** `Authorization: Bearer <token>` (Required)

**Roles:** Admin, HR, Manager

**Response (200):**
```json
{
  "employees": {
    "total": 50,
    "newThisMonth": 3
  },
  "leaves": {
    "pending": 5,
    "approvedThisMonth": 15
  },
  "attendance": {
    "presentToday": 45
  },
  "exitInterviews": {
    "pending": 2
  },
  "payroll": {
    "pendingApproval": 5
  }
}
```

---

## Attendance Endpoints

### GET /attendance
Get attendance records

**Headers:** `Authorization: Bearer <token>` (Required)

### POST /attendance/clock-in
Clock in

**Headers:** `Authorization: Bearer <token>` (Required)

### POST /attendance/clock-out
Clock out

**Headers:** `Authorization: Bearer <token>` (Required)

---

## Department Endpoints

### GET /departments
Get all departments

**Headers:** `Authorization: Bearer <token>` (Required)

### POST /departments
Create department (Admin, HR only)

**Headers:** `Authorization: Bearer <token>` (Required)

**Roles:** Admin, HR

---

## Notification Endpoints

### GET /notifications
Get notifications for logged-in user

**Headers:** `Authorization: Bearer <token>` (Required)

### PUT /notifications/:id/read
Mark notification as read

**Headers:** `Authorization: Bearer <token>` (Required)

---

## Health Check

### GET /health
Check API health (no authentication required)

**Response (200):**
```json
{
  "status": "ok",
  "message": "HR Management API is running"
}
```

---

## Rate Limiting

- **General API**: 100 requests per 15 minutes per IP
- **Authentication endpoints**: 5 requests per 15 minutes per IP
- **Email sending**: 10 emails per hour per user

---

## Error Codes

| Code | Description |
|------|-------------|
| 1001 | Invalid credentials |
| 1002 | Account locked |
| 1003 | MFA required |
| 1004 | Invalid MFA token |
| 2001 | Resource not found |
| 2002 | Validation error |
| 3001 | Permission denied |
| 3002 | Token expired |
| 5001 | Database error |
| 5002 | Email sending error |

---

**Last Updated**: October 13, 2025
**API Version**: 1.0.0
