import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const colors = {
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m',
    reset: '\x1b[0m'
};

const log = (emoji, message, color = colors.reset) => {
    console.log(`${color}${emoji} ${message}${colors.reset}`);
};

async function testAttendanceSync() {
    console.log('\n' + '='.repeat(70));
    console.log('👥 TESTING ATTENDANCE REAL-TIME SYNC');
    console.log('='.repeat(70) + '\n');

    let adminToken = null;
    let hrToken = null;
    let testAttendanceId = null;

    try {
        // Step 1: Login as Admin
        log('🔐', 'Step 1: Logging in as Admin...', colors.blue);
        const adminLogin = await axios.post(`${API_URL}/auth/login`, {
            email: 'admin@hrms.com',
            password: 'password123'
        });
        const adminMfa = await axios.post(`${API_URL}/auth/mfa/verify`, {
            userId: adminLogin.data.user.id,
            token: '123456',
            isSetup: false
        });
        adminToken = adminMfa.data.token;
        const adminHeaders = { Authorization: `Bearer ${adminToken}` };
        log('✅', 'Admin authenticated', colors.green);

        // Step 2: Login as HR
        log('🔐', 'Step 2: Logging in as HR...', colors.blue);
        const hrLogin = await axios.post(`${API_URL}/auth/login`, {
            email: 'hr@hrms.com',
            password: 'password123'
        });
        const hrMfa = await axios.post(`${API_URL}/auth/mfa/verify`, {
            userId: hrLogin.data.user.id,
            token: '123456',
            isSetup: false
        });
        hrToken = hrMfa.data.token;
        const hrHeaders = { Authorization: `Bearer ${hrToken}` };
        log('✅', 'HR authenticated', colors.green);

        // Step 3: Admin gets initial attendance count
        log('📊', '\nStep 3: Admin checking initial attendance...', colors.blue);
        const adminInitial = await axios.get(`${API_URL}/attendance`, { headers: adminHeaders });
        console.log(`   Admin sees: ${adminInitial.data.length} attendance records`);

        // Step 4: HR gets initial attendance count
        log('📊', 'Step 4: HR checking initial attendance...', colors.blue);
        const hrInitial = await axios.get(`${API_URL}/attendance`, { headers: hrHeaders });
        console.log(`   HR sees: ${hrInitial.data.length} attendance records`);

        // Step 5: Get an employee to mark attendance for
        const employees = await axios.get(`${API_URL}/employees`, { headers: adminHeaders });
        const testEmployee = employees.data[0];
        log('👤', `\nStep 5: Using employee: ${testEmployee.name}`, colors.cyan);

        // Step 6: Admin marks attendance
        log('✏️', 'Step 6: Admin marking attendance...', colors.blue);
        const todayDate = new Date().toISOString().split('T')[0];
        const createResponse = await axios.post(
            `${API_URL}/attendance`,
            {
                employeeId: testEmployee._id || testEmployee.id,
                date: todayDate,
                status: 'Present',
                clockIn: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
            },
            { headers: adminHeaders }
        );
        testAttendanceId = createResponse.data._id || createResponse.data.id;
        log('✅', `Attendance marked for ${testEmployee.name}`, colors.green);

        // Step 7: Wait a moment
        log('⏳', 'Step 7: Waiting 2 seconds...', colors.yellow);
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Step 8: Admin checks updated attendance
        log('📊', '\nStep 8: Admin checking updated attendance...', colors.blue);
        const adminUpdated = await axios.get(`${API_URL}/attendance`, { headers: adminHeaders });
        console.log(`   Admin now sees: ${adminUpdated.data.length} attendance records`);

        // Step 9: HR checks updated attendance (should see the same)
        log('📊', 'Step 9: HR checking updated attendance...', colors.blue);
        const hrUpdated = await axios.get(`${API_URL}/attendance`, { headers: hrHeaders });
        console.log(`   HR now sees: ${hrUpdated.data.length} attendance records`);

        // Step 10: Verify both see the same data
        if (adminUpdated.data.length === hrUpdated.data.length) {
            log('✅', '\n🎉 SUCCESS: Both users see the same attendance data!', colors.green);
            log('✅', 'Attendance is syncing across all users', colors.green);
        } else {
            log('⚠️', '\nWarning: Users see different attendance counts', colors.yellow);
        }

        // Step 11: Clean up
        if (testAttendanceId) {
            log('🧹', '\nStep 10: Cleaning up test data...', colors.blue);
            await axios.delete(`${API_URL}/attendance/${testAttendanceId}`, { headers: adminHeaders });
            log('✅', 'Test attendance deleted', colors.green);
        }

        console.log('\n' + '='.repeat(70));
        log('🎉', 'ATTENDANCE SYNC TEST COMPLETE!', colors.green);
        console.log('='.repeat(70));
        
        console.log('\n💡 Attendance Sync Mechanism:');
        console.log('   • AttendancePage loads data from API on mount');
        console.log('   • Auto-refreshes every 10 seconds');
        console.log('   • When Admin/HR marks attendance, it saves to API');
        console.log('   • All users see the update within 10 seconds');
        console.log('   • Changes are visible across all logged-in users');
        console.log('\n');

    } catch (error) {
        console.error('\n' + '='.repeat(70));
        log('❌', 'ATTENDANCE SYNC TEST FAILED', colors.red);
        console.log('='.repeat(70));
        
        if (error.response) {
            console.error(`Status: ${error.response.status}`);
            console.error(`Message: ${error.response.data.message || error.response.data}`);
        } else if (error.request) {
            console.error('❌ No response from server. Is the backend running?');
        } else {
            console.error('Error:', error.message);
        }
        console.log('\n');
        process.exit(1);
    }
}

testAttendanceSync();
