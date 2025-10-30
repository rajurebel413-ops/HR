# Quick Setup Guide

Follow these steps to get the HR Management System up and running.

## Step-by-Step Setup

### 1. Prerequisites Check

Before starting, ensure you have:

- ✅ Node.js v18+ installed (`node --version`)
- ✅ MongoDB v6+ installed and running
- ✅ npm or yarn package manager

### 2. Install MongoDB (if not installed)

#### macOS
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

#### Ubuntu/Debian
```bash
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod
```

#### Windows
Download and install from: https://www.mongodb.com/try/download/community

### 3. Verify MongoDB is Running

```bash
# Try connecting to MongoDB
mongosh

# You should see a MongoDB shell prompt
# Type 'exit' to exit
```

### 4. Install Dependencies

#### Frontend
```bash
# In the workspace root directory
npm install
```

#### Backend
```bash
cd server
npm install
cd ..
```

### 5. Configure Environment

```bash
cd server
cp .env.example .env
```

The default `.env` is already configured for local development. You can keep it as is.

### 6. Seed the Database

This creates test users and sample data:

```bash
cd server
npm run seed
```

Expected output:
```
✅ Database seeded successfully!

Test Accounts:
Admin: admin@hrms.com / password123
HR: hr@hrms.com / password123
Manager: manager@hrms.com / password123
Employee: employee@hrms.com / password123
```

### 7. Start the Backend Server

```bash
# From the server directory
npm run dev
```

Expected output:
```
Server is running on port 5000
Environment: development
MongoDB Connected: localhost
```

### 8. Start the Frontend (New Terminal)

```bash
# From the workspace root directory
npm run dev
```

Expected output:
```
  VITE v6.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

### 9. Access the Application

Open your browser and navigate to:
```
http://localhost:5173
```

### 10. Login

Use any of the test accounts:

**Admin Account (Full Access)**
- Email: `admin@hrms.com`
- Password: `password123`

**Employee Account**
- Email: `employee@hrms.com`
- Password: `password123`

### 11. MFA Setup (Optional)

On first login, you'll be asked to set up MFA:
1. Scan the QR code with Google Authenticator or Authy
2. Enter the 6-digit code
3. You're logged in!

**Note**: For testing, you can disable MFA by clicking "Skip" or using the mock token.

## Common Issues

### Issue: Cannot connect to MongoDB

**Solution**:
```bash
# Check if MongoDB is running
brew services list  # macOS
sudo systemctl status mongod  # Linux

# Start MongoDB if not running
brew services start mongodb-community  # macOS
sudo systemctl start mongod  # Linux
```

### Issue: Port 5000 already in use

**Solution**:
```bash
# Find and kill the process
lsof -ti:5000 | xargs kill -9

# Or change the port in server/.env
PORT=5001
```

### Issue: Port 5173 already in use

**Solution**:
```bash
# Find and kill the process
lsof -ti:5173 | xargs kill -9
```

### Issue: Module not found errors

**Solution**:
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Do the same for server
cd server
rm -rf node_modules package-lock.json
npm install
```

### Issue: TypeScript errors

**Solution**:
```bash
# Run TypeScript check
npx tsc --noEmit

# This will show you any TypeScript errors
```

## Testing the System

### 1. Test Employee Management
- Login as Admin or HR
- Go to "Employees" page
- Add a new employee
- Edit employee details
- View employee list

### 2. Test Attendance
- Login as Employee
- The system auto clock-ins on login
- Check the dashboard for attendance info
- Clock out from dashboard

### 3. Test Leave Management
- Login as Employee
- Go to "My Leaves"
- Apply for leave
- Login as Manager/HR
- Go to "Leave Requests"
- Approve or reject the leave

### 4. Test Payroll
- Login as HR or Admin
- Go to "Payroll"
- Click "Run Payroll" tab
- Generate payroll for last month
- View payslips
- Mark as paid

## Next Steps

1. **Customize the System**
   - Update company logo in LoginPage and Topbar
   - Modify color scheme in CSS
   - Add custom fields to models

2. **Production Deployment**
   - Set up MongoDB Atlas for database
   - Deploy backend to Heroku/AWS/DigitalOcean
   - Deploy frontend to Vercel/Netlify
   - Configure environment variables

3. **Add More Features**
   - Email notifications
   - File uploads for documents
   - Performance reviews
   - Training management
   - Asset management

## Getting Help

If you encounter any issues:
1. Check the error messages in browser console (F12)
2. Check backend logs in terminal
3. Verify MongoDB is running: `mongosh`
4. Review the [README.md](README.md) for more details
5. Check [server/README.md](server/README.md) for API documentation

## Success Checklist

- [ ] MongoDB is installed and running
- [ ] Frontend dependencies installed
- [ ] Backend dependencies installed
- [ ] Database seeded successfully
- [ ] Backend server running on port 5000
- [ ] Frontend running on port 5173
- [ ] Can login with test account
- [ ] Can navigate between pages
- [ ] Can perform CRUD operations

If all items are checked, you're all set! 🎉

---

**Happy coding!** 🚀
