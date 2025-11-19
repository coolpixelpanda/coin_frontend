# Backend API Requirements for SMS Verification

## Required Endpoints

### 1. POST /api/send-verification-code
**Purpose:** Send SMS verification code to user's phone number

**Request Body:**
```json
{
  "PhoneNumber": "+19725594853",
  "CountryCode": "US"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Verification code sent successfully"
}
```

**Implementation Notes:**
- Use an SMS service provider like Twilio, AWS SNS, or similar
- Generate a 6-digit random code
- Store the code temporarily (e.g., Redis with 10-minute expiration) associated with the phone number
- Send SMS with message like: "Your CEX-USA verification code is: 123456"

### 2. POST /api/verify-phone-code
**Purpose:** Verify the SMS code entered by the user

**Request Body:**
```json
{
  "PhoneNumber": "+19725594853",
  "Code": "123456"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Phone verified successfully",
  "phoneVerified": true
}
```

**Implementation Notes:**
- Check if the code matches the stored code for the phone number
- Verify the code hasn't expired (typically 10 minutes)
- Mark the phone number as verified in the user's account
- Clear the stored verification code after successful verification

## SMS Service Setup (Example with Twilio)

1. Sign up for Twilio account
2. Get Account SID and Auth Token
3. Purchase a phone number
4. Install Twilio SDK: `npm install twilio`
5. Implement the endpoints using Twilio API

Example implementation:
```javascript
const twilio = require('twilio');
const client = twilio(accountSid, authToken);

// Send SMS
await client.messages.create({
  body: `Your CEX-USA verification code is: ${code}`,
  from: '+1234567890', // Your Twilio number
  to: phoneNumber
});
```

