# Project Management Tool

A full-stack project management application built with React, TypeScript, NestJS, and MongoDB.

## Live Demo

- **Frontend**: [https://project-management-tool-chi-ruby.vercel.app](https://project-management-tool-chi-ruby.vercel.app)
- **Backend API**: [https://project-management-tool-byza.onrender.com](https://project-management-tool-byza.onrender.com)

**Test Credentials:**

- Email: `test@example.com`
- Password: `Test@123`

## Features

- User authentication with JWT
- Create, update, and delete projects
- Task management with status tracking (todo, in-progress, done)
- Search and filter functionality
- Pagination for projects
- Responsive design with dark/light theme
- Form validation on both client and server
- Delete confirmation modals

## Tech Stack

### Backend

- NestJS 10
- MongoDB with Mongoose
- Passport JWT for authentication
- Bcrypt for password hashing
- Class Validator for DTO validation

### Frontend

- React 18
- TypeScript
- Vite
- React Router 6
- Zustand for state management
- React Hook Form
- Axios
- Tailwind CSS

### Tools

- Docker
- ESLint & Prettier
- Jest for testing

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- MongoDB (v6 or higher)

## Installation

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd project-management-tool
```

### 2. Install dependencies

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 3. Setup environment variables

```bash
# Backend .env
cd backend
cp .env.example .env
```

Update `backend/.env`:

```env
MONGODB_URI=mongodb://localhost:27017/project-management
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRATION=7d
PORT=3000
```

```bash
# Frontend .env (if needed)
cd ../frontend
cp .env.example .env
```

### 4. Start MongoDB

**Windows:**

```powershell
net start MongoDB
```

**macOS/Linux:**

```bash
sudo systemctl start mongod
# or
brew services start mongodb-community
```

**Verify MongoDB is running:**

```powershell
netstat -an | Select-String "27017"
```

### 5. Seed the database

```bash
cd backend
npm run seed
```

You'll see output confirming the test user and sample data was created.

**Test credentials:**

- Email: test@example.com
- Password: Test@123

### 6. Start the application

```bash
# Terminal 1 - Backend
cd backend
npm run start:dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### 7. Access the application

- Frontend: http://localhost:5173
- Backend API: http://localhost:3000
- Login with: test@example.com / Test@123

## Project Structure

```
project-management-tool/
├── backend/                    # NestJS backend
│   ├── src/
│   │   ├── auth/              # Authentication module (JWT)
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── strategies/    # Passport JWT strategy
│   │   │   ├── guards/        # JWT auth guards
│   │   │   └── dto/           # Auth DTOs
│   │   ├── users/             # User management
│   │   │   ├── users.service.ts
│   │   │   └── schemas/       # User schema
│   │   ├── projects/          # Projects module
│   │   │   ├── projects.controller.ts
│   │   │   ├── projects.service.ts
│   │   │   ├── schemas/       # Project schema
│   │   │   └── dto/           # Project DTOs
│   │   ├── tasks/             # Tasks module
│   │   │   ├── tasks.controller.ts
│   │   │   ├── tasks.service.ts
│   │   │   ├── schemas/       # Task schema
│   │   │   └── dto/           # Task DTOs
│   │   ├── database/          # Database utilities
│   │   │   └── seed.ts        # Seed script
│   │   ├── app.module.ts      # Root module
│   │   └── main.ts            # Application entry
│   ├── test/                  # E2E tests
│   ├── Dockerfile             # Docker configuration
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/                   # React frontend
│   ├── src/
│   │   ├── components/        # Reusable components
│   │   │   ├── Header.tsx     # Navigation with theme toggle
│   │   │   ├── ProjectModal.tsx  # Create/edit projects
│   │   │   ├── TaskModal.tsx     # Create/edit tasks
│   │   │   └── DeleteModal.tsx   # Confirmation dialog
│   │   ├── pages/             # Page components
│   │   │   ├── Login.tsx      # Login page
│   │   │   ├── Register.tsx   # Registration page
│   │   │   ├── Dashboard.tsx  # Projects list
│   │   │   └── ProjectDetails.tsx  # Task management
│   │   ├── hooks/             # Custom React hooks
│   │   │   └── useTheme.ts    # Theme management
│   │   ├── store/             # Zustand state
│   │   │   └── authStore.ts   # Auth state management
│   │   ├── lib/               # Utilities
│   │   │   └── axios.ts       # Axios configuration
│   │   ├── types/             # TypeScript types
│   │   │   └── index.ts       # Type definitions
│   │   ├── App.tsx            # Main app component
│   │   ├── index.css          # Global styles
│   │   └── main.tsx           # Entry point
│   ├── Dockerfile             # Docker configuration
│   ├── package.json
│   ├── vite.config.ts         # Vite configuration
│   ├── tailwind.config.js     # Tailwind configuration
│   └── tsconfig.json
│
├── docker-compose.yml
└── README.md
```

## API Endpoints

### Authentication

| Method | Endpoint       | Description       | Auth Required |
| ------ | -------------- | ----------------- | ------------- |
| POST   | /auth/register | Register new user | No            |
| POST   | /auth/login    | Login user        | No            |

**Register Request:**

```json
{
  "email": "user@example.com",
  "password": "Test@123"
}
```

**Login Response:**

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "user@example.com"
  }
}
```

### Projects

| Method | Endpoint      | Description        | Auth Required |
| ------ | ------------- | ------------------ | ------------- |
| GET    | /projects     | Get all projects   | Yes           |
| GET    | /projects/:id | Get single project | Yes           |
| POST   | /projects     | Create project     | Yes           |
| PATCH  | /projects/:id | Update project     | Yes           |
| DELETE | /projects/:id | Delete project     | Yes           |

**Query Parameters for GET /projects:**

- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 10)
- `search` (string): Search in title/description

**Create/Update Project Request:**

```json
{
  "title": "E-Commerce Platform",
  "description": "Build a modern e-commerce platform with React and Node.js",
  "status": "active"
}
```

### Tasks

| Method | Endpoint   | Description     | Auth Required |
| ------ | ---------- | --------------- | ------------- |
| GET    | /tasks     | Get all tasks   | Yes           |
| GET    | /tasks/:id | Get single task | Yes           |
| POST   | /tasks     | Create task     | Yes           |
| PATCH  | /tasks/:id | Update task     | Yes           |
| DELETE | /tasks/:id | Delete task     | Yes           |

**Query Parameters for GET /tasks:**

- `projectId` (string): Filter by project
- `status` (string): Filter by status (todo/in-progress/done)

**Create/Update Task Request:**

```json
{
  "title": "Setup Project Repository",
  "description": "Initialize Git repository and setup project structure",
  "status": "todo",
  "dueDate": "2024-12-31T00:00:00.000Z",
  "projectId": "507f1f77bcf86cd799439011"
}
```

## Database Schema

### User Collection

```typescript
{
  _id: ObjectId,
  email: String (unique, required),
  password: String (hashed, required),
  createdAt: Date,
  updatedAt: Date
}
```

### Project Collection

```typescript
{
  _id: ObjectId,
  title: String (required),
  description: String (required),
  status: String (enum: ['active', 'completed'], default: 'active'),
  userId: ObjectId (ref: 'User', required),
  createdAt: Date,
  updatedAt: Date
}
```

### Task Collection

```typescript
{
  _id: ObjectId,
  title: String (required),
  description: String (required),
  status: String (enum: ['todo', 'in-progress', 'done'], default: 'todo'),
  dueDate: Date (required),
  projectId: ObjectId (ref: 'Project', required),
  userId: ObjectId (ref: 'User', required),
  createdAt: Date,
  updatedAt: Date
}
```

## Running with Docker

```bash
# Build and start all services
docker-compose up --build

