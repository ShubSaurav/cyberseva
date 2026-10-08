import React, { useState, useMemo } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Eye, 
  Search, 
  Plus, 
  TrendingUp, 
  CreditCard, 
  Banknote, 
  Clock, 
  QrCode, 
  User, 
  Trash2, 
  HelpCircle, 
  FileText,
  Printer,
  ShieldCheck,
  Zap,
  Layers,
  Sliders,
  Maximize2
} from 'lucide-react';
import { Job, ShopSettings, StaffMember } from '../../types';
import { Language, translations } from '../../utils/i18n';
import { CounterHeroIllustration, EmptyKhataIllustration } from '../common/Illustrations';

interface CounterHomeProps {
  settings: ShopSettings;
  jobs: Job[];
  onNavigate: (tab: string, state?: any) => void;
  onOpenCopilotWithQuery: (q: string) => void;
  onViewReceipt: (job: Job) => void;
  onOpenQuickSale: (serviceName?: string) => void;
  onDeleteJob: (jobId: string) => void;
  onInspectImage?: (imageUrl: string, title: string, subtitle?: string) => void;
  currentOperator?: StaffMember;
  language: Language;
}

export const CounterHome: React.FC<CounterHomeProps> = ({
  settings,
  jobs,
  onNavigate,
  onOpenCopilotWithQuery,
  onViewReceipt,
  onOpenQuickSale,
  onDeleteJob,
  onInspectImage,
  currentOperator,
  language
}) => {
  const [quickInput, setQuickInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'id' | 'photo' | 'govt'>('all');
  const t = translations[language];

  const handleVoiceAssistantRun = (query?: string) => {
    const q = query || quickInput;
    if (q.trim()) {
      onOpenCopilotWithQuery(q);
      setQuickInput('');
    }
  };

  // Today's jobs only for sales calculations
  const todayDate = new Date().toISOString().split('T')[0];
  const todayJobs = useMemo(() => {
    return jobs.filter(j => j.createdAt && j.createdAt.split('T')[0] === todayDate);
  }, [jobs, todayDate]);

  // Today's Totals
  const todayMetrics = useMemo(() => {
    const total = todayJobs
      .filter(j => j.paymentStatus === 'PAID')
      .reduce((sum, j) => sum + (j.totalAmount || 0), 0);

    const cash = todayJobs
      .filter(j => j.paymentMode === 'CASH' && j.paymentStatus === 'PAID')
      .reduce((sum, j) => sum + (j.totalAmount || 0), 0);

    const upi = todayJobs
      .filter(j => j.paymentMode === 'UPI_QR' && j.paymentStatus === 'PAID')
      .reduce((sum, j) => sum + (j.totalAmount || 0), 0);

    const pending = todayJobs
      .filter(j => j.paymentStatus === 'PENDING' || j.paymentMode === 'PENDING')
      .reduce((sum, j) => sum + (j.totalAmount || 0), 0);

    return { total, cash, upi, pending, count: todayJobs.length };
  }, [todayJobs]);

  // All 10 Services (Strictly NO FIXED RATES / NO MRP)
  const allServices = [
    {
      id: 'aadhaar',
      tab: 'aadhaar',
      title: t.toolAadhaarTitle,
      description: t.toolAadhaarDesc,
      category: 'id',
      badge: t.toolAadhaarBadge,
      badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
      image: '/tools/aadhaar.jpg',
      previewTitle: 'Aadhaar Smart Card Layout'
    },
    {
      id: 'pan',
      tab: 'aadhaar',
      title: t.toolPanTitle,
      description: t.toolPanDesc,
      category: 'id',
      badge: t.toolPanBadge,
      badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      image: '/tools/pan.jpg',
      previewTitle: 'PAN Card PVC Layout'
    },
    {
      id: 'passport',
      tab: 'photo',
      title: t.toolPassportTitle,
      description: t.toolPassportDesc,
      category: 'photo',
      badge: t.toolPassportBadge,
      badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
      image: '/tools/passport.jpg',
      previewTitle: '8/16 Photos Glossy Sheet'
    },
    {
      id: 'voter',
      tab: 'aadhaar',
      title: t.toolVoterTitle,
      description: t.toolVoterDesc,
      category: 'id',
      badge: t.toolVoterBadge,
      badgeColor: 'bg-sky-50 text-sky-700 border-sky-200',
      image: '/tools/voter.jpg',
      previewTitle: 'Voter ID (EPIC) Card'
    },
    {
      id: 'ayushman',
      tab: 'aadhaar',
      title: t.toolAyushmanTitle,
      description: t.toolAyushmanDesc,
      category: 'govt',
      badge: t.toolAyushmanBadge,
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      image: '/tools/ayushman.jpg',
      previewTitle: 'Ayushman PM-JAY Golden Card'
    },
    {
      id: 'admit',
      tab: 'pdf',
      title: t.toolAdmitTitle,
      description: t.toolAdmitDesc,
      category: 'govt',
      badge: t.toolAdmitBadge,
      badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
      image: '/tools/admit_card.jpg',
      previewTitle: 'Govt Exam Admit Card'
    },
    {
      id: 'pdf',
      tab: 'pdf',
      title: t.toolPdfTitle,
      description: t.toolPdfDesc,
      category: 'photo',
      badge: t.toolPdfBadge,
      badgeColor: 'bg-rose-50 text-rose-700 border-rose-200',
      image: '/tools/pdf.svg',
      previewTitle: 'PDF Tools & Govt 500KB Compressor'
    },
    {
      id: 'qr',
      tab: 'qr',
      title: t.toolQrTitle,
      description: t.toolQrDesc,
      category: 'photo',
      badge: t.toolQrBadge,
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      image: '/tools/mobile_qr.jpg',
      previewTitle: 'Customer Direct Mobile QR Transfer'
    },
    {
      id: 'bill',
      tab: 'counter',
      isQuickSaleOnly: true,
      serviceName: 'Electricity Bill Payment',
      title: t.toolBillTitle,
      description: t.toolBillDesc,
      category: 'govt',
      badge: t.toolBillBadge,
      badgeColor: 'bg-orange-50 text-orange-700 border-orange-200',
      image: '/tools/bill.svg',
      previewTitle: 'Electricity & Utility Bill Receipt'
    },
    {
      id: 'xerox',
      tab: 'counter',
      isQuickSaleOnly: true,
      serviceName: 'Xerox & Lamination',
      title: t.toolXeroxTitle,
      description: t.toolXeroxDesc,
      category: 'photo',
      badge: t.toolXeroxBadge,
      badgeColor: 'bg-teal-50 text-teal-700 border-teal-200',
      image: '/tools/xerox.svg',
      previewTitle: 'Photocopy & Thermal Lamination'
    }
  ];

  // Filtered Services
  const filteredServices = useMemo(() => {
    return allServices.filter((s) => {
      const matchesCat = selectedCategory === 'all' || s.category === selectedCategory;
      const matchesQuery = s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           s.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCat && matchesQuery;
    });
  }, [allServices, selectedCategory, searchQuery]);

  return (
    <div className="space-y-7 pb-16 animate-fadeIn max-w-7xl mx-auto">
      {/* 1. TOP HERO SECTION: Brand Greeting + Quick Action Strip + Hero Illustration */}
      <section className="clean-card p-6 sm:p-8 bg-white relative overflow-hidden border border-slate-200/90 shadow-sm">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-blue-100/50 via-indigo-50/20 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Hero Content (7 Cols) */}
          <div className="lg:col-span-7 space-y-4">
            {/* Live Counter Badge */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-extrabold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                {t.counterActive} • {currentOperator ? currentOperator.name : settings.ownerName}
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>UIDAI & CSC Ready</span>
              </span>
            </div>

            {/* Main Greeting */}
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#071A52] tracking-tight font-display leading-tight">
                {language === 'en'
                  ? `Welcome, ${currentOperator ? currentOperator.name : settings.ownerName}! 👋`
                  : language === 'hinglish'
                  ? `Namaste ${currentOperator ? currentOperator.name : settings.ownerName} Ji! 🙏`
                  : `नमस्ते ${currentOperator ? currentOperator.name : settings.ownerName} जी! 🙏`}
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl leading-relaxed">
                {t.subtitle}
              </p>
            </div>

            {/* Quick Action Buttons (Big & Tactile) */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => onOpenQuickSale()}
                className="btn-green px-5 py-3 rounded-2xl font-extrabold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>{t.quickSaleBtn}</span>
              </button>

              <button
                onClick={() => onNavigate('qr')}
                className="btn-primary px-5 py-3 rounded-2xl font-extrabold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-blue-500/20 active:scale-95 transition-all"
              >
                <QrCode className="w-4 h-4" />
                <span>{t.receiveFilesBtn}</span>
              </button>

              <button
                onClick={() => onOpenCopilotWithQuery('Help with Aadhaar front back layout')}
                className="px-4 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs flex items-center gap-1.5 border border-slate-200 transition-colors"
              >
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>AI Copilot</span>
              </button>
            </div>

            {/* Notice: No fixed MRP */}
            <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-2xl text-[11px] text-amber-900 flex items-center gap-2">
              <span className="text-sm">💡</span>
              <span className="font-semibold">{t.noFixedRateNotice}</span>
            </div>
          </div>

          {/* Right Hero Illustration (5 Cols) */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="w-full max-w-md drop-shadow-xl hover:scale-[1.02] transition-transform duration-300">
              <CounterHeroIllustration />
            </div>
          </div>
        </div>
      </section>

      {/* 2. TODAY'S SALES & CASHFLOW BENTO TILES (Real-time Financial Snapshot) */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-600" />
            <h2 className="text-base sm:text-lg font-extrabold text-[#071A52] font-display">
              {t.todaySalesHeading}
            </h2>
          </div>
          <button
            onClick={() => onNavigate('sales')}
            className="text-xs font-extrabold text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-1"
          >
            <span>{t.viewDetailedReport}</span>
          </button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Total Today Income */}
          <div className="clean-card p-5 bg-gradient-to-br from-white to-emerald-50/40 border-2 border-emerald-200/80 hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                {t.todayTotal}
              </span>
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                ₹
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-[#071A52] font-display tracking-tight">
                ₹{todayMetrics.total.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="mt-2 text-[11px] font-bold text-emerald-700 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{todayMetrics.count} {language === 'en' ? 'Completed Orders' : 'सेवाएं पूरी'}</span>
            </div>
          </div>

          {/* Card 2: Cash in Hand */}
          <div className="clean-card p-5 hover:shadow-md transition-all bg-white border border-slate-200">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                {t.cashCollected}
              </span>
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Banknote className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display tracking-tight">
                ₹{todayMetrics.cash.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="mt-2 text-[11px] font-medium text-slate-500">
              {language === 'en' ? 'Physical counter cash' : 'काउंटर गल्ला कैश'}
            </div>
          </div>

          {/* Card 3: UPI / QR Received */}
          <div className="clean-card p-5 hover:shadow-md transition-all bg-white border border-slate-200">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                {t.upiReceived}
              </span>
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <CreditCard className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-blue-700 font-display tracking-tight">
                ₹{todayMetrics.upi.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="mt-2 text-[11px] font-medium text-slate-500">
              {language === 'en' ? 'Online QR / Bank' : 'सीधे बैंक / UPI'}
            </div>
          </div>

          {/* Card 4: Pending / Due (Udhar) */}
          <div className="clean-card p-5 hover:shadow-md transition-all bg-white border border-slate-200">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                {t.pendingUdhar}
              </span>
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-amber-600 font-display tracking-tight">
                ₹{todayMetrics.pending.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="mt-2 text-[11px] font-medium text-amber-700">
              {todayMetrics.pending > 0 
                ? (language === 'en' ? 'Pending settlement' : 'लेना बाकी है') 
                : (language === 'en' ? 'All dues cleared' : 'सब चुकता')}
            </div>
          </div>
        </div>
      </section>

      {/* 3. ALL COUNTER TOOLS SECTION: Clean Bento Grid with Real Imagery (NO FIXED MRP) */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg sm:text-xl font-extrabold text-[#071A52] font-display flex items-center gap-2">
              <Layers className="w-5 h-5 text-blue-600" />
              <span>{t.allToolsHeading}</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {t.allToolsSub}
            </p>
          </div>

          {/* Search & Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.searchToolsPlaceholder}
                className="pl-8 pr-3 py-1.5 text-xs font-semibold bg-white border border-slate-200 rounded-xl focus:border-blue-500 outline-none w-48 sm:w-60 shadow-xs"
              />
            </div>

            <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200 text-xs font-bold">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  selectedCategory === 'all' ? 'bg-white text-blue-600 shadow-xs font-extrabold' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {t.filterAll}
              </button>
              <button
                onClick={() => setSelectedCategory('id')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  selectedCategory === 'id' ? 'bg-white text-blue-600 shadow-xs font-extrabold' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {t.filterId}
              </button>
              <button
                onClick={() => setSelectedCategory('photo')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  selectedCategory === 'photo' ? 'bg-white text-blue-600 shadow-xs font-extrabold' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {t.filterPhoto}
              </button>
              <button
                onClick={() => setSelectedCategory('govt')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  selectedCategory === 'govt' ? 'bg-white text-blue-600 shadow-xs font-extrabold' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {t.filterGovt}
              </button>
            </div>
          </div>
        </div>

        {/* 10 Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {filteredServices.map((service) => (
            <div
              key={service.id}
              className="clean-card clean-card-hover p-4 flex flex-col justify-between group bg-white border border-slate-200/90 relative overflow-hidden"
            >
              <div>
                {/* Visual Image Thumbnail Container */}
                <div 
                  className="w-full h-32 rounded-xl bg-slate-100 overflow-hidden relative mb-3 border border-slate-100 flex items-center justify-center cursor-pointer group-hover:border-blue-200 transition-colors"
                  onClick={() => {
                    if (onInspectImage && service.image) {
                      onInspectImage(service.image, service.title, service.previewTitle);
                    } else if (service.isQuickSaleOnly) {
                      onOpenQuickSale(service.serviceName);
                    } else {
                      onNavigate(service.tab);
                    }
                  }}
                >
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {/* Hover Inspect Icon */}
                  <div className="absolute inset-0 bg-slate-950/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <span className="p-2 rounded-xl bg-white/90 text-slate-800 text-xs font-extrabold shadow-md flex items-center gap-1">
                      <Maximize2 className="w-3.5 h-3.5" />
                      <span>{language === 'en' ? 'Inspect' : 'देखें'}</span>
                    </span>
                  </div>
                </div>

                {/* Badge Tag (Operational only, ZERO MRP) */}
                <span className={`inline-block text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border mb-2 ${service.badgeColor}`}>
                  {service.badge}
                </span>

                {/* Service Title */}
                <h3 className="font-extrabold text-sm text-[#071A52] font-display group-hover:text-blue-600 transition-colors">
                  {service.title}
                </h3>

                {/* Subtitle */}
                <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-snug">
                  {service.description}
                </p>
              </div>

              {/* Bottom Actions: Start Service & Quick Log */}
              <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between gap-1.5">
                <button
                  onClick={() => {
                    if (service.isQuickSaleOnly) {
                      onOpenQuickSale(service.serviceName);
                    } else {
                      onNavigate(service.tab);
                    }
                  }}
                  className="flex-1 py-1.5 px-2 rounded-xl bg-slate-50 hover:bg-blue-50 text-blue-700 font-extrabold text-[11px] flex items-center justify-center gap-1 transition-colors border border-slate-200 group-hover:border-blue-300"
                >
                  <span>{t.startServiceBtn}</span>
                </button>

                <button
                  onClick={() => onOpenQuickSale(service.title)}
                  className="p-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-[11px] transition-colors border border-emerald-200"
                  title="Quick Log Sale"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. BOTTOM SPLIT: Live Sales Ledger (8 Cols) + Printer & Desk Hub (4 Cols) */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Live Sales Ledger (8 Cols) */}
        <div className="lg:col-span-8 clean-card p-5 bg-white border border-slate-200 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
            <div>
              <h3 className="text-base font-extrabold text-[#071A52] font-display flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-600" />
                <span>{t.recentActivityHeading}</span>
              </h3>
              <p className="text-[11px] text-slate-500">
                {t.recentActivitySub}
              </p>
            </div>

            <button
              onClick={() => onOpenQuickSale()}
              className="btn-green px-3.5 py-1.5 text-xs font-extrabold flex items-center gap-1 self-start sm:self-auto shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{t.quickSaleBtn}</span>
            </button>
          </div>

          {/* Table */}
          {todayJobs.length === 0 ? (
            <div className="py-10 text-center space-y-3">
              <EmptyKhataIllustration />
              <p className="text-xs font-bold text-slate-600">
                {t.noSalesToday}
              </p>
              <button
                onClick={() => onOpenQuickSale()}
                className="btn-primary px-4 py-2 text-xs font-extrabold inline-flex items-center gap-1.5 shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{t.logSaleBtn}</span>
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">{t.colTime}</th>
                    <th className="py-2.5 px-3">{t.colJobId}</th>
                    <th className="py-2.5 px-3">{t.colCustomer}</th>
                    <th className="py-2.5 px-3">{t.colService}</th>
                    <th className="py-2.5 px-3">{t.colAmount}</th>
                    <th className="py-2.5 px-3">{t.colPayment}</th>
                    <th className="py-2.5 px-3">{t.colStaff}</th>
                    <th className="py-2.5 px-3 text-right">{t.colActions}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {todayJobs.map((job) => {
                    const timeStr = job.createdAt 
                      ? new Date(job.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
                      : '--:--';
                    return (
                      <tr key={job.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3 px-3 text-slate-500 font-mono text-[11px]">{timeStr}</td>
                        <td className="py-3 px-3 font-mono font-bold text-blue-600">{job.jobCode}</td>
                        <td className="py-3 px-3 font-bold text-slate-800">
                          {job.customerName || (language === 'en' ? 'Walk-in' : 'ग्राहक')}
                        </td>
                        <td className="py-3 px-3 text-slate-600 font-medium">
                          {job.services.map(s => `${s.name} (x${s.quantity})`).join(', ')}
                        </td>
                        <td className="py-3 px-3 font-extrabold text-[#071A52] font-display text-sm">
                          ₹{job.totalAmount}
                        </td>
                        <td className="py-3 px-3">
                          <span className={`inline-flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                            job.paymentMode === 'CASH'
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              : job.paymentMode === 'PENDING'
                              ? 'bg-amber-50 text-amber-800 border border-amber-200'
                              : 'bg-blue-50 text-blue-800 border border-blue-200'
                          }`}>
                            {job.paymentMode === 'CASH' ? 'Cash' : job.paymentMode === 'PENDING' ? 'Pending' : 'UPI QR'}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-[11px] text-slate-500">
                          {job.operator || settings.ownerName}
                        </td>
                        <td className="py-3 px-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => onViewReceipt(job)}
                              className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600"
                              title={t.btnReceipt}
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => onDeleteJob(job.id)}
                              className="p-1.5 rounded-lg border border-rose-200 hover:bg-rose-50 text-rose-600"
                              title={t.btnDelete}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Right Column: Printer Hardware & Quick Hub (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Printer Live Spooler Status */}
          <div className="clean-card p-5 bg-white border border-slate-200 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-xs font-extrabold text-[#071A52] flex items-center gap-1.5">
                <Printer className="w-4 h-4 text-blue-600" />
                <span>Counter Printers (Live)</span>
              </span>
              <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                Spooler Online
              </span>
            </div>

            {/* HP LaserJet Status */}
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                <span>HP LaserJet Pro M404n</span>
                <span className="text-emerald-700 font-extrabold">Ready</span>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] text-slate-500 font-medium">
                  <span>Black Toner:</span>
                  <span className="font-bold text-slate-800">84%</span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div className="bg-slate-800 h-full rounded-full" style={{ width: '84%' }} />
                </div>
              </div>
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>A4 Paper Tray: 180 sheets</span>
                <span>Fast B&W Desk</span>
              </div>
            </div>

            {/* Canon Color Ink Tank Status */}
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                <span>Canon PIXMA G3010 Ink Tank</span>
                <span className="text-blue-700 font-extrabold">WiFi Active</span>
              </div>
              <div className="grid grid-cols-4 gap-1 text-center">
                <div className="p-1 rounded bg-slate-800 text-white text-[9px] font-bold">BK 92%</div>
                <div className="p-1 rounded bg-cyan-500 text-white text-[9px] font-bold">C 88%</div>
                <div className="p-1 rounded bg-fuchsia-500 text-white text-[9px] font-bold">M 82%</div>
                <div className="p-1 rounded bg-yellow-400 text-slate-900 text-[9px] font-bold">Y 85%</div>
              </div>
            </div>
          </div>

          {/* Quick File Transfer Desk Standee Card */}
          <div className="clean-card p-5 bg-gradient-to-br from-emerald-500/10 via-white to-blue-500/10 border border-emerald-200 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                <QrCode className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-extrabold text-xs text-[#071A52]">
                  {language === 'en' ? 'Direct Mobile File Drop' : 'मोबाइल फाइल ड्रॉप'}
                </h4>
                <p className="text-[10px] text-slate-500">
                  {language === 'en' ? 'Customer scans & sends without WhatsApp' : 'बिना व्हाट्सएप कस्टमर से सीधे फाइल लें'}
                </p>
              </div>
            </div>

            <button
              onClick={() => onNavigate('qr')}
              className="w-full btn-green py-2.5 text-xs font-extrabold flex items-center justify-center gap-1.5 shadow-sm"
            >
              <span>{language === 'en' ? 'Open Customer QR Standee ➔' : 'कस्टमर QR स्टैंडी खोलें ➔'}</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
