import React, { useState } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Eye, 
  ShieldCheck, 
  Send,
  Search,
  Printer,
  CreditCard,
  FileCheck2
} from 'lucide-react';
import { Job, ShopSettings } from '../../types';
import { Language, translations } from '../../utils/i18n';

interface CounterHomeProps {
  settings: ShopSettings;
  jobs: Job[];
  onNavigate: (tab: string, state?: any) => void;
  onOpenCopilotWithQuery: (q: string) => void;
  onViewReceipt: (job: Job) => void;
  onPurgeJob: (jobId: string) => void;
  onQuickPrint: (job: Job) => void;
  language: Language;
}

export const CounterHome: React.FC<CounterHomeProps> = ({
  settings,
  jobs,
  onNavigate,
  onOpenCopilotWithQuery,
  onViewReceipt,
  onPurgeJob,
  onQuickPrint,
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

  // Full suite of 10 Counter Tools with realistic visual card imagery
  const tools = [
    {
      id: 'aadhaar',
      title: t.toolAadhaarTitle,
      desc: t.toolAadhaarDesc,
      image: '/tools/aadhaar.jpg',
      badge: '₹15 Print',
      badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
      category: 'id' as const,
      targetTab: 'aadhaar',
      tag: 'UIDAI',
      borderColor: 'hover:border-blue-500'
    },
    {
      id: 'pan',
      title: t.toolPanTitle,
      desc: t.toolPanDesc,
      image: '/tools/pan.jpg',
      badge: '₹20 PVC/A4',
      badgeColor: 'bg-sky-50 text-sky-700 border-sky-200',
      category: 'id' as const,
      targetTab: 'aadhaar',
      tag: 'Income Tax',
      borderColor: 'hover:border-sky-500'
    },
    {
      id: 'passport',
      title: t.toolPassportTitle,
      desc: t.toolPassportDesc,
      image: '/tools/passport.jpg',
      badge: '₹30 Sheet',
      badgeColor: 'bg-orange-50 text-orange-700 border-orange-200',
      category: 'photo' as const,
      targetTab: 'photo',
      tag: '8/16 Photos',
      borderColor: 'hover:border-orange-500'
    },
    {
      id: 'voter',
      title: t.toolVoterTitle,
      desc: t.toolVoterDesc,
      image: '/tools/voter.jpg',
      badge: '₹15 Print',
      badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      category: 'id' as const,
      targetTab: 'aadhaar',
      tag: 'Election Comm.',
      borderColor: 'hover:border-indigo-500'
    },
    {
      id: 'ayushman',
      title: t.toolAyushmanTitle,
      desc: t.toolAyushmanDesc,
      image: '/tools/ayushman.jpg',
      badge: '₹20 Golden',
      badgeColor: 'bg-amber-50 text-amber-800 border-amber-200',
      category: 'id' as const,
      targetTab: 'aadhaar',
      tag: 'PM-JAY 5 Lakh',
      borderColor: 'hover:border-amber-500'
    },
    {
      id: 'admit',
      title: t.toolAdmitTitle,
      desc: t.toolAdmitDesc,
      image: '/tools/admit_card.jpg',
      badge: '₹10 Print',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      category: 'govt' as const,
      targetTab: 'pdf',
      tag: 'Sarkari Exam',
      borderColor: 'hover:border-emerald-500'
    },
    {
      id: 'pdf',
      title: t.toolPdfTitle,
      desc: t.toolPdfDesc,
      image: '/tools/pdf.svg',
      badge: '< 500 KB',
      badgeColor: 'bg-rose-50 text-rose-700 border-rose-200',
      category: 'govt' as const,
      targetTab: 'pdf',
      tag: 'Merge & Fix',
      borderColor: 'hover:border-rose-500'
    },
    {
      id: 'qr',
      title: t.toolQrTitle,
      desc: t.toolQrDesc,
      image: '/tools/mobile_qr.jpg',
      badge: 'Free Standee',
      badgeColor: 'bg-teal-50 text-teal-700 border-teal-200',
      category: 'govt' as const,
      targetTab: 'qr',
      tag: 'No WhatsApp',
      borderColor: 'hover:border-teal-500'
    },
    {
      id: 'bill',
      title: t.toolBillTitle,
      desc: t.toolBillDesc,
      image: '/tools/bill.svg',
      badge: '₹10 Receipt',
      badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
      category: 'govt' as const,
      targetTab: 'rates',
      tag: 'Bijli / Power',
      borderColor: 'hover:border-amber-500'
    },
    {
      id: 'xerox',
      title: t.toolXeroxTitle,
      desc: t.toolXeroxDesc,
      image: '/tools/xerox.svg',
      badge: '₹3 - ₹20',
      badgeColor: 'bg-slate-100 text-slate-800 border-slate-300',
      category: 'photo' as const,
      targetTab: 'rates',
      tag: 'Xerox & Pouch',
      borderColor: 'hover:border-slate-500'
    }
  ];

  // Filtering based on search and category
  const filteredTools = tools.filter((tool) => {
    const matchesCategory = selectedCategory === 'all' || tool.category === selectedCategory;
    const matchesQuery = 
      searchQuery.trim() === '' ||
      tool.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.tag.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  return (
    <div className="space-y-6 pb-12 animate-fadeIn max-w-7xl mx-auto">
      {/* Friendly Counter Welcome & AI Voice Bar */}
      <div className="clean-card p-5 sm:p-6 bg-gradient-to-r from-blue-50/80 via-white to-orange-50/80 border border-blue-100 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#071A52] tracking-tight">
            {t.greeting}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            {t.subtitle}
          </p>
        </div>

        {/* AI Voice / Command Bar */}
        <div className="w-full md:w-auto flex-1 max-w-md flex items-center gap-2 bg-white p-1.5 rounded-2xl border border-slate-300 shadow-sm focus-within:border-[#155EEF]">
          <Sparkles className="w-4 h-4 text-amber-500 ml-2" />
          <input
            type="text"
            value={quickInput}
            onChange={(e) => setQuickInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleVoiceAssistantRun()}
            placeholder={t.aiPlaceholder}
            className="flex-1 text-xs font-medium text-slate-900 outline-none px-2 py-1 placeholder:text-slate-400"
          />
          <button
            onClick={() => handleVoiceAssistantRun()}
            className="btn-primary px-3 py-1.5 text-xs font-bold flex items-center gap-1"
          >
            <span>{t.run}</span>
            <Send className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* TOOLS SECTION HEADER WITH CATEGORY TABS & SEARCH */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-lg sm:text-xl font-extrabold text-[#071A52] flex items-center gap-2">
              <span>{t.allToolsHeading}</span>
              <span className="text-xs bg-blue-100 text-[#155EEF] font-extrabold px-2.5 py-0.5 rounded-full">
                {filteredTools.length} टूल्स
              </span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {t.allToolsSub}
            </p>
          </div>

          {/* Quick Real-Time Search Bar */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.searchToolsPlaceholder}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#155EEF] shadow-xs"
            />
          </div>
        </div>

        {/* Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              selectedCategory === 'all'
                ? 'bg-[#071A52] text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            🌟 {t.filterAll}
          </button>
          <button
            onClick={() => setSelectedCategory('id')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              selectedCategory === 'id'
                ? 'bg-[#155EEF] text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            🪪 {t.filterId}
          </button>
          <button
            onClick={() => setSelectedCategory('photo')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              selectedCategory === 'photo'
                ? 'bg-[#FF6B00] text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            📸 {t.filterPhoto}
          </button>
          <button
            onClick={() => setSelectedCategory('govt')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              selectedCategory === 'govt'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            🏛️ {t.filterGovt}
          </button>
        </div>
      </div>

      {/* 10 VISUAL TOOL BOXES WITH REAL CARD IMAGES AS ICONS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 sm:gap-4">
        {filteredTools.map((tool) => (
          <div
            key={tool.id}
            onClick={() => onNavigate(tool.targetTab)}
            className={`clean-card p-3 sm:p-4 clean-card-hover cursor-pointer flex flex-col justify-between group border-2 border-slate-200/90 ${tool.borderColor} transition-all duration-200 bg-white`}
          >
            <div>
              {/* Tool Related Visual Image as Icon Badge */}
              <div className="relative w-full aspect-square max-h-32 sm:max-h-36 rounded-2xl bg-gradient-to-b from-slate-50 to-slate-100 p-2 flex items-center justify-center overflow-hidden border border-slate-200/80 shadow-inner mb-3 group-hover:scale-[1.04] transition-transform duration-200">
                <img
                  src={tool.image}
                  alt={tool.title}
                  className="w-full h-full object-contain drop-shadow-md rounded-xl"
                  loading="lazy"
                />
                <span className={`absolute top-1.5 right-1.5 text-[9px] sm:text-[10px] font-extrabold px-1.5 py-0.5 rounded-md border shadow-xs ${tool.badgeColor}`}>
                  {tool.badge}
                </span>
                <span className="absolute bottom-1.5 left-1.5 text-[9px] font-bold text-slate-500 bg-white/90 backdrop-blur-xs px-1.5 py-0.5 rounded border border-slate-100">
                  {tool.tag}
                </span>
              </div>

              {/* Title & Description */}
              <h3 className="text-xs sm:text-sm font-extrabold text-[#071A52] tracking-tight group-hover:text-[#155EEF] transition-colors leading-snug">
                {tool.title}
              </h3>
              <p className="text-[10px] sm:text-[11px] text-slate-500 mt-1 leading-relaxed line-clamp-2">
                {tool.desc}
              </p>
            </div>

            {/* Bottom Action Strip */}
            <div className="pt-2.5 mt-2.5 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400">
                1-क्लिक
              </span>
              <span className="text-[11px] font-extrabold text-[#155EEF] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                <span>{t.startServiceBtn}</span>
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* TODAY'S COUNTER JOBS TABLE */}
      <div className="clean-card p-5 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div>
            <h3 className="text-base font-extrabold text-[#071A52] flex items-center gap-2">
              <span>{t.jobsHeading}</span>
              <span className="text-xs bg-slate-100 text-slate-700 font-bold px-2 py-0.5 rounded-full">
                {jobs.length} {t.jobsDone}
              </span>
            </h3>
            <p className="text-xs text-slate-500">
              {t.jobsSub}
            </p>
          </div>
          <button
            onClick={() => onNavigate('jobs')}
            className="text-xs font-extrabold text-[#155EEF] hover:underline"
          >
            {t.viewAllJobs} ({jobs.length}) →
          </button>
        </div>

        {/* Clean Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">{t.colJobId}</th>
                <th className="py-3 px-4">{t.colCustomer}</th>
                <th className="py-3 px-4">{t.colService}</th>
                <th className="py-3 px-4">{t.colAmount}</th>
                <th className="py-3 px-4">{t.colStatus}</th>
                <th className="py-3 px-4 text-right">{t.colActions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {jobs.slice(0, 5).map((job) => (
                <tr key={job.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-[#071A52]">
                    {job.jobCode}
                  </td>
                  <td className="py-3 px-4 font-bold text-slate-900">
                    {job.customerName}
                  </td>
                  <td className="py-3 px-4 text-slate-700 font-medium">
                    {job.services.map(s => s.name).join(', ')}
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-extrabold text-[#071A52]">₹{job.totalAmount}</span>
                    <span className="text-[10px] text-slate-500 ml-1">({job.paymentMode})</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      job.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-700' : 'bg-blue-50 text-blue-700'
                    }`}>
                      <CheckCircle2 className="w-3 h-3" />
                      <span>{job.status === 'COMPLETED' ? t.statusPrinted : job.status}</span>
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onViewReceipt(job)}
                        className="px-2.5 py-1 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-[11px] flex items-center gap-1"
                        title={t.btnReceipt}
                      >
                        <Eye className="w-3 h-3 text-slate-500" />
                        <span>{t.btnReceipt}</span>
                      </button>

                      <button
                        onClick={() => onQuickPrint(job)}
                        className="px-2.5 py-1 rounded-lg bg-blue-50 text-[#155EEF] hover:bg-blue-100 font-bold text-[11px] flex items-center gap-1"
                        title={t.btnPrint}
                      >
                        <Printer className="w-3 h-3" />
                        <span>{t.btnPrint}</span>
                      </button>

                      {job.hasTemporaryFiles && (
                        <button
                          onClick={() => onPurgeJob(job.id)}
                          className="px-2 py-1 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold text-[10px] flex items-center gap-1"
                          title={t.btnPurge}
                        >
                          <ShieldCheck className="w-3 h-3" />
                          <span>{t.btnPurge}</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
