import { Router, Request, Response } from 'express';
import { store, CustomerUploadSession } from '../data/store';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

// POST create a temporary customer QR upload session
router.post('/create', (req: Request, res: Response) => {
  const { customerName, phone } = req.body;
  const token = 'CS-' + Math.floor(1000 + Math.random() * 9000); // 4-digit code e.g. CS-4921
  const expiresAt = new Date(Date.now() + (store.settings.autoPurgeMinutes || 15) * 60 * 1000).toISOString();

  const session: CustomerUploadSession = {
    id: uuidv4(),
    sessionToken: token,
    customerName: customerName || 'Walk-in Customer',
    phone: phone || '',
    status: 'WAITING_FOR_FILES',
    createdAt: new Date().toISOString(),
    expiresAt,
    uploadedFiles: []
  };

  store.sessions[token] = session;
  store.addAudit('Counter QR', 'Temporary Session Created', `Generated QR session ${token} for ${session.customerName}`);

  res.json({
    success: true,
    data: {
      sessionToken: token,
      expiresAt,
      // The customer visits this URL on mobile browser
      customerUploadUrl: `/c/${token}`
    }
  });
});

// GET fetch session info (used by customer mobile page or operator poll)
router.get('/:token', (req: Request, res: Response) => {
  const token = String(req.params.token);
  const session = store.sessions[token];
  if (!session) {
    return res.status(404).json({ success: false, message: 'Session expired or invalid QR' });
  }

  // Check expiry
  if (new Date() > new Date(session.expiresAt)) {
    session.status = 'EXPIRED';
    return res.status(410).json({ success: false, message: 'This upload session has expired for privacy.' });
  }

  res.json({ success: true, data: session });
});

// POST upload files to session (from customer's mobile)
router.post('/:token/upload', (req: Request, res: Response) => {
  const token = String(req.params.token);
  const session = store.sessions[token];
  if (!session) {
    return res.status(404).json({ success: false, message: 'Session not found' });
  }

  const { files } = req.body; // array of { originalName, fileSize, mimeType, category, dataUrl }
  if (!files || !Array.isArray(files) || files.length === 0) {
    return res.status(400).json({ success: false, message: 'No documents provided' });
  }

  if (files.length > 20) {
    return res.status(400).json({ success: false, message: 'Maximum 20 files per upload batch' });
  }

  if (session.uploadedFiles.length + files.length > 50) {
    return res.status(400).json({ success: false, message: 'Session storage limit reached (max 50 documents per session)' });
  }

  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg', 'application/pdf'];

  for (const file of files) {
    const rawMime = file.mimeType ? String(file.mimeType).toLowerCase() : 'image/jpeg';
    const mimeType = allowedMimeTypes.includes(rawMime) ? rawMime : 'image/jpeg';
    const safeName = file.originalName ? String(file.originalName).replace(/[^\w\s.-]/gi, '').slice(0, 100) : 'Document.jpg';
    const safeDataUrl = typeof file.dataUrl === 'string' && (file.dataUrl.startsWith('data:') || file.dataUrl.startsWith('http')) 
      ? file.dataUrl 
      : undefined;

    session.uploadedFiles.push({
      id: uuidv4(),
      originalName: safeName,
      fileSize: Math.min(Number(file.fileSize) || 102400, 25 * 1024 * 1024),
      mimeType,
      category: file.category || 'DOCUMENT',
      dataUrl: safeDataUrl,
      uploadedAt: new Date().toISOString()
    });
  }

  session.status = 'FILES_UPLOADED';
  store.addAudit('Customer Mobile', 'Documents Uploaded', `${files.length} document(s) uploaded to session ${session.sessionToken}`);

  res.json({
    success: true,
    message: 'Documents transmitted securely to cyber café counter!',
    uploadedCount: session.uploadedFiles.length
  });
});

// POST destroy session data (Operator manually purges or completes job)
router.post('/:token/purge', (req: Request, res: Response) => {
  const token = String(req.params.token);
  if (store.sessions[token]) {
    delete store.sessions[token];
    store.addAudit('Privacy Engine', 'Session Purged', `Memory wiped for token ${token}`);
  }
  res.json({ success: true, message: 'Session completely wiped.' });
});

export default router;
