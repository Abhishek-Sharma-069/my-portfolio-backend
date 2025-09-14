# Portfolio Backend API

This is the backend API for the portfolio management system, built with Node.js, Express, and MongoDB.

## Features

- Portfolio data management (projects, experience, skills, contact info)
- File upload support for images and resumes via Cloudinary
- JWT-based authentication
- RESTful API endpoints

## Prerequisites

- Node.js (version 16 or higher)
- MongoDB (local or cloud instance)
- Cloudinary account for file storage

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Create a `.env` file in the root directory with the following variables:

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

### 3. MongoDB Setup

Make sure MongoDB is running locally or update the `MONGODB_URI` to point to your cloud MongoDB instance.

### 4. Cloudinary Setup

1. Sign up for a free Cloudinary account
2. Get your cloud name, API key, and API secret from the dashboard
3. Update the `.env` file with your credentials

### 5. Run the Application

#### Development Mode
```bash
npm run dev
```

#### Production Mode
```bash
npm start
```

#### Initialize Portfolio Data
```bash
npm run setup
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register admin user
- `POST /api/auth/login` - Login admin user

### Portfolio Data
- `GET /api/portfolio-data` - Get all portfolio data
- `PUT /api/portfolio-data` - Update portfolio data (protected)

### Projects
- `POST /api/projects` - Add new project (protected)
- `PUT /api/projects/:id` - Update project (protected)
- `DELETE /api/projects/:id` - Delete project (protected)

### Experience
- `POST /api/experience` - Add new experience (protected)
- `PUT /api/experience/:id` - Update experience (protected)
- `DELETE /api/experience/:id` - Delete experience (protected)

### Resume
- `PUT /api/resume` - Update resume (protected)

## File Upload

The API supports file uploads for:
- Project images (JPG, PNG, GIF)
- Resume files (PDF, DOC, DOCX)

Maximum file size: 10MB

## Error Handling

The API includes comprehensive error handling for:
- File upload errors
- Authentication errors
- Database errors
- Validation errors

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check the connection string in `.env`

2. **Cloudinary Upload Error**
   - Verify Cloudinary credentials in `.env`
   - Check file size and format

3. **Authentication Error**
   - Ensure JWT_SECRET is set in `.env`
   - Check token expiration

4. **File Upload Error**
   - Verify file type is supported
   - Check file size (max 10MB)

### Health Check

Check if the server is running:
```bash
curl http://localhost:5000/health
```

## Development

The application uses:
- **Express.js** - Web framework
- **Mongoose** - MongoDB ODM
- **Multer** - File upload middleware
- **Cloudinary** - Cloud file storage
- **JWT** - Authentication
- **CORS** - Cross-origin resource sharing

## License

ISC
