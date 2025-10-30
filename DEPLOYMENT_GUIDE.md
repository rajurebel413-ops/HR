  # WEintegrity HR Management System - Deployment Guide

## 🚀 Production Deployment Guide

This guide covers deploying the WEintegrity HR Management System to production environments.

## Table of Contents

1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [Database Setup](#database-setup)
3. [Backend Deployment](#backend-deployment)
4. [Frontend Deployment](#frontend-deployment)
5. [Email Service Configuration](#email-service-configuration)
6. [Security Configuration](#security-configuration)
7. [Monitoring & Logging](#monitoring--logging)
8. [Backup Strategy](#backup-strategy)
9. [Scaling Considerations](#scaling-considerations)

## Pre-Deployment Checklist

### ✅ Environment Preparation

- [ ] Production domain purchased and configured
- [ ] SSL/TLS certificates obtained
- [ ] Cloud hosting accounts set up
- [ ] Email service provider configured (SendGrid, AWS SES, etc.)
- [ ] MongoDB production instance ready
- [ ] Environment variables documented and secured
- [ ] CI/CD pipeline configured
- [ ] Monitoring tools set up

### ✅ Code Preparation

- [ ] All tests passing
- [ ] Production environment variables set
- [ ] Build process tested
- [ ] Dependencies audited for security vulnerabilities
- [ ] Error handling reviewed
- [ ] Logging configured appropriately
- [ ] Rate limiting implemented

## Database Setup

### MongoDB Atlas (Recommended)

1. **Create MongoDB Atlas Account**
   - Go to https://www.mongodb.com/cloud/atlas
   - Sign up for free tier or paid tier based on needs

2. **Create Cluster**
   ```
   - Select cloud provider (AWS, GCP, or Azure)
   - Choose region closest to your application server
   - Select cluster tier (M10+ recommended for production)
   - Enable automated backups
   ```

3. **Configure Network Access**
   ```
   - Add IP addresses that need access
   - For production, use specific IPs, not 0.0.0.0/0
   - Configure VPC peering for enhanced security
   ```

4. **Create Database User**
   ```
   - Username: hrms_prod_user
   - Password: Use strong, randomly generated password
   - Roles: Read and write to specific database
   ```

5. **Get Connection String**
   ```
   mongodb+srv://<username>:<password>@cluster.mongodb.net/hr_management_system?retryWrites=true&w=majority
   ```

6. **Initial Data Migration**
   ```bash
   # Export from development
   mongodump --uri="mongodb://localhost:27017/hr_management_system" --out=./dump
   
   # Import to production
   mongorestore --uri="mongodb+srv://user:pass@cluster.mongodb.net" ./dump
   ```

### Database Indexes

Create indexes for optimal performance:

```javascript
// In MongoDB Shell or Compass
use hr_management_system;

// User indexes
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ role: 1 });

// Employee indexes
db.employees.createIndex({ employeeId: 1 }, { unique: true });
db.employees.createIndex({ userId: 1 });
db.employees.createIndex({ departmentId: 1 });
db.employees.createIndex({ status: 1 });

// Leave Request indexes
db.leaverequests.createIndex({ employeeId: 1 });
db.leaverequests.createIndex({ status: 1 });
db.leaverequests.createIndex({ startDate: 1 });

// Payroll indexes
db.payrolls.createIndex({ employeeId: 1, month: 1, year: 1 }, { unique: true });
db.payrolls.createIndex({ status: 1 });

// Attendance indexes
db.attendances.createIndex({ employeeId: 1, date: 1 });
db.attendances.createIndex({ date: 1 });
```

## Backend Deployment

### Option 1: AWS EC2

1. **Launch EC2 Instance**
   ```bash
   # Choose Ubuntu Server 22.04 LTS
   # Instance type: t3.small or larger
   # Configure security group:
   - Port 22 (SSH) - Your IP only
   - Port 5000 (API) - Load balancer only
   - Port 443 (HTTPS) - 0.0.0.0/0
   ```

2. **Install Dependencies**
   ```bash
   # Connect to instance
   ssh -i your-key.pem ubuntu@your-instance-ip
   
   # Update system
   sudo apt update && sudo apt upgrade -y
   
   # Install Node.js 18
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt install -y nodejs
   
   # Install PM2 for process management
   sudo npm install -g pm2
   
   # Install nginx for reverse proxy
   sudo apt install -y nginx
   ```

3. **Deploy Application**
   ```bash
   # Clone repository
   git clone https://github.com/yourorg/hr-management-system.git
   cd hr-management-system/server
   
   # Install dependencies
   npm install --production
   
   # Create .env file
   nano .env
   # Add production environment variables
   
   # Start with PM2
   pm2 start server.js --name hr-api
   pm2 save
   pm2 startup
   ```

4. **Configure Nginx**
   ```bash
   sudo nano /etc/nginx/sites-available/hr-api
   ```
   
   Add configuration:
   ```nginx
   server {
       listen 80;
       server_name api.yourdomain.com;
       
       location / {
           proxy_pass http://localhost:5000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
       }
   }
   ```
   
   Enable site:
   ```bash
   sudo ln -s /etc/nginx/sites-available/hr-api /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

5. **Setup SSL with Let's Encrypt**
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d api.yourdomain.com
   ```

### Option 2: Heroku

1. **Install Heroku CLI**
   ```bash
   npm install -g heroku
   heroku login
   ```

2. **Create Heroku App**
   ```bash
   cd server
   heroku create your-hr-api
   ```

3. **Set Environment Variables**
   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set MONGODB_URI=your-mongodb-uri
   heroku config:set JWT_SECRET=your-secret
   heroku config:set SMTP_HOST=smtp.sendgrid.net
   # ... set all other variables
   ```

4. **Deploy**
   ```bash
   git push heroku main
   heroku logs --tail
   ```

### Option 3: Docker Deployment

1. **Create Dockerfile**
   ```dockerfile
   FROM node:18-alpine
   
   WORKDIR /app
   
   COPY package*.json ./
   RUN npm ci --only=production
   
   COPY . .
   
   EXPOSE 5000
   
   CMD ["node", "server.js"]
   ```

2. **Create docker-compose.yml**
   ```yaml
   version: '3.8'
   services:
     api:
       build: ./server
       ports:
         - "5000:5000"
       environment:
         - NODE_ENV=production
         - MONGODB_URI=${MONGODB_URI}
         - JWT_SECRET=${JWT_SECRET}
       restart: unless-stopped
   ```

3. **Deploy**
   ```bash
   docker-compose up -d
   ```

## Frontend Deployment

### Option 1: Vercel (Recommended)

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Configure vercel.json**
   ```json
   {
     "buildCommand": "npm run build",
     "outputDirectory": "dist",
     "framework": "vite",
     "env": {
       "VITE_API_URL": "@api_url"
     }
   }
   ```

3. **Deploy**
   ```bash
   vercel --prod
   ```

4. **Set Environment Variables in Vercel Dashboard**
   - `VITE_API_URL`: https://api.yourdomain.com/api

### Option 2: AWS S3 + CloudFront

1. **Build Application**
   ```bash
   npm run build
   ```

2. **Create S3 Bucket**
   ```bash
   aws s3 mb s3://your-hr-app
   aws s3 website s3://your-hr-app --index-document index.html --error-document index.html
   ```

3. **Upload Files**
   ```bash
   aws s3 sync dist/ s3://your-hr-app --acl public-read
   ```

4. **Create CloudFront Distribution**
   - Origin: S3 bucket
   - Enable HTTPS
   - Set custom domain
   - Configure SSL certificate

### Option 3: Netlify

1. **Create netlify.toml**
   ```toml
   [build]
     command = "npm run build"
     publish = "dist"
   
   [[redirects]]
     from = "/*"
     to = "/index.html"
     status = 200
   ```

2. **Deploy**
   ```bash
   npm install -g netlify-cli
   netlify deploy --prod
   ```

## Email Service Configuration

### SendGrid Setup

1. **Create SendGrid Account**
   - Go to https://sendgrid.com
   - Sign up and verify email

2. **Create API Key**
   ```
   Settings > API Keys > Create API Key
   Name: HR Management System
   Permissions: Full Access (or limited to Mail Send)
   ```

3. **Configure in .env**
   ```env
   SMTP_HOST=smtp.sendgrid.net
   SMTP_PORT=587
   SMTP_USER=apikey
   SMTP_PASS=your-sendgrid-api-key
   SMTP_FROM=noreply@yourdomain.com
   ```

4. **Verify Domain**
   ```
   Settings > Sender Authentication > Verify a domain
   Add DNS records as instructed
   ```

### AWS SES Setup

1. **Request Production Access**
   - AWS SES starts in sandbox mode
   - Request production access in AWS Console

2. **Verify Domain**
   ```bash
   aws ses verify-domain-identity --domain yourdomain.com
   ```

3. **Configure SMTP Credentials**
   ```
   SES Console > SMTP Settings > Create SMTP Credentials
   ```

4. **Update .env**
   ```env
   SMTP_HOST=email-smtp.us-east-1.amazonaws.com
   SMTP_PORT=587
   SMTP_USER=your-smtp-username
   SMTP_PASS=your-smtp-password
   ```

## Security Configuration

### 1. SSL/TLS Configuration

```bash
# Force HTTPS in Nginx
server {
    listen 80;
    server_name api.yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name api.yourdomain.com;
    
    ssl_certificate /etc/letsencrypt/live/api.yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.yourdomain.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    
    # ... rest of configuration
}
```

### 2. Rate Limiting

Install and configure express-rate-limit:

```javascript
// server/server.js
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});

app.use('/api/', limiter);

// Stricter limit for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  skipSuccessfulRequests: true
});

app.use('/api/auth/login', authLimiter);
```

### 3. Helmet.js for Security Headers

```javascript
import helmet from 'helmet';

app.use(helmet());
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    styleSrc: ["'self'", "'unsafe-inline'"],
    scriptSrc: ["'self'"],
    imgSrc: ["'self'", "data:", "https:"],
  }
}));
```

### 4. Environment Variables Security

```bash
# Never commit .env files
echo ".env" >> .gitignore

