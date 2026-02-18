# Frontend-Backend Integration Guide

## Overview

The frontend has been fully integrated with the backend API. All data is now persisted to the Supabase PostgreSQL database and calculations are performed on the server.

## What Was Changed

### 1. New API Service Layer (`src/lib/api.ts`)
Created a complete API service wrapper that handles:
- **Project Management**: Create, list, retrieve, update, delete projects
- **Configuration**: Update wages and material rates
- **Timeline Analysis**: Analyze timeline compression options
- **Utilities**: Health checks, default configurations

```typescript
// Example usage
import * as projectAPI from './lib/api';

const project = await projectAPI.createProject({
  projectName: 'My Building',
  builtUpArea: 5000,
  numberOfFloors: 5,
  projectTimeline: 24,
});
```

### 2. Updated App.tsx
- Replaced `setTimeout` mock with real API calls
- Added backend health check on app load
- Added error handling with user-friendly error banner
- Integrated project creation via API
- Full project data persistence to database

### 3. Environment Configuration
Create `.env.local` file in project root:

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

## Running Both Frontend and Backend

### Option 1: Local Development (Recommended)

**Terminal 1 - Backend:**
```bash
cd backend
npm install
npm run dev
```
Backend runs on `http://localhost:3000`

**Terminal 2 - Frontend:**
```bash
# Copy environment template
cp .env.local.example .env.local

# Install dependencies
npm install

# Start development server
npm run dev
```
Frontend runs on `http://localhost:5173`

### Option 2: Using Docker Compose

```bash
# From project root
cd backend
docker-compose up
```

This starts both frontend and backend with proper networking.

## API Endpoints Reference

### Projects
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/projects` | Create new project with calculations |
| `GET` | `/projects` | List all user projects |
| `GET` | `/projects/:id` | Get project with all details |
| `PUT` | `/projects/:id/config` | Update configuration |
| `DELETE` | `/projects/:id` | Delete project |

### Utilities
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/projects/:id/timeline-compression` | Analyze timeline options |
| `GET` | `/default-config` | Get default wages/rates |
| `GET` | `/health` | Health check |

## Authentication

The system uses a temporary header-based authentication via `x-user-id` header. This is automatically handled by the API service layer.

### For Production with Supabase Auth:

1. Set up Supabase authentication in the frontend
2. Get user ID from `supabase.auth.getUser()`
3. Modify `getUserId()` in `src/lib/api.ts`:

```typescript
import { supabase } from './supabase';

const getUserId = async (): Promise<string> => {
  const { data: { user } } = await supabase.auth.getUser();
  return user?.id || 'anonymous';
};
```

## Data Flow

```
┌─────────────────┐
│    Frontend     │
│   (React/TSX)   │
└────────┬────────┘
         │
    ┌────┴─────────────────┐
    │  API Service Layer   │
    │  (src/lib/api.ts)    │
    └────┬─────────────────┘
         │ HTTP REST
         │
┌────────┴─────────────────┐
│   Backend (Express.js)   │
│   Calculations & Routes  │
└────────┬─────────────────┘
         │
┌────────┴──────────────────┐
│  Supabase PostgreSQL      │
│  (Projects, Materials,    │
│   Phases, Schedules, etc) │
└──────────────────────────┘
```

## Key Features

✅ **Data Persistence** - All projects saved to database
✅ **Multi-user Support** - Each user can create multiple projects
✅ **Calculation Consistency** - Same logic on frontend and backend
✅ **Error Handling** - Graceful error messages for users
✅ **Offline Fallback** - Frontend continues to work if backend is down
✅ **Type Safety** - Full TypeScript support with interfaces

## Troubleshooting

### Backend not connecting
1. Verify backend is running: `http://localhost:3000/api/health`
2. Check `VITE_API_BASE_URL` in `.env.local`
3. Ensure CORS is enabled (already configured)

### Projects not saving
1. Check Supabase credentials in backend `.env`
2. Verify database tables exist (run migrations)
3. Check RLS policies are enabled

### Calculation differences
1. Both frontend and backend use same `calculationEngine.ts`
2. Configuration (wages/rates) should match
3. Check `ProjectConfig` object is correct

## Testing with Postman

A Postman collection is provided in `backend/postman_collection.json`.

Import into Postman and test all endpoints:
1. Create project
2. List projects
3. Get project details
4. Update configuration
5. Analyze timeline compression
6. Delete project

## Next Steps

1. ✅ Frontend and backend integrated
2. ✅ Projects save to database
3. 🔄 Deploy backend (Railway, Vercel, etc.)
4. 🔄 Deploy frontend (Vercel, Netlify)
5. 🔄 Set up production Supabase instance
6. 🔄 Configure production authentication

See `backend/DEPLOYMENT.md` for deployment instructions.
