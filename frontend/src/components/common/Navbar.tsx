import React, { useState } from 'react';
import { 
  Sparkles, 
  Printer as PrinterIcon, 
  Plus, 
  QrCode, 
  Bell, 
  ShieldCheck, 
  User, 
  Globe,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { ShopSettings, Printer } from '../../types';

interface NavbarProps {
  settings: ShopSettings;
  printers: Printer[];
  onOpenCopilot: () => void;
  onOpenNewJob: () => void;
  onOpenCustomerQR: () => void;
  onNavigate: (tab: string) => void;
  language: string;
  setLanguage: (lang: 'en' | 'hi' | 'hinglish') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  settings,
  printers,
  onOpenCopilot,
  onOpenNewJob,
  onOpenCustomerQR,
  onNavigate,
  language,
  setLanguage
}) => {
  const [showNotifications, setShowNotifications] = useState(false);

  const defaultPrinter = printers.find(p => p.isDefault) || printers[0];

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#E4E7EC] px-4 lg:px-6 py-2.5 flex items-center justify-between shadow-sm">
      {/* Left: Shop Name & Status */}
      <div className="flex items-center gap-3">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <h1 className="font-extrabold text-[#071A52] text-base lg:text-lg tracking-tight">
              {settings.shopName}
            </h1>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              COUNTER 1 ACTIVE
            </span>
          </div>
          <p className="text-xs text-[#667085] flex items-center gap-1.5">
            <span>{settings.tagline}</span>
            <span>•</span>
            <span className="flex items-center gap-1 text-emerald-600 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              Privacy Shield Active (Zero Retention)
            </span>
          </p>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 lg:gap-3">
        {/* Live Printer Status Widget */}
        <button 
          onClick={() => onNavigate('printers')}
          className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#F6F8FC] border border-[#E4E7EC] hover:border-[#155EEF]/40 transition-colors text-left"
          title="Click to manage Windows Print Bridge"
        >
          <div className={`p-1.5 rounded-lg ${defaultPrinter?.status === 'ONLINE' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
            <PrinterIcon className="w-4 h-4" />
          </div>
          <div className="text-xs leading-tight">
            <div className="font-semibold text-[#101828] flex items-center gap-1.5">
              <span>{defaultPrinter?.name || 'LaserJet Spooler'}</span>
              <span className={`w-2 h-2 rounded-full ${defaultPrinter?.status === 'ONLINE' ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
            </div>
            <div className="text-[11px] text-[#667085]">
              Toner: {defaultPrinter?.tonerBlack || 84}% • {defaultPrinter?.paperTrayCount || 180} sh.
            </div>
          </div>
        </button>

        {/* Customer Mobile QR upload quick trigger */}
        <button
          onClick={onOpenCustomerQR}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-50 border border-orange-200 text-[#FF6B00] hover:bg-orange-100 transition-all font-semibold text-xs shadow-sm"
        >
          <QrCode className="w-4 h-4" />
          <span className="hidden sm:inline">Customer QR Upload</span>
          <span className="sm:hidden">QR</span>
        </button>

        {/* CyberSeva Copilot Button */}
        <button
          onClick={onOpenCopilot}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#155EEF] to-[#00AEEF] text-white hover:opacity-95 transition-all font-bold text-xs shadow-md shadow-blue-500/20 active:scale-95"
        >
          <Sparkles className="w-4 h-4 animate-spin-slow text-amber-300" />
          <span>AI Copilot</span>
          <span className="hidden lg:inline bg-white/20 text-[10px] px-1.5 py-0.5 rounded-md font-mono">
            Hinglish
          </span>
        </button>

        {/* Quick New Job Button */}
        <button
          onClick={onOpenNewJob}
          className="clay-button-orange flex items-center gap-1.5 px-4 py-2 font-bold text-xs tracking-wide"
        >
          <Plus className="w-4 h-4" />
          <span>New Job</span>
        </button>

        {/* Language selector */}
        <div className="hidden xl:flex items-center bg-[#F1F4F9] rounded-xl p-1 border border-[#E4E7EC] text-xs">
          <button
            onClick={() => setLanguage('hinglish')}
            className={`px-2 py-1 rounded-lg font-medium transition-all ${language === 'hinglish' ? 'bg-white text-[#155EEF] shadow-sm' : 'text-[#667085] hover:text-[#101828]'}`}
          >
            Hinglish
          </button>
          <button
            onClick={() => setLanguage('hi')}
            className={`px-2 py-1 rounded-lg font-medium transition-all ${language === 'hi' ? 'bg-white text-[#155EEF] shadow-sm' : 'text-[#667085] hover:text-[#101828]'}`}
          >
            हिन्दी
          </button>
          <button
            onClick={() => setLanguage('en')}
            className={`px-2 py-1 rounded-lg font-medium transition-all ${language === 'en' ? 'bg-white text-[#155EEF] shadow-sm' : 'text-[#667085] hover:text-[#101828]'}`}
          >
            English
          </button>
        </div>

        {/* Owner Profile Avatar */}
        <div className="flex items-center gap-2 pl-2 border-l border-[#E4E7EC]">
          <div className="w-8 h-8 rounded-full bg-[#071A52] text-white flex items-center justify-center font-bold text-xs shadow-inner">
            {settings.ownerName.charAt(0)}
          </div>
          <div className="hidden 2xl:block text-left">
            <p className="text-xs font-bold text-[#101828] leading-none">{settings.ownerName}</p>
            <p className="text-[10px] text-[#667085]">Counter Admin</p>
          </div>
        </div>
      </div>
    </header>
  );
};
