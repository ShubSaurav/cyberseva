import React, { useState, useEffect } from 'react';
import { Header } from './components/common/Header';
import { CounterHome } from './components/views/CounterHome';
import { AadhaarStudio } from './components/views/AadhaarStudio';
import { PassportStudio } from './components/views/PassportStudio';
import { PdfStudio } from './components/views/PdfStudio';
import { CustomerQrView } from './components/views/CustomerQrView';
import { HistoryView } from './components/views/HistoryView';
import { SettingsRatesView } from './components/views/SettingsRatesView';
import { CustomerUploadView } from './components/views/CustomerUploadView';

import { SimplePrintModal } from './components/common/SimplePrintModal';
import { SimpleReceiptModal } from './components/common/SimpleReceiptModal';
import { SimpleCopilotModal } from './components/common/SimpleCopilotModal';
import { HelpModal } from './components/common/HelpModal';

import { api } from './services/api';
import { ShopSettings, Printer, Job, CopilotActionPlan } from './types';
import { Language, FontSize } from './utils/i18n';

export function App() {
  const urlParams = new URLSearchParams(window.location.search);
  const isCustomerUploadMode = urlParams.get('view') === 'customer-upload';
  const customerSessionToken = urlParams.get('token') || 'CS-DEMO';

  // Navigation State
  const [activeTab, setActiveTab] = useState<string>('counter');

  // Language & Accessibility State
  const [language, setLanguage] = useState<Language>(() => {
    return (localStorage.getItem('cyberseva_lang') as Language) || 'hi';
  });
  const [fontSize, setFontSize] = useState<FontSize>(() => {
    return (localStorage.getItem('cyberseva_font_size') as FontSize) || 'md';
  });
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  // Apply Font Size dynamically to root HTML for responsive rem scaling
  useEffect(() => {
    if (fontSize === 'sm') {
      document.documentElement.style.fontSize = '14.5px';
    } else if (fontSize === 'lg') {
      document.documentElement.style.fontSize = '18px';
    } else {
      document.documentElement.style.fontSize = '16px';
    }
  }, [fontSize]);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('cyberseva_lang', lang);
  };

  const handleSetFontSize = (size: FontSize) => {
    setFontSize(size);
    localStorage.setItem('cyberseva_font_size', size);
  };

  // Shared Data
  const [settings, setSettings] = useState<ShopSettings>({
    shopName: 'Sharma Digital Seva & Cyber Point',
    tagline: 'One Counter. Every Service.',
    ownerName: 'Rajesh Sharma',
    phone: '+91 98765 43210',
    email: 'sharmacyberpoint@gmail.com',
    address: 'Near Head Post Office, Civil Lines, Kanpur, UP - 208001',
    upiId: 'sharmacyber@okhdfcbank',
    gstin: '09AAACH7409R1ZZ',
    defaultPrinterId: 'printer-hp-1',
    language: 'hi',
    autoPurgeMinutes: 15,
    currency: '₹',
    pricingMatrix: {
      'a4_bw_single': 3,
      'a4_bw_both': 5,
      'a4_color_single': 10,
      'aadhaar_smart_print': 15,
      'passport_photo_8': 30,
      'passport_photo_16': 50,
      'document_scan': 5,
      'lamination_a4': 20,
      'pdf_merge_edit': 10
    }
  });

  const [printers, setPrinters] = useState<Printer[]>([
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
    }
  ]);

  const [jobs, setJobs] = useState<Job[]>([
    {
      id: 'job-10293',
      jobCode: '#10293',
      customerName: 'Amit Kumar Verma',
      customerPhone: '+91 98234 11223',
      services: [
        { id: 's1', name: 'Aadhaar Smart Print (A4)', category: 'PRINT', unitPrice: 15, quantity: 1, total: 15 }
      ],
      subtotal: 15,
      discount: 0,
      totalAmount: 15,
      paymentMode: 'UPI_QR',
      paymentStatus: 'PAID',
      status: 'COMPLETED',
      operator: 'Rajesh (Owner)',
      createdAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
      hasTemporaryFiles: false
    },
    {
      id: 'job-10294',
      jobCode: '#10294',
      customerName: 'Pooja Tiwari',
      customerPhone: '+91 97112 55667',
      services: [
        { id: 's2', name: '8 Passport Photos (Glossy)', category: 'PHOTO', unitPrice: 30, quantity: 1, total: 30 }
      ],
      subtotal: 30,
      discount: 0,
      totalAmount: 30,
      paymentMode: 'UPI_QR',
      paymentStatus: 'PAID',
      status: 'COMPLETED',
      operator: 'Rajesh (Owner)',
      createdAt: new Date().toISOString(),
      hasTemporaryFiles: true
    },
    {
      id: 'job-10295',
      jobCode: '#10295',
      customerName: 'Walk-in Student',
      customerPhone: '',
      services: [
        { id: 's3', name: 'Admit Card B&W Single A4', category: 'PRINT', unitPrice: 3, quantity: 2, total: 6 }
      ],
      subtotal: 6,
      discount: 0,
      totalAmount: 6,
      paymentMode: 'CASH',
      paymentStatus: 'PAID',
      status: 'COMPLETED',
      operator: 'Rajesh (Owner)',
      createdAt: new Date().toISOString(),
      hasTemporaryFiles: true
    }
  ]);

  // Modals
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);
  const [copilotInitialQuery, setCopilotInitialQuery] = useState('');
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [printDocUrl, setPrintDocUrl] = useState<string | undefined>(undefined);
  const [printDocName, setPrintDocName] = useState<string>('Document.pdf');
  const [selectedReceiptJob, setSelectedReceiptJob] = useState<Job | null>(null);

  useEffect(() => {
    loadLiveStore();
  }, []);

  const loadLiveStore = async () => {
    try {
      const [fetchedSettings, fetchedPrinters, fetchedJobs] = await Promise.all([
        api.getSettings(),
        api.getPrinters(),
        api.getJobs()
      ]);
      if (fetchedSettings) setSettings(fetchedSettings);
      if (fetchedPrinters?.printers?.length) setPrinters(fetchedPrinters.printers);
      if (fetchedJobs?.length) setJobs(fetchedJobs);
    } catch (e) {
      console.log('Running in local memory mode', e);
    }
  };

  // If customer is opening on phone from counter QR code
  if (isCustomerUploadMode) {
    return <CustomerUploadView token={customerSessionToken} />;
  }

  // Keyboard shortcuts (Ctrl+P for print, Ctrl+N for counter home, Esc to close modals)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'p') {
        e.preventDefault();
        setIsPrintModalOpen(true);
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'n') {
        e.preventDefault();
        setActiveTab('counter');
      } else if (e.key === 'Escape') {
        setIsHelpOpen(false);
        setIsPrintModalOpen(false);
        setIsCopilotOpen(false);
        setSelectedReceiptJob(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleOpenPrint = (url: string, name: string) => {
    setPrintDocUrl(url);
    setPrintDocName(name);
    setIsPrintModalOpen(true);
  };

  const handleExecuteCopilotPlan = (plan: CopilotActionPlan) => {
    if (plan.intent === 'AADHAAR_SMART_LAYOUT') {
      setActiveTab('aadhaar');
    } else if (plan.intent === 'PASSPORT_PHOTO') {
      setActiveTab('photo');
    } else if (plan.intent === 'COMPRESS_PDF' || plan.intent === 'PDF_MERGE') {
      setActiveTab('pdf');
    } else if (plan.intent === 'PRINT_DISPATCH') {
      setIsPrintModalOpen(true);
    } else {
      setActiveTab('counter');
    }
  };

  const handlePurgeJob = async (jobId: string) => {
    await api.purgeJobFiles(jobId);
    setJobs(jobs.map(j => j.id === jobId ? { ...j, hasTemporaryFiles: false } : j));
    alert('ग्राहक की फाइलें काउंटर मेमोरी से सुरक्षित मिटा दी गई हैं।');
  };

  const todayRevenue = jobs.reduce((sum, j) => sum + (j.paymentStatus === 'PAID' ? j.totalAmount : 0), 0) + 2840;

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col font-sans antialiased transition-all">
      {/* Top Clean Header */}
      <Header
        settings={settings}
        printers={printers}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenCopilot={() => {
          setCopilotInitialQuery('');
          setIsCopilotOpen(true);
        }}
        onOpenHelp={() => setIsHelpOpen(true)}
        todayRevenue={todayRevenue}
        language={language}
        setLanguage={handleSetLanguage}
        fontSize={fontSize}
        setFontSize={handleSetFontSize}
      />

      {/* Main Clean Workspace */}
      <main className="flex-1 p-4 sm:p-6 overflow-y-auto max-w-7xl w-full mx-auto">
        {activeTab === 'counter' && (
          <CounterHome
            settings={settings}
            jobs={jobs}
            onNavigate={(t) => setActiveTab(t)}
            onOpenCopilotWithQuery={(q) => {
              setCopilotInitialQuery(q);
              setIsCopilotOpen(true);
            }}
            onViewReceipt={(j) => setSelectedReceiptJob(j)}
            onPurgeJob={handlePurgeJob}
            onQuickPrint={(j) => handleOpenPrint('', `${j.jobCode}_RePrint.pdf`)}
            language={language}
          />
        )}

        {activeTab === 'aadhaar' && (
          <AadhaarStudio onPrint={handleOpenPrint} language={language} />
        )}

        {activeTab === 'photo' && (
          <PassportStudio onPrint={handleOpenPrint} language={language} />
        )}

        {activeTab === 'pdf' && (
          <PdfStudio language={language} />
        )}

        {activeTab === 'qr' && (
          <CustomerQrView
            onFilesReady={(files) => {
              setActiveTab('aadhaar');
            }}
          />
        )}

        {activeTab === 'jobs' && (
          <HistoryView
            jobs={jobs}
            onViewReceipt={(j) => setSelectedReceiptJob(j)}
            onPurgeJob={handlePurgeJob}
            onQuickPrint={(j) => handleOpenPrint('', `${j.jobCode}_Print.pdf`)}
            language={language}
          />
        )}

        {activeTab === 'rates' && (
          <SettingsRatesView
            settings={settings}
            onUpdateSettings={setSettings}
          />
        )}
      </main>

      {/* Minimal Clean Modals */}
      <SimplePrintModal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        printers={printers}
        previewUrl={printDocUrl}
        documentName={printDocName}
        onSuccess={() => {
          loadLiveStore();
        }}
      />

      <SimpleReceiptModal
        isOpen={selectedReceiptJob !== null}
        onClose={() => setSelectedReceiptJob(null)}
        job={selectedReceiptJob}
        settings={settings}
      />

      <SimpleCopilotModal
        isOpen={isCopilotOpen}
        onClose={() => setIsCopilotOpen(false)}
        onExecute={handleExecuteCopilotPlan}
        initialQuery={copilotInitialQuery}
      />

      {/* Help & Counter Guide Modal */}
      <HelpModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
        lang={language}
      />
    </div>
  );
}

export default App;
