# Architecture & Deployment Guide

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     USER BROWSER                             │
│              React Frontend (Port 5173)                      │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  - ProjectInputForm                                  │   │
│  │  - CostBreakdown                                     │   │
│  │  - WeeklySchedule                                    │   │
│  │  - LayoutSuggestions                                 │   │
│  │  - TimelineCompression                               │   │
│  └─────────────────────────────────────────────────────┘   │
└───────────────────────────┬─────────────────────────────────┘
                            │
                    HTTP/REST API
                  (x-user-id header)
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│              EXPRESS API SERVER (Port 3001)                 │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Routes:                                             │   │
│  │  - POST   /api/projects          (Create)           │   │
│  │  - GET    /api/projects          (List)             │   │
│  │  - GET    /api/projects/:id      (Details)          │   │
│  │  - PUT    /api/projects/:id/config (Update Config)  │   │
│  │  - POST   /api/projects/:id/timeline-compression    │   │
│  │  - DELETE /api/projects/:id      (Delete)           │   │
│  │  - GET    /api/default-config    (Defaults)         │   │
│  │  - GET    /api/health            (Status)           │   │
│  └─────────────────────────────────────────────────────┘   │
│                          │                                   │
│          ┌───────────────┼───────────────┐                 │
│          ▼               ▼               ▼                 │
│  ┌──────────────┐ ┌───────────────┐ ┌──────────────┐      │
│  │ Calculation  │ │   Database    │ │   Validation │      │
│  │   Engine     │ │  Operations   │ │  (Zod)       │      │
│  └──────────────┘ └───────────────┘ └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            │
                     Supabase SDK
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│          SUPABASE BACKEND (PostgreSQL Database)             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Tables:                                             │   │
│  │  - projects                                          │   │
│  │  - project_configurations                           │   │
│  │  - project_phases                                    │   │
│  │  - labor_allocations                                 │   │
│  │  - material_requirements                             │   │
│  │  - weekly_schedules                                  │   │
│  │  - layout_suggestions                                │   │
│  │                                                       │   │
│  │  Security:                                           │   │
│  │  - Row-Level Security (RLS) Policies               │   │
│  │  - User data isolation                              │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

## Data Flow

### 1. Create Project
```
Frontend Form Input
    ↓
POST /api/projects with x-user-id
    ↓
Input Validation (Zod)
    ↓
Calculation Engine:
  - calculateMaterialRequirements()
  - calculatePhases()
  - calculateCostBreakdown()
  - generateWeeklySchedule()
  - generateLayoutSuggestions()
    ↓
Database Operations:
  - INSERT projects
  - INSERT project_configurations
  - INSERT project_phases
  - INSERT labor_allocations
  - INSERT material_requirements
  - INSERT weekly_schedules
  - INSERT layout_suggestions
    ↓
Return Project ID + Summary
    ↓
Frontend Updates UI
```

### 2. Get Project Details
```
Frontend: GET /api/projects/:id
    ↓
User Authorization Check (RLS)
    ↓
Database Query ALL related data
    ↓
Join and Format Response:
  - Project info
  - Configuration rates
  - Phases with labor
  - Materials
  - Schedules
  - Layouts
    ↓
Return Complete Project Data
    ↓
Frontend Displays All Components
```

## Deployment Options

### Option 1: Local Development
```bash
cd backend
npm install
npm run dev
# Server on http://localhost:3001
```

**Best for:**
- Development
- Testing
- Learning

---

### Option 2: Docker Local
```bash
docker build -t construction-api .
docker run -d -p 3001:3001 \
  -e SUPABASE_URL=your_url \
  -e SUPABASE_ANON_KEY=your_key \
  -e SUPABASE_SERVICE_ROLE_KEY=your_service_key \
  construction-api
```

**Best for:**
- Testing deployment
- Local Docker environment

---

### Option 3: Vercel (Recommended for Serverless)

1. Create `vercel.json`:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "backend/package.json",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "backend/src/index.ts"
    }
  ]
}
```

2. Deploy:
```bash
npm install -g vercel
cd backend
vercel
# Follow prompts, add environment variables
```

**Best for:**
- Serverless deployment
- Auto-scaling
- Low maintenance

---

### Option 4: Railway (Recommended for Containers)

1. Create Railway project
2. Connect GitHub repository
3. Set environment variables in Railway dashboard
4. Deploy automatically on push

```bash
# Or deploy manually
railway link
railway up
```

**Best for:**
- Container-based deployment
- Simple configuration
- Good pricing

---

### Option 5: AWS (Enterprise)

#### Using Elastic Beanstalk
```bash
eb init
eb create construction-api
eb deploy
```

#### Using ECS + Fargate
```bash
aws ecr create-repository --repository-name construction-api
docker build -t construction-api .
docker tag construction-api:latest [account-id].dkr.ecr.[region].amazonaws.com/construction-api
docker push [account-id].dkr.ecr.[region].amazonaws.com/construction-api
# Create ECS task and service in AWS Console
```

**Best for:**
- Enterprise deployments
- High traffic
- Custom infrastructure

---

### Option 6: DigitalOcean App Platform

1. Connect GitHub
2. Create new app
3. Select backend folder as source
4. Add environment variables
5. Deploy

```yaml
name: construction-api
services:
- name: api
  github:
    repo: your-username/Viswakarma-main
    branch: main
  build_command: npm install && npm run build
  run_command: npm start
  environment_slug: node-js
  envs:
  - key: SUPABASE_URL
    scope: RUN_AND_BUILD_TIME
    value: ${SUPABASE_URL}
  # ... other vars
