import { Router, Request, Response } from 'express';
import { store, PrintJobItem } from '../data/store';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

// GET all discovered printers from Windows Print Bridge
router.get('/', (req: Request, res: Response) => {
  res.json({
    success: true,
    bridgeStatus: {
      connected: true,
      bridgeVersion: '1.4.2-win64',
      spoolerStatus: 'RUNNING',
      port: 9100,
      host: '127.0.0.1'
    },
    printers: store.printers,
    activeQueue: store.printQueue
  });
});

// POST dispatch a print job to Windows Print Bridge
router.post('/print', (req: Request, res: Response) => {
  const { printerId, jobId, documentName, pages, copies, colorMode, paperSize, duplex } = req.body;

  const printer = store.printers.find(p => p.id === printerId) || store.printers.find(p => p.isDefault) || store.printers[0];
  
  if (printer.status === 'OFFLINE') {
    return res.status(400).json({
      success: false,
      message: `Printer ${printer.name} is currently offline. Please check USB or network cable.`
    });
  }

  const printItem: PrintJobItem = {
    id: `pj-${uuidv4().slice(0, 6)}`,
    jobId: jobId || 'quick-print',
    printerId: printer.id,
    printerName: printer.name,
    documentName: documentName || 'Document_CyberSeva.pdf',
    pages: pages || 1,
    copies: copies || 1,
    colorMode: colorMode || (printer.type.includes('Mono') ? 'BW' : 'COLOR'),
    paperSize: paperSize || 'A4',
    status: 'QUEUED',
    createdAt: 'Just now'
  };

  store.printQueue.unshift(printItem);

  // Update printer counter
  printer.totalPrintsToday += (printItem.pages * printItem.copies);
  if (printer.paperTrayCount > 0) {
    printer.paperTrayCount = Math.max(0, printer.paperTrayCount - (printItem.pages * printItem.copies));
  }

  // Deduct paper inventory if found
  const paperInv = store.inventory.find(i => i.category === 'PAPER' && (paperSize === '4x6' ? i.id === 'inv-2' : i.id === 'inv-1'));
  if (paperInv && paperInv.currentStock > 0 && paperSize === '4x6') {
    paperInv.currentStock = Math.max(0, paperInv.currentStock - printItem.copies);
  }

  store.addAudit('Print Bridge', 'Print Job Spooled', `Sent ${printItem.copies} copies of ${printItem.documentName} to ${printer.name}`);

  // Simulate Print Bridge progress asynchronously
  setTimeout(() => {
    printItem.status = 'PRINTING';
  }, 1000);

  setTimeout(() => {
    printItem.status = 'COMPLETED';
    printItem.completedAt = 'Just now';
  }, 4000);

  res.json({
    success: true,
    message: `Job sent to ${printer.name} via Windows Print Bridge`,
    data: printItem
  });
});

// POST test print
router.post('/:id/test-print', (req: Request, res: Response) => {
  const printer = store.printers.find(p => p.id === req.params.id);
  if (!printer) {
    return res.status(404).json({ success: false, message: 'Printer not found' });
  }

  const printItem: PrintJobItem = {
    id: `pj-test-${Date.now()}`,
    jobId: 'TEST-PAGE',
    printerId: printer.id,
    printerName: printer.name,
    documentName: 'CyberSeva_Diagnostic_Test_Sheet.pdf',
    pages: 1,
    copies: 1,
    colorMode: printer.type.includes('Color') ? 'COLOR' : 'BW',
    paperSize: 'A4',
    status: 'COMPLETED',
    createdAt: 'Just now',
    completedAt: 'Just now'
  };

  store.printQueue.unshift(printItem);
  store.addAudit('Operator', 'Test Print Dispatched', `Alignment & nozzle test sheet on ${printer.name}`);

  res.json({
    success: true,
    message: `Diagnostic test page printed on ${printer.name}`
  });
});

// POST cancel print queue item
router.delete('/queue/:id', (req: Request, res: Response) => {
  const index = store.printQueue.findIndex(p => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Print job not in active queue' });
  }

  store.printQueue[index].status = 'CANCELLED';
  store.addAudit('Print Bridge', 'Print Cancelled', `Job ${req.params.id} cancelled by operator.`);

  res.json({ success: true, message: 'Print job cancelled successfully' });
});

export default router;
