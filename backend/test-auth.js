import axios from 'axios';

const API_URL = 'http://localhost:5001/api/v1/auth';

// Test user data
const testUser = {
  name: 'Test User',
  email: `test${Date.now()}@example.com`,
  password: 'test1234',
  passwordConfirm: 'test1234'
};

// Helper function to make API calls
async function testAuth() {
  try {
    console.log('Testing authentication flow...\n');
    
    // 1. Test signup
    console.log('1. Testing user signup...');
    const signupResponse = await axios.post(`${API_URL}/signup`, testUser);
    console.log('✅ Signup successful!', signupResponse.data);
    
    // 2. Test login with correct credentials
    console.log('\n2. Testing login with correct credentials...');
    const loginResponse = await axios.post(`${API_URL}/login`, {
      email: testUser.email,
      password: testUser.password
    });
    console.log('✅ Login successful!', {
      token: loginResponse.data.token,
      user: loginResponse.data.data.user
    });
    
    // 3. Test login with incorrect password
    console.log('\n3. Testing login with incorrect password...');
    try {
      await axios.post(`${API_URL}/login`, {
        email: testUser.email,
        password: 'wrongpassword'
      });
    } catch (error) {
      console.log('✅ Failed login test (expected):', error.response?.data?.message);
    }
    
    // 4. Test login with non-existent email
    console.log('\n4. Testing login with non-existent email...');
    try {
      await axios.post(`${API_URL}/login`, {
        email: 'nonexistent@example.com',
        password: 'password123'
      });
    } catch (error) {
      console.log('✅ Failed login test (expected):', error.response?.data?.message);
    }
    
    console.log('\n🎉 All authentication tests completed successfully!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
    process.exit(1);
  }
}

// Run the tests
testAuth();
