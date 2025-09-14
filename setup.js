#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🚀 Portfolio Backend Setup');
console.log('==========================\n');

// Check if .env file already exists
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
    console.log('⚠️  .env file already exists. Skipping creation.');
    console.log('Please update your existing .env file with the required variables.\n');
} else {
    // Create .env file with template
    const envTemplate = `# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/portfolio

# JWT Secret (change this in production)
JWT_SECRET=your_jwt_secret_key_here_change_this_in_production

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Server Configuration
PORT=5000
`;

    try {
        fs.writeFileSync(envPath, envTemplate);
        console.log('✅ .env file created successfully!');
        console.log('📝 Please update the .env file with your actual credentials.\n');
    } catch (error) {
        console.error('❌ Error creating .env file:', error.message);
        process.exit(1);
    }
}

console.log('📋 Required Environment Variables:');
console.log('================================');
console.log('1. MONGODB_URI - Your MongoDB connection string');
console.log('2. JWT_SECRET - A secret key for JWT tokens');
console.log('3. CLOUDINARY_CLOUD_NAME - Your Cloudinary cloud name');
console.log('4. CLOUDINARY_API_KEY - Your Cloudinary API key');
console.log('5. CLOUDINARY_API_SECRET - Your Cloudinary API secret');
console.log('6. PORT - Server port (optional, defaults to 5000)\n');

console.log('🔧 Next Steps:');
console.log('==============');
console.log('1. Update the .env file with your credentials');
console.log('2. Install dependencies: npm install');
console.log('3. Start MongoDB service');
console.log('4. Run the server: npm run dev');
console.log('5. Initialize portfolio data: npm run setup\n');

console.log('📚 For more information, see README.md');
console.log('🎯 Happy coding!');