# Use secrets management
# AWS Secrets Manager
aws secretsmanager create-secret --name hr-system-secrets --secret-string file://secrets.json

# Or HashiCorp Vault
vault kv put secret/hr-system mongodb_uri=xxx jwt_secret=xxx
```

## Monitoring & Logging

### 1. Application Monitoring with PM2

```bash
# Install PM2 Plus
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7

# Monitor
pm2 monit
pm2 logs hr-api
```

### 2. Error Tracking with Sentry

```bash
npm install @sentry/node
```

```javascript
// server/server.js
import * as Sentry from '@sentry/node';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
});

app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.errorHandler());
```

### 3. Database Monitoring

- Enable MongoDB Atlas monitoring
- Set up alerts for:
  - High CPU usage (>80%)
  - High memory usage (>80%)
  - Slow queries (>1000ms)
  - Connection pool exhaustion

### 4. Uptime Monitoring

Use services like:
- UptimeRobot (https://uptimerobot.com)
- Pingdom (https://www.pingdom.com)
- StatusCake (https://www.statuscake.com)

Configure alerts for:
- API downtime
- Response time > 2000ms
- SSL certificate expiration

## Backup Strategy

### 1. Database Backups

```bash
# Daily automated backups with MongoDB Atlas
# Configure in Atlas Dashboard:
# - Backup frequency: Every 24 hours
# - Retention: 30 days
# - Point-in-time recovery: Enabled

