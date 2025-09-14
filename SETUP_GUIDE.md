# Portfolio Backend Setup Guide

This guide will help you set up the portfolio backend with Cloudinary image upload functionality.

## Prerequisites

1. **Node.js** (version 16 or higher)
2. **MongoDB** (local or cloud instance)
3. **Cloudinary Account** (free tier available)

## Step 1: Environment Setup

### 1.1 Create Environment File

Run the setup script to create your `.env` file:

```bash
cd my-portfolio-backend
node setup.js
```

This will create a `.env` file with the following template:

```env
# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/portfolio

# JWT Secret (change this in production)
JWT_SECRET=your_jwt_secret_key_here_change_this_in_production

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Server Configuration
PORT=5000
```

### 1.2 Update Environment Variables

Edit the `.env` file with your actual credentials:

1. **MongoDB URI**: 
   - Local: `mongodb://localhost:27017/portfolio`
   - Cloud (MongoDB Atlas): `mongodb+srv://username:password@cluster.mongodb.net/portfolio`

2. **JWT Secret**: Generate a strong secret key (e.g., use `openssl rand -base64 32`)

3. **Cloudinary Credentials**: Get these from your Cloudinary dashboard

## Step 2: Cloudinary Setup

### 2.1 Create Cloudinary Account

1. Go to [cloudinary.com](https://cloudinary.com)
2. Sign up for a free account
3. Go to your dashboard

### 2.2 Get Credentials

From your Cloudinary dashboard, copy:
- **Cloud Name**
- **API Key**
- **API Secret**

Update these in your `.env` file.

## Step 3: Install Dependencies

```bash
npm install
```

## Step 4: Start MongoDB

### Local MongoDB:
```bash
# On Windows
net start MongoDB

# On macOS/Linux
sudo systemctl start mongod
```

### MongoDB Atlas:
No additional setup needed if using cloud MongoDB.

## Step 5: Initialize Database

```bash
npm run setup
```

This will create the initial portfolio data structure.

## Step 6: Start the Server

### Development Mode:
```bash
npm run dev
```

### Production Mode:
```bash
npm start
```

The server will start on `http://localhost:5000`

## Step 7: Test the Setup

Run the test script to verify everything is working:

```bash
node test-upload.js
```

## Step 8: Create Admin User

### 8.1 Register Admin User

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "your_secure_password"}'
```

### 8.2 Login to Get Token

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "your_secure_password"}'
```

Save the returned token for authenticated requests.

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register admin user
- `POST /api/auth/login` - Login admin user

### Portfolio Data
- `GET /api/portfolio-data` - Get all portfolio data
- `PUT /api/portfolio-data` - Update portfolio data (protected)

### Projects (All Protected)
- `POST /api/projects` - Add new project with image upload
- `PUT /api/projects/:id` - Update project (with optional image upload)
- `DELETE /api/projects/:id` - Delete project (removes image from Cloudinary)

### Experience (All Protected)
- `POST /api/experience` - Add new experience
- `PUT /api/experience/:id` - Update experience
- `DELETE /api/experience/:id` - Delete experience

### Resume (Protected)
- `PUT /api/resume` - Update resume (with file upload)

## Image Upload Features

### ✅ What's Implemented:

1. **Cloudinary Integration**: Images are uploaded directly to Cloudinary
2. **Automatic URL Storage**: Cloudinary URLs are stored in the database
3. **Image Management**: 
   - Old images are deleted when new ones are uploaded
   - Images are deleted when projects are deleted
4. **File Validation**: Only images, PDFs, and Word docs are allowed
5. **Size Limits**: 10MB maximum file size
6. **Error Handling**: Comprehensive error handling for upload failures

### 🔧 How It Works:

1. **Frontend** sends FormData with image file to backend
2. **Multer** middleware processes the file upload
3. **CloudinaryStorage** uploads file to Cloudinary
4. **Controller** receives `req.file.secure_url` from Cloudinary
5. **Database** stores the Cloudinary URL
6. **Frontend** displays images using the stored URLs

## Troubleshooting

### Common Issues:

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check connection string in `.env`

2. **Cloudinary Upload Error**
   - Verify Cloudinary credentials in `.env`
   - Check file size and format

3. **Authentication Error**
   - Ensure JWT_SECRET is set in `.env`
   - Check token expiration

4. **File Upload Error**
   - Verify file type is supported
   - Check file size (max 10MB)

### Health Check:

```bash
curl http://localhost:5000/health
```

## Frontend Integration

The frontend (`my-portfolio`) is already configured to work with this backend:

1. **ProjectsManager.jsx**: Handles project CRUD with image uploads
2. **ResumeManager.jsx**: Handles resume uploads
3. **ExperienceManager.jsx**: Handles experience management

### Frontend Setup:

```bash
cd ../my-portfolio
npm install
npm run dev
```

The frontend will run on `http://localhost:5173`

## Production Deployment

### Environment Variables for Production:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/portfolio
JWT_SECRET=your_very_secure_jwt_secret_here
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
PORT=5000
NODE_ENV=production
```

### Security Notes:

1. Change default JWT secret
2. Use strong passwords for admin user
3. Enable CORS for your frontend domain only
4. Use HTTPS in production
5. Regularly backup your MongoDB database

## Support

If you encounter any issues:

1. Check the console logs for error messages
2. Verify all environment variables are set correctly
3. Ensure all services (MongoDB, Cloudinary) are accessible
4. Check the test script output for specific error details

Happy coding! 🚀
