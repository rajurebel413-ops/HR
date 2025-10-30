# API Integration Guide

## Overview

This guide explains how to integrate the backend API services with the frontend React components. The project includes a complete API service layer in the `services/` directory that can be used to replace mock data with real backend calls.

## Architecture

### Frontend API Service Layer

```
services/
├── api.ts                  # Axios instance with interceptors
├── authService.ts          # Authentication endpoints
├── employeeService.ts      # Employee management
├── departmentService.ts    # Department management
├── attendanceService.ts    # Attendance tracking
├── leaveService.ts         # Leave management
├── payrollService.ts       # Payroll operations
├── notificationService.ts  # Notifications
└── index.ts               # Export all services
```

### Backend API Structure

```
server/
├── config/
│   └── database.js        # MongoDB connection
├── models/                # Mongoose schemas
├── routes/                # Express routes
├── middleware/
│   └── auth.js           # JWT authentication
└── server.js             # Express app
```

## Authentication Flow

### Current Implementation (Mock Data)

The current `App.tsx` uses mock data for authentication:

```typescript
const handleLogin = useCallback((user: User) => {
  setCurrentUser(user);
  // ... rest of logic
}, []);
```

### Integrated Implementation (Real API)

Here's how to integrate the authentication API:

```typescript
import { authService } from './services';

const handleLogin = async (email: string, password: string) => {
  try {
    // Step 1: Login (returns user without token)
    const { user } = await authService.login({ email, password });
    setCurrentUser(user);
    
    // Step 2: Setup or verify MFA
    if (user.isMfaSetup) {
      setAuthState('needsMfaVerification');
    } else {
      setAuthState('needsMfaSetup');
    }
  } catch (error) {
    console.error('Login failed:', error);
    addToast({ type: 'error', message: 'Login failed. Please try again.' });
  }
};

const handleMfaSetup = async (userId: string) => {
  try {
    const { qrCode, secret } = await authService.setupMFA(userId);
    // Display QR code for user to scan
    return { qrCode, secret };
  } catch (error) {
    console.error('MFA setup failed:', error);
  }
};

const handleMfaVerify = async (userId: string, token: string, isSetup: boolean) => {
  try {
    const { token: jwtToken, user } = await authService.verifyMFA({
      userId,
      token,
      isSetup
    });
    
    // Token is automatically stored in localStorage by the service
    setCurrentUser(user);
    setAuthState('authenticated');
  } catch (error) {
    console.error('MFA verification failed:', error);
    addToast({ type: 'error', message: 'Invalid MFA code. Please try again.' });
  }
};
```

## Data Fetching Patterns

### Pattern 1: Load Data on Component Mount

Replace mock data with API calls using `useEffect`:

```typescript
import { employeeService } from '../services';

const EmployeesPage = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const data = await employeeService.getAllEmployees();
        setEmployees(data);
      } catch (error) {
        console.error('Failed to fetch employees:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    // ... render employees
  );
};
```

### Pattern 2: CRUD Operations

#### Create

```typescript
import { employeeService } from '../services';

const handleCreateEmployee = async (employeeData: Omit<Employee, 'id'>) => {
  try {
    const newEmployee = await employeeService.createEmployee(employeeData);
    setEmployees(prev => [...prev, newEmployee]);
    addToast({ type: 'success', message: 'Employee created successfully!' });
  } catch (error) {
    console.error('Failed to create employee:', error);
    addToast({ type: 'error', message: 'Failed to create employee' });
  }
};
```

#### Update

```typescript
const handleUpdateEmployee = async (id: string, updates: Partial<Employee>) => {
  try {
    const updatedEmployee = await employeeService.updateEmployee(id, updates);
    setEmployees(prev => prev.map(emp => emp.id === id ? updatedEmployee : emp));
    addToast({ type: 'success', message: 'Employee updated successfully!' });
  } catch (error) {
    console.error('Failed to update employee:', error);
    addToast({ type: 'error', message: 'Failed to update employee' });
  }
};
```

#### Delete

```typescript
const handleDeleteEmployee = async (id: string) => {
  try {
    await employeeService.deleteEmployee(id);
    setEmployees(prev => prev.filter(emp => emp.id !== id));
    addToast({ type: 'success', message: 'Employee deleted successfully!' });
  } catch (error) {
    console.error('Failed to delete employee:', error);
    addToast({ type: 'error', message: 'Failed to delete employee' });
  }
};
```

### Pattern 3: Attendance Clock In/Out

