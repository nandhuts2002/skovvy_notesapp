# Simple Notes App

A complete, production-ready notes application built with **React + Vite** frontend, **Node.js + Express** backend, **Supabase** for PostgreSQL database and authentication, secured with **JWT tokens**.

## 🚀 Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Axios** - HTTP client with interceptors
- **Supabase JS Client** - Authentication

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **Supabase** - PostgreSQL database & auth
- **JWT** - Token-based authentication
- **CORS** - Cross-origin resource sharing

### Database
- **Supabase (PostgreSQL)** - Cloud database
- **Row Level Security (RLS)** - Data isolation

## 📁 Project Structure

```
/frontend
  ├── src
  │   ├── pages
  │   │   ├── Signup.jsx          # User registration
  │   │   ├── Login.jsx           # User login
  │   │   ├── Notes.jsx           # Main notes dashboard
  │   ├── components
  │   │   ├── NoteForm.jsx        # Create/edit note form
  │   │   ├── NoteList.jsx        # Display notes list
  │   │   ├── NoteItem.jsx        # Individual note card
  │   ├── services
  │   │   ├── api.js              # Axios instance with JWT interceptor
  │   │   ├── supabase.js         # Supabase client config
  │   ├── context
  │   │   ├── AuthContext.jsx     # Authentication state management
  │   ├── App.jsx                 # Main app with routing
  │   ├── main.jsx                # Entry point

/backend
  ├── src
  │   ├── routes
  │   │   ├── notes.routes.js     # Notes API routes
  │   ├── middleware
  │   │   ├── auth.middleware.js  # JWT verification
  │   ├── controllers
  │   │   ├── notes.controller.js # CRUD logic
  │   ├── supabaseClient.js       # Supabase admin client
  │   ├── server.js               # Express server

/database
  ├── schema.sql                  # Database schema & RLS policies
```

## 🗄️ Database Schema

### Notes Table

| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PRIMARY KEY, default uuid_generate_v4() |
| user_id | UUID | NOT NULL, references auth.users(id) |
| title | TEXT | NOT NULL |
| content | TEXT | NOT NULL |
| created_at | TIMESTAMP | default NOW() |
| updated_at | TIMESTAMP | default NOW() |

### Row Level Security (RLS) Policies

All policies enforce that users can only access their own notes:
- **SELECT**: Users see only their notes (`auth.uid() = user_id`)
- **INSERT**: Users can only create notes for themselves
- **UPDATE**: Users can only update their own notes
- **DELETE**: Users can only delete their own notes

## 🔐 Authentication & Security

### How JWT Works in This App

1. **User Signs Up/Logs In** → Supabase Auth creates session
2. **Session Token** → Frontend stores `access_token` in localStorage
3. **API Requests** → Axios interceptor attaches token:
   ```
   Authorization: Bearer <access_token>
   ```
4. **Backend Verification** → Middleware verifies token with Supabase:
   ```javascript
   const { data: { user }, error } = await supabase.auth.getUser(token);
   ```
5. **User ID Extraction** → Backend uses `user.id` for all database queries
6. **Database Security** → RLS policies double-check user ownership

### Security Features
- ✅ JWT verification on every protected route
- ✅ User ID extracted from verified token (never trusted from client)
- ✅ Row Level Security enforces data isolation
- ✅ Automatic token refresh handling
- ✅ 401 responses for invalid/expired tokens
- ✅ HTTPS required in production

## 🛠️ Setup Instructions

### 1. Supabase Setup

