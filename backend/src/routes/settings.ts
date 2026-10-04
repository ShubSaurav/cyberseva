import { Router, Request, Response } from 'express';
import { store } from '../data/store';

const router = Router();

// GET shop settings & pricing
router.get('/', (req: Request, res: Response) => {
  res.json({
    success: true,
    data: store.settings
  });
});

// PUT/PATCH update settings
router.put('/', (req: Request, res: Response) => {
  const updates = req.body;
  store.settings = {
    ...store.settings,
    ...updates
  };

  store.addAudit(store.settings.ownerName, 'Settings Modified', 'Pricing or Shop Details updated');

  res.json({
    success: true,
    data: store.settings
  });
});

// GET audit logs
router.get('/audit-logs', (req: Request, res: Response) => {
  res.json({
    success: true,
    data: store.auditLogs
  });
});

export default router;
