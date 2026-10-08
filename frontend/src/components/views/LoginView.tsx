import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  User, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  KeyRound,
  Store,
  Layers,
  Zap,
  Globe
} from 'lucide-react';
import { StaffMember, ShopSettings } from '../../types';
import { Language, translations } from '../../utils/i18n';
import { LoginSecurityIllustration } from '../common/Illustrations';

interface LoginViewProps {
  settings: ShopSettings;
  staffMembers: StaffMember[];
  onLoginSuccess: (operator: StaffMember) => void;
  language: Language;
  onSetLanguage: (lang: Language) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({
  settings,
  staffMembers,
  onLoginSuccess,
  language,
  onSetLanguage
}) => {
  const t = translations[language];

  // Default to first staff member or owner
  const defaultStaff = staffMembers[0] || {
    id: 'staff-owner',
    name: settings.ownerName || 'Rajesh Sharma',
    role: 'Owner / Manager',
    status: 'ACTIVE'
  };

  const [selectedStaff, setSelectedStaff] = useState<StaffMember>(defaultStaff);
  const [pin, setPin] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');

  const handleNumClick = (num: string) => {
    if (pin.length < 4) {
      setPin(prev => prev + num);
      setErrorMsg('');
    }
  };

  const handleBackspace = () => {
    setPin(prev => prev.slice(0, -1));
    setErrorMsg('');
  };

  const handleClear = () => {
    setPin('');
    setErrorMsg('');
  };

  const handleAttemptLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    // Allow any 4-digit PIN, default '1234' or demo pass
    if (pin.length === 4 || pin === '1234' || pin === '') {
      onLoginSuccess(selectedStaff);
    } else {
      setErrorMsg(language === 'en' ? 'Please enter a 4-digit counter PIN (or use 1-Click Demo Login).' : 'कृपया 4-अंकों का पिन दर्ज करें (या 1-क्लिक डेमो लॉगिन दबाएं)।');
    }
  };

  const handleQuickDemoLogin = (staff?: StaffMember) => {
    onLoginSuccess(staff || selectedStaff);
  };

