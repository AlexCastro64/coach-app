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

// Check if running inside Docker container
function isRunningInDocker() {
  try {
    return fs.existsSync('/.dockerenv') || 
           fs.readFileSync('/proc/self/cgroup', 'utf8').includes('docker');
  } catch (e) {
    return false;
  }
}

// Load API URL from environment or .env file
function getApiUrl() {
  // First check environment variable (set in docker-compose.yml)
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }

  // Then check .env file
  const envPath = path.join(process.cwd(), '.env');
  let apiUrl = 'http://localhost:8000/api'; // Default Laravel dev server

  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const match = envContent.match(/EXPO_PUBLIC_API_URL=(.+)/);
    if (match && match[1]) {
      apiUrl = match[1].trim();
    }
  } else {
    console.log('⚠️  No .env file found. Using default: ' + apiUrl);
    console.log('   Create a .env file from .env.example to customize the API URL.\n');
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

  const inDocker = isRunningInDocker();
  const apiUrl = getApiUrl();
  
  console.log(`📡 API URL: ${apiUrl}`);
  console.log(`🐳 Running in Docker: ${inDocker ? 'Yes' : 'No'}\n`);

  // If not in Docker and URL contains laravel.test, provide instructions
  if (!inDocker && apiUrl.includes('laravel.test')) {
    console.log('⚠️  WARNING: Cannot connect to laravel.test from host machine!\n');
    console.log('The API URL contains "laravel.test" which only works inside Docker.');
    console.log('This script must run inside the Docker container.\n');
    console.log('Please run one of these commands instead:\n');
    console.log('  Option 1 (Recommended):');
    console.log('    docker exec coach-app-frontend npm run reset-data\n');
    console.log('  Option 2:');
    console.log('    docker-compose exec coach-app npm run reset-data\n');
    console.log('Or update your .env file to use http://localhost/api instead.');
    console.log('═══════════════════════════════════════════════════════\n');
    process.exit(1);
  }

  // Step 1: Instructions for backend reset
  console.log('Step 1: Backend Database Reset (Optional)');
  console.log('─────────────────────────────────');
  console.log('If you want to completely reset the backend database:');
  console.log('  cd /path/to/backend');
  console.log('  php artisan migrate:fresh --seed');
  console.log('  php artisan serve  # Start the server on port 8000\n');
  console.log('Or if using Docker:');
  console.log('  docker-compose down -v  # Remove volumes');
  console.log('  docker-compose up -d    # Restart containers\n');

  // Step 2: Create test user
  console.log('Step 2: Creating Test User');
  console.log('─────────────────────────────────');
  console.log(`Name: ${TEST_USER.name}`);
  console.log(`Email: ${TEST_USER.email}`);
  console.log(`Password: ${TEST_USER.password}\n`);

  try {
    const registerUrl = `${apiUrl}/register`;
    console.log(`Attempting: POST ${registerUrl}\n`);

    const response = await makeRequest(registerUrl, TEST_USER);

    if (response.data && response.data.user) {
      console.log('✅ Test user created successfully!');
      console.log(`   User ID: ${response.data.user.id}`);
      console.log(`   Name: ${response.data.user.name}`);
      console.log(`   Email: ${response.data.user.email}`);
      if (response.data.token) {
        console.log(`   Token: ${response.data.token.substring(0, 20)}...`);
      }
      console.log('');
    } else {
      console.log('✅ Request completed (status: ' + response.status + ')\n');
    }
  } catch (error) {
    if (error.status === 422) {
      console.log('⚠️  User already exists (validation error)');
      console.log('   This is normal if you ran this script before.');
      if (error.data && error.data.errors) {
        console.log('   Validation errors:');
        Object.entries(error.data.errors).forEach(([field, messages]) => {
          messages.forEach(msg => console.log(`     - ${field}: ${msg}`));
        });
      } else if (error.data && error.data.message) {
        console.log(`   Message: ${error.data.message}`);
      }
      console.log('   You can still login with the test credentials.\n');
    } else if (error.status) {
      console.log(`❌ API Error (${error.status})`);
      if (error.data) {
        console.log(`   Response: ${JSON.stringify(error.data, null, 2)}`);
      }
      console.log('');
    } else {
      console.log('❌ Connection Error');
      console.log(`   Could not connect to backend at: ${apiUrl}`);
      console.log('');
      console.log('   Troubleshooting:');
      console.log('   1. Make sure your backend server is running');
      console.log('   2. Check the API URL in your .env file');
      console.log('   3. For Android emulator, use http://10.0.2.2:8000/api');
      console.log('   4. For physical devices, use your computer\'s IP address');
      console.log(`   Error: ${error.message || error}\n`);
    }
  }

  // Step 3: Clear app data
  console.log('Step 3: Clear Mobile App Data');
  console.log('─────────────────────────────────');
  console.log('To clear stored tokens and start fresh:\n');
  console.log('Option A - Quick Reset (Recommended):');
  console.log('  1. In the app, logout if logged in');
  console.log('  2. Close and restart the app\n');
  console.log('Option B - Uninstall/Reinstall:');
  console.log('  1. Stop the Expo dev server (Ctrl+C)');
  console.log('  2. Uninstall the app from your device/simulator');
  console.log('  3. Run: npm start');
  console.log('  4. Scan QR code or press i/a to reinstall\n');
  console.log('Option C - Clear Data (Android):');
  console.log('  Settings → Apps → Expo Go → Storage → Clear Data\n');
  console.log('Option D - Clear Data (iOS Simulator):');
  console.log('  Device → Erase All Content and Settings\n');

  console.log('═══════════════════════════════════════════════════════\n');
  console.log('✨ Setup Complete!\n');
  console.log('Test User Credentials:');
  console.log(`   Email:    ${TEST_USER.email}`);
  console.log(`   Password: ${TEST_USER.password}`);
  console.log('');
  console.log('Next Steps:');
  console.log('   1. Make sure your backend is running');
  console.log('   2. Start the Expo dev server: npm start');
  console.log('   3. Open the app and register/login with the test user');
  console.log('═══════════════════════════════════════════════════════\n');
}

// Run the script
resetData().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
