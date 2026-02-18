# Backend Quick Start Guide

## Installation (5 minutes)

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your Supabase credentials
npm run dev
```

Server runs on `http://localhost:3001`

---

## Environment Variables

Add to `.env`:
```
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=your_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_key_here
FRONTEND_URL=http://localhost:5173
PORT=3001
NODE_ENV=development
```

---

## Test API Immediately

```bash
# Create a test project
curl -X POST http://localhost:3001/api/projects \
  -H "Content-Type: application/json" \
  -H "x-user-id: test-user-123" \
  -d '{
    "projectName": "Test Building",
    "builtUpArea": 1500,
    "numberOfFloors": 4,
    "projectTimeline": 52
  }'

# Note the project ID from response, then:

# Get all details
curl http://localhost:3001/api/projects/{PROJECT_ID} \
  -H "x-user-id: test-user-123"

# Health check
curl http://localhost:3001/api/health
```

---

## Key Features

| Feature | What It Does |
|---------|-------------|
| **Material Calc** | Auto-calculates cement, steel, sand, bricks needed |
| **Phases** | Splits into Foundation → Structure → Roofing → Finishing |
| **Labor** | Determines workers needed (Masons, Labor, Electricians, Plumbers) |
| **Scheduling** | Creates week-by-week breakdown with tasks |
| **Layouts** | Suggests room configurations per floor |
| **Cost Analysis** | Shows material + labor costs |
| **Timeline Impact** | Shows cost increase if timeline compressed |

---

## API Endpoints

### Projects
- `POST /api/projects` - Create
- `GET /api/projects` - List all
- `GET /api/projects/:id` - Get details
- `PUT /api/projects/:id/config` - Update costs/wages
- `POST /api/projects/:id/timeline-compression` - Analyze faster timeline
- `DELETE /api/projects/:id` - Delete

### Utilities
- `GET /api/default-config` - See default wage/material rates
- `GET /api/health` - Check if API is running

---

## Required Header

All project endpoints need:
```
x-user-id: your-user-id
```

This header identifies which user the request is for.

---

## Response Format

```json
{
  "id": "uuid",
  "projectName": "Project Name",
  "builtUpArea": 1500,
  "numberOfFloors": 4,
  "projectTimeline": 52,
  "totalCost": 2500000,
  "status": "draft",
  "config": { /* wage/material rates */ },
  "phases": [ /* foundation, structure, roofing, finishing */ ],
  "materials": [ /* cement, steel, sand, aggregate, bricks */ ],
  "schedules": [ /* week 1-52 with tasks & resources */ ],
  "layouts": [ /* floor 1-4 with room suggestions */ ]
}
```

---

## Common Calculations

**Example Project:**
- Built-up Area: 1500 sq ft
- Floors: 4
- Timeline: 52 weeks

**Results:**
- Foundation: 13 weeks
- Structure: 18 weeks
- Roofing: 8 weeks
- Finishing: 13 weeks
- Total Cost: ~₹24-28 lakhs (varies by location)

---

## Troubleshooting

### Port 3001 already in use
```bash
# Windows
netstat -ano | findstr :3001
taskkill /PID {PID} /F

# Mac/Linux
lsof -ti:3001 | xargs kill -9
```

### Supabase connection error
- Check `.env` file exists
- Verify credentials are correct
- Test at: https://app.supabase.com

### TypeScript errors
```bash
npm run type-check
```

### Need fresh install
```bash
rm -rf node_modules package-lock.json
npm install
```

---

## Running Tests

```bash
# Type checking
npm run type-check

# Build production version
npm run build

# Run production build locally
npm start
```

---

## Docker (Optional)

```bash
# Build image
docker build -t construction-api .

# Run container
docker run -p 3001:3001 \
  -e SUPABASE_URL=your_url \
  -e SUPABASE_ANON_KEY=your_key \
  -e SUPABASE_SERVICE_ROLE_KEY=your_service_key \
  construction-api

# Or with Docker Compose
docker-compose up -d
```

---

## Connect to Frontend

In your React app, update API calls:

```typescript
const API_URL = 'http://localhost:3001/api';
const USER_ID = 'your-user-123'; // Replace with actual user

// Create project
const response = await fetch(`${API_URL}/projects`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-user-id': USER_ID,
  },
  body: JSON.stringify({
    projectName: formData.projectName,
    builtUpArea: formData.builtUpArea,
    numberOfFloors: formData.numberOfFloors,
    projectTimeline: formData.projectTimeline,
  }),
});

const project = await response.json();
```

---

## Files to Know

| File | Purpose |
|------|---------|
| `src/index.ts` | Main server |
| `src/routes/projects.ts` | Project endpoints |
| `src/calculationEngine.ts` | All calculations |
| `src/database.ts` | Supabase queries |
| `.env` | Your secrets |
| `README.md` | Full API docs |

---

## Default Cost Rates

```json
{
  "masonWage": 800,           // per day
  "laborWage": 600,           // per day
  "electricianWage": 1000,    // per day
  "plumberWage": 1000,        // per day
  "cementRate": 400,          // per bag
  "steelRate": 60,            // per kg
  "sandRate": 1500,           // per m³
  "aggregateRate": 1800,      // per m³
  "brickRate": 6000           // per 1000 units
}
```

All rates are in Indian Rupees and configurable per project.

---

## Example Full Request/Response

### Request
```
POST http://localhost:3001/api/projects
Headers:
  Content-Type: application/json
  x-user-id: test-user-123

Body:
{
  "projectName": "Residential Complex",
  "builtUpArea": 2000,
  "numberOfFloors": 6,
  "projectTimeline": 60
}
```

### Response
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "projectName": "Residential Complex",
  "builtUpArea": 2000,
  "numberOfFloors": 6,
  "projectTimeline": 60,
  "totalCost": 4200000,
  "status": "draft",
  "createdAt": "2026-02-18T10:30:00Z"
}
```

Then retrieve full details with:
```
GET http://localhost:3001/api/projects/550e8400-e29b-41d4-a716-446655440000
Headers:
  x-user-id: test-user-123
```

---

## Next Steps

1. ✅ Install and run backend
2. ✅ Test with API examples above
3. ✅ Connect your frontend
4. ✅ Deploy to production

Need help? See `README.md` for complete documentation.
