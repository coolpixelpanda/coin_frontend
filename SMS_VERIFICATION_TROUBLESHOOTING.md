# SMS Verification Troubleshooting Guide

## Why You're Seeing "Failed to send verification code. Please try again."

This error can occur for several reasons. Here are the most common causes and how to check them:

### 1. **Backend Endpoint Doesn't Exist (Most Common)**
**Error:** 404 Not Found  
**Reason:** The backend API endpoint `/api/send-verification-code` hasn't been implemented yet.

**How to Check:**
- Open browser Developer Tools (F12)
- Go to Console tab
- Look for error messages like:
  - `API - Send Verification Code Error: 404`
  - `SMS service endpoint not found`

**Solution:** 
- Implement the backend endpoint `POST /api/send-verification-code`
- See `BACKEND_API_REQUIREMENTS.md` for implementation details

---

### 2. **Backend Server Not Running**
**Error:** Network Error / Failed to fetch  
**Reason:** The backend server at `http://localhost:3006` is not running.

**How to Check:**
- Check if backend server is running on port 3006
- Open browser Developer Tools → Network tab
- Try sending code and check if request shows "Failed" or "ERR_CONNECTION_REFUSED"

**Solution:**
- Start your backend server
- Verify it's running on `http://localhost:3006`
- Check if the API base URL in `src/services/api.js` matches your backend URL

---

### 3. **CORS (Cross-Origin Resource Sharing) Error**
**Error:** CORS policy error in browser console  
**Reason:** Backend doesn't allow requests from your frontend origin.

**How to Check:**
- Browser console shows: `Access to XMLHttpRequest blocked by CORS policy`

**Solution:**
- Configure backend to allow CORS from your frontend origin
- Add CORS headers in backend:
  ```javascript
  Access-Control-Allow-Origin: http://localhost:5173 (or your frontend URL)
  Access-Control-Allow-Methods: POST, GET, OPTIONS
  Access-Control-Allow-Headers: Content-Type, Authorization
  ```

---

### 4. **Backend Server Error (500)**
**Error:** 500 Internal Server Error  
**Reason:** Backend endpoint exists but has a bug or SMS service is not configured.

**How to Check:**
- Browser console shows: `API - Send Verification Code Error: 500`
- Backend logs show error details

**Solution:**
- Check backend logs for specific error
- Verify SMS service (Twilio/AWS SNS) is configured correctly
- Check if SMS service credentials are set up

---

### 5. **Invalid Phone Number Format**
**Error:** 400 Bad Request  
**Reason:** Backend rejected the phone number format.

**How to Check:**
- Error message mentions "Invalid phone number"
- Check console for the phone number being sent

**Solution:**
- Verify phone number format matches backend expectations
- Check if country code is included correctly

---

### 6. **Authentication Required**
**Error:** 401 Unauthorized / 403 Forbidden  
**Reason:** Backend requires authentication token but it's missing or invalid.

**How to Check:**
- Error message: "Authentication required"
- Check if user is logged in

**Solution:**
- Ensure user is authenticated before phone verification
- Check if auth token is being sent in request headers

---

## How to Debug

1. **Open Browser Developer Tools (F12)**
2. **Go to Console tab** - Look for error messages
3. **Go to Network tab** - Check the actual API request:
   - Click on the failed request
   - Check "Status" column (404, 500, etc.)
   - Check "Response" tab for error details
   - Check "Headers" tab to see what was sent

4. **Check the Request:**
   - URL: Should be `http://localhost:3006/api/send-verification-code`
   - Method: POST
   - Payload: Should contain `PhoneNumber` and `CountryCode`

5. **Check Backend Logs:**
   - Look for incoming requests
   - Check for error messages
   - Verify SMS service configuration

---

## Quick Test

To quickly test if the backend endpoint exists:

1. Open browser console
2. Run this command:
```javascript
fetch('http://localhost:3006/api/send-verification-code', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ PhoneNumber: '+19725594853', CountryCode: 'US' })
})
.then(r => r.json())
.then(console.log)
.catch(console.error)
```

This will show you the exact error from the backend.

---

## Most Likely Cause

Based on the error message, the **most likely reason** is that the backend endpoint `/api/send-verification-code` doesn't exist yet. The frontend is trying to call it, but the backend returns a 404 error.

**Next Steps:**
1. Check browser console for the exact error
2. Implement the backend endpoint (see `BACKEND_API_REQUIREMENTS.md`)
3. Set up an SMS service (Twilio recommended)
4. Test the endpoint

