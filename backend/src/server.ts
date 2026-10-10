import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

import jobsRouter from './routes/jobs';
import printersRouter from './routes/printers';
import customerSessionsRouter from './routes/customerSessions';
import copilotRouter from './routes/copilot';
import inventoryRouter from './routes/inventory';
import settingsRouter from './routes/settings';
import analyticsRouter from './routes/analytics';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;
const HOST = process.env.HOST || '0.0.0.0';

// Security Headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

// Dynamic CORS configuration
const corsOrigin = process.env.CORS_ORIGIN || '*';
const originOption = corsOrigin === '*' ? '*' : corsOrigin.split(',').map(s => s.trim());
app.use(cors({
  origin: originOption,
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body Parsers with limits
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    app: 'CyberSeva Backend & Print Bridge Hub',
    tagline: 'One Counter. Every Service.',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'production',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/jobs', jobsRouter);
app.use('/api/printers', printersRouter);
app.use('/api/sessions', customerSessionsRouter);
app.use('/api/copilot', copilotRouter);
app.use('/api/inventory', inventoryRouter);
app.use('/api/settings', settingsRouter);
app.use('/api/analytics', analyticsRouter);

// Production Static Client Hosting (Serves React Vite SPA if built)
const frontendDist = path.join(__dirname, '../../frontend/dist');
if (fs.existsSync(frontendDist)) {
  app.use(express.static(frontendDist));
}

// 404 handler for unmatched API routes
app.use('/api', (req, res) => {
  res.status(404).json({
    success: false,
    message: `API endpoint ${req.method} ${req.path} not found`
  });
});

// Client SPA fallback for non-API routes (Express 5 compatible)
if (fs.existsSync(frontendDist)) {
  app.use((req, res, next) => {
    if (req.method === 'GET' && !req.path.startsWith('/api')) {
      return res.sendFile(path.join(frontendDist, 'index.html'));
    }
    next();
  });
}

// Global Production Error Handler (Zero stack trace leaks)
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (err instanceof SyntaxError && 'status' in err && (err as any).status === 400) {
    return res.status(400).json({
      success: false,
      message: 'Invalid or malformed JSON payload'
    });
  }

  console.error('[CyberSeva Server Error]:', err?.message || err);
  const statusCode = typeof err?.status === 'number' && err.status >= 400 && err.status < 600 ? err.status : 500;
  
  res.status(statusCode).json({
    success: false,
    message: process.env.NODE_ENV === 'production' ? 'Internal server error' : (err?.message || 'Server error')
  });
});

// Start Server
app.listen(Number(PORT), HOST, () => {
  console.log(`===============================================`);
  console.log(`🚀 CYBERSEVA BACKEND SERVER RUNNING`);
  console.log(`📡 URL: http://${HOST}:${PORT}`);
  console.log(`🖨️  Print Bridge & Spooler: ACTIVE`);
  console.log(`🛡️  Privacy Guardian: ACTIVE (Zero-leak buffer)`);
  console.log(`===============================================`);
});

export default app;
