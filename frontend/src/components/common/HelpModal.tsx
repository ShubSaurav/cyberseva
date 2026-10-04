import React from 'react';
import { 
  X, 
  HelpCircle, 
  Keyboard, 
  Printer, 
  Smartphone, 
  ShieldCheck, 
  PhoneCall, 
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { Language, translations } from '../../utils/i18n';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose, lang }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn no-print">
      <div className="bg-white rounded-3xl w-full max-w-xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#071A52] to-[#155EEF] text-white p-4 px-6 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center">
              <HelpCircle className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h2 className="text-base font-extrabold">दुकानदार सहायता व गाइड (Help & Counter Guide)</h2>
              <p className="text-xs text-blue-200">साइबर कैफे और जन सेवा केंद्र काउंटर के लिए त्वरित सहायता</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-white/10 text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 overflow-y-auto text-xs text-slate-800">
          {/* 1. Keyboard Shortcuts */}
          <div className="clean-card p-4 space-y-2.5 bg-slate-50 border border-slate-200">
            <div className="flex items-center gap-2 text-slate-900 font-extrabold text-xs">
              <Keyboard className="w-4 h-4 text-[#155EEF]" />
              <span>कीबोर्ड शॉर्टकट्स (Keyboard Shortcuts):</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center justify-between bg-white p-2 rounded-lg border border-slate-200">
                <span className="text-slate-600">प्रिंट विंडो खोलें:</span>
                <kbd className="px-2 py-0.5 rounded bg-slate-100 border font-mono font-bold text-slate-900">Ctrl + P</kbd>
              </div>
              <div className="flex items-center justify-between bg-white p-2 rounded-lg border border-slate-200">
                <span className="text-slate-600">काउंटर होम जाएं:</span>
                <kbd className="px-2 py-0.5 rounded bg-slate-100 border font-mono font-bold text-slate-900">Ctrl + N</kbd>
              </div>
              <div className="flex items-center justify-between bg-white p-2 rounded-lg border border-slate-200">
                <span className="text-slate-600">विंडो बंद करें:</span>
                <kbd className="px-2 py-0.5 rounded bg-slate-100 border font-mono font-bold text-slate-900">Esc</kbd>
              </div>
              <div className="flex items-center justify-between bg-white p-2 rounded-lg border border-slate-200">
                <span className="text-slate-600">AI सहायक बोलें:</span>
                <kbd className="px-2 py-0.5 rounded bg-slate-100 border font-mono font-bold text-slate-900">AI बटन</kbd>
              </div>
            </div>
          </div>

          {/* 2. Fast Counter Tips */}
          <div className="space-y-2">
            <span className="font-extrabold text-slate-900 uppercase tracking-wide block">
              💡 काउंटर पर 30 सेकंड में काम करने के टिप्स:
            </span>
            <div className="space-y-2">
              <div className="p-3 bg-blue-50 rounded-xl border border-blue-100 text-xs space-y-1">
                <strong className="text-[#071A52] flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#155EEF]" />
                  <span>आधार कार्ड 10 सेकंड में प्रिंट:</span>
                </strong>
                <p className="text-slate-600 leading-relaxed">
                  'आधार प्रिंट' पर क्लिक करें ➔ आगे व पीछे की फोटो चुनें ➔ सीधे 'A4 प्रिंट करें' बटन दबाएं। A4 पर अपने आप दोनों हिस्से सही साइज में सेट हो जाएंगे।
                </p>
              </div>

              <div className="p-3 bg-orange-50 rounded-xl border border-orange-100 text-xs space-y-1">
                <strong className="text-[#071A52] flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#FF6B00]" />
                  <span>पासपोर्ट फोटो 15 सेकंड में:</span>
                </strong>
                <p className="text-slate-600 leading-relaxed">
                  फोटो अपलोड करें ➔ '8 फोटो' या '16 फोटो' चुनें ➔ नीला या सफेद बैकग्राउंड चुनें ➔ प्रिंट दें। कटिंग लाइन्स अपने आप प्रिंट होंगी।
                </p>
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 text-xs space-y-1">
                <strong className="text-[#071A52] flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>व्हाट्सएप का झंझट खत्म (Customer QR):</span>
                </strong>
                <p className="text-slate-600 leading-relaxed">
                  ग्राहक से कहें कि वह अपने मोबाइल फोन के कैमरे से काउंटर QR स्कैन करे। उसकी फोटो सीधे आपकी स्क्रीन पर आ जाएगी।
                </p>
              </div>
            </div>
          </div>

          {/* 3. Support Helpline */}
          <div className="p-4 bg-slate-900 text-white rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/10 rounded-xl">
                <PhoneCall className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <div className="font-extrabold text-xs">CyberSeva हेल्पडेस्क सहायता:</div>
                <div className="text-[11px] text-slate-300">+91 98765 43210 (सुबह 9 से रात 9 बजे)</div>
              </div>
            </div>
            <span className="text-[10px] bg-emerald-500 text-white font-extrabold px-2 py-0.5 rounded">
              सहायता उपलब्ध
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 text-center">
          <button
            onClick={onClose}
            className="btn-primary px-6 py-2 font-bold text-xs"
          >
            समझ गया (Close)
          </button>
        </div>
      </div>
    </div>
  );
};