# Run in background
docker-compose up -d

# Seed database
docker-compose exec backend npm run seed

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## Environment Variables

### Backend (.env)

```env
# Database
MONGODB_URI=mongodb://localhost:27017/project-management

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRATION=7d

# Server
PORT=3000
```

### Frontend (.env)

```env
# API Configuration
VITE_API_URL=http://localhost:3000
```

## Known Limitations

- No file upload functionality
- No real-time updates (WebSocket)
- No email verification
- No password reset mechanism
- Limited user profile management
- No notification system
- Single-user projects (no collaboration)
- No task dependencies
- No task comments

## Deployment

### Production Deployment

The application is deployed on the following platforms:

#### Frontend (Vercel)
- **URL**: https://project-management-tool-chi-ruby.vercel.app
- **Platform**: Vercel
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Root Directory**: `frontend`

#### Backend (Render)
- **URL**: https://project-management-tool-byza.onrender.com
- **Platform**: Render
- **Build Command**: `npm install && npm run build`
- **Start Command**: `node dist/main.js`
- **Root Directory**: `backend`

#### Database (MongoDB Atlas)
- **Platform**: MongoDB Atlas
- **Region**: Asia-Southeast (Singapore)
- **Tier**: M0 (Free)

### Environment Variables

**Backend (Render):**
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/project-management
JWT_SECRET=your-production-jwt-secret
JWT_EXPIRATION=7d
PORT=10000
NODE_ENV=production
FRONTEND_URL=https://project-management-tool-chi-ruby.vercel.app
```

**Frontend (Vercel):**
```env
VITE_API_URL=https://project-management-tool-byza.onrender.com
```

### Deployment Steps

#### Deploy Backend to Render
1. Connect GitHub repository to Render
2. Set root directory to `backend`
3. Configure build and start commands
4. Add environment variables
5. Deploy

#### Deploy Frontend to Vercel
1. Connect GitHub repository to Vercel
2. Set root directory to `frontend`
3. Configure build settings (Vite)
4. Add environment variables
5. Deploy

#### Setup MongoDB Atlas
1. Create a free M0 cluster
2. Configure network access (allow 0.0.0.0/0)
3. Create database user
4. Get connection string
5. Update backend environment variable

## License

MIT License
