# 🚀 Quick Start - SeatSafe Event Ticketing System

## ⚡ Prerequisites
1. **Node.js**: v18.0.0 or higher
2. **PostgreSQL**: v14.0 or higher

---

## 📋 Getting Started

### Step 1: Configure Environment Variables
Copy `.env.example` to `.env` inside `backend/`:
```powershell
cp backend/.env.example backend/.env
```

### Step 2: Start Backend Server
```powershell
cd backend
npm install
npm run dev
```

### Step 3: Start Frontend Client
In a new terminal window:
```powershell
cd frontend
npm install
npm run dev
```

---

## 🌐 Access the Application

- **Frontend (UI)**: http://localhost:5173
- **Backend (API)**: http://localhost:8080
- **Health Check**: http://localhost:8080/health

---

## 🎯 Test the Application

### 1. Register as Organizer
1. Go to http://localhost:5173
2. Click **"Sign up"**
3. Fill in email, password, name, and set role to **organizer**
4. Click **"Register"**

### 2. Create & Publish an Event
1. Click **"Create Event"** in navbar
2. Enter details (Title, Capacity, Price, Dates)
3. Click **"Create Event"** and then **"Publish"**

### 3. Book Tickets as Attendee
1. Register/Login as an attendee
2. Browse events on homepage and click **"Register"**
3. View issued tickets in your **Dashboard**

---

## 🛠️ Run Tests

```powershell
cd backend
npm test
```
