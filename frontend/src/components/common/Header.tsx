import React from 'react';
import { 
  Sparkles, 
  HelpCircle,
  ShieldCheck, 
  IndianRupee,
  LayoutGrid,
  FileText,
  Camera,
  FileStack,
  TrendingUp,
  Settings,
  QrCode,
  Plus,
  LogOut,
  UserCheck
} from 'lucide-react';
import { ShopSettings, Printer as PrinterType, StaffMember } from '../../types';
import { Language, FontSize, translations } from '../../utils/i18n';

interface HeaderProps {
  settings: ShopSettings;
  printers: PrinterType[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenCopilot: () => void;
  onOpenHelp: () => void;
  onOpenQuickSale: () => void;
  todayRevenue: number;
  language: Language;
  setLanguage: (lang: Language) => void;
  fontSize: FontSize;
  setFontSize: (size: FontSize) => void;
  currentOperator?: StaffMember;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  settings,
  printers,
  activeTab,
  setActiveTab,
  onOpenCopilot,
  onOpenHelp,
  onOpenQuickSale,
  todayRevenue,
  language,
  setLanguage,
  fontSize,
  setFontSize,
  currentOperator,
  onLogout
}) => {
  const t = translations[language];

  const tabs = [
    { id: 'counter', label: t.tabCounter, sub: t.tabCounterSub, icon: LayoutGrid },
    { id: 'qr', label: t.tabReceiveFiles, sub: t.tabReceiveFilesSub, icon: QrCode },
    { id: 'aadhaar', label: t.tabAadhaar, sub: t.tabAadhaarSub, icon: FileText },
    { id: 'photo', label: t.tabPhoto, sub: t.tabPhotoSub, icon: Camera },
    { id: 'pdf', label: t.tabPdf, sub: t.tabPdfSub, icon: FileStack },
    { id: 'sales', label: t.tabSales, sub: t.tabSalesSub, icon: TrendingUp },
    { id: 'settings', label: t.tabSettings, sub: t.tabSettingsSub, icon: Settings },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm no-print">
      {/* Top Bar: Brand, Shop, Font Controls, Language Switcher, Quick Sale, Cash, Copilot */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3">
        {/* Brand & Shop Title */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('counter')}>
          <img
            src="/cybersevalogo2.png"
            alt="CyberSeva"
            className="h-9 sm:h-10 w-auto object-contain"
          />
          <div className="hidden sm:block border-l border-slate-200 pl-3">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm text-[#071A52] tracking-tight">
                {settings.shopName}
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                {t.counterActive}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>{t.privacyShield}</span>
            </p>
          </div>
        </div>

        {/* Controls: Font Size, Language Switcher, Quick Sale, Cash, Copilot */}
        <div className="flex items-center flex-wrap gap-2 sm:gap-2.5">
          {/* FONT SIZE CONTROLLER (Small, Med, Large) */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200 text-xs" title="Font Size">
            <button
              onClick={() => setFontSize('sm')}
              className={`px-2 py-1 rounded-lg font-bold transition-all ${
                fontSize === 'sm' ? 'bg-white text-[#155EEF] shadow-sm' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              A-
            </button>
            <button
              onClick={() => setFontSize('md')}
              className={`px-2 py-1 rounded-lg font-bold transition-all ${
                fontSize === 'md' ? 'bg-white text-[#155EEF] shadow-sm' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              A
            </button>
            <button
              onClick={() => setFontSize('lg')}
              className={`px-2 py-1 rounded-lg font-bold transition-all text-sm ${
                fontSize === 'lg' ? 'bg-white text-[#155EEF] shadow-sm font-extrabold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              A+
            </button>
          </div>

          {/* LANGUAGE SWITCHER (English, Hinglish, हिन्दी) */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200 text-xs font-bold" title="Language Switcher">
            <button
              onClick={() => setLanguage('en')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                language === 'en' ? 'bg-white text-[#155EEF] shadow-sm font-extrabold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              English
            </button>
            <button
              onClick={() => setLanguage('hinglish')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                language === 'hinglish' ? 'bg-white text-[#155EEF] shadow-sm font-extrabold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Hinglish
            </button>
            <button
              onClick={() => setLanguage('hi')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                language === 'hi' ? 'bg-white text-[#155EEF] shadow-sm font-extrabold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              हिन्दी
            </button>
          </div>

          {/* QUICK SALE BUTTON */}
          <button
            onClick={onOpenQuickSale}
            className="btn-green flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-extrabold text-xs shadow-xs"
            title="Log Sale"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{t.quickSaleBtn}</span>
          </button>

          {/* HELP BUTTON */}
          <button
            onClick={onOpenHelp}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs border border-slate-200 transition-colors"
            title={t.help}
          >
            <HelpCircle className="w-4 h-4 text-[#155EEF]" />
            <span className="hidden sm:inline">{t.help}</span>
          </button>

          {/* Today's Sales Badge */}
          <div 
            onClick={() => setActiveTab('sales')}
            className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 cursor-pointer hover:bg-emerald-100 transition-colors"
          >
            <IndianRupee className="w-4 h-4 text-emerald-600" />
            <div>
              <span className="text-[9px] uppercase font-bold text-emerald-700 block leading-none">{t.todayEarnings}</span>
              <span className="font-extrabold text-xs text-emerald-800">₹{todayRevenue.toLocaleString('en-IN')}</span>
            </div>
          </div>

          {/* AI Copilot Button */}
          <button
            onClick={onOpenCopilot}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#155EEF] to-[#00AEEF] text-white font-extrabold text-xs shadow-md shadow-blue-500/20 hover:opacity-95 transition-all active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
            <span className="hidden sm:inline">{t.aiAssistant}</span>
          </button>

          {/* Current Operator Profile & Logout Button */}
          {currentOperator && (
            <div className="flex items-center gap-1.5 pl-1 border-l border-slate-200">
              <div 
                className="flex items-center gap-2 px-2.5 py-1 rounded-xl bg-slate-100 border border-slate-200 text-xs cursor-pointer hover:bg-slate-200 transition-colors"
                title={`Active Counter Operator: ${currentOperator.name}`}
              >
                <div className="w-6 h-6 rounded-lg bg-blue-600 text-white flex items-center justify-center font-extrabold text-[11px]">
                  {currentOperator.name.charAt(0)}
                </div>
                <div className="hidden xl:block text-left">
                  <div className="text-[11px] font-extrabold text-slate-800 leading-tight truncate max-w-[100px]">
                    {currentOperator.name}
                  </div>
                  <div className="text-[9px] text-slate-500 leading-none">
                    {currentOperator.role || 'Operator'}
                  </div>
                </div>
              </div>

              {onLogout && (
                <button
                  onClick={onLogout}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-all"
                  title={language === 'en' ? 'Switch Operator / Logout' : 'ऑपरेटर बदलें / लॉगआउट'}
                >
                  <LogOut className="w-4 h-4" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Clean Navigation Bar - Large easy-to-click tabs */}
      <div className="bg-[#F8FAFC] border-t border-slate-200 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto py-2 scrollbar-none">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-white text-[#155EEF] shadow-sm border border-slate-200 font-extrabold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#155EEF]' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                <span className={`text-[10px] font-normal ${isActive ? 'text-[#155EEF]' : 'text-slate-400'}`}>
                  ({tab.sub})
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
