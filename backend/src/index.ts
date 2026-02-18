import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { config } from './config';
import projectsRouter from './routes/projects';
import utilsRouter from './routes/utils';

const app = express();

// Middleware
app.use(cors({
  origin: config.cors.origin,
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api/projects', projectsRouter);
app.use('/api', utilsRouter);

// Health check root endpoint
app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'Construction Planning Platform API',
    version: '1.0.0',
    status: 'running',
  });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: 'Not Found',
    path: req.path,
  });
});

// Error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err);

  if (err.name === 'ZodError') {
    return res.status(400).json({
      error: 'Validation Error',
      details: err.errors,
    });
  }

  if (err.message === 'User ID not provided') {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'User ID is required',
    });
  }

  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message || 'An unexpected error occurred',
  });
});

const PORT = config.port;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Environment: ${config.nodeEnv}`);
  console.log(`CORS enabled for: ${config.cors.origin}`);
});

export default app;
