# Task Master - Premium Task Management Application

This is a modern, premium full-stack Task Management application built with React (Vite), Node.js, Express, MongoDB, and Socket.io.

## Features
- **Luxury Dark Theme**: Glassmorphism UI, smooth animations, and premium color palettes.
- **Authentication**: JWT-based auth with bcrypt password hashing.
- **Real-time Sync**: Socket.io integration across multiple tabs.
- **Responsive**: Fully responsive across mobile, tablet, and desktop.
- **Calendar View**: View tasks by their due dates.

---

## 🛠️ Prerequisites
Before you begin, ensure you have the following installed on your machine:
1. [Node.js](https://nodejs.org/en/) (v16 or higher) - **CRITICAL: You must install Node.js as it is not currently detected on your system.**
2. [MongoDB](https://www.mongodb.com/try/download/community) (Local installation or a MongoDB Atlas URI)

---

## 🚀 Installation & Local Development

### 1. Backend Setup
1. Open a terminal and navigate to the `backend` folder:
   ```bash
   cd "d:\abhiram\Internship projects\Task manager application\backend"
   ```
2. Install the backend dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `backend` directory (already created for you) with:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://127.0.0.1:27017/taskmanager
   JWT_SECRET=super_secret_jwt_key_for_development
   ```
4. Start the backend server:
   ```bash
   npm run dev
   ```

### 2. Frontend Setup
1. Open a new terminal and navigate to the `frontend` folder:
   ```bash
   cd "d:\abhiram\Internship projects\Task manager application\frontend"
   ```
2. Install the frontend dependencies:
   ```bash
   npm install
   ```
3. Start the frontend development server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to the URL provided by Vite (usually `http://localhost:5173`).

---

## ☁️ Deployment Guide

### Backend Deployment (Railway)
1. Push your `backend` code to a GitHub repository.
2. Sign in to [Railway.app](https://railway.app/).
3. Click "New Project" -> "Deploy from GitHub repo".
4. Select your backend repository.
5. In Railway Variables, add your environment variables (`MONGODB_URI` pointing to Atlas, and `JWT_SECRET`).
6. Railway will automatically detect the `package.json` and start the Node server.

### Frontend Deployment (Vercel)
1. Push your `frontend` code to a GitHub repository.
2. Sign in to [Vercel](https://vercel.com/).
3. Click "Add New" -> "Project".
4. Import your frontend repository.
5. Vercel will automatically detect Vite and configure the build settings (`npm run build` and output directory `dist`).
6. Before deploying, ensure you update the `axios.defaults.baseURL` in `frontend/src/context/AuthContext.jsx` and the socket URL in `frontend/src/context/SocketContext.jsx` to point to your live Railway backend URL instead of `localhost:5000`.
7. Click "Deploy".