  return (
    <div className="min-h-screen bg-[#070D1D] text-slate-100 flex flex-col justify-between font-sans antialiased relative overflow-hidden select-none">
      {/* Ambient background glows */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-emerald-500/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[160px] pointer-events-none" />

      {/* Top Navbar */}
      <header className="relative z-10 max-w-7xl w-full mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src="/cybersevalogo2.png"
            alt="CyberSeva"
            className="h-10 w-auto object-contain drop-shadow"
          />
          <div className="border-l border-slate-700/80 pl-3">
            <span className="text-xs font-extrabold uppercase tracking-widest text-blue-400 block font-display">
              Digital Counter OS
            </span>
            <span className="text-[11px] text-slate-400">
              One Counter. Every Service.
            </span>
          </div>
        </div>

        {/* Language Switcher */}
        <div className="flex items-center bg-slate-800/80 border border-slate-700/80 rounded-2xl p-1 text-xs">
          <button
            onClick={() => onSetLanguage('en')}
            className={`px-3 py-1 rounded-xl font-bold transition-all ${
              language === 'en' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            English
          </button>
          <button
            onClick={() => onSetLanguage('hinglish')}
            className={`px-3 py-1 rounded-xl font-bold transition-all ${
              language === 'hinglish' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Hinglish
          </button>
          <button
            onClick={() => onSetLanguage('hi')}
            className={`px-3 py-1 rounded-xl font-bold transition-all ${
              language === 'hi' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            हिंदी
          </button>
        </div>
      </header>

      {/* Main Split Grid */}
      <main className="relative z-10 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 my-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Side: Modern Visual Showcase & Cyber Café Credentials (6 Cols) */}
        <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Counter Terminal v2.4 • In-Memory Zero Storage</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight font-display tracking-tight">
            The Digital Operating System for <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-emerald-400">Indian Cyber Cafés</span>
          </h1>

          <p className="text-sm text-slate-300 max-w-lg leading-relaxed mx-auto lg:mx-0">
            {language === 'en'
              ? 'Handle Aadhaar front/back smart printing, passport photo sheets, direct customer file sharing, and daily/monthly income khata from one unified screen.'
              : language === 'hinglish'
              ? 'Aadhaar smart print, passport photo sheet, mobile se direct file lena aur dainik/masik bikri khata — sab ek jagah se control karein.'
              : 'आधार स्मार्ट प्रिंट, पासपोर्ट फोटो शीट, मोबाइल से सीधे फाइल प्राप्त करना और दैनिक/मासिक बिक्री खाता — सब एक ही स्क्रीन पर।'}
          </p>

          {/* SVG Illustration Container */}
          <div className="max-w-md mx-auto lg:mx-0 py-2">
            <LoginSecurityIllustration className="w-full h-auto drop-shadow-2xl" />
          </div>

          {/* Security & Feature Badges */}
          <div className="grid grid-cols-3 gap-3 pt-2 text-left">
            <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-2xl">
              <Zap className="w-5 h-5 text-amber-400 mb-1" />
              <div className="font-extrabold text-xs text-white">5-Sec Sales</div>
              <div className="text-[10px] text-slate-400">No MRP, custom rate</div>
            </div>
            <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-2xl">
              <ShieldCheck className="w-5 h-5 text-emerald-400 mb-1" />
              <div className="font-extrabold text-xs text-white">Privacy Safe</div>
              <div className="text-[10px] text-slate-400">Auto-wiped on print</div>
            </div>
            <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-2xl">
              <Layers className="w-5 h-5 text-blue-400 mb-1" />
              <div className="font-extrabold text-xs text-white">Daily Khata</div>
              <div className="text-[10px] text-slate-400">Cash & UPI ledger</div>
            </div>
          </div>
        </div>

        {/* Right Side: Sleek Operator Auth Card (6 Cols) */}
        <div className="lg:col-span-6 flex justify-center">
          <div className="w-full max-w-md bg-slate-900/90 backdrop-blur-2xl border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
            {/* Shop Header Pill */}
            <div className="pb-4 border-b border-slate-800 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-1.5 text-xs text-slate-400 font-bold">
                  <Store className="w-3.5 h-3.5 text-blue-400" />
                  <span>{settings.shopName}</span>
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  {settings.address?.split(',')[0] || 'Civil Lines, Kanpur'} • Counter #1
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-extrabold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                ONLINE
              </span>
            </div>

            {/* Operator Selection */}
            <div className="space-y-2">
              <label className="text-[11px] uppercase tracking-wider font-extrabold text-slate-400 block">
                {language === 'en' ? 'Select Counter Operator:' : language === 'hinglish' ? 'Operator Chunein:' : 'काउंटर ऑपरेटर चुनें:'}
              </label>
              <div className="grid grid-cols-2 gap-2">
                {staffMembers.map((staff) => (
                  <button
                    key={staff.id}
                    type="button"
                    onClick={() => setSelectedStaff(staff)}
                    className={`p-2.5 rounded-2xl text-left border transition-all flex items-center gap-2.5 ${
                      selectedStaff.id === staff.id
                        ? 'bg-blue-600/20 border-blue-500 text-white shadow-lg shadow-blue-500/10 ring-1 ring-blue-500'
                        : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:border-slate-600'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-extrabold text-xs ${
                      selectedStaff.id === staff.id ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-300'
                    }`}>
                      {staff.name.charAt(0)}
                    </div>
                    <div className="truncate">
                      <div className="text-xs font-extrabold truncate">{staff.name}</div>
                      <div className="text-[10px] text-slate-400">{staff.role || 'Operator'}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* PIN Entry Display */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-extrabold text-slate-300 flex items-center gap-1">
                  <KeyRound className="w-3.5 h-3.5 text-blue-400" />
                  <span>{language === 'en' ? 'Enter Counter PIN:' : language === 'hinglish' ? 'Counter PIN Dalein:' : 'काउंटर पिन दर्ज करें:'}</span>
                </span>
                <span className="text-[11px] text-slate-400 font-mono">Demo: 1 2 3 4</span>
              </div>

              {/* 4 PIN Dots */}
              <div className="flex justify-center items-center gap-3 py-2">
                {[0, 1, 2, 3].map((idx) => (
                  <div
                    key={idx}
                    className={`w-11 h-12 rounded-2xl border-2 flex items-center justify-center text-lg font-extrabold font-mono transition-all ${
                      pin.length > idx
                        ? 'border-blue-500 bg-blue-600/20 text-white shadow-md shadow-blue-500/20 scale-105'
                        : 'border-slate-700 bg-slate-800/40 text-slate-600'
                    }`}
                  >
                    {pin.length > idx ? '●' : ''}
                  </div>
                ))}
              </div>

              {errorMsg && (
                <p className="text-[11px] text-rose-400 text-center font-semibold animate-fadeIn">
                  {errorMsg}
                </p>
              )}
            </div>

            {/* Tactile Keypad */}
            <div className="grid grid-cols-3 gap-2">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
                <button
                  key={digit}
                  type="button"
                  onClick={() => handleNumClick(digit)}
                  className="py-3 rounded-2xl bg-slate-800/80 hover:bg-slate-700 text-white font-extrabold text-base font-display transition-all active:scale-95 border border-slate-700/60 shadow-sm"
                >
                  {digit}
                </button>
              ))}
              <button
                type="button"
                onClick={handleClear}
                className="py-3 rounded-2xl bg-slate-800/50 hover:bg-slate-700 text-slate-400 text-xs font-bold transition-all border border-slate-700/60"
              >
                Clear
              </button>
              <button
                type="button"
                onClick={() => handleNumClick('0')}
                className="py-3 rounded-2xl bg-slate-800/80 hover:bg-slate-700 text-white font-extrabold text-base font-display transition-all active:scale-95 border border-slate-700/60"
              >
                0
              </button>
              <button
                type="button"
                onClick={handleBackspace}
                className="py-3 rounded-2xl bg-slate-800/50 hover:bg-slate-700 text-slate-400 text-xs font-bold transition-all border border-slate-700/60"
              >
                ⌫ Del
              </button>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={handleAttemptLogin}
                className="w-full btn-primary py-3.5 rounded-2xl font-extrabold text-sm flex items-center justify-center gap-2 shadow-xl shadow-blue-500/25 transition-all"
              >
                <span>{language === 'en' ? 'Sign In to Counter' : language === 'hinglish' ? 'Counter Par Login Karein' : 'काउंटर में प्रवेश करें'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoLogin()}
                className="w-full py-2.5 rounded-2xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 font-extrabold text-xs flex items-center justify-center gap-1.5 border border-emerald-500/30 transition-all"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>⚡ {language === 'en' ? 'Instant 1-Click Demo Login' : '1-क्लिक डायरेक्ट डेमो लॉगिन'}</span>
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-4 text-center text-xs text-slate-500 border-t border-slate-800/60">
        <div className="flex items-center justify-center gap-3">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>CYBERSEVA OS • End-to-End In-Memory Security • UIDAI & CSC Ready</span>
        </div>
      </footer>
    </div>
  );
};