# Manual backup
mongodump --uri="mongodb+srv://user:pass@cluster.mongodb.net/hr_management_system" --out=./backup-$(date +%Y%m%d)

# Restore
mongorestore --uri="mongodb+srv://user:pass@cluster.mongodb.net" ./backup-20251013
```

### 2. Application Code Backups

```bash
# Use Git tags for releases
git tag -a v1.0.0 -m "Production release 1.0.0"
git push origin v1.0.0

# Store in multiple locations
git remote add backup git@github.com:yourorg/hr-backup.git
git push backup main
```

### 3. Backup Testing

- Test restore process monthly
- Document restore procedures
- Maintain backup restore logs

## Scaling Considerations

### Horizontal Scaling

1. **Load Balancer Configuration**
   ```nginx
   upstream hr_api {
       least_conn;
       server api1.internal:5000;
       server api2.internal:5000;
       server api3.internal:5000;
   }
   
   server {
       location / {
           proxy_pass http://hr_api;
       }
   }
   ```

2. **Session Handling**
   - Use JWT tokens (stateless)
   - Store sessions in Redis if needed

3. **Database Scaling**
   - MongoDB replica sets
   - Read replicas for reporting
   - Sharding for large datasets

### Vertical Scaling

- Monitor resource usage
- Upgrade instance types as needed
- Optimize database queries

### Caching Strategy

```javascript
// Install Redis
npm install redis

// Cache frequently accessed data
import Redis from 'redis';
const redis = Redis.createClient({
  url: process.env.REDIS_URL
});

// Cache departments
app.get('/api/departments', async (req, res) => {
  const cached = await redis.get('departments');
  if (cached) {
    return res.json(JSON.parse(cached));
  }
  
  const departments = await Department.find();
  await redis.set('departments', JSON.stringify(departments), 'EX', 3600);
  res.json(departments);
});
```

## Post-Deployment Tasks

### ✅ Verification

- [ ] Health check endpoints responding
- [ ] Database connections working
- [ ] Email notifications sending
- [ ] Authentication working
- [ ] MFA setup functional
- [ ] All user roles accessible
- [ ] Reports generating correctly
- [ ] File uploads working
- [ ] SSL certificates valid
- [ ] DNS records propagated

### ✅ Performance Testing

```bash
# Load testing with Apache Bench
ab -n 1000 -c 10 https://api.yourdomain.com/api/health

# Or with Artillery
npm install -g artillery
artillery quick --count 100 --num 10 https://api.yourdomain.com/api/health
```

### ✅ Documentation

- [ ] Update API documentation with production URLs
- [ ] Document deployment process
- [ ] Create runbooks for common issues
- [ ] Update team on new deployment

## Rollback Procedure

In case of issues:

```bash
# Backend (PM2)
pm2 stop hr-api
git checkout v1.0.0  # previous stable version
npm install
pm2 restart hr-api

# Database (if needed)
mongorestore --uri="mongodb+srv://..." ./backup-previous

# Frontend (Vercel)
vercel rollback
```

## Maintenance Windows

Schedule regular maintenance:
- Security updates: Monthly
- Dependency updates: Bi-weekly
- Database optimization: Quarterly
- Performance reviews: Quarterly

## Support Contacts

- **DevOps Lead**: devops@yourcompany.com
- **Database Admin**: dba@yourcompany.com
- **Security Team**: security@yourcompany.com
- **On-Call**: oncall@yourcompany.com

---

**Last Updated**: October 13, 2025
**Version**: 1.0.0
**Maintained by**: DevOps Team
