# Notes App

A full-stack notes application with authentication and CRUD operations.

## Tech Stack

- **Frontend**: React (Vite)
- **Backend**: Node.js + Express
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth (JWT-based)

## Database Choice

**Supabase PostgreSQL** was chosen for:
- Built-in authentication and JWT management
- Row Level Security (RLS) for data isolation
- Real-time capabilities
- Easy integration with React

## Authentication Method

**Supabase Auth** - Handles user signup, login, and JWT token generation automatically. Tokens are verified on the backend using Supabase's service role key.

## Local Setup

### Prerequisites
- Node.js 16+ installed
- Supabase account and project created

### 1. Clone and Install

```bash
cd backend
npm install

cd ../frontend
npm install
```

### 2. Environment Variables

**Backend** (`backend/.env`):
```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
PORT=5000
```

**Frontend** (`frontend/.env`):
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_anon_public_key
VITE_API_BASE_URL=http://localhost:5000
```

### 3. Database Setup

Run this SQL in your Supabase SQL Editor:

```sql
-- Create notes table
CREATE TABLE notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own notes"
  ON notes FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own notes"
  ON notes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own notes"
  ON notes FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own notes"
  ON notes FOR DELETE
  USING (auth.uid() = user_id);

-- Auto-update timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER notes_updated_at
  BEFORE UPDATE ON notes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();
```

### 4. Run the Application

**Backend:**
```bash
cd backend
npm run dev
# Runs on http://localhost:5000
```

**Frontend:**
```bash
cd frontend
npm run dev
# Runs on http://localhost:5173
```

## Database Schema

### Notes Table

| Column      | Type      | Description                    |
|-------------|-----------|--------------------------------|
| id          | UUID      | Primary key                    |
| user_id     | UUID      | Foreign key to auth.users      |
| title       | TEXT      | Note title                     |
| content     | TEXT      | Note content                   |
| created_at  | TIMESTAMP | Auto-set on creation           |
| updated_at  | TIMESTAMP | Auto-updated on modification   |

**RLS Policies**: All operations (SELECT, INSERT, UPDATE, DELETE) are restricted to the authenticated user's own notes via `auth.uid() = user_id`.

## JWT Validation Implementation

### How it works:

1. **Frontend Login/Signup**: User authenticates via Supabase Auth, receives a JWT token
2. **Token Storage**: JWT stored in Supabase client (localStorage)
3. **API Requests**: Frontend sends JWT in `Authorization: Bearer <token>` header
4. **Backend Validation**: Express middleware verifies JWT using Supabase service role:

```javascript
// backend/src/middleware/auth.middleware.js
const jwt = require('jsonwebtoken');

const authenticateUser = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    // Verify JWT with Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    
    req.user = user; // Attach user to request
    next();
  } catch (error) {
    res.status(401).json({ error: 'Authentication failed' });
  }
};
```

## API Examples

### 1. Signup
```bash
# Handled by Supabase Auth client-side
# Returns JWT token automatically
```

### 2. Get All Notes
```bash
GET http://localhost:5000/api/notes
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

Response:
[
  {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "user_id": "user-uuid",
    "title": "Meeting Notes",
    "content": "Discussed project milestones...",
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-15T10:30:00Z"
  }
]
```

### 3. Create Note
```bash
POST http://localhost:5000/api/notes
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "title": "Shopping List",
  "content": "Eggs, Milk, Bread"
}

Response:
{
  "id": "new-uuid",
  "user_id": "user-uuid",
  "title": "Shopping List",
  "content": "Eggs, Milk, Bread",
  "created_at": "2024-01-15T11:00:00Z",
  "updated_at": "2024-01-15T11:00:00Z"
}
```

### 4. Update Note
```bash
PUT http://localhost:5000/api/notes/{noteId}
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "title": "Updated Title",
  "content": "Updated content"
}
```

### 5. Delete Note
```bash
DELETE http://localhost:5000/api/notes/{noteId}
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

Response:
{
  "message": "Note deleted successfully"
}
```

## Security Features

- **JWT Authentication**: All API endpoints require valid JWT token
- **Row Level Security (RLS)**: Database-level isolation ensures users only access their own data
- **User Scoping**: Backend extracts user ID from verified JWT, preventing unauthorized access
- **CORS**: Configured to accept requests only from frontend origin

## License

MIT
