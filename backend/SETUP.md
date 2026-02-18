# Construction Planning Platform - Backend Setup Guide

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env
```

Edit `.env` with your Supabase credentials:
```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
FRONTEND_URL=http://localhost:5173
PORT=3001
NODE_ENV=development
```

### 3. Get Supabase Credentials

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Navigate to Settings → API
4. Copy:
   - Project URL → `SUPABASE_URL`
   - `anon` key → `SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY`

### 4. Run Development Server
```bash
npm run dev
```

Server will start on `http://localhost:3001`

## API Testing

### Using cURL

#### Create a Project
```bash
curl -X POST http://localhost:3001/api/projects \
  -H "Content-Type: application/json" \
  -H "x-user-id: test-user-123" \
  -d '{
    "projectName": "Test Project",
    "builtUpArea": 1500,
    "numberOfFloors": 4,
    "projectTimeline": 52
  }'
```

#### Get All Projects
```bash
curl http://localhost:3001/api/projects \
  -H "x-user-id: test-user-123"
```

#### Get Project Details
```bash
curl http://localhost:3001/api/projects/{projectId} \
  -H "x-user-id: test-user-123"
```

### Using Postman

1. Import the API collection from `postman_collection.json`
2. Set environment variables:
   - `base_url`: http://localhost:3001
   - `user_id`: test-user-123
   - `project_id`: (from create response)
3. Run requests

## Docker Deployment

### Build Image
```bash
docker build -t construction-api:latest .
```

### Run Container
```bash
docker run -d \
  -p 3001:3001 \
  -e SUPABASE_URL=your_url \
  -e SUPABASE_ANON_KEY=your_key \
  -e SUPABASE_SERVICE_ROLE_KEY=your_service_key \
  construction-api:latest
```

### Using Docker Compose
```bash
docker-compose up -d
```

## Database Setup

The Supabase migration file (`../supabase/migrations/20260218142802_create_construction_planning_tables.sql`) creates all necessary tables automatically.

To run migration:
1. Go to Supabase Dashboard
2. SQL Editor → New Query
3. Paste migration SQL and execute

Or using Supabase CLI:
```bash
supabase db push
```

## Integration with Frontend

Update frontend API configuration in `src/lib/supabase.ts`:

```typescript
const API_BASE_URL = 'http://localhost:3001/api';
const USER_ID = 'your-user-id'; // From auth

// Create project
const response = await fetch(`${API_BASE_URL}/projects`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-user-id': USER_ID,
  },
  body: JSON.stringify({
    projectName: 'My Project',
    builtUpArea: 1500,
    numberOfFloors: 4,
    projectTimeline: 52,
  }),
});
```

## Troubleshooting

### Port Already in Use
```bash
# Windows
netstat -ano | findstr :3001
taskkill /PID {PID} /F

# macOS/Linux
lsof -ti:3001 | xargs kill -9
```

### Supabase Connection Error
- Verify `.env` file exists and is readable
- Check Supabase project is active
- Ensure credentials are correct
- Check network connectivity

### TypeScript Errors
```bash
npm run type-check
```

### Clear Node Modules
```bash
rm -rf node_modules package-lock.json
npm install
```

## Performance Tuning

### Enable Query Caching
```typescript
// In database.ts
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
```

### Optimize Database Queries
- Use indexes (already created)
- Batch operations when possible
- Limit result sets

## Monitoring

Check application health:
```bash
curl http://localhost:3001/api/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2026-02-18T10:00:00.000Z"
}
```

## Next Steps

1. ✅ Backend API setup complete
2. Connect frontend to API endpoints
3. Implement authentication integration
4. Set up monitoring and logging
5. Deploy to production

## Support

For issues or questions:
1. Check README.md for API documentation
2. Review error logs in terminal
3. Verify Supabase credentials
4. Check database migrations
