# School Management System

A comprehensive school management system built with the MERN stack (MongoDB, Express.js, React, Node.js).

## Features

- User Authentication & Authorization
- Student Management
- Parent Portal
- Grade Management
- Attendance Tracking
- Calendar & Events
- Messaging System
- Real-time Notifications
- File Management

## Prerequisites

- Node.js >= 14.0.0
- MongoDB
- npm or yarn

## Installation & Setup

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

4. Update the `.env` file with your configuration:
- Set up MongoDB connection string
- Configure JWT secret
- Set up email credentials (if using email notifications)
- Configure cloud storage (if using file uploads)

5. Start the development server:
```bash
npm run dev
```

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file:
```bash
cp .env.example .env
```

4. Update the `.env` file with your backend API URL

5. Start the development server:
```bash
npm start
```

## Deployment

### Backend Deployment (Render.com)

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Configure the following:
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Environment Variables (copy from .env)

### Frontend Deployment (Vercel)

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy to Vercel:
```bash
vercel
```

3. Configure environment variables in Vercel dashboard

## Environment Variables

### Backend

```env
PORT=5000
NODE_ENV=production
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=24h
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_specific_password
FRONTEND_URL=your_frontend_url
```

### Frontend

```env
REACT_APP_API_URL=your_backend_api_url
```

## API Documentation

API documentation is available at `/api-docs` when running in development mode.

## Testing

Run the test suite:

```bash
npm test
```

## Contributing

1. Fork the repository
2. Create a new branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
