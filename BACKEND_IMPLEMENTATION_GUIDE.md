# Backend Implementation Guide
## Google Sign-In & Phone Verification Features

This guide provides complete implementation details for the backend API endpoints required by the CEX-USA frontend application.

---

## Table of Contents
1. [Google Sign-In Implementation](#1-google-sign-in-implementation)
2. [Phone Verification (SMS) Implementation](#2-phone-verification-sms-implementation)
3. [Database Schema Updates](#3-database-schema-updates)
4. [Environment Variables](#4-environment-variables)
5. [Error Handling](#5-error-handling)
6. [Testing](#6-testing)

---

## 1. Google Sign-In Implementation

### Overview
The frontend implements Google OAuth 2.0 sign-in. When a user clicks "Sign in with Google":
1. Frontend gets Google access token
2. Frontend fetches user info from Google API
3. Frontend extracts username from email (everything before @)
4. Frontend calls `/api/register` first (in case user doesn't exist)
5. Frontend calls `/api/login` with Google token

### Frontend Flow Analysis

**From `src/components/SignIn.jsx`:**
- Gets Google access token via OAuth 2.0
- Fetches user info from `https://www.googleapis.com/oauth2/v2/userinfo`
- Extracts username: `cool.pixel.tyler@gmail.com` → `cool.pixel.tyler`
- Generates auto-password: `Google_${timestamp}_${random}`
- Calls register with: `{ username, email, password }`
- Calls login with: `{ username, email, password, googleToken }`

### Required Backend Changes

#### 1.1 Update `/api/register` Endpoint

**Current Request Format:**
```json
{
  "Username": "cool.pixel.tyler",
  "Email": "cool.pixel.tyler@gmail.com",
  "Password": "Google_1234567890_abc123xyz"
}
```

**Required Behavior:**
- Accept registration with Google-generated password
- Handle duplicate email gracefully (return 409 or specific error message)
- Store user with Google flag if `GoogleToken` is present in request

**Example Implementation (Node.js/Express):**

```javascript
// POST /api/register
app.post('/api/register', async (req, res) => {
  try {
    const { Username, Email, Password, GoogleToken } = req.body;
    
    // Validate required fields
    if (!Email || !Password) {
      return res.status(400).json({
        error: 'Email and Password are required'
      });
    }
    
    // Check if user already exists
    const existingUser = await db.query(
      'SELECT * FROM users WHERE email = ?',
      [Email]
    );
    
    if (existingUser.length > 0) {
      return res.status(409).json({
        error: 'User already exists',
        message: 'A user with this email already exists'
      });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(Password, 10);
    
    // Insert new user
    const result = await db.query(
      `INSERT INTO users (username, email, password, is_google_user, google_token, created_at) 
       VALUES (?, ?, ?, ?, ?, NOW())`,
      [
        Username || Email.split('@')[0], // Use email prefix if username not provided
        Email,
        hashedPassword,
        GoogleToken ? true : false,
        GoogleToken || null
      ]
    );
    
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      User_id: result.insertId
    });
    
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      error: 'Registration failed',
      message: error.message
    });
  }
});
```

#### 1.2 Update `/api/login` Endpoint

**Request Format (Multiple Scenarios):**

**Scenario 1: Regular Login**
```json
{
  "Username": "",
  "Email": "user@example.com",
  "Password": "userpassword"
}
```

**Scenario 2: Google Sign-In**
```json
{
  "Username": "cool.pixel.tyler",
  "Email": "cool.pixel.tyler@gmail.com",
  "Password": "Google_1234567890_abc123xyz",
  "GoogleToken": "ya29.a0AfH6SMBx..."
}
```

**Required Behavior:**
- If `GoogleToken` is present, verify it with Google
- If Google token is valid, authenticate user without password check
- Return user data in format: `{ User_id, Total_amount }`
- Optionally return auth token

**Example Implementation:**

```javascript
// POST /api/login
const { OAuth2Client } = require('google-auth-library');

app.post('/api/login', async (req, res) => {
  try {
    const { Username, Email, Password, GoogleToken } = req.body;
    
    if (!Email) {
      return res.status(400).json({
        error: 'Email is required'
      });
    }
    
    // Find user by email
    const users = await db.query(
      'SELECT * FROM users WHERE email = ?',
      [Email]
    );
    
    if (users.length === 0) {
      return res.status(401).json({
        error: 'Invalid credentials',
        message: 'User does not exist. Please sign up first.'
      });
    }
    
    const user = users[0];
    
    // Handle Google Sign-In
    if (GoogleToken) {
      // Verify Google token
      const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
      
      try {
        const ticket = await client.verifyIdToken({
          idToken: GoogleToken,
          audience: process.env.GOOGLE_CLIENT_ID
        });
        
        const payload = ticket.getPayload();
        const googleEmail = payload.email;
        
        // Verify email matches
        if (googleEmail !== Email) {
          return res.status(401).json({
            error: 'Email mismatch',
            message: 'Google account email does not match'
          });
        }
        
        // Update user's Google token if needed
        if (!user.is_google_user) {
          await db.query(
            'UPDATE users SET is_google_user = true, google_token = ? WHERE id = ?',
            [GoogleToken, user.id]
          );
        }
        
        // Return user data
        return res.json({
          User_id: user.id,
          Total_amount: user.total_amount || 0,
          token: generateAuthToken(user.id), // Optional: JWT token
          email: user.email,
          username: user.username
        });
        
      } catch (googleError) {
        console.error('Google token verification failed:', googleError);
        return res.status(401).json({
          error: 'Invalid Google token',
          message: 'Google authentication failed'
        });
      }
    }
    
    // Handle regular password login
    if (!Password) {
      return res.status(400).json({
        error: 'Password is required for non-Google login'
      });
    }
    
    // Verify password
    const passwordMatch = await bcrypt.compare(Password, user.password);
    
    if (!passwordMatch) {
      return res.status(401).json({
        error: 'Invalid credentials',
        message: 'Invalid email or password'
      });
    }
    
    // Return user data
    res.json({
      User_id: user.id,
      Total_amount: user.total_amount || 0,
      token: generateAuthToken(user.id), // Optional: JWT token
      email: user.email,
      username: user.username
    });
    
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      error: 'Login failed',
      message: error.message
    });
  }
});
```

**Alternative: Using Google Access Token (OAuth 2.0)**

If frontend sends Google **access token** instead of ID token, verify it like this:

```javascript
// Verify Google Access Token
async function verifyGoogleAccessToken(accessToken) {
  try {
    const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Invalid access token');
    }
    
    const userInfo = await response.json();
    return userInfo; // { email, name, picture, etc. }
  } catch (error) {
    throw new Error('Failed to verify Google access token');
  }
}

// In login endpoint:
if (GoogleToken) {
  const googleUserInfo = await verifyGoogleAccessToken(GoogleToken);
  
  // Verify email matches
  if (googleUserInfo.email !== Email) {
    return res.status(401).json({
      error: 'Email mismatch'
    });
  }
  
  // Continue with authentication...
}
```

---

## 2. Phone Verification (SMS) Implementation

### Overview
The frontend sends phone verification requests after user login. The flow:
1. User enters phone number with country code
2. Frontend calls `/api/send-verification-code`
3. Backend generates 6-digit code, stores it, sends SMS
4. User enters code
5. Frontend calls `/api/verify-phone-code`
6. Backend verifies code and marks phone as verified

### Frontend Flow Analysis

**From `src/components/PhoneVerification.jsx`:**
- Phone format: `+19725594853` (country code + digits)
- Country code: `US`, `GB`, etc.
- Code length: 6 digits
- Resend cooldown: 60 seconds

### Required Backend Endpoints

#### 2.1 POST `/api/send-verification-code`

**Request Format:**
```json
{
  "PhoneNumber": "+19725594853",
  "CountryCode": "US"
}
```

**Required Behavior:**
1. Validate phone number format
2. Generate 6-digit random code
3. Store code temporarily (Redis recommended, 10-minute expiration)
4. Send SMS via SMS service (Twilio/AWS SNS)
5. Return success response

**Example Implementation (Node.js/Express with Twilio):**

```javascript
const twilio = require('twilio');
const redis = require('redis');

const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const redisClient = redis.createClient({
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379
});

// POST /api/send-verification-code
app.post('/api/send-verification-code', async (req, res) => {
  try {
    const { PhoneNumber, CountryCode } = req.body;
    
    // Validate phone number
    if (!PhoneNumber || !CountryCode) {
      return res.status(400).json({
        error: 'PhoneNumber and CountryCode are required'
      });
    }
    
    // Validate phone number format (E.164 format: +1234567890)
    const phoneRegex = /^\+[1-9]\d{1,14}$/;
    if (!phoneRegex.test(PhoneNumber)) {
      return res.status(400).json({
        error: 'Invalid phone number format',
        message: 'Phone number must be in E.164 format (e.g., +19725594853)'
      });
    }
    
    // Generate 6-digit verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Store code in Redis with 10-minute expiration
    const redisKey = `verification:${PhoneNumber}`;
    await redisClient.setex(redisKey, 600, verificationCode); // 600 seconds = 10 minutes
    
    // Optionally store in database for audit
    await db.query(
      `INSERT INTO phone_verification_codes (phone_number, code, country_code, created_at, expires_at) 
       VALUES (?, ?, ?, NOW(), DATE_ADD(NOW(), INTERVAL 10 MINUTE))`,
      [PhoneNumber, verificationCode, CountryCode]
    );
    
    // Send SMS via Twilio
    try {
      const message = await twilioClient.messages.create({
        body: `Your CEX-USA verification code is: ${verificationCode}. This code expires in 10 minutes.`,
        from: process.env.TWILIO_PHONE_NUMBER, // Your Twilio number
        to: PhoneNumber
      });
      
      console.log('SMS sent successfully:', message.sid);
      
      res.json({
        success: true,
        message: 'Verification code sent successfully',
        // Don't send code in response for security
      });
      
    } catch (smsError) {
      console.error('Twilio error:', smsError);
      
      // Handle specific Twilio errors
      if (smsError.code === 21211) {
        return res.status(400).json({
          error: 'Invalid phone number',
          message: 'The phone number provided is invalid'
        });
      } else if (smsError.code === 21608) {
        return res.status(400).json({
          error: 'Unverified number',
          message: 'This phone number is not verified. Please use a verified number.'
        });
      }
      
      throw smsError;
    }
    
  } catch (error) {
    console.error('Send verification code error:', error);
    res.status(500).json({
      error: 'Failed to send verification code',
      message: error.message || 'An error occurred while sending the verification code'
    });
  }
});
```

**Alternative: Using AWS SNS**

```javascript
const AWS = require('aws-sdk');

const sns = new AWS.SNS({
  region: process.env.AWS_REGION || 'us-east-1',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

// In send-verification-code endpoint:
const params = {
  Message: `Your CEX-USA verification code is: ${verificationCode}. This code expires in 10 minutes.`,
  PhoneNumber: PhoneNumber
};

await sns.publish(params).promise();
```

#### 2.2 POST `/api/verify-phone-code`

**Request Format:**
```json
{
  "PhoneNumber": "+19725594853",
  "Code": "123456"
}
```

**Required Behavior:**
1. Retrieve stored code for phone number
2. Compare with provided code
3. Check if code has expired
4. If valid, mark phone as verified in user account
5. Delete/expire the verification code
6. Return success response

**Example Implementation:**

```javascript
// POST /api/verify-phone-code
app.post('/api/verify-phone-code', async (req, res) => {
  try {
    const { PhoneNumber, Code } = req.body;
    const authToken = req.headers.authorization?.replace('Bearer ', '');
    
    // Validate input
    if (!PhoneNumber || !Code) {
      return res.status(400).json({
        error: 'PhoneNumber and Code are required'
      });
    }
    
    if (Code.length !== 6 || !/^\d{6}$/.test(Code)) {
      return res.status(400).json({
        error: 'Invalid code format',
        message: 'Code must be 6 digits'
      });
    }
    
    // Get user from token (phone verification happens after login)
    if (!authToken) {
      return res.status(401).json({
        error: 'Authentication required',
        message: 'Please sign in first'
      });
    }
    
    const userId = await verifyAuthToken(authToken); // Your token verification function
    
    // Retrieve code from Redis
    const redisKey = `verification:${PhoneNumber}`;
    const storedCode = await redisClient.get(redisKey);
    
    if (!storedCode) {
      return res.status(400).json({
        error: 'Invalid or expired code',
        message: 'Verification code has expired or is invalid. Please request a new code.'
      });
    }
    
    // Verify code
    if (storedCode !== Code) {
      // Optional: Track failed attempts
      const attemptKey = `verification_attempts:${PhoneNumber}`;
      const attempts = await redisClient.incr(attemptKey);
      await redisClient.expire(attemptKey, 600); // Reset after 10 minutes
      
      if (attempts > 5) {
        return res.status(429).json({
          error: 'Too many attempts',
          message: 'Too many failed verification attempts. Please request a new code.'
        });
      }
      
      return res.status(400).json({
        error: 'Invalid code',
        message: 'The verification code you entered is incorrect. Please try again.'
      });
    }
    
    // Code is valid - mark phone as verified
    await db.query(
      `UPDATE users 
       SET phone_number = ?, phone_verified = true, phone_verified_at = NOW() 
       WHERE id = ?`,
      [PhoneNumber, userId]
    );
    
    // Delete verification code from Redis
    await redisClient.del(redisKey);
    
    // Delete from database (optional cleanup)
    await db.query(
      'DELETE FROM phone_verification_codes WHERE phone_number = ? AND code = ?',
      [PhoneNumber, Code]
    );
    
    res.json({
      success: true,
      message: 'Phone number verified successfully',
      phoneVerified: true
    });
    
  } catch (error) {
    console.error('Verify phone code error:', error);
    res.status(500).json({
      error: 'Verification failed',
      message: error.message || 'An error occurred while verifying the code'
    });
  }
});
```

---

## 3. Database Schema Updates

### 3.1 Users Table Updates

Add the following columns to your `users` table:

```sql
ALTER TABLE users
ADD COLUMN phone_number VARCHAR(20) NULL,
ADD COLUMN phone_verified BOOLEAN DEFAULT FALSE,
ADD COLUMN phone_verified_at DATETIME NULL,
ADD COLUMN is_google_user BOOLEAN DEFAULT FALSE,
ADD COLUMN google_token TEXT NULL,
ADD INDEX idx_phone_number (phone_number),
ADD INDEX idx_email (email);
```

**Complete Users Table Schema:**

```sql
CREATE TABLE IF NOT EXISTS users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  phone_number VARCHAR(20) NULL,
  phone_verified BOOLEAN DEFAULT FALSE,
  phone_verified_at DATETIME NULL,
  is_google_user BOOLEAN DEFAULT FALSE,
  google_token TEXT NULL,
  total_amount DECIMAL(15, 2) DEFAULT 0.00,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_phone_number (phone_number)
);
```

### 3.2 Phone Verification Codes Table (Optional - for audit)

```sql
CREATE TABLE IF NOT EXISTS phone_verification_codes (
  id INT PRIMARY KEY AUTO_INCREMENT,
  phone_number VARCHAR(20) NOT NULL,
  code VARCHAR(6) NOT NULL,
  country_code VARCHAR(10) NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  expires_at DATETIME NOT NULL,
  verified BOOLEAN DEFAULT FALSE,
  verified_at DATETIME NULL,
  INDEX idx_phone_number (phone_number),
  INDEX idx_code (code),
  INDEX idx_expires_at (expires_at)
);
```

---

## 4. Environment Variables

Add these environment variables to your backend `.env` file:

```env
# Google OAuth Configuration
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here

# Twilio SMS Configuration (if using Twilio)
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=+1234567890

# AWS SNS Configuration (if using AWS)
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key

# Redis Configuration (for storing verification codes)
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=your_redis_password_if_needed

# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=your_database_name

# JWT Secret (if using JWT tokens)
JWT_SECRET=your_jwt_secret_key
```

---

## 5. Error Handling

### Standard Error Response Format

All endpoints should return errors in this format:

```json
{
  "error": "Error type",
  "message": "Human-readable error message"
}
```

### HTTP Status Codes

- `200` - Success
- `201` - Created (registration)
- `400` - Bad Request (invalid input)
- `401` - Unauthorized (authentication required/invalid)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found (endpoint/resource doesn't exist)
- `409` - Conflict (user already exists)
- `429` - Too Many Requests (rate limiting)
- `500` - Internal Server Error

### Error Handling Example

```javascript
// Middleware for error handling
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Validation Error',
      message: err.message
    });
  }
  
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Invalid or expired token'
    });
  }
  
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'production' 
      ? 'An error occurred' 
      : err.message
  });
});
```

---

## 6. Testing

### 6.1 Test Google Sign-In

**Test Registration:**
```bash
curl -X POST http://localhost:3006/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "Username": "testuser",
    "Email": "test@gmail.com",
    "Password": "Google_1234567890_abc123",
    "GoogleToken": "ya29.a0AfH6SMBx..."
  }'
```

**Test Login with Google Token:**
```bash
curl -X POST http://localhost:3006/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "Username": "testuser",
    "Email": "test@gmail.com",
    "Password": "Google_1234567890_abc123",
    "GoogleToken": "ya29.a0AfH6SMBx..."
  }'
```

### 6.2 Test Phone Verification

**Test Send Code:**
```bash
curl -X POST http://localhost:3006/api/send-verification-code \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN" \
  -d '{
    "PhoneNumber": "+19725594853",
    "CountryCode": "US"
  }'
```

**Test Verify Code:**
```bash
curl -X POST http://localhost:3006/api/verify-phone-code \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN" \
  -d '{
    "PhoneNumber": "+19725594853",
    "Code": "123456"
  }'
```

---

## 7. Complete Implementation Checklist

### Google Sign-In
- [ ] Install `google-auth-library` package
- [ ] Set up Google OAuth credentials in Google Cloud Console
- [ ] Add `GOOGLE_CLIENT_ID` to environment variables
- [ ] Update `/api/register` to handle Google users
- [ ] Update `/api/login` to verify Google tokens
- [ ] Add `is_google_user` and `google_token` columns to users table
- [ ] Test Google sign-in flow

### Phone Verification
- [ ] Set up SMS service (Twilio or AWS SNS)
- [ ] Install SMS service SDK
- [ ] Set up Redis for code storage
- [ ] Implement `/api/send-verification-code` endpoint
- [ ] Implement `/api/verify-phone-code` endpoint
- [ ] Add phone verification columns to users table
- [ ] Add phone_verification_codes table (optional)
- [ ] Test SMS sending
- [ ] Test code verification
- [ ] Implement rate limiting for verification attempts

---

## 8. Security Considerations

1. **Rate Limiting**: Implement rate limiting on SMS endpoints to prevent abuse
2. **Code Expiration**: Verification codes should expire after 10 minutes
3. **Attempt Limits**: Limit failed verification attempts (e.g., 5 attempts per phone number)
4. **Phone Number Validation**: Validate phone numbers before sending SMS
5. **Google Token Verification**: Always verify Google tokens server-side
6. **Password Hashing**: Use bcrypt or similar for password hashing
7. **HTTPS**: Use HTTPS in production
8. **CORS**: Configure CORS properly for your frontend domain

---

## 9. Dependencies to Install

**Node.js/Express:**
```bash
npm install google-auth-library twilio redis bcrypt jsonwebtoken
# or
npm install google-auth-library aws-sdk redis bcrypt jsonwebtoken
```

**Python/Flask:**
```bash
pip install google-auth twilio redis bcrypt pyjwt
# or
pip install google-auth boto3 redis bcrypt pyjwt
```

---

## 10. Example Complete Backend File Structure

```
backend/
├── routes/
│   ├── auth.js          # Login, register endpoints
│   └── verification.js # SMS verification endpoints
├── middleware/
│   ├── auth.js          # Authentication middleware
│   └── errorHandler.js  # Error handling middleware
├── services/
│   ├── googleAuth.js    # Google OAuth verification
│   ├── smsService.js    # SMS sending service
│   └── redisService.js  # Redis operations
├── models/
│   └── user.js          # User model/database queries
├── config/
│   └── database.js      # Database configuration
└── .env                 # Environment variables
```

---

This guide provides everything needed to implement the backend features. Follow the examples and adapt them to your specific backend framework and database system.

