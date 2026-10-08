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
  store.saveToDisk();

  res.json({
    success: true,
    data: store.settings
  });
});

// POST add a staff member
router.post('/staff', (req: Request, res: Response) => {
  const { name, role, phone } = req.body;
  if (!name || !name.trim()) {
    return res.status(400).json({ success: false, message: 'Staff name is required' });
  }

  const newStaff = {
    id: `staff-${Date.now()}`,
    name: name.trim(),
    role: role || 'Operator',
    phone: phone?.trim() || '',
    active: true,
    createdAt: new Date().toISOString()
  };

  if (!store.settings.staffMembers) {
    store.settings.staffMembers = [];
  }
  store.settings.staffMembers.push(newStaff);
  store.addAudit(store.settings.ownerName, 'Staff Member Added', `Added ${newStaff.name} (${newStaff.role})`);
  store.saveToDisk();

  res.status(201).json({ success: true, data: store.settings.staffMembers });
});

// DELETE remove a staff member
router.delete('/staff/:id', (req: Request, res: Response) => {
  if (!store.settings.staffMembers) store.settings.staffMembers = [];
  const index = store.settings.staffMembers.findIndex(s => s.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Staff member not found' });
  }

  const [removed] = store.settings.staffMembers.splice(index, 1);
  store.addAudit(store.settings.ownerName, 'Staff Member Removed', `Removed ${removed.name}`);
  store.saveToDisk();

  res.json({ success: true, data: store.settings.staffMembers });
});

// GET audit logs
router.get('/audit-logs', (req: Request, res: Response) => {
  res.json({
    success: true,
    data: store.auditLogs
  });
});

export default router;