```typescript
import { attendanceService } from '../services';

const handleClockIn = async () => {
  try {
    const { record, message } = await attendanceService.clockIn();
    setTodayAttendanceRecord(record);
    addToast({ type: 'success', message });
  } catch (error) {
    console.error('Clock in failed:', error);
    addToast({ type: 'error', message: 'Failed to clock in' });
  }
};

const handleClockOut = async () => {
  try {
    const { record, message } = await attendanceService.clockOut();
    setTodayAttendanceRecord(record);
    addToast({ type: 'success', message });
  } catch (error) {
    console.error('Clock out failed:', error);
    addToast({ type: 'error', message: 'Failed to clock out' });
  }
};
```

### Pattern 4: Leave Management

```typescript
import { leaveService } from '../services';

const handleApplyLeave = async (leaveData: Omit<LeaveRequest, 'id' | 'status' | 'employeeId' | 'employeeName'>) => {
  try {
    const newLeaveRequest = await leaveService.createLeaveRequest(leaveData);
    setLeaveRequests(prev => [newLeaveRequest, ...prev]);
    addToast({ type: 'success', message: 'Leave request submitted successfully!' });
  } catch (error) {
    console.error('Failed to submit leave request:', error);
    addToast({ type: 'error', message: 'Failed to submit leave request' });
  }
};

const handleLeaveAction = async (requestId: string, status: 'Approved' | 'Rejected') => {
  try {
    const updatedRequest = await leaveService.updateLeaveRequestStatus(requestId, status);
    setLeaveRequests(prev => prev.map(req => req.id === requestId ? updatedRequest : req));
    addToast({ type: 'success', message: `Leave request ${status.toLowerCase()} successfully!` });
  } catch (error) {
    console.error('Failed to update leave request:', error);
    addToast({ type: 'error', message: 'Failed to update leave request' });
  }
};
```

## Custom Hooks for API Integration

### useEmployees Hook

Create reusable hooks for common operations:

```typescript
// hooks/useEmployees.ts
import { useState, useEffect } from 'react';
import { employeeService } from '../services';
import { Employee } from '../types';

export const useEmployees = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const data = await employeeService.getAllEmployees();
      setEmployees(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch employees');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const createEmployee = async (employeeData: Omit<Employee, 'id'>) => {
    try {
      const newEmployee = await employeeService.createEmployee(employeeData);
      setEmployees(prev => [...prev, newEmployee]);
      return newEmployee;
    } catch (err) {
      setError('Failed to create employee');
      throw err;
    }
  };

  const updateEmployee = async (id: string, updates: Partial<Employee>) => {
    try {
      const updated = await employeeService.updateEmployee(id, updates);
      setEmployees(prev => prev.map(emp => emp.id === id ? updated : emp));
      return updated;
    } catch (err) {
      setError('Failed to update employee');
      throw err;
    }
  };

  const deleteEmployee = async (id: string) => {
    try {
      await employeeService.deleteEmployee(id);
      setEmployees(prev => prev.filter(emp => emp.id !== id));
    } catch (err) {
      setError('Failed to delete employee');
      throw err;
    }
  };

  return {
    employees,
    loading,
    error,
    fetchEmployees,
    createEmployee,
    updateEmployee,
    deleteEmployee
  };
};
```

Usage:

```typescript
const EmployeesPage = () => {
  const { employees, loading, error, createEmployee, updateEmployee, deleteEmployee } = useEmployees();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    // ... render employees with CRUD operations
  );
};
```

## Error Handling

### Global Error Handler (Already Implemented)

The API client (`services/api.ts`) includes automatic error handling:

```typescript
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Automatically logout on 401
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);
```

### Component-Level Error Handling

```typescript
const handleOperation = async () => {
  try {
    await someApiCall();
    addToast({ type: 'success', message: 'Operation successful!' });
  } catch (error) {
    if (error.response?.status === 403) {
      addToast({ type: 'error', message: 'You don\'t have permission for this action' });
    } else if (error.response?.status === 404) {
      addToast({ type: 'error', message: 'Resource not found' });
    } else if (error.response?.status === 400) {
      addToast({ type: 'error', message: error.response.data.message || 'Invalid data' });
    } else {
      addToast({ type: 'error', message: 'Something went wrong. Please try again.' });
    }
    console.error('Operation failed:', error);
  }
};
```

## Migration Strategy

### Step-by-Step Migration from Mock Data to Real API

1. **Start with Authentication** (Critical)
   - Update `LoginPage` to use `authService.login()`
   - Update MFA setup/verification
   - Test login flow thoroughly

2. **Migrate Read Operations**
   - Update components to fetch data on mount
   - Replace `mockEmployees` with `employeeService.getAllEmployees()`
   - Add loading states

3. **Migrate Create Operations**
   - Update forms to call API services
   - Handle success/error responses
   - Update local state after successful creation

4. **Migrate Update Operations**
   - Update edit forms to call API services
   - Implement optimistic updates if needed
   - Handle validation errors

5. **Migrate Delete Operations**
   - Update delete handlers
   - Add confirmation dialogs
   - Update local state after deletion

