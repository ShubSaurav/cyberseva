import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
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

// Middlewares
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    app: 'CyberSeva Backend & Print Bridge Hub',
    tagline: 'One Counter. Every Service.',
    version: '1.0.0',
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

// Start Server
app.listen(PORT, () => {
  console.log(`===============================================`);
  console.log(`🚀 CYBERSEVA BACKEND SERVER RUNNING`);
  console.log(`📡 URL: http://localhost:${PORT}`);
  console.log(`🖨️  Print Bridge & Spooler: ACTIVE`);
  console.log(`🛡️  Privacy Guardian: ACTIVE (Zero-leak buffer)`);
  console.log(`===============================================`);
});

export default app;
