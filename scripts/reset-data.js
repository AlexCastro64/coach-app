#!/usr/bin/env node

/**
 * Reset Data Script
 *
 * This script helps you reset the app for testing by:
 * 1. Creating a test user in the backend database
 * 2. Providing instructions to clear local app data
 *
 * Test User Credentials:
 * Email: test@test.com
 * Password: 11111111
 *
 * Usage: npm run reset-data
 */

const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');

// Test user credentials
const TEST_USER = {
  name: 'Test User',
  email: 'test@test.com',
  password: '11111111',
  password_confirmation: '11111111'
};

// Load API URL from .env or use default
function getApiUrl() {
  const envPath = path.join(process.cwd(), '.env');
  let apiUrl = 'http://localhost:8000/api';

  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const match = envContent.match(/EXPO_PUBLIC_API_URL=(.+)/);
    if (match && match[1]) {
      apiUrl = match[1].trim();
    }
  }

  return apiUrl;
}

// Make HTTP/HTTPS request
function makeRequest(url, data) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const isHttps = urlObj.protocol === 'https:';
    const client = isHttps ? https : http;

    const postData = JSON.stringify(data);

    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port || (isHttps ? 443 : 80),
      path: urlObj.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = client.request(options, (res) => {
      let responseData = '';

      res.on('data', (chunk) => {
        responseData += chunk;
      });

      res.on('end', () => {
        try {
          const parsed = JSON.parse(responseData);
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve({ status: res.statusCode, data: parsed });
          } else {
            reject({ status: res.statusCode, data: parsed });
          }
        } catch (e) {
          resolve({ status: res.statusCode, data: responseData });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.write(postData);
    req.end();
  });
}

async function resetData() {
  console.log('🔄 Coach App Data Reset Script\n');
  console.log('═══════════════════════════════════════════════════════\n');

  const apiUrl = getApiUrl();
  console.log(`📡 Using API: ${apiUrl}\n`);

  // Step 1: Instructions for backend reset
  console.log('Step 1: Backend Database Reset');
  console.log('─────────────────────────────────');
  console.log('To completely reset the backend database, run:');
  console.log('  cd /path/to/backend');
  console.log('  php artisan migrate:fresh --seed\n');

  // Step 2: Create test user
  console.log('Step 2: Creating Test User');
  console.log('─────────────────────────────────');
  console.log(`Name: ${TEST_USER.name}`);
  console.log(`Email: ${TEST_USER.email}`);
  console.log(`Password: ${TEST_USER.password}\n`);

  try {
    const registerUrl = `${apiUrl}/register`;
    console.log(`Calling: POST ${registerUrl}`);

    const response = await makeRequest(registerUrl, TEST_USER);

    if (response.data && response.data.user) {
      console.log('✅ Test user created successfully!');
      console.log(`   User ID: ${response.data.user.id}`);
      console.log(`   Email: ${response.data.user.email}\n`);
    } else {
      console.log('✅ Request completed (status: ' + response.status + ')\n');
    }
  } catch (error) {
    if (error.status === 422) {
      console.log('⚠️  User may already exist (validation error)');
      console.log('   This is normal if you ran this script before.');
      if (error.data && error.data.message) {
        console.log(`   Message: ${error.data.message}`);
      }
      console.log('   You can still login with the test credentials.\n');
    } else if (error.status) {
      console.log(`❌ Error: ${error.status}`);
      console.log(`   Response: ${JSON.stringify(error.data, null, 2)}\n`);
    } else {
      console.log('❌ Connection Error');
      console.log(`   Could not connect to backend at: ${apiUrl}`);
      console.log('   Make sure your backend server is running.');
      console.log(`   Error: ${error.message || error}\n`);
    }
  }

  // Step 3: Clear app data
  console.log('Step 3: Clear Mobile App Data');
  console.log('─────────────────────────────────');
  console.log('To clear stored tokens and app data:\n');
  console.log('Option A - Uninstall/Reinstall:');
  console.log('  1. Stop the Expo dev server');
  console.log('  2. Uninstall the app from your device/simulator');
  console.log('  3. Run: npm start');
  console.log('  4. Reinstall the app\n');
  console.log('Option B - Clear Data (Android):');
  console.log('  Settings → Apps → Coach App → Storage → Clear Data\n');
  console.log('Option C - Clear Data (iOS Simulator):');
  console.log('  Device → Erase All Content and Settings\n');

  console.log('═══════════════════════════════════════════════════════\n');
  console.log('✨ Reset Complete!\n');
  console.log('You can now login with:');
  console.log(`   Email: ${TEST_USER.email}`);
  console.log(`   Password: ${TEST_USER.password}`);
  console.log('═══════════════════════════════════════════════════════\n');
}

// Run the script
resetData().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