```

**Best for:**
- Affordable deployment
- Good documentation
- Simple setup

---

### Option 7: Heroku

```bash
heroku create construction-api
heroku config:set SUPABASE_URL=your_url
heroku config:set SUPABASE_ANON_KEY=your_key
heroku config:set SUPABASE_SERVICE_ROLE_KEY=your_service_key
git push heroku main
```

**Note:** Heroku is phasing out free tier.

**Best for:**
- Quick deployments
- Prototyping

---

## Environment Variables by Deployment

### Development
```
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=ey...
SUPABASE_SERVICE_ROLE_KEY=ey...
FRONTEND_URL=http://localhost:5173
PORT=3001
NODE_ENV=development
```

### Production (Railway/Vercel/etc)
```
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=ey...
SUPABASE_SERVICE_ROLE_KEY=ey...
FRONTEND_URL=https://yourdomain.com
PORT=3001
NODE_ENV=production
```

## Performance Optimization

### Database Level
```sql
-- Already created indexes:
CREATE INDEX idx_projects_user_id ON projects(user_id);
CREATE INDEX idx_project_configurations_project_id ON project_configurations(project_id);
CREATE INDEX idx_project_phases_project_id ON project_phases(project_id);
CREATE INDEX idx_labor_allocations_phase_id ON labor_allocations(phase_id);
CREATE INDEX idx_material_requirements_project_id ON material_requirements(project_id);
CREATE INDEX idx_weekly_schedules_project_id ON weekly_schedules(project_id);
CREATE INDEX idx_layout_suggestions_project_id ON layout_suggestions(project_id);
```

### API Level
- Enable gzip compression in production
- Add caching headers for static responses
- Use connection pooling for database

### Example Nginx Config:
```nginx
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Gzip compression
        gzip on;
        gzip_types application/json text/plain;
    }
}
```

## Monitoring & Logging

### Application Logs
```bash
# Docker logs
docker logs container_id

# Vercel
vercel logs

# Railway
railway logs

# SSH into server
ssh user@server-ip
tail -f /var/log/construction-api.log
```

### Health Check Endpoint
```bash
curl https://api.yourdomain.com/api/health
# Expected: {"status": "ok", "timestamp": "2026-02-18T..."}
```

### Database Monitoring
- Supabase Dashboard → Database → Logs
- Monitor query performance
- Check connection usage

## Scaling Considerations

### Horizontal Scaling
- Stateless API design ✓
- Load balancer ready ✓
- Database can scale separately ✓

### Vertical Scaling
- Increase server resources
- Upgrade Supabase plan
- Add database read replicas

### Caching Strategy
```typescript
// Add Redis caching (future enhancement)
const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

async function getCachedProject(projectId: string) {
  if (cache.has(projectId)) {
    return cache.get(projectId);
  }
  const data = await db.getProject(projectId);
  cache.set(projectId, data);
  setTimeout(() => cache.delete(projectId), CACHE_DURATION);
  return data;
}
```

## Backup & Disaster Recovery

### Supabase Backups
- Automatic daily backups
- 30-day retention
- Point-in-time recovery available

### Manual Backup
```bash
pg_dump -h host -U user database_name > backup.sql
```

### Restore
```bash
psql -h host -U user database_name < backup.sql
```

## Security Checklist

- [ ] Set strong database passwords
- [ ] Enable HTTPS only
- [ ] Configure CORS properly
- [ ] Use environment variables for secrets
- [ ] Enable firewall rules
- [ ] Set up rate limiting
- [ ] Enable SQL injection protection
- [ ] Regular security updates
- [ ] Monitor access logs
- [ ] Backup database regularly

## Cost Estimation

### Supabase
- Free tier: Up to 500K requests/month
- Pro tier: $25/month + usage
- Recommended for production: Pro

### Vercel
- Free tier: Perfect for this app
- Pro tier: $20/month for priority support

### Railway
- Pay-as-you-go: ~$5-10/month
- Recommended for this app

### Total Production Cost: $25-35/month

## Recommended Deployment Stack

1. **Frontend**: Vercel (React/Vite)
2. **Backend**: Railway or Vercel (Node.js)
3. **Database**: Supabase (PostgreSQL)
4. **Domain**: Namecheap ($1-3/year)

**Total: ~$25-35/month**

---

## Quick Deploy Script

```bash
#!/bin/bash

# Deploy to Railway
cd backend
npm install
npm run build

railway link
railway up

# Deploy frontend
cd ../
npm run build
vercel --prod
```

---

## Troubleshooting Deployment

### Port Issues
- Vercel: Uses PORT env var
- Railway: Auto-assigns port
- AWS: Configure security groups

### Database Connection
- Check SUPABASE_URL format
- Verify keys are correct
- Test with: `npm run type-check`

### Builds Failing
- Clear node_modules: `rm -rf node_modules`
- Clear npm cache: `npm cache clean --force`
- Check Node version: `node --version` (need 18+)

## Production Checklist

- [ ] Environment variables configured
- [ ] Database migrated
- [ ] API health check working
- [ ] Frontend can reach backend
- [ ] CORS configured correctly
- [ ] SSL/HTTPS enabled
- [ ] Error logging configured
- [ ] Backup plan in place
- [ ] Monitor alerts set up
- [ ] Documentation updated

---

Ready to deploy? Start with Railway or Vercel - they require the least setup!
