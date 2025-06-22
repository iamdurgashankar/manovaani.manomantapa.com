# PHP OTP Backend for cPanel

This PHP version of the OTP backend is designed to work with cPanel hosting where Node.js is not supported.

## cPanel Deployment Instructions

### 1. Upload Files to cPanel
1. Log in to your cPanel account
2. Go to **File Manager**
3. Navigate to your domain's root directory (usually `public_html`)
4. Create a new folder called `backend-otp`
5. Upload the following files to the `backend-otp` folder:
   - `index.php`
   - `.htaccess`
   - `.env` (you'll create this)

### 2. Set up Twilio Account
1. Go to [Twilio Console](https://console.twilio.com/)
2. Create a new account or sign in to existing account
3. Get your Account SID and Auth Token from the dashboard
4. Create a Verify Service:
   - Go to "Verify" in the left sidebar
   - Click "Create a Verify Service"
   - Give it a name (e.g., "Manomantapa OTP")
   - Copy the Service SID

### 3. Configure Environment Variables

#### Option A: Using .env file (Recommended)
1. In your `backend-otp` folder, create a new file called `.env`
2. Add the following content:
   ```
   TWILIO_ACCOUNT_SID=your_actual_account_sid_here
   TWILIO_AUTH_TOKEN=your_actual_auth_token_here
   TWILIO_SERVICE_SID=your_actual_verify_service_sid_here
   ```
3. Replace the placeholder values with your actual Twilio credentials

#### Option B: Using cPanel Environment Variables
1. In cPanel, go to **Software** → **Setup Node.js App** or **Environment Variables**
2. Add the following environment variables:
   - `TWILIO_ACCOUNT_SID`
   - `TWILIO_AUTH_TOKEN`
   - `TWILIO_SERVICE_SID`

### 4. Update Frontend URL
1. Open `src/components/AuthModal.js` in your React project
2. Update the `BACKEND_URL` to point to your domain:
   ```javascript
   const BACKEND_URL = 'https://yourdomain.com/backend-otp';
   ```
3. Replace `yourdomain.com` with your actual domain name

### 5. Test the Backend
Your PHP backend will be accessible at:
- `https://yourdomain.com/backend-otp/send-otp`
- `https://yourdomain.com/backend-otp/verify-otp`

## API Endpoints

### POST /send-otp
Sends an OTP to the provided phone number.

**URL:** `https://yourdomain.com/backend-otp/send-otp`

**Request Body:**
```json
{
  "phone": "1234567890"
}
```

**Response:**
```json
{
  "success": true,
  "message": "OTP has been sent successfully!"
}
```

### POST /verify-otp
Verifies the OTP entered by the user.

**URL:** `https://yourdomain.com/backend-otp/verify-otp`

**Request Body:**
```json
{
  "phone": "1234567890",
  "otp": "123456"
}
```

**Response:**
```json
{
  "success": true,
  "message": "OTP verified successfully!"
}
```

## Troubleshooting

### Common Issues:

1. **"Twilio environment variables not set"**
   - Make sure you have created a `.env` file with your Twilio credentials
   - Check that the `.env` file is in the same directory as `index.php`
   - Verify that all three variables are set correctly

2. **"404 Not Found" errors**
   - Ensure the `.htaccess` file is uploaded correctly
   - Check that mod_rewrite is enabled on your hosting
   - Verify the file paths are correct

3. **"500 Internal Server Error"**
   - Check the `php_errors.log` file in your `backend-otp` directory
   - Verify your Twilio credentials are correct
   - Make sure cURL is enabled in your PHP installation

4. **CORS errors**
   - The `.htaccess` file should handle CORS automatically
   - If you still get CORS errors, contact your hosting provider

### File Permissions:
- Make sure `.env` file has permissions 644 or 600
- Ensure `index.php` has permissions 644
- The `.htaccess` file should have permissions 644

### Testing:
- Use a real phone number for testing
- The phone number should be in 10-digit format (e.g., "1234567890")
- OTP codes are 6 digits long
- Test both endpoints to ensure they're working correctly

## Security Notes
- Keep your Twilio credentials secure
- The `.htaccess` file prevents direct access to the `.env` file
- Consider adding rate limiting for production use
- Make sure your domain uses HTTPS for secure communication

## Support
If you encounter issues:
1. Check the `php_errors.log` file for detailed error messages
2. Verify your Twilio account is active and has sufficient credits
3. Test with a simple curl command to isolate the issue
4. Contact your hosting provider if it's a server configuration issue 