import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/common/Header';
import { CounterHome } from './components/views/CounterHome';
import { AadhaarStudio } from './components/views/AadhaarStudio';
import { PassportStudio } from './components/views/PassportStudio';
import { PdfStudio } from './components/views/PdfStudio';
import { CustomerQrView } from './components/views/CustomerQrView';
import { SalesKhataView } from './components/views/SalesKhataView';
import { SettingsStaffView } from './components/views/SettingsStaffView';
import { HistoryView } from './components/views/HistoryView';
import { CustomerUploadView } from './components/views/CustomerUploadView';

import { SimplePrintModal } from './components/common/SimplePrintModal';
import { SimpleReceiptModal } from './components/common/SimpleReceiptModal';
import { SimpleCopilotModal } from './components/common/SimpleCopilotModal';
import { QuickSaleModal } from './components/common/QuickSaleModal';
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
    pricingMatrix: {},
    staffMembers: [
      {
        id: 'staff-1',
        name: 'Amit Verma',
        role: 'Operator',
        phone: '+91 98234 11223',
        status: 'ACTIVE',
        createdAt: new Date().toISOString()
      },
      {
        id: 'staff-2',
        name: 'Sunil Kumar',
        role: 'Assistant',
        phone: '+91 97112 55667',
        status: 'ACTIVE',
        createdAt: new Date().toISOString()
      }
    ]
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

  const [jobs, setJobs] = useState<Job[]>([]);

  // Modals
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);
  const [copilotInitialQuery, setCopilotInitialQuery] = useState('');
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [printDocUrl, setPrintDocUrl] = useState<string | undefined>(undefined);
  const [printDocName, setPrintDocName] = useState<string>('Document.pdf');
  const [selectedReceiptJob, setSelectedReceiptJob] = useState<Job | null>(null);

  // Quick Sale Modal State
  const [isQuickSaleOpen, setIsQuickSaleOpen] = useState(false);
  const [quickSaleInitialService, setQuickSaleInitialService] = useState<string | undefined>(undefined);

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
      if (fetchedJobs?.length) {
        setJobs(fetchedJobs);
      } else {
        // Default today's starter jobs if empty
        const todayStr = new Date().toISOString();
        setJobs([
          {
            id: 'job-10293',
            jobCode: '#10293',
            customerName: 'Amit Kumar Verma',
            customerPhone: '+91 98234 11223',
            services: [
              { id: 's1', name: 'Aadhaar Smart Print (A4)', category: 'PRINT', unitPrice: 20, quantity: 1, total: 20 }
            ],
            subtotal: 20,
            discount: 0,
            totalAmount: 20,
            paymentMode: 'UPI_QR',
            paymentStatus: 'PAID',
            status: 'COMPLETED',
            operator: 'Rajesh Sharma',
            createdAt: todayStr,
            completedAt: todayStr,
            hasTemporaryFiles: false
          },
          {
            id: 'job-10294',
            jobCode: '#10294',
            customerName: 'Pooja Tiwari',
            customerPhone: '+91 97112 55667',
            services: [
              { id: 's2', name: '8 Passport Photos (Glossy)', category: 'PHOTO', unitPrice: 50, quantity: 1, total: 50 }
            ],
            subtotal: 50,
            discount: 0,
            totalAmount: 50,
            paymentMode: 'CASH',
            paymentStatus: 'PAID',
            status: 'COMPLETED',
            operator: 'Amit Verma',
            createdAt: todayStr,
            hasTemporaryFiles: false
          },
          {
            id: 'job-10295',
            jobCode: '#10295',
            customerName: 'Ravi Ranjan (Student)',
            customerPhone: '',
            services: [
              { id: 's3', name: 'Admit Card B&W Single A4', category: 'PRINT', unitPrice: 10, quantity: 2, total: 20 }
            ],
            subtotal: 20,
            discount: 0,
            totalAmount: 20,
            paymentMode: 'PENDING',
            paymentStatus: 'PENDING',
            status: 'COMPLETED',
            operator: 'Sunil Kumar',
            createdAt: todayStr,
            hasTemporaryFiles: false
          }
        ]);
      }
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
        setIsQuickSaleOpen(false);
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

  const handleOpenQuickSale = (serviceName?: string) => {
    setQuickSaleInitialService(serviceName);
    setIsQuickSaleOpen(true);
  };

  const handleSaveSale = async (saleData: any): Promise<Job> => {
    try {
      const newJob = await api.logSale(saleData);
      setJobs(prev => [newJob, ...prev]);
      return newJob;
    } catch (e) {
      console.log('Local memory fallback for sale', e);
      const total = (saleData.unitPrice || 0) * (saleData.quantity || 1);
      const localJob: Job = {
        id: `sale-${Date.now()}`,
        jobCode: `#${Math.floor(10000 + Math.random() * 90000)}`,
        customerName: saleData.customerName || (language === 'en' ? 'Walk-in Customer' : 'काउंटर ग्राहक'),
        customerPhone: saleData.customerPhone || '',
        services: [
          {
            id: `s-${Date.now()}`,
            name: saleData.serviceName,
            category: 'CUSTOM',
            unitPrice: saleData.unitPrice,
            quantity: saleData.quantity || 1,
            total
          }
        ],
        subtotal: total,
        discount: 0,
        totalAmount: total,
        paymentMode: saleData.paymentMode === 'CASH' ? 'CASH' : saleData.paymentMode === 'PENDING' ? 'PENDING' : 'UPI_QR',
        paymentStatus: saleData.paymentMode === 'PENDING' ? 'PENDING' : 'PAID',
        status: 'COMPLETED',
        operator: saleData.staffName || settings.ownerName,
        createdAt: new Date().toISOString(),
        hasTemporaryFiles: false
      };
      setJobs(prev => [localJob, ...prev]);
      return localJob;
    }
  };

  const handleDeleteJob = async (jobId: string) => {
    const confirmMsg = language === 'en'
      ? 'Are you sure you want to delete this sale entry?'
      : language === 'hinglish'
      ? 'Kya aap sach mein ye entry delete karna chahte hain?'
      : 'क्या आप इस सेल एंट्री को हटाना चाहते हैं?';

    if (window.confirm(confirmMsg)) {
      try {
        await api.deleteJob(jobId);
      } catch (e) {
        console.error(e);
      }
      setJobs(prev => prev.filter(j => j.id !== jobId));
    }
  };

  // Compute Today's Revenue dynamically (Paid only)
  const todayDate = new Date().toISOString().split('T')[0];
  const todayRevenue = useMemo(() => {
    return jobs
      .filter(j => j.createdAt && j.createdAt.split('T')[0] === todayDate && j.paymentStatus === 'PAID')
      .reduce((sum, j) => sum + (j.totalAmount || 0), 0);
  }, [jobs, todayDate]);

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
        onOpenQuickSale={() => handleOpenQuickSale()}
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
            onOpenQuickSale={handleOpenQuickSale}
            onDeleteJob={handleDeleteJob}
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
            onFilesReady={(_files) => {
              setActiveTab('aadhaar');
            }}
            language={language}
          />
        )}

        {activeTab === 'sales' && (
          <SalesKhataView
            jobs={jobs}
            settings={settings}
            language={language}
            onOpenQuickSale={() => handleOpenQuickSale()}
            onDeleteJob={handleDeleteJob}
            onViewReceipt={(j: Job) => setSelectedReceiptJob(j)}
          />
        )}

        {activeTab === 'settings' && (
          <SettingsStaffView
            settings={settings}
            onUpdateSettings={setSettings}
            language={language}
          />
        )}

        {activeTab === 'jobs' && (
          <HistoryView
            jobs={jobs}
            onViewReceipt={(j) => setSelectedReceiptJob(j)}
            onPurgeJob={async (jobId) => {
              await api.purgeJobFiles(jobId);
              setJobs(jobs.map(j => j.id === jobId ? { ...j, hasTemporaryFiles: false } : j));
            }}
            onQuickPrint={(j) => handleOpenPrint('', `${j.jobCode}_Print.pdf`)}
            language={language}
          />
        )}
      </main>

      {/* Quick Sale Logger Modal */}
      <QuickSaleModal
        isOpen={isQuickSaleOpen}
        onClose={() => setIsQuickSaleOpen(false)}
        onSaveSale={async (saleData, printReceipt) => {
          const newJob = await handleSaveSale(saleData);
          if (printReceipt && newJob) {
            setSelectedReceiptJob(newJob);
          }
        }}
        settings={settings}
        language={language}
        initialService={quickSaleInitialService}
      />

      {/* Print Dispatch Modal */}
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

      {/* Bill Receipt Modal */}
      <SimpleReceiptModal
        isOpen={selectedReceiptJob !== null}
        onClose={() => setSelectedReceiptJob(null)}
        job={selectedReceiptJob}
        settings={settings}
      />

      {/* AI Copilot Modal */}
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

