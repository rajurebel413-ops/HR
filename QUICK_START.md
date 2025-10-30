# 🚀 Quick Start Guide

## ✅ System is Ready!

Both servers are running and all APIs are working.

---

## 🔐 Login Now

### 1. Open Browser
Go to: **http://localhost:3000**

### 2. Enter Credentials
- **Email**: `admin@hrms.com`
- **Password**: `password123`
- Click **Sign In**

### 3. Email Verification
You'll see the Email Verification page with a purple box that says:

```
Development Mode
Email not configured. Use code: 123456
```

- Click **"Send Verification Code"**
- Enter: **123456**
- Click **"Verify Code"**

### 4. You're In! 🎉
You should now see the HR Management Dashboard.

---

## 🧪 Test CRUD Operations

### Departments
1. Click **"Departments"** in left sidebar
2. Click **"Add Department"** button
3. Enter a name and save
4. Try editing and deleting

### Employees
1. Click **"Employees"** in left sidebar
2. Click **"Add Employee"** button
3. Fill in the form and save
4. Try editing and deleting

### Leaves
1. Click **"My Leaves"** in left sidebar
2. Click **"Apply Leave"** button
3. Select dates and type
4. Submit request

### Leave Management (Admin)
1. Click **"Leave Requests"** in left sidebar
2. See all pending requests
3. Approve or reject them

---

## 📊 Verify Everything Works

Run the automated test:
```bash
node test-complete-flow-fixed.js
```

Expected output:
```
🎉 ALL TESTS PASSED!
✅ Authentication: Working
✅ Email Verification: Working (Dev Mode)
✅ Departments CRUD: Working
✅ Employees CRUD: Working
✅ Leaves CRUD: Working
✅ Attendance: Working
```

---

## 🔧 Servers Running

- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:5000
- **Database**: MongoDB (127.0.0.1:27017)

---

## 📚 More Information

- **Full Login Guide**: See `FRONTEND_LOGIN_GUIDE.md`
- **Fixes Applied**: See `FIXES_APPLIED_TODAY.md`
- **System Status**: See `SYSTEM_STATUS_DASHBOARD.md`

---

## 🆘 Need Help?

### Login Not Working?
- Check browser console (F12)
- Verify backend is running: http://localhost:5000/api/health

### Email Verification Error?
- Use the bypass code: **123456**
- It's shown in the purple box on the verification page

### CRUD Not Working?
- Refresh the page
- Check browser console for errors
- Verify you're logged in

---

**Everything is ready to go! Start testing now! 🚀**
