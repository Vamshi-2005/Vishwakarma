# Construction Planning Platform - Backend API

A Node.js/Express backend for the AI-powered construction planning platform. This API handles project creation, cost estimation, workforce allocation, and construction scheduling.

## Features

- **Project Management**: Create, read, update, and delete construction projects
- **Cost Estimation**: Automatic calculation of material costs and labor expenses
- **Phase Planning**: Break down projects into construction phases with detailed timelines
- **Material Requirements**: Calculate material quantities and costs
- **Workforce Allocation**: Determine required workforce by type and phase
- **Weekly Scheduling**: Generate detailed week-by-week construction schedules
- **Layout Suggestions**: AI-powered floor layout recommendations
- **Timeline Compression**: Analyze impact of accelerated timelines on costs
- **Configuration Management**: Customize wage rates and material costs

## Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: Supabase (PostgreSQL)
- **Validation**: Zod
- **Authentication**: Supabase Auth (via x-user-id header)

## Prerequisites

- Node.js 18+ and npm
- Supabase account and project
- Environment variables configured

## Installation

1. Clone the repository and navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

4. Configure environment variables with your Supabase credentials:
```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
FRONTEND_URL=http://localhost:5173
PORT=3001
```

## Running the Server

### Development Mode
```bash
npm run dev
```
Server will run on `http://localhost:3001` with hot reload.

### Production Build
```bash
npm run build
npm start
```

### Type Checking
```bash
npm run type-check
```

## API Documentation

### Base URL
```
http://localhost:3001/api
```

### Authentication
All project endpoints require the `x-user-id` header:
```
x-user-id: user_uuid
```

### Endpoints

#### Projects

##### Create Project
```
POST /projects
Content-Type: application/json
x-user-id: user_uuid

{
  "projectName": "Residential Complex A",
  "builtUpArea": 1500,
  "numberOfFloors": 4,
  "projectTimeline": 52
}
```

**Response (201)**:
```json
{
  "id": "uuid",
  "projectName": "Residential Complex A",
  "builtUpArea": 1500,
  "numberOfFloors": 4,
  "projectTimeline": 52,
  "totalCost": 2500000,
  "status": "draft",
  "createdAt": "2026-02-18T10:00:00Z"
}
```

##### Get All Projects
```
GET /projects
x-user-id: user_uuid
```

**Response (200)**:
```json
[
  {
    "id": "uuid",
    "projectName": "Residential Complex A",
    "builtUpArea": 1500,
    "numberOfFloors": 4,
    "projectTimeline": 52,
    "totalCost": 2500000,
    "status": "draft",
    "createdAt": "2026-02-18T10:00:00Z",
    "updatedAt": "2026-02-18T10:00:00Z"
  }
]
```

##### Get Project Details
```
GET /projects/:projectId
x-user-id: user_uuid
```

**Response (200)**:
```json
{
  "project": {
    "id": "uuid",
    "projectName": "Residential Complex A",
    "builtUpArea": 1500,
    "numberOfFloors": 4,
    "projectTimeline": 52,
    "totalCost": 2500000,
    "status": "draft",
    "createdAt": "2026-02-18T10:00:00Z",
    "updatedAt": "2026-02-18T10:00:00Z"
  },
  "config": {
    "masonWage": 800,
    "laborWage": 600,
    "electricianWage": 1000,
    "plumberWage": 1000,
    "cementRate": 400,
    "steelRate": 60,
    "sandRate": 1500,
    "aggregateRate": 1800,
    "brickRate": 6000
  },
  "phases": [
    {
      "id": "uuid",
      "phaseName": "Foundation",
      "phaseOrder": 1,
      "startWeek": 1,
      "durationWeeks": 13,
      "costEstimate": 312000,
      "laborAllocations": [
        {
          "id": "uuid",
          "workerType": "Mason",
          "quantity": 3,
          "daysRequired": 78
        }
      ]
    }
  ],
  "materials": [
    {
      "id": "uuid",
      "materialName": "Cement",
      "quantity": 900,
      "unit": "bags",
      "cost": 360000,
      "phase": "Foundation & Structure"
    }
  ],
  "schedules": [
    {
      "id": "uuid",
      "weekNumber": 1,
      "phaseName": "Foundation",
      "tasks": ["Site preparation", "Excavation", "Soil testing"],
      "workforceRequired": {
        "Mason": 3,
        "Labor": 5
      },
      "materialsNeeded": {
        "Cement": 70,
        "Sand": 4
      }
    }
  ],
  "layouts": [
    {
      "id": "uuid",
      "floorNumber": 1,
      "layoutConfig": {
        "bedrooms": 3,
        "bathrooms": 2,
        "kitchen": 1,
        "livingRoom": 1,
        "diningRoom": 1,
        "balconies": 0,
        "utilities": 1
      },
      "totalRooms": 9,
      "suggestions": "Ground floor optimized for common areas..."
    }
  ]
}
```