1. Create a Supabase account at [supabase.com](https://supabase.com)
2. Create a new project
3. Go to **Project Settings** → **API**
4. Copy the following:
   - `Project URL` (SUPABASE_URL)
   - `anon public` key (SUPABASE_ANON_KEY)
   - `service_role` key (SUPABASE_SERVICE_ROLE_KEY) - **Keep this secret!**

5. Go to **SQL Editor** and run the schema from `database/schema.sql`

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file (copy from .env.example)
cp .env.example .env

# Edit .env and add your Supabase credentials
# SUPABASE_URL=https://your-project.supabase.co
# SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
# PORT=5000

# Start development server
npm run dev
```

Backend will run on `http://localhost:5000`

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create .env file (copy from .env.example)
cp .env.example .env

# Edit .env and add your Supabase credentials
# VITE_SUPABASE_URL=https://your-project.supabase.co
# VITE_SUPABASE_ANON_KEY=your-anon-key
# VITE_API_BASE_URL=http://localhost:5000

# Start development server
npm run dev
```

Frontend will run on `http://localhost:5173`

### 4. Test the Application

1. Open `http://localhost:5173`
2. Sign up with email and password
3. Create, edit, and delete notes
4. Log out and log back in
5. Verify notes are persisted

## 📡 API Documentation

Base URL: `http://localhost:5000`

### Authentication
All `/api/notes` routes require JWT authentication via the `Authorization` header.

### Endpoints

#### Create Note
```bash
POST /api/notes
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "title": "My First Note",
  "content": "This is the note content"
}

# Response: 201 Created
{
  "id": "uuid",
  "user_id": "uuid",
  "title": "My First Note",
  "content": "This is the note content",
  "created_at": "2024-01-16T12:00:00Z",
  "updated_at": "2024-01-16T12:00:00Z"
}
```

#### Get All Notes
```bash
GET /api/notes
Authorization: Bearer <access_token>

# Response: 200 OK
[
  {
    "id": "uuid",
    "user_id": "uuid",
    "title": "My First Note",
    "content": "This is the note content",
    "created_at": "2024-01-16T12:00:00Z",
    "updated_at": "2024-01-16T12:00:00Z"
  }
]
# Notes sorted by updated_at DESC
```

#### Get Single Note
```bash
GET /api/notes/:id
Authorization: Bearer <access_token>

# Response: 200 OK
{
  "id": "uuid",
  "user_id": "uuid",
  "title": "My First Note",
  "content": "This is the note content",
  "created_at": "2024-01-16T12:00:00Z",
  "updated_at": "2024-01-16T12:00:00Z"
}

# Response: 404 Not Found (if note doesn't exist or doesn't belong to user)
```

#### Update Note
```bash
PUT /api/notes/:id
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "title": "Updated Title",
  "content": "Updated content"
}

# Response: 200 OK
{
  "id": "uuid",
  "user_id": "uuid",
  "title": "Updated Title",
  "content": "Updated content",
  "created_at": "2024-01-16T12:00:00Z",
  "updated_at": "2024-01-16T12:30:00Z"
}

# Response: 404 Not Found (if note doesn't exist or doesn't belong to user)
```

#### Delete Note
```bash
DELETE /api/notes/:id
Authorization: Bearer <access_token>

# Response: 200 OK
{
  "message": "Note deleted successfully"
}

# Response: 404 Not Found (if note doesn't exist or doesn't belong to user)
```

### Error Responses

```bash
# 401 Unauthorized - Missing or invalid token
{
  "error": "Unauthorized",
  "message": "Missing or invalid Authorization header"
}

# 400 Bad Request - Validation error
{
  "error": "Bad Request",
  "message": "Title and content are required"
}

# 404 Not Found - Resource not found
{
  "error": "Not Found",
  "message": "Note not found"
}

# 500 Internal Server Error
{
  "error": "Internal Server Error",
  "message": "Something went wrong"
}
```

## ✨ Features

### Authentication
- ✅ Email/password signup
- ✅ Email/password login
- ✅ Secure session management
- ✅ Automatic token refresh
- ✅ Protected routes (redirect to login)

### Notes Management
- ✅ Create notes with title and content
- ✅ View all notes (sorted by most recently updated)
- ✅ Edit notes inline
- ✅ Delete notes with confirmation
- ✅ Display notes count
- ✅ Content preview (first 100 characters)
- ✅ Relative timestamps ("2 hours ago")
- ✅ Input validation (no empty fields)

### Security
- ✅ JWT verification on all protected routes
- ✅ User ID scoping (can't access other users' notes)
- ✅ Row Level Security in database
- ✅ CORS protection
- ✅ Error handling with proper HTTP codes

## 🎨 UI/UX

- Modern gradient design with purple theme
- Responsive layout (mobile-friendly)
- Smooth transitions and hover effects
- Clean, intuitive interface
- Loading states
- Error messages
- Empty state handling

## 🚀 Production Deployment

### Backend Deployment (e.g., Railway, Render, Heroku)
1. Set environment variables in hosting platform
2. Ensure `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are set
3. Update CORS settings in `server.js` to allow your frontend domain

### Frontend Deployment (e.g., Vercel, Netlify)
1. Set environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_API_BASE_URL` (your backend URL)
2. Build: `npm run build`
3. Deploy the `dist` folder

### Supabase (Production)
1. Enable email confirmations in **Authentication** → **Settings**
2. Configure email templates
3. Set up custom SMTP (optional)
4. Review RLS policies
5. Enable database backups

## 🧪 Testing

### Manual Testing Checklist
- [ ] Sign up with new email
- [ ] Verify email confirmation (if enabled)
- [ ] Log in with credentials
- [ ] Create a note
- [ ] Edit the note
- [ ] Delete the note (with confirmation)
- [ ] Log out
- [ ] Verify redirect to login when accessing `/notes` while logged out
- [ ] Log in again and verify notes persist
- [ ] Test with invalid token (should return 401)

## 📝 Environment Variables

### Backend (.env)
```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
PORT=5000
```

### Frontend (.env)
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
VITE_API_BASE_URL=http://localhost:5000
```

## 🔧 Troubleshooting

### "Missing Supabase credentials" error
- Ensure `.env` files exist in both frontend and backend
- Verify environment variables are correctly set
- Restart dev servers after changing `.env`

### 401 Unauthorized errors
- Check if token is being sent in Authorization header
- Verify Supabase service role key is correct
- Check if token has expired (refresh the page)

### CORS errors
- Ensure backend CORS is configured correctly
- Verify `VITE_API_BASE_URL` matches backend URL

### Notes not showing
- Check browser console for errors
- Verify database schema was created correctly
- Check RLS policies in Supabase dashboard

## 📄 License

MIT

## 👤 Author

Built as a demonstration of full-stack development with modern technologies.

---

**Happy coding! 🎉**
