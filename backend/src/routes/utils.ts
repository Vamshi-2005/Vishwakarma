import { Router, Request, Response } from 'express';
import { DEFAULT_CONFIG } from '../calculationEngine';

const router = Router();

// Get default configuration
router.get('/default-config', (req: Request, res: Response) => {
  res.json({
    masonWage: DEFAULT_CONFIG.masonWage,
    laborWage: DEFAULT_CONFIG.laborWage,
    electricianWage: DEFAULT_CONFIG.electricianWage,
    plumberWage: DEFAULT_CONFIG.plumberWage,
    cementRate: DEFAULT_CONFIG.cementRate,
    steelRate: DEFAULT_CONFIG.steelRate,
    sandRate: DEFAULT_CONFIG.sandRate,
    aggregateRate: DEFAULT_CONFIG.aggregateRate,
    brickRate: DEFAULT_CONFIG.brickRate,
  });
});

// Health check
router.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

export default router;
