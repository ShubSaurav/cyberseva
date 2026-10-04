import { v4 as uuidv4 } from 'uuid';

export interface ShopSettings {
  shopName: string;
  tagline: string;
  ownerName: string;
  phone: string;
  email: string;
  address: string;
  upiId: string;
  gstin?: string;
  defaultPrinterId: string;
  language: 'en' | 'hi' | 'hinglish';
  autoPurgeMinutes: number;
  currency: string;
  pricingMatrix: Record<string, number>;
}

export interface Printer {
  id: string;
  name: string;
  model: string;
  brand: 'HP' | 'Canon' | 'Epson' | 'Brother';
  status: 'ONLINE' | 'OFFLINE' | 'PRINTING' | 'LOW_PAPER' | 'ERROR';
  location: string;
  isDefault: boolean;
  type: 'Laser Monochrome' | 'Color Ink Tank' | 'All-in-One Inkjet';
  connection: 'USB 3.0' | 'WiFi' | 'Ethernet';
  tonerBlack: number; // percentage
  inkCyan?: number;
  inkMagenta?: number;
  inkYellow?: number;
  paperTrayCount: number;
  paperSize: 'A4' | 'A5' | '4x6' | 'Legal';
  totalPrintsToday: number;
}

export interface PrintJobItem {
  id: string;
  jobId: string;
  printerId: string;
  printerName: string;
  documentName: string;
  pages: number;
  copies: number;
  colorMode: 'BW' | 'COLOR';
  paperSize: 'A4' | 'A5' | '4x6' | 'PVC';
  status: 'QUEUED' | 'PRINTING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
  createdAt: string;
  completedAt?: string;
}

export interface ServiceItem {
  id: string;
  name: string;
  category: 'PRINT' | 'PHOTO' | 'DOC' | 'LAMINATION' | 'FORM';
  unitPrice: number;
  quantity: number;
  total: number;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  totalJobs: number;
  totalSpent: number;
  lastVisit: string;
  isGuest: boolean;
}

export interface Job {
  id: string;
  jobCode: string; // e.g. #10293
  customerName: string;
  customerPhone?: string;
  services: ServiceItem[];
  subtotal: number;
  discount: number;
  totalAmount: number;
  paymentMode: 'UPI_QR' | 'CASH' | 'SPLIT';
  paymentStatus: 'PAID' | 'PENDING';
  status: 'NEW' | 'PROCESSING' | 'READY' | 'PRINTING' | 'COMPLETED' | 'CANCELLED';
  operator: string;
  notes?: string;
  createdAt: string;
  completedAt?: string;
  hasTemporaryFiles: boolean;
  purgedAt?: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  category: 'PAPER' | 'INK_TONER' | 'LAMINATION' | 'STATIONERY';
  currentStock: number;
  unit: string;
  minThreshold: number;
  status: 'GOOD' | 'LOW' | 'CRITICAL';
  estimatedDaysLeft: number;
  lastRestocked: string;
}

export interface CustomerUploadSession {
  id: string;
  sessionToken: string;
  customerName: string;
  phone?: string;
  status: 'WAITING_FOR_FILES' | 'FILES_UPLOADED' | 'PROCESSED' | 'EXPIRED';
  createdAt: string;
  expiresAt: string;
  uploadedFiles: {
    id: string;
    originalName: string;
    fileSize: number;
    mimeType: string;
    category: 'AADHAAR_FRONT' | 'AADHAAR_BACK' | 'PAN' | 'PHOTO' | 'DOCUMENT' | 'PDF';
    dataUrl?: string;
    uploadedAt: string;
  }[];
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  staffName: string;
  jobCode?: string;
  action: string;
  details: string;
  privacySafe: boolean;
}

