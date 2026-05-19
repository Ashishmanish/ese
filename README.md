# AI-Based Smart Complaint Management System

A full-stack MERN application that allows users to register complaints, track them, and utilize AI for smart categorization, priority detection, and auto-generated responses.

## Features

- **User Authentication**: Secure Login & Signup with JWT and bcrypt.
- **Complaint Management**: Users can register and track complaints.
- **AI Integration**: Powered by OpenRouter AI (e.g., Google Gemini Flash / OpenAI) to automatically:
  - Detect complaint urgency/priority.
  - Suggest the responsible department.
  - Generate an auto-reply message for the user.
  - Summarize the complaint.
- **Dashboard**: View all complaints, filter by category, and search by location.
- **Admin Capabilities**: Update the status of any complaint.

## Tech Stack

- **Frontend**: React (Vite), Tailwind CSS, React Router, Axios.
- **Backend**: Node.js, Express.js.
- **Database**: MongoDB (Mongoose).
- **AI API**: OpenRouter API.

## Setup Instructions

### 1. Backend Setup

1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `backend` directory with the following:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   OPENROUTER_API_KEY=your_openrouter_api_key
   ```
4. Start the server:
   ```bash
   node server.js
   ```

### 2. Frontend Setup

1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login

### Complaints
- `POST /api/complaints` - Add a complaint
- `GET /api/complaints` - Get all complaints
- `GET /api/complaints/:id` - Get complaint by ID
- `PUT /api/complaints/:id` - Update complaint status
- `GET /api/complaints/search?location={loc}` - Search by location

### AI
- `POST /api/ai/analyze` - Analyze a complaint via AI

## Deployment

### Render Deployment Instructions

1. **Backend**:
   - Create a new "Web Service" on Render.
   - Connect your GitHub repository.
   - Set the Root Directory to `backend`.
   - Build Command: `npm install`
   - Start Command: `node server.js`
   - Add all your Environment Variables (`MONGO_URI`, `JWT_SECRET`, `OPENROUTER_API_KEY`).

2. **Frontend**:
   - Create a new "Static Site" on Render.
   - Connect your GitHub repository.
   - Set the Root Directory to `frontend`.
   - Build Command: `npm run build`
   - Publish Directory: `dist`
   - Ensure you update all `http://localhost:5000` API calls in the React code to your new Render backend URL before deploying, or use an environment variable.
