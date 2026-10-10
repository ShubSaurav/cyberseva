import { Job, Printer, ShopSettings, InventoryItem, Customer, CustomerUploadSession, CopilotActionPlan, PrintJobItem } from '../types';

const rawApiUrl = (import.meta.env?.VITE_API_URL as string | undefined)?.trim();
const API_BASE = rawApiUrl
  ? (rawApiUrl.endsWith('/api') ? rawApiUrl : `${rawApiUrl.replace(/\/$/, '')}/api`)
  : '/api';

export const api = {
  // Health
  checkHealth: async () => {
    try {
      const res = await fetch(`${API_BASE}/health`);
      return await res.json();
    } catch {
      return { status: 'OFFLINE_MODE' };
    }
  },

  // Settings
  getSettings: async (): Promise<ShopSettings> => {
    try {
      const res = await fetch(`${API_BASE}/settings`);
      const data = await res.json();
      return data.data;
    } catch {
      return {
        shopName: 'Sharma Digital Seva & Cyber Point',
        tagline: 'One Counter. Every Service.',
        ownerName: 'Rajesh Sharma',
        phone: '+91 98765 43210',
        email: 'sharmacyberpoint@gmail.com',
        address: 'Near Head Post Office, Civil Lines, Kanpur, UP - 208001',
        upiId: 'sharmacyber@okhdfcbank',
        gstin: '09AAACH7409R1ZZ',
        defaultPrinterId: 'printer-hp-1',
        language: 'hinglish',
        autoPurgeMinutes: 15,
        currency: '₹',
        pricingMatrix: {
          'a4_bw_single': 3,
          'a4_bw_both': 5,
          'a4_color_single': 10,
          'a4_color_both': 18,
          'aadhaar_smart_print': 15,
          'aadhaar_laminated': 25,
          'pan_print': 10,
          'passport_photo_8': 30,
          'passport_photo_16': 50,
          'document_scan': 5,
          'lamination_a4': 20,
          'lamination_id': 10,
          'pdf_merge_edit': 10,
          'online_form_apply': 50,
          'pvc_card_print': 60
        }
      };
    }
  },

  updateSettings: async (settings: Partial<ShopSettings>) => {
    const res = await fetch(`${API_BASE}/settings`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings)
    });
    return await res.json();
  },

  getAuditLogs: async () => {
    try {
      const res = await fetch(`${API_BASE}/settings/audit-logs`);
      const data = await res.json();
      return data.data;
    } catch {
      return [];
    }
  },

  // Staff
  addStaff: async (staffData: { name: string; role: string; phone?: string }) => {
    const res = await fetch(`${API_BASE}/settings/staff`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(staffData)
    });
    return await res.json();
  },

  deleteStaff: async (id: string) => {
    const res = await fetch(`${API_BASE}/settings/staff/${id}`, {
      method: 'DELETE'
    });
    return await res.json();
  },

  // Jobs & Sales
  getJobs: async (): Promise<Job[]> => {
    try {
      const res = await fetch(`${API_BASE}/jobs`);
      const data = await res.json();
      return data.data;
    } catch {
      return [];
    }
  },

  createJob: async (jobData: Partial<Job>): Promise<Job> => {
    const res = await fetch(`${API_BASE}/jobs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(jobData)
    });
    const data = await res.json();
    return data.data;
  },

  logSale: async (saleData: {
    serviceName: string;
    totalAmount: number;
    quantity?: number;
    paymentMode?: string;
    paymentStatus?: string;
    operator?: string;
    customerName?: string;
    customerPhone?: string;
    notes?: string;
  }): Promise<Job> => {
    const res = await fetch(`${API_BASE}/jobs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(saleData)
    });
    const data = await res.json();
    return data.data;
  },

  deleteJob: async (id: string) => {
    const res = await fetch(`${API_BASE}/jobs/${id}`, {
      method: 'DELETE'
    });
    return await res.json();
  },

  updateJob: async (id: string, updates: Partial<Job>) => {
    const res = await fetch(`${API_BASE}/jobs/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    return await res.json();
  },

  purgeJobFiles: async (id: string) => {
    const res = await fetch(`${API_BASE}/jobs/${id}/purge`, { method: 'POST' });
    return await res.json();
  },

  // Printers & Print Bridge
  getPrinters: async (): Promise<{ printers: Printer[]; activeQueue: PrintJobItem[]; bridgeStatus: any }> => {
    try {
      const res = await fetch(`${API_BASE}/printers`);
      const data = await res.json();
      return data;
    } catch {
      return {
        bridgeStatus: { connected: true, bridgeVersion: '1.4.2-win64', spoolerStatus: 'RUNNING' },
        printers: [],
        activeQueue: []
      };
    }
  },

  dispatchPrint: async (payload: {
    printerId?: string;
    jobId?: string;
    documentName: string;
    pages: number;
    copies: number;
    colorMode: 'BW' | 'COLOR';
    paperSize: 'A4' | 'A5' | '4x6' | 'PVC';
  }) => {
    const res = await fetch(`${API_BASE}/printers/print`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return await res.json();
  },

  testPrint: async (printerId: string) => {
    const res = await fetch(`${API_BASE}/printers/${printerId}/test-print`, { method: 'POST' });
    return await res.json();
  },

  // Customer Sessions
  createSession: async (customerName?: string, phone?: string) => {
    const res = await fetch(`${API_BASE}/sessions/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ customerName, phone })
    });
    return await res.json();
  },

  getSession: async (token: string): Promise<CustomerUploadSession | null> => {
    try {
      const res = await fetch(`${API_BASE}/sessions/${token}`);
      const data = await res.json();
      return data.data;
    } catch {
      return null;
    }
  },

  uploadToSession: async (token: string, files: any[]) => {
    const res = await fetch(`${API_BASE}/sessions/${token}/upload`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ files })
    });
    return await res.json();
  },

  // Copilot AI
  askCopilot: async (query: string): Promise<CopilotActionPlan> => {
    const res = await fetch(`${API_BASE}/copilot/parse`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query })
    });
    const data = await res.json();
    return data.data;
  },

  // Inventory
  getInventory: async (): Promise<InventoryItem[]> => {
    try {
      const res = await fetch(`${API_BASE}/inventory`);
      const data = await res.json();
      return data.data;
    } catch {
      return [];
    }
  },

  updateInventoryStock: async (id: string, currentStock: number) => {
    const res = await fetch(`${API_BASE}/inventory/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ currentStock })
    });
    return await res.json();
  },

  // Analytics
  getAnalytics: async () => {
    try {
      const res = await fetch(`${API_BASE}/analytics`);
      const data = await res.json();
      return data.data;
    } catch {
      return null;
    }
  }
};
