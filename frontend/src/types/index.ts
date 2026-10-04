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
  type: string;
  connection: string;
  tonerBlack: number;
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
  jobCode: string;
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

export interface CopilotActionPlan {
  intent: 'AADHAAR_SMART_LAYOUT' | 'PASSPORT_PHOTO' | 'COMPRESS_IMAGE' | 'COMPRESS_PDF' | 'PDF_MERGE' | 'PRINT_DISPATCH' | 'BUSINESS_INSIGHT' | 'SIGNATURE_CLEANUP' | 'GENERAL_HELP';
  documentType?: 'AADHAAR' | 'PAN' | 'PHOTO' | 'SIGNATURE' | 'PDF' | 'GENERAL_DOC';
  parameters: Record<string, any>;
  title: string;
  explanation: string;
  hindiExplanation: string;
  autoExecute: boolean;
  targetStudioTab?: 'dashboard' | 'new-job' | 'document-studio' | 'photo-studio' | 'pdf-studio' | 'printing' | 'reports';
  dataPayload?: any;
}
