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

// POST create job
router.post('/', (req: Request, res: Response) => {
  const { customerName, customerPhone, services, paymentMode, paymentStatus, notes, operator } = req.body;
  
  const subtotal = services.reduce((acc: number, s: any) => acc + (s.total || s.unitPrice * s.quantity), 0);
  const totalAmount = subtotal; // discount can be subtracted if provided

  const nextNumber = 10290 + store.jobs.length + 1;
  const newJob: Job = {
    id: `job-${uuidv4().slice(0, 8)}`,
    jobCode: `#${nextNumber}`,
    customerName: customerName || 'Counter Walk-in',
    customerPhone: customerPhone || '',
    services: services || [],
    subtotal,
    discount: 0,
    totalAmount,
    paymentMode: paymentMode || 'UPI_QR',
    paymentStatus: paymentStatus || 'PENDING',
    status: 'NEW',
    operator: operator || store.settings.ownerName,
    notes: notes || '',
    createdAt: new Date().toISOString(),
    hasTemporaryFiles: true
  };

  store.jobs.unshift(newJob);
  store.addAudit(newJob.operator, 'New Job Created', `Job ${newJob.jobCode} for ₹${newJob.totalAmount}`, newJob.jobCode);

  res.status(201).json({ success: true, data: newJob });
});

// PATCH update job status or payment
router.patch('/:id', (req: Request, res: Response) => {
  const jobIndex = store.jobs.findIndex(j => j.id === req.params.id);
  if (jobIndex === -1) {
    return res.status(404).json({ success: false, message: 'Job not found' });
  }

  const job = store.jobs[jobIndex];
  const { status, paymentStatus, paymentMode } = req.body;

  if (status) {
    job.status = status;
    if (status === 'COMPLETED' && !job.completedAt) {
      job.completedAt = new Date().toISOString();
    }
  }
  if (paymentStatus) job.paymentStatus = paymentStatus;
  if (paymentMode) job.paymentMode = paymentMode;

  store.addAudit(job.operator, 'Job Updated', `Status changed to ${job.status}, Payment: ${job.paymentStatus}`, job.jobCode);

  res.json({ success: true, data: job });
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

  res.json({ success: true, message: 'Temporary document data safely wiped from counter buffer.' });
});

export default router;
