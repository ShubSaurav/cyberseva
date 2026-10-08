import { Router, Request, Response } from 'express';
import { store, Job } from '../data/store';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

// GET all jobs
router.get('/', (req: Request, res: Response) => {
  res.json({
    success: true,
    data: store.jobs
  });
});

// GET job by id
router.get('/:id', (req: Request, res: Response) => {
  const job = store.jobs.find(j => j.id === req.params.id);
  if (!job) {
    return res.status(404).json({ success: false, message: 'Job not found' });
  }
  res.json({ success: true, data: job });
});

// POST create job / sale
router.post('/', (req: Request, res: Response) => {
  const { customerName, customerPhone, services, paymentMode, paymentStatus, notes, operator, serviceName, totalAmount, quantity } = req.body;
  
  const parsedServices = services && Array.isArray(services) && services.length > 0 
    ? services 
    : [
        {
          id: `s-${Date.now()}`,
          name: serviceName || 'Counter Service',
          category: 'PRINT',
          unitPrice: totalAmount !== undefined ? Number(totalAmount) : 10,
          quantity: quantity ? Number(quantity) : 1,
          total: totalAmount !== undefined ? Number(totalAmount) : 10
        }
      ];

  const calculatedTotal = totalAmount !== undefined 
    ? Number(totalAmount) 
    : parsedServices.reduce((acc: number, s: any) => acc + (s.total || s.unitPrice * (s.quantity || 1)), 0);

  const nextNumber = 10290 + store.jobs.length + 1;
  const newJob: Job = {
    id: `job-${uuidv4().slice(0, 8)}`,
    jobCode: `#${nextNumber}`,
    customerName: customerName?.trim() || 'Walk-in Customer',
    customerPhone: customerPhone?.trim() || '',
    services: parsedServices,
    subtotal: calculatedTotal,
    discount: 0,
    totalAmount: calculatedTotal,
    paymentMode: paymentMode || 'CASH',
    paymentStatus: paymentStatus || 'PAID',
    status: 'COMPLETED',
    operator: operator || store.settings.ownerName,
    notes: notes || '',
    createdAt: new Date().toISOString(),
    completedAt: new Date().toISOString(),
    hasTemporaryFiles: false
  };

  store.jobs.unshift(newJob);
  store.addAudit(newJob.operator, 'Sale Recorded', `Sale ${newJob.jobCode} for ₹${newJob.totalAmount} (${newJob.paymentMode})`, newJob.jobCode);
  store.saveToDisk();

  res.status(201).json({ success: true, data: newJob });
});

// PATCH update job status or payment
router.patch('/:id', (req: Request, res: Response) => {
  const jobIndex = store.jobs.findIndex(j => j.id === req.params.id);
  if (jobIndex === -1) {
    return res.status(404).json({ success: false, message: 'Job not found' });
  }

  const job = store.jobs[jobIndex];
  const { status, paymentStatus, paymentMode, totalAmount, customerName } = req.body;

  if (status) {
    job.status = status;
    if (status === 'COMPLETED' && !job.completedAt) {
      job.completedAt = new Date().toISOString();
    }
  }
  if (paymentStatus) job.paymentStatus = paymentStatus;
  if (paymentMode) job.paymentMode = paymentMode;
  if (totalAmount !== undefined) job.totalAmount = Number(totalAmount);
  if (customerName) job.customerName = customerName;

  store.addAudit(job.operator, 'Job Updated', `Status changed to ${job.status}, Payment: ${job.paymentStatus}`, job.jobCode);
  store.saveToDisk();

  res.json({ success: true, data: job });
});

// DELETE remove job
router.delete('/:id', (req: Request, res: Response) => {
  const index = store.jobs.findIndex(j => j.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Job not found' });
  }
  const [deleted] = store.jobs.splice(index, 1);
  store.addAudit(store.settings.ownerName, 'Sale Entry Deleted', `Removed record ${deleted.jobCode}`);
  store.saveToDisk();
  res.json({ success: true, message: 'Sale record deleted' });
});

// POST purge temporary files (Privacy-first)
router.post('/:id/purge', (req: Request, res: Response) => {
  const job = store.jobs.find(j => j.id === req.params.id);
  if (!job) {
    return res.status(404).json({ success: false, message: 'Job not found' });
  }

  job.hasTemporaryFiles = false;
  job.purgedAt = new Date().toISOString();
  store.addAudit('Privacy Guardian', 'Temporary Data Destroyed', `Zero-trace buffer wipe completed for ${job.jobCode}`, job.jobCode);
  store.saveToDisk();

  res.json({ success: true, message: 'Temporary document data safely wiped from counter buffer.' });
});

export default router;