##### Update Project Configuration
```
PUT /projects/:projectId/config
Content-Type: application/json
x-user-id: user_uuid

{
  "masonWage": 850,
  "laborWage": 650
}
```

**Response (200)**:
```json
{
  "masonWage": 850,
  "laborWage": 650,
  "electricianWage": 1000,
  "plumberWage": 1000,
  "cementRate": 400,
  "steelRate": 60,
  "sandRate": 1500,
  "aggregateRate": 1800,
  "brickRate": 6000
}
```

##### Calculate Timeline Compression
```
POST /projects/:projectId/timeline-compression
Content-Type: application/json
x-user-id: user_uuid

{
  "newTimeline": 36
}
```

**Response (200)**:
```json
{
  "newCost": 3125000,
  "costIncrease": 625000,
  "percentageIncrease": 25,
  "workforceIncrease": 44.4,
  "risks": [
    "Moderate risk of quality issues",
    "Increased overtime requirements",
    "Coordination complexity increases"
  ]
}
```

##### Delete Project
```
DELETE /projects/:projectId
x-user-id: user_uuid
```

**Response (204)**: No Content

#### Utilities

##### Get Default Configuration
```
GET /default-config
```

**Response (200)**:
```json
{
  "masonWage": 800,
  "laborWage": 600,
  "electricianWage": 1000,
  "plumberWage": 1000,
  "cementRate": 400,
  "steelRate": 60,
  "sandRate": 1500,
  "aggregateRate": 1800,
  "brickRate": 6000
}
```

##### Health Check
```
GET /health
```

**Response (200)**:
```json
{
  "status": "ok",
  "timestamp": "2026-02-18T10:00:00.000Z"
}
```

## Error Responses

### Validation Error (400)
```json
{
  "error": "Validation Error",
  "details": [
    {
      "code": "too_small",
      "minimum": 1,
      "type": "number",
      "path": ["builtUpArea"]
    }
  ]
}
```

### Unauthorized (401)
```json
{
  "error": "Unauthorized",
  "message": "User ID is required"
}
```

### Not Found (404)
```json
{
  "error": "Not Found",
  "path": "/api/projects/invalid-id"
}
```

### Server Error (500)
```json
{
  "error": "Internal Server Error",
  "message": "Database connection failed"
}
```

## Calculation Engine

The backend includes a comprehensive calculation engine for:

### Material Requirements
Calculates quantities based on:
- Built-up area
- Number of floors
- Material rates from configuration

### Construction Phases
Generates 4 phases:
1. **Foundation**: 25% of timeline
2. **Structure**: 35% of timeline
3. **Roofing**: 15% of timeline
4. **Finishing**: Remaining timeline

### Labor Allocation
Determines workforce requirements by:
- Phase type
- Total construction area
- Worker category (Mason, Labor, Electrician, Plumber)

### Timeline Compression
Analyzes impact of accelerated schedules:
- Overtime cost calculation
- Workforce increase requirements
- Risk assessment

### Layout Suggestions
Provides floor-by-floor recommendations:
- Room configurations
- Space optimization
- Layout-specific suggestions

## Project Structure

```
backend/
├── src/
│   ├── index.ts              # Main server file
│   ├── config.ts             # Configuration management
│   ├── database.ts           # Supabase client and queries
│   ├── calculationEngine.ts  # Calculation logic
│   └── routes/
│       ├── projects.ts       # Project endpoints
│       └── utils.ts          # Utility endpoints
├── dist/                     # Compiled JavaScript
├── package.json
├── tsconfig.json
└── .env                      # Environment variables
```

## Database Schema

See `../supabase/migrations/20260218142802_create_construction_planning_tables.sql` for:
- Table definitions
- Relationships
- Indexes
- Row-level security policies

## Development Guide

### Adding New Endpoints

1. Create route handler in `src/routes/`
2. Use `asyncHandler` wrapper for error handling
3. Validate input with Zod schemas
4. Use `db.*` methods for database operations
5. Return consistent JSON responses

### Adding Calculations

1. Implement function in `calculationEngine.ts`
2. Export from module
3. Import and use in routes
4. Add tests for calculation accuracy

### Debugging

Enable verbose logging by setting:
```bash
NODE_ENV=development npm run dev
```

## Performance Considerations

- Database queries are optimized with indexes
- Material calculations use bulk inserts
- Weekly schedules generated efficiently
- Row-level security validates permissions automatically

## Security

- User data isolated via RLS policies
- Service role key only used server-side
- Anon key restricted in Supabase
- Input validation on all endpoints
- CORS configured for frontend origin

## Future Enhancements

- [ ] Real-time project updates via WebSockets
- [ ] Advanced AI-driven layout optimization
- [ ] Machine learning cost predictions
- [ ] Multi-project resource allocation
- [ ] Project team collaboration features
- [ ] Integration with project management tools
- [ ] Mobile app support

## License

MIT
