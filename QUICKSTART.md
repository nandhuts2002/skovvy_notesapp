# 🚀 Simple Notes App - Quick Start Guide

## ✅ What's Been Set Up

- ✅ Backend environment configured with Supabase credentials
- ✅ Frontend environment configured with Supabase credentials
- ✅ Dependencies installed (Backend: 84 packages, Frontend: 106 packages)
- ✅ Backend server running on **http://localhost:5000**
- ✅ Frontend server running on **http://localhost:5173**

## ⚠️ IMPORTANT: Database Setup Required

You need to run the database schema in Supabase **before testing the app**.

### Steps to Set Up Database:

1. **Open Supabase SQL Editor**:
   - Go to: https://supabase.com/dashboard/project/ilyqrfkgfxaeaazpfjie/sql/new
   - Log in to your Supabase account if needed

2. **Copy the SQL Schema**:
   - Open the file: `d:\skv\database\schema.sql`
   - Copy the entire contents

3. **Run the Schema**:
   - Paste the SQL into the Supabase SQL Editor
   - Click "Run" button
   - You should see: "Success. No rows returned"

4. **Verify Tables Created**:
   - Go to: https://supabase.com/dashboard/project/ilyqrfkgfxaeaazpfjie/editor
   - You should see the `notes` table in the sidebar

## 🎯 Testing the Application

Once the database is set up:

1. **Open the App**:
   - Navigate to: http://localhost:5173

2. **Sign Up**:
   - Click "Sign up" 
   - Enter email and password
   - You'll be redirected to the notes page

3. **Create Notes**:
   - Enter a title and content
   - Click "Add Note"
   - Your note will appear in the list

4. **Test Features**:
   - ✅ Edit notes (click "Edit" button)
   - ✅ Delete notes (click "Delete" with confirmation)
   - ✅ View note count
   - ✅ Automatic sorting by most recently updated
   - ✅ Content preview (first 100 characters)
   - ✅ Relative timestamps

5. **Test Authentication**:
   - Click "Logout"
   - Try to access http://localhost:5173/notes (should redirect to login)
   - Log back in with your credentials
   - Verify your notes are still there

## 📡 Server Status

### Backend API
- **URL**: http://localhost:5000
- **Status**: ✅ Running
- **Health Check**: http://localhost:5000/health

### Frontend App
- **URL**: http://localhost:5173
- **Status**: ✅ Running
- **Auto-reload**: Enabled (Vite hot module replacement)

## 🔧 Useful Commands

### Backend
```bash
cd d:\skv\backend
npm run dev     # Start development server
```

### Frontend
```bash
cd d:\skv\frontend
npm run dev     # Start development server
```

## 📝 Quick Reference

### Environment Files Created
- ✅ `d:\skv\backend\.env` - Backend Supabase credentials
- ✅ `d:\skv\frontend\.env` - Frontend Supabase credentials

### API Endpoints (all require JWT token)
- POST `/api/notes` - Create note
- GET `/api/notes` - Get all notes
- GET `/api/notes/:id` - Get single note
- PUT `/api/notes/:id` - Update note
- DELETE `/api/notes/:id` - Delete note

## ⚠️ Troubleshooting

### "Failed to fetch notes" error?
→ Make sure you've run the database schema in Supabase SQL Editor

### Can't sign up?
→ Check browser console for errors
→ Verify Supabase credentials are correct in `.env` files

### CORS errors?
→ Both servers must be running
→ Frontend must use `http://localhost:5173`
→ Backend must use `http://localhost:5000`

## 📚 Documentation

For complete documentation, see:
- **README.md** - Full setup and API documentation
- **Walkthrough.md** - Implementation details and features

---

**Ready to test!** 🎉

1. Run the database schema in Supabase (link above)
2. Open http://localhost:5173
3. Sign up and start creating notes!
