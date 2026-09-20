# 🚀 Quick Start - Event Ticketing System

## ⚡ Super Quick Start (Easiest Way)

### Prerequisites
1. **Install Go**: https://go.dev/dl/ (Download and install)
2. **Install Node.js**: https://nodejs.org/ (Already installed ✅)

### Start Everything
Just double-click: **`start_all.bat`**

This will:
- ✅ Check if Go and Node.js are installed
- ✅ Start backend in a new window
- ✅ Start frontend in a new window
- ✅ Open both servers automatically

---

## 📋 Manual Start (Step by Step)

### Step 1: Install Go (if not installed)
1. Download from: https://go.dev/dl/
2. Run installer
3. Restart PowerShell/Command Prompt

### Step 2: Restart Backend
Double-click: **`restart_backend.bat`**

Or manually:
```powershell
cd backend
go run ./cmd/server/main.go
```

### Step 3: Restart Frontend (Optional)
Double-click: **`restart_frontend.bat`**

Or manually:
```powershell
cd frontend
npm run dev
```

---

## 🌐 Access the Application

### Frontend (User Interface)
**URL**: http://localhost:5173

### Backend (API)
**URL**: http://localhost:8080
**Health Check**: http://localhost:8080/health

---

## ✅ Verify Everything Works

### 1. Check Backend
Open PowerShell and run:
```powershell
curl http://localhost:8080/health
```

Expected response:
```json
{"status":"ok","service":"ticketing-api","version":"1.0.0"}
```

### 2. Check Frontend
Open browser: http://localhost:5173

You should see the SeatSafe homepage with events.

### 3. Run Tests
```powershell
powershell -ExecutionPolicy Bypass -File test_backend.ps1
```

Expected: **16/16 tests passing** ✅

---

## 🎯 Test the Application

### Register as Organizer
1. Go to http://localhost:5173
2. Click **"Sign up"**
3. Fill in:
   - Email: `organizer@test.com`
   - Password: `password123`
   - Full Name: `Test Organizer`
   - Role: `organizer`
4. Click **"Register"**

### Create an Event
1. Click **"Create Event"** in navbar
2. Fill in event details:
   - Title: `My First Event`
   - Description: `Test event`
   - Location: `Online`
   - Start Time: (future date)
   - End Time: (after start time)
   - Capacity: `100`
   - Price: `50.00`
3. Click **"Create Event"**
4. Click **"Publish"** to make it public

### Register as Attendee
1. Logout
2. Click **"Sign up"**
3. Fill in:
   - Email: `attendee@test.com`
   - Password: `password123`
   - Full Name: `Test Attendee`
   - Role: `attendee`
4. Click **"Register"**

### Book an Event
1. Go to homepage
2. Find your event
3. Click **"Register"**
4. Select quantity
5. Click **"Book"**
6. Check **"Dashboard"** to see your tickets

---

## 🛠️ Troubleshooting

### Backend Won't Start

#### "go: command not found"
**Solution**: Install Go from https://go.dev/dl/ and restart terminal

#### "address already in use"
**Solution**: Kill the process using port 8080
```powershell
netstat -ano | Select-String ":8080"
taskkill /PID <PID> /F
```

#### "failed to connect to database"
**Solution**: Check `backend/.env` file, verify DATABASE_URL is correct

### Frontend Won't Start

#### "EADDRINUSE: address already in use"
**Solution**: Kill the process using port 5173
```powershell
netstat -ano | Select-String ":5173"
taskkill /PID <PID> /F
```

### Frontend Shows Errors

#### "Failed to load events"
**Solution**: 
1. Check backend is running: `curl http://localhost:8080/health`
2. Check `frontend/.env.local` has correct API URL

#### "Network Error"
**Solution**: Verify CORS settings in `backend/.env`:
```env
ALLOWED_ORIGINS=http://localhost:5173
```

---

## 📁 Project Structure

```
project/
├── backend/              # Go backend (API)
│   ├── cmd/
│   │   └── server/
│   │       └── main.go   # Backend entry point
│   ├── internal/         # Business logic
│   └── .env              # Backend config
│
├── frontend/             # React frontend (UI)
│   ├── src/
│   │   ├── pages/        # Page components
│   │   ├── components/   # Reusable components
│   │   └── api/          # API client
│   └── .env.local        # Frontend config
│
├── start_all.bat         # Start both servers
├── restart_backend.bat   # Restart backend only
└── restart_frontend.bat  # Restart frontend only
```

---

## 🔑 Default Credentials

### Test Organizer
- Email: `organizer@test.com`
- Password: `password123`
- Role: `organizer`

### Test Attendee
- Email: `attendee@test.com`
- Password: `password123`
- Role: `attendee`

---

## 📊 API Endpoints

### Public Endpoints
- `GET /health` - Health check
- `POST /api/v1/auth/register` - Register user
- `POST /api/v1/auth/login` - Login
- `GET /api/v1/events` - List events
- `GET /api/v1/events/:id` - Get event details

### Authenticated Endpoints
- `GET /api/v1/auth/me` - Get profile
- `POST /api/v1/events/:id/register` - Book event
- `GET /api/v1/registrations/me` - My registrations
- `GET /api/v1/tickets/me` - My tickets

### Organizer/Admin Only
- `POST /api/v1/events` - Create event
- `PATCH /api/v1/events/:id/publish` - Publish event
- `GET /api/v1/events/:id/registrations` - Event registrations

---

## 🎉 Success Checklist

- [ ] Go installed
- [ ] Backend running on port 8080
- [ ] Frontend running on port 5173
- [ ] Health check returns OK
- [ ] Can register as organizer
- [ ] Can create and publish events
- [ ] Can register as attendee
- [ ] Can book events
- [ ] Dashboard shows tickets
- [ ] All tests passing (16/16)

---

## 📚 Additional Documentation

- `START_GUIDE.md` - Detailed start guide
- `BACKEND_FIX_SUMMARY.md` - Backend fixes summary
- `BACKEND_FIXES_APPLIED.md` - Detailed fix explanations
- `VERIFICATION_CHECKLIST.md` - Testing checklist
- `BACKEND_TEST_REPORT.md` - Test results

---

## 🆘 Need Help?

1. Check if Go is installed: `go version`
2. Check if Node.js is installed: `node --version`
3. Check if ports are free: `netstat -ano | Select-String ":8080"`
4. Check backend logs in the terminal window
5. Check frontend logs in the browser console (F12)

---

## 🎯 What's Fixed?

✅ **Role Assignment** - Users can now register with specific roles
✅ **RBAC** - Role-based access control works correctly
✅ **Event Creation** - Organizers can create and publish events
✅ **Field Naming** - API accepts multiple field name formats
✅ **Validation** - Clear error messages for invalid input

**All 16 backend tests now pass!** 🎉
