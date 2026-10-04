import { Router, Request, Response } from 'express';
import { store } from '../data/store';

const router = Router();

// GET all inventory items
router.get('/', (req: Request, res: Response) => {
  res.json({
    success: true,
    data: store.inventory
  });
});

// PATCH update inventory stock
router.patch('/:id', (req: Request, res: Response) => {
  const item = store.inventory.find(i => i.id === req.params.id);
  if (!item) {
    return res.status(404).json({ success: false, message: 'Item not found' });
  }

  const { currentStock, lastRestocked } = req.body;
  if (typeof currentStock === 'number') {
    item.currentStock = currentStock;
    item.status = item.currentStock <= (item.minThreshold / 2) ? 'CRITICAL' : (item.currentStock <= item.minThreshold ? 'LOW' : 'GOOD');
  }
  if (lastRestocked) item.lastRestocked = lastRestocked;

  store.addAudit('Operator', 'Inventory Updated', `Restocked ${item.name}: now ${item.currentStock} ${item.unit}`);

  res.json({ success: true, data: item });
});

export default router;
