import React, { useState, useMemo } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Eye, 
  EyeOff,
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
  Lock,
  Unlock,
  Sliders
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
  currentOperator?: StaffMember;
  isPrivacyMasked: boolean;
  onTogglePrivacyMask: () => void;
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
  currentOperator,
  isPrivacyMasked,
  onTogglePrivacyMask,
  language
}) => {
  const [quickInput, setQuickInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'id' | 'photo' | 'govt'>('all');
  const t = translations[language];

  // Today's jobs only for sales calculations
  const todayDate = new Date().toISOString().split('T')[0];
  const todayJobs = useMemo(() => {
    return jobs.filter(j => j.createdAt && j.createdAt.split('T')[0] === todayDate);
  }, [jobs, todayDate]);

  // Today's Totals (Kept confidential from walk-in customers)
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

  // All 10 Services (Clicking directly opens that studio/tool; ZERO MRP displayed)
  const allServices = [
    {
      id: 'aadhaar',
      action: () => onNavigate('aadhaar'),
      title: t.toolAadhaarTitle,
      description: t.toolAadhaarDesc,
      category: 'id',
      badge: t.toolAadhaarBadge,
      badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
      image: '/tools/aadhaar.jpg'
    },
    {
      id: 'pan',
      action: () => onNavigate('aadhaar'),
      title: t.toolPanTitle,
      description: t.toolPanDesc,
      category: 'id',
      badge: t.toolPanBadge,
      badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      image: '/tools/pan.jpg'
    },
    {
      id: 'passport',
      action: () => onNavigate('photo'),
      title: t.toolPassportTitle,
      description: t.toolPassportDesc,
      category: 'photo',
      badge: t.toolPassportBadge,
      badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
      image: '/tools/passport.jpg'
    },
    {
      id: 'voter',
      action: () => onNavigate('aadhaar'),
      title: t.toolVoterTitle,
      description: t.toolVoterDesc,
      category: 'id',
      badge: t.toolVoterBadge,
      badgeColor: 'bg-sky-50 text-sky-700 border-sky-200',
      image: '/tools/voter.jpg'
    },
    {
      id: 'ayushman',
      action: () => onNavigate('aadhaar'),
      title: t.toolAyushmanTitle,
      description: t.toolAyushmanDesc,
      category: 'govt',
      badge: t.toolAyushmanBadge,
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      image: '/tools/ayushman.jpg'
    },
    {
      id: 'admit',
      action: () => onNavigate('pdf'),
      title: t.toolAdmitTitle,
      description: t.toolAdmitDesc,
      category: 'govt',
      badge: t.toolAdmitBadge,
      badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
      image: '/tools/admit_card.jpg'
    },
    {
      id: 'pdf',
      action: () => onNavigate('pdf'),
      title: t.toolPdfTitle,
      description: t.toolPdfDesc,
      category: 'photo',
      badge: t.toolPdfBadge,
      badgeColor: 'bg-rose-50 text-rose-700 border-rose-200',
      image: '/tools/pdf.svg'
    },
    {
      id: 'qr',
      action: () => onNavigate('qr'),
      title: t.toolQrTitle,
      description: t.toolQrDesc,
      category: 'photo',
      badge: t.toolQrBadge,
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      image: '/tools/mobile_qr.jpg'
    },
    {
      id: 'bill',
      action: () => onOpenQuickSale('Electricity Bill Payment'),
      title: t.toolBillTitle,
      description: t.toolBillDesc,
      category: 'govt',
      badge: t.toolBillBadge,
      badgeColor: 'bg-orange-50 text-orange-700 border-orange-200',
      image: '/tools/bill.svg'
    },
    {
      id: 'xerox',
      action: () => onOpenQuickSale('Photocopy (Xerox) & Lamination'),
      title: t.toolXeroxTitle,
      description: t.toolXeroxDesc,
      category: 'photo',
      badge: t.toolXeroxBadge,
      badgeColor: 'bg-teal-50 text-teal-700 border-teal-200',
      image: '/tools/xerox.svg'
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
    <div className="space-y-6 pb-16 animate-fadeIn max-w-7xl mx-auto">
      {/* 1. TOP HERO WORKSPACE: Welcoming & Operational (Safe when customer is looking) */}
      <section className="clean-card p-6 sm:p-7 bg-white relative overflow-hidden border border-slate-200/90 shadow-sm">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-blue-100/40 via-indigo-50/20 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Left Hero Content (7 Cols) */}
          <div className="lg:col-span-7 space-y-4">
            {/* Live Counter Badges */}
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
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#071A52] tracking-tight font-display leading-tight">
                {language === 'en'
                  ? `Welcome, ${currentOperator ? currentOperator.name : settings.ownerName}! 👋`
                  : language === 'hinglish'
                  ? `Namaste ${currentOperator ? currentOperator.name : settings.ownerName} Ji! 🙏`
                  : `नमस्ते ${currentOperator ? currentOperator.name : settings.ownerName} जी! 🙏`}
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl leading-relaxed">
                {language === 'en'
                  ? 'Select any counter service below to launch studio directly, or receive files from customer phone:'
                  : language === 'hinglish'
                  ? 'Niche se koi bhi counter service direct chalu karein, ya customer ke phone se file mangayein:'
                  : 'नीचे से कोई भी सेवा सीधे शुरू करें, या ग्राहक के फोन से फाइल प्राप्त करें:'}
              </p>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                onClick={() => onOpenQuickSale()}
                className="btn-green px-5 py-2.5 rounded-xl font-extrabold text-xs sm:text-sm flex items-center gap-2 shadow-md shadow-emerald-500/20 active:scale-95 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>{t.quickSaleBtn}</span>
              </button>

              <button
                onClick={() => onNavigate('qr')}
                className="btn-primary px-5 py-2.5 rounded-xl font-extrabold text-xs sm:text-sm flex items-center gap-2 shadow-md shadow-blue-500/20 active:scale-95 transition-all"
              >
                <QrCode className="w-4 h-4" />
                <span>{t.receiveFilesBtn}</span>
              </button>

              {/* Discreet Counter Screen Privacy Toggle */}
              <button
                onClick={onTogglePrivacyMask}
                className={`px-3.5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 border transition-all ${
                  isPrivacyMasked 
                    ? 'bg-amber-50 text-amber-800 border-amber-200' 
                    : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                }`}
                title={isPrivacyMasked ? t.privacyMaskOff : t.privacyMaskOn}
              >
                {isPrivacyMasked ? (
                  <>
                    <EyeOff className="w-3.5 h-3.5 text-amber-700" />
                    <span>{t.privacyMaskActive}</span>
                  </>
                ) : (
                  <>
                    <Eye className="w-3.5 h-3.5 text-slate-600" />
                    <span>{t.privacyMaskOn}</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right Hero Illustration (5 Cols) */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="w-full max-w-sm drop-shadow-md">
              <CounterHeroIllustration />
            </div>
          </div>
        </div>
      </section>

      {/* 2. OPERATIONAL SNAPSHOT TILES (Customer-Safe: NO sensitive financial numbers visible) */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Tile 1: Today's Orders / Services Processed (Safe to show) */}
        <div className="clean-card p-4 bg-white border border-slate-200 hover:shadow-sm transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
              {t.counterJobsProcessed}
            </span>
            <div className="w-7 h-7 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-[#071A52] font-display">
              {todayMetrics.count}
            </span>
            <span className="text-xs text-slate-500 font-medium">{language === 'en' ? 'Completed' : 'सफल'}</span>
          </div>
          <div className="mt-1 text-[11px] text-emerald-600 font-semibold">
            ● Counter Shift Active
          </div>
        </div>

        {/* Tile 2: Laser Printer Spooler Status */}
        <div className="clean-card p-4 bg-white border border-slate-200 hover:shadow-sm transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
              Laser Printer
            </span>
            <div className="w-7 h-7 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <Printer className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-1">
            <span className="text-base font-extrabold text-slate-900 font-display">
              HP LaserJet M404n
            </span>
          </div>
          <div className="mt-1 text-[11px] text-slate-500 flex justify-between">
            <span>Toner: <strong>84%</strong></span>
            <span>Tray: <strong>180 A4</strong></span>
          </div>
        </div>

        {/* Tile 3: Color Photo Ink Tank Status */}
        <div className="clean-card p-4 bg-white border border-slate-200 hover:shadow-sm transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
              Color Photo Desk
            </span>
            <div className="w-7 h-7 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-1">
            <span className="text-base font-extrabold text-slate-900 font-display">
              Canon G3010 Ink Tank
            </span>
          </div>
          <div className="mt-1 text-[11px] text-slate-500">
            CMYK Ink: <strong className="text-blue-600">85%+ Ready</strong>
          </div>
        </div>

        {/* Tile 4: Discreet Revenue Pill (CONFIDENTIAL: Masked by default for customer privacy) */}
        <div 
          onClick={onTogglePrivacyMask}
          className={`clean-card p-4 border transition-all cursor-pointer ${
            isPrivacyMasked 
              ? 'bg-slate-50/80 border-slate-200 hover:bg-slate-100' 
              : 'bg-emerald-50/60 border-emerald-200'
          }`}
          title="Click to toggle customer privacy mask"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
              {language === 'en' ? 'Confidential Sales' : 'काउंटर बिक्री'}
            </span>
            <div className="w-7 h-7 rounded-xl bg-slate-200/80 text-slate-700 flex items-center justify-center">
              {isPrivacyMasked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5 text-emerald-700" />}
            </div>
          </div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-[#071A52] font-display">
              {isPrivacyMasked ? '₹ ••••' : `₹${todayMetrics.total.toLocaleString('en-IN')}`}
            </span>
          </div>
          <div className="mt-1 text-[11px] text-blue-600 font-bold hover:underline">
            {language === 'en' ? 'Open Full Khata Ledger ➔' : 'विस्तृत खाता देखें ➔'}
          </div>
        </div>
      </section>

      {/* 3. ALL 10 COUNTER SERVICES: 1-Click Launch (NO FIXED MRP / NO INSPECT OVERLAY) */}
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

          {/* Search & Category Filter */}
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

        {/* 10 Services Grid (Direct 1-Click Launch) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {filteredServices.map((service) => (
            <div
              key={service.id}
              onClick={service.action}
              className="clean-card clean-card-hover p-4 flex flex-col justify-between group bg-white border border-slate-200/90 cursor-pointer transition-all hover:border-blue-300 active:scale-[0.99]"
            >
              <div>
                {/* Visual Image Thumbnail */}
                <div className="w-full h-32 rounded-xl bg-slate-100 overflow-hidden relative mb-3 border border-slate-100 flex items-center justify-center">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
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

              {/* Action Buttons: Direct 1-Click Start */}
              <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between gap-1.5">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    service.action();
                  }}
                  className="flex-1 py-1.5 px-2 rounded-xl bg-blue-50 group-hover:bg-blue-600 group-hover:text-white text-blue-700 font-extrabold text-[11px] flex items-center justify-center gap-1 transition-colors"
                >
                  <span>{t.startServiceBtn}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenQuickSale(service.title);
                  }}
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

      {/* 4. BOTTOM SPLIT: Customer Safe Activity Feed (8 Cols) + Mobile Drop Station (4 Cols) */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Activity Feed with Privacy Masking (8 Cols) */}
        <div className="lg:col-span-8 clean-card p-5 bg-white border border-slate-200 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
            <div>
              <h3 className="text-base font-extrabold text-[#071A52] font-display flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-600" />
                <span>{t.recentActivityHeading}</span>
              </h3>
              <p className="text-[11px] text-slate-500">
                {language === 'en'
                  ? 'Real-time record of all counter print and processing jobs today'
                  : 'आज काउंटर पर पूरे किए गए प्रिंट और सेवा रिकॉर्ड'}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onTogglePrivacyMask}
                className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 text-xs flex items-center gap-1"
                title={isPrivacyMasked ? t.privacyMaskOff : t.privacyMaskOn}
              >
                {isPrivacyMasked ? <EyeOff className="w-3.5 h-3.5 text-amber-600" /> : <Eye className="w-3.5 h-3.5" />}
                <span className="text-[11px] font-bold">{isPrivacyMasked ? 'Masked' : 'Visible'}</span>
              </button>

              <button
                onClick={() => onOpenQuickSale()}
                className="btn-green px-3.5 py-1.5 text-xs font-extrabold flex items-center gap-1 shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{t.quickSaleBtn}</span>
              </button>
            </div>
          </div>

          {/* Table */}
          {todayJobs.length === 0 ? (
            <div className="py-8 text-center space-y-3">
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
                          {isPrivacyMasked ? '₹ ••••' : `₹${job.totalAmount}`}
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

        {/* Right Column: Customer Mobile Drop Station & Privacy Assurance (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Quick File Transfer Desk Standee Card */}
          <div className="clean-card p-5 bg-gradient-to-br from-emerald-500/10 via-white to-blue-500/10 border border-emerald-200 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                <QrCode className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-[#071A52]">
                  {language === 'en' ? 'Direct Mobile File Drop' : 'मोबाइल फाइल ट्रांसफर'}
                </h4>
                <p className="text-[11px] text-slate-500">
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

          {/* Privacy & Zero Cloud Retention Card */}
          <div className="clean-card p-4 bg-slate-50 border border-slate-200 space-y-2 text-xs">
            <div className="flex items-center gap-2 font-extrabold text-slate-800">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>{t.privacyShield}</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              {language === 'en'
                ? 'All Aadhaar cards, photos, and certificates are processed strictly in browser memory. No permanent cloud storage.'
                : 'सभी दस्तावेज केवल अस्थायी रैम मेमोरी में प्रोसेस होते हैं और प्रिंट होते ही मिटा दिए जाते हैं।'}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