// In-Memory State Container
class CyberSevaStore {
  settings: ShopSettings = {
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

  printers: Printer[] = [
    {
      id: 'printer-hp-1',
      name: 'HP LaserJet Pro M404n',
      model: 'M404n',
      brand: 'HP',
      status: 'ONLINE',
      location: 'Counter 1 (Fast B&W Desk)',
      isDefault: true,
      type: 'Laser Monochrome',
      connection: 'USB 3.0',
      tonerBlack: 84,
      paperTrayCount: 180,
      paperSize: 'A4',
      totalPrintsToday: 215
    },
    {
      id: 'printer-canon-1',
      name: 'Canon PIXMA G3010 Ink Tank',
      model: 'G3010',
      brand: 'Canon',
      status: 'ONLINE',
      location: 'Counter 2 (Photo & Color Desk)',
      isDefault: false,
      type: 'Color Ink Tank',
      connection: 'WiFi',
      tonerBlack: 92,
      inkCyan: 88,
      inkMagenta: 82,
      inkYellow: 85,
      paperTrayCount: 65,
      paperSize: 'A4',
      totalPrintsToday: 68
    },
    {
      id: 'printer-epson-1',
      name: 'Epson EcoTank L3250',
      model: 'L3250',
      brand: 'Epson',
      status: 'OFFLINE',
      location: 'Back Office (Heavy Duplex)',
      isDefault: false,
      type: 'Color All-in-One Inkjet',
      connection: 'WiFi',
      tonerBlack: 60,
      inkCyan: 72,
      inkMagenta: 69,
      inkYellow: 70,
      paperTrayCount: 120,
      paperSize: 'A4',
      totalPrintsToday: 29
    },
    {
      id: 'printer-brother-1',
      name: 'Brother DCP-L2541DW',
      model: 'DCP-L2541DW',
      brand: 'Brother',
      status: 'ONLINE',
      location: 'Scanner & Copy Station',
      isDefault: false,
      type: 'Laser Monochrome',
      connection: 'Ethernet',
      tonerBlack: 48,
      paperTrayCount: 95,
      paperSize: 'A4',
      totalPrintsToday: 42
    }
  ];

  printQueue: PrintJobItem[] = [
    {
      id: 'pj-101',
      jobId: 'job-10293',
      printerId: 'printer-hp-1',
      printerName: 'HP LaserJet Pro M404n',
      documentName: 'Aadhaar_Front_Back_A4.pdf',
      pages: 1,
      copies: 1,
      colorMode: 'BW',
      paperSize: 'A4',
      status: 'COMPLETED',
      createdAt: '10 mins ago',
      completedAt: '9 mins ago'
    },
    {
      id: 'pj-102',
      jobId: 'job-10294',
      printerId: 'printer-canon-1',
      printerName: 'Canon PIXMA G3010 Ink Tank',
      documentName: 'Passport_Photos_8x_Sheet.jpg',
      pages: 1,
      copies: 1,
      colorMode: 'COLOR',
      paperSize: 'A4',
      status: 'PRINTING',
      createdAt: '3 mins ago'
    }
  ];

  inventory: InventoryItem[] = [
    {
      id: 'inv-1',
      name: 'A4 Copier Paper (JK Cedar 75 GSM)',
      category: 'PAPER',
      currentStock: 14,
      unit: 'Reams (500 sheets/ream)',
      minThreshold: 5,
      status: 'GOOD',
      estimatedDaysLeft: 3.5,
      lastRestocked: '2026-09-29'
    },
    {
      id: 'inv-2',
      name: '4x6 Glossy Photo Paper (Kodak 210 GSM)',
      category: 'PAPER',
      currentStock: 35,
      unit: 'Sheets',
      minThreshold: 50,
      status: 'LOW',
      estimatedDaysLeft: 2,
      lastRestocked: '2026-09-24'
    },
    {
      id: 'inv-3',
      name: 'HP 88A LaserJet Black Toner',
      category: 'INK_TONER',
      currentStock: 2,
      unit: 'Cartridges',
      minThreshold: 2,
      status: 'GOOD',
      estimatedDaysLeft: 18,
      lastRestocked: '2026-09-15'
    },
    {
      id: 'inv-4',
      name: 'Canon GI-790 Color Ink Bottle Set (CMYK)',
      category: 'INK_TONER',
      currentStock: 1,
      unit: 'Full Set (4 Bottles)',
      minThreshold: 2,
      status: 'LOW',
      estimatedDaysLeft: 5,
      lastRestocked: '2026-09-10'
    },
    {
      id: 'inv-5',
      name: 'A4 Lamination Pouches (125 Micron)',
      category: 'LAMINATION',
      currentStock: 65,
      unit: 'Pouches',
      minThreshold: 30,
      status: 'GOOD',
      estimatedDaysLeft: 8,
      lastRestocked: '2026-09-26'
    },
    {
      id: 'inv-6',
      name: 'ID Card Lamination Pouches',
      category: 'LAMINATION',
      currentStock: 140,
      unit: 'Pouches',
      minThreshold: 50,
      status: 'GOOD',
      estimatedDaysLeft: 14,
      lastRestocked: '2026-09-20'
    }
  ];

  customers: Customer[] = [
    {
      id: 'cust-1',
      name: 'Amit Kumar Verma',
      phone: '+91 98234 11223',
      totalJobs: 14,
      totalSpent: 420,
      lastVisit: 'Today, 10:15 AM',
      isGuest: false
    },
    {
      id: 'cust-2',
      name: 'Pooja Tiwari',
      phone: '+91 97112 55667',
      totalJobs: 6,
      totalSpent: 195,
      lastVisit: 'Today, 11:30 AM',
      isGuest: false
    },
    {
      id: 'cust-3',
      name: 'Rameshwar Singh (Kisan Mitra)',
      phone: '+91 94500 88991',
      totalJobs: 28,
      totalSpent: 940,
      lastVisit: 'Yesterday',
      isGuest: false
    },
    {
      id: 'cust-4',
      name: 'Sunita Devi',
      phone: '+91 91200 44332',
      totalJobs: 3,
      totalSpent: 85,
      lastVisit: '2 days ago',
      isGuest: false
    }
  ];

  jobs: Job[] = [
    {
      id: 'job-10293',
      jobCode: '#10293',
      customerName: 'Amit Kumar Verma',
      customerPhone: '+91 98234 11223',
      services: [
        { id: 's1', name: 'Aadhaar Smart Print (Front + Back A4)', category: 'PRINT', unitPrice: 15, quantity: 1, total: 15 },
        { id: 's2', name: 'A4 Lamination (125 Micron)', category: 'LAMINATION', unitPrice: 20, quantity: 1, total: 20 }
      ],
      subtotal: 35,
      discount: 0,
      totalAmount: 35,
      paymentMode: 'UPI_QR',
      paymentStatus: 'PAID',
      status: 'COMPLETED',
      operator: 'Rajesh (Owner)',
      createdAt: '2026-10-04T10:15:00.000Z',
      completedAt: '2026-10-04T10:22:00.000Z',
      hasTemporaryFiles: false,
      purgedAt: '2026-10-04T10:25:00.000Z'
    },
    {
      id: 'job-10294',
      jobCode: '#10294',
      customerName: 'Pooja Tiwari',
      customerPhone: '+91 97112 55667',
      services: [
        { id: 's3', name: 'Passport Photos (8 Copies 35x45mm Glossy)', category: 'PHOTO', unitPrice: 30, quantity: 1, total: 30 }
      ],
      subtotal: 30,
      discount: 0,
      totalAmount: 30,
      paymentMode: 'UPI_QR',
      paymentStatus: 'PAID',
      status: 'PRINTING',
      operator: 'Vikas (Staff)',
      createdAt: '2026-10-04T11:30:00.000Z',
      hasTemporaryFiles: true
    },
    {
      id: 'job-10295',
      jobCode: '#10295',
      customerName: 'Walk-in Student',
      customerPhone: '',
      services: [
        { id: 's4', name: 'Admit Card B&W Single A4', category: 'PRINT', unitPrice: 3, quantity: 3, total: 9 },
        { id: 's5', name: 'PDF Merge & 50KB SSC Compress', category: 'DOC', unitPrice: 15, quantity: 1, total: 15 }
      ],
      subtotal: 24,
      discount: 0,
      totalAmount: 24,
      paymentMode: 'CASH',
      paymentStatus: 'PAID',
      status: 'READY',
      operator: 'Rajesh (Owner)',
      createdAt: '2026-10-04T11:45:00.000Z',
      hasTemporaryFiles: true
    },
    {
      id: 'job-10296',
      jobCode: '#10296',
      customerName: 'Mohd. Salim',
      customerPhone: '+91 93361 77889',
      services: [
        { id: 's6', name: 'PAN Card Printout & Lamination', category: 'PRINT', unitPrice: 30, quantity: 1, total: 30 }
      ],
      subtotal: 30,
      discount: 0,
      totalAmount: 30,
      paymentMode: 'UPI_QR',
      paymentStatus: 'PENDING',
      status: 'PROCESSING',
      operator: 'Rajesh (Owner)',
      createdAt: '2026-10-04T12:05:00.000Z',
      hasTemporaryFiles: true
    }
  ];

  sessions: Record<string, CustomerUploadSession> = {};

  auditLogs: AuditLogEntry[] = [
    {
      id: 'log-1',
      timestamp: '10:25 AM',
      staffName: 'Rajesh Sharma',
      jobCode: '#10293',
      action: 'Automatic Privacy Purge',
      details: 'Customer Aadhaar temporary memory buffer destroyed securely (Zero retention).',
      privacySafe: true
    },
    {
      id: 'log-2',
      timestamp: '10:22 AM',
      staffName: 'Rajesh Sharma',
      jobCode: '#10293',
      action: 'Print Completed',
      details: 'Aadhaar front-back A4 dispatched to HP LaserJet Pro M404n.',
      privacySafe: true
    },
    {
      id: 'log-3',
      timestamp: '10:16 AM',
      staffName: 'Rajesh Sharma',
      jobCode: '#10293',
      action: 'Document Layout Engine',
      details: 'Dual perspective crop and auto-deskew applied for Aadhaar card.',
      privacySafe: true
    },
    {
      id: 'log-4',
      timestamp: '11:32 AM',
      staffName: 'Vikas (Staff)',
      jobCode: '#10294',
      action: 'Photo Studio 8-Up Generator',
      details: 'Generated 35x45mm 8-photo grid on Kodak photo sheet with cut guides.',
      privacySafe: true
    }
  ];

  addAudit(staffName: string, action: string, details: string, jobCode?: string) {
    const entry: AuditLogEntry = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      staffName,
      jobCode,
      action,
      details,
      privacySafe: true
    };
    this.auditLogs.unshift(entry);
    if (this.auditLogs.length > 100) this.auditLogs.pop();
  }
}

export const store = new CyberSevaStore();