6. **Add Real-time Features** (Optional)
   - Implement polling for updates
   - Add WebSocket support for live notifications
   - Implement auto-refresh

### Hybrid Approach (Recommended for Testing)

You can run both mock and real data during migration:

```typescript
const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === 'true';

const fetchEmployees = async () => {
  if (USE_MOCK_DATA) {
    return mockEmployees;
  } else {
    return await employeeService.getAllEmployees();
  }
};
```

Add to `.env`:
```env
VITE_USE_MOCK_DATA=false
VITE_API_URL=http://localhost:5000/api
```

## Testing the Integration

### 1. Start the Backend

```bash
cd server
npm run dev
```

### 2. Verify Backend is Running

```bash
curl http://localhost:5000/api/health
# Should return: {"status":"ok","message":"HR Management API is running"}
```

### 3. Test Authentication

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@hrms.com","password":"password"}'
```

### 4. Start Frontend

```bash
npm run dev
```

### 5. Test in Browser

1. Open http://localhost:5173
2. Login with test credentials
3. Open browser DevTools → Network tab
4. Verify API calls are being made to `http://localhost:5000/api`

## Common Issues and Solutions

### CORS Errors

**Problem**: Browser blocks API requests

**Solution**: Ensure `FRONTEND_URL` in `server/.env` matches your frontend URL:
```env
FRONTEND_URL=http://localhost:5173
```

### 401 Unauthorized

**Problem**: API returns 401 for protected routes

**Solution**: Ensure token is being stored and sent:
- Check localStorage for `token`
- Verify token in Network tab → Request Headers → Authorization

### Network Errors

**Problem**: Cannot connect to backend

**Solution**:
- Verify backend is running: `curl http://localhost:5000/api/health`
- Check `VITE_API_URL` in `.env`
- Ensure no firewall blocking port 5000

### Data Not Updating

**Problem**: Changes not reflected in UI

**Solution**: Update local state after API calls:
```typescript
const data = await service.create(newData);
setState(prev => [...prev, data]); // Add this!
```

## Best Practices

### 1. Always Handle Loading States

```typescript
const [loading, setLoading] = useState(false);

const handleSubmit = async () => {
  setLoading(true);
  try {
    await apiCall();
  } finally {
    setLoading(false);
  }
};
```

### 2. Provide User Feedback

```typescript
try {
  await apiCall();
  addToast({ type: 'success', message: 'Success!' });
} catch (error) {
  addToast({ type: 'error', message: 'Failed!' });
}
```

### 3. Implement Optimistic Updates (Optional)

```typescript
const handleDelete = async (id: string) => {
  // Update UI immediately
  setData(prev => prev.filter(item => item.id !== id));
  
  try {
    await service.delete(id);
  } catch (error) {
    // Rollback on error
    setData(originalData);
    addToast({ type: 'error', message: 'Delete failed' });
  }
};
```

### 4. Cache Data When Appropriate

```typescript
const [employees, setEmployees] = useState<Employee[]>([]);
const [lastFetch, setLastFetch] = useState<number>(0);
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

const fetchEmployees = async (force = false) => {
  if (!force && Date.now() - lastFetch < CACHE_DURATION) {
    return; // Use cached data
  }
  
  const data = await employeeService.getAllEmployees();
  setEmployees(data);
  setLastFetch(Date.now());
};
```

### 5. Handle Concurrent Requests

```typescript
import { useRef } from 'react';

const abortControllerRef = useRef<AbortController>();

const fetchData = async () => {
  // Cancel previous request
  abortControllerRef.current?.abort();
  
  // Create new abort controller
  abortControllerRef.current = new AbortController();
  
  try {
    const data = await service.getData({ 
      signal: abortControllerRef.current.signal 
    });
    setData(data);
  } catch (error) {
    if (error.name !== 'AbortError') {
      console.error(error);
    }
  }
};
```

## Next Steps

1. ✅ Backend and API services are ready
2. ✅ Service layer is implemented
3. ⚠️ Frontend still uses mock data (for stability)
4. 📋 Follow this guide to migrate components one by one
5. 🧪 Test each component after migration
6. 🚀 Deploy when all components are migrated

## Summary

- **API Services**: Ready to use in `services/` directory
- **Migration Strategy**: Incremental, component by component
- **Testing**: Use hybrid approach during migration
- **Best Practices**: Loading states, error handling, user feedback
- **Documentation**: This guide + API_DOCUMENTATION.md

For backend API details, see [API_DOCUMENTATION.md](./API_DOCUMENTATION.md).

For setup instructions, see [FULLSTACK_SETUP.md](./FULLSTACK_SETUP.md).

---

**Ready to integrate?** Start with authentication, test thoroughly, then migrate other components one by one!
