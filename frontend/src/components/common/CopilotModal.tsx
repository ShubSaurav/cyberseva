import React, { useState } from 'react';
import { 
  Sparkles, 
  X, 
  Send, 
  Mic, 
  MicOff, 
  ArrowRight, 
  CheckCircle2, 
  FileText, 
  Camera, 
  Printer, 
  FileStack,
  BarChart3,
  HelpCircle,
  Play
} from 'lucide-react';
import { api } from '../../services/api';
import { CopilotActionPlan } from '../../types';

interface CopilotModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExecutePlan: (plan: CopilotActionPlan) => void;
}

export const CopilotModal: React.FC<CopilotModalProps> = ({
  isOpen,
  onClose,
  onExecutePlan
}) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [actionPlan, setActionPlan] = useState<CopilotActionPlan | null>(null);
  const [isListening, setIsListening] = useState(false);

  if (!isOpen) return null;

  const quickPrompts = [
    'Aadhaar ka front aur back ek A4 page pe laga ke print kar',
    'Is photo ke 8 passport size bana do',
    'PDF ko 500 KB se kam kar do aur page 4 hata do',
    'Signature 20 KB se kam kar do',
    'Black and white mein 5 copies print kar',
    'Mera revenue last month ke comparison mein kaisa hai?',
    'Kaunsa printer sabse zyada use hua?'
  ];

  const handleSend = async (textToSend?: string) => {
    const q = textToSend || query;
    if (!q.trim()) return;

    setLoading(true);
    try {
      const plan = await api.askCopilot(q);
      setActionPlan(plan);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSimulatedMic = () => {
    setIsListening(true);
    setTimeout(() => {
      setIsListening(false);
      setQuery('Aadhaar ka front back ek A4 sheet pe print kar do');
      handleSend('Aadhaar ka front back ek A4 sheet pe print kar do');
    }, 1500);
  };

  const handleExecute = () => {
    if (actionPlan) {
      onExecutePlan(actionPlan);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl border border-blue-100 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#071A52] via-[#155EEF] to-[#00AEEF] p-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-inner">
              <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
            </div>
            <div>
              <h2 className="text-base font-extrabold flex items-center gap-2">
                CyberSeva Copilot
                <span className="text-[10px] bg-orange-500 text-white font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Hinglish AI
                </span>
              </h2>
              <p className="text-xs text-blue-100">
                Action-first Assistant for Counter Operators (Hindi & Hinglish supported)
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          {/* Quick Voice / Text Suggestions */}
          <div>
            <p className="text-xs font-bold text-[#667085] uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <span>⚡ Click any common cyber café order:</span>
            </p>
            <div className="flex flex-wrap gap-2">
              {quickPrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setQuery(prompt);
                    handleSend(prompt);
                  }}
                  className="text-xs bg-[#F6F8FC] hover:bg-blue-50 text-[#344054] hover:text-[#155EEF] border border-[#E4E7EC] hover:border-blue-300 px-3 py-1.5 rounded-lg transition-all text-left font-medium active:scale-98"
                >
                  "{prompt}"
                </button>
              ))}
            </div>
          </div>

          {/* Action Result Card */}
          {actionPlan && (
            <div className="bg-[#FAFBFF] border-2 border-[#155EEF]/30 rounded-xl p-4 shadow-sm animate-fadeIn">
              <div className="flex items-center justify-between pb-2 mb-3 border-b border-[#E4E7EC]">
                <div className="flex items-center gap-2">
                  <span className="p-1 rounded-md bg-emerald-100 text-emerald-700">
                    <CheckCircle2 className="w-4 h-4" />
                  </span>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#071A52]">
                    Structured Action Parsed
                  </span>
                </div>
                <span className="text-[11px] font-mono font-bold bg-[#155EEF]/10 text-[#155EEF] px-2 py-0.5 rounded">
                  {actionPlan.intent}
                </span>
              </div>

              <h3 className="font-extrabold text-[#101828] text-base mb-1">
                {actionPlan.title}
              </h3>

              <div className="p-3 bg-white rounded-lg border border-[#E4E7EC] mb-3">
                <p className="text-xs font-medium text-[#101828] leading-relaxed mb-1">
                  {actionPlan.explanation}
                </p>
                <p className="text-xs text-[#155EEF] font-semibold">
                  🇮🇳 हिन्दी: {actionPlan.hindiExplanation}
                </p>
              </div>

              {/* Parameters Breakdown */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4 text-xs">
                {Object.entries(actionPlan.parameters).map(([key, val]) => (
                  <div key={key} className="bg-white p-2 rounded-lg border border-[#E4E7EC]">
                    <span className="text-[10px] text-[#667085] uppercase block font-semibold">{key}</span>
                    <span className="font-bold text-[#101828] truncate block">{String(val)}</span>
                  </div>
                ))}
              </div>

              {/* Action Button */}
              <button
                onClick={handleExecute}
                className="w-full clay-button-royal py-3 font-bold text-xs sm:text-sm flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Execute & Load in Studio Now (कार्रवाई शुरू करें)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Input Footer */}
        <div className="p-3 bg-white border-t border-[#E4E7EC] flex items-center gap-2">
          <button
            onClick={handleSimulatedMic}
            className={`p-2.5 rounded-xl border transition-all ${
              isListening
                ? 'bg-red-500 text-white border-red-600 animate-bounce'
                : 'bg-[#F1F4F9] text-[#667085] hover:text-[#071A52] border-[#E4E7EC]'
            }`}
            title="Voice input in Hindi/Hinglish"
          >
            {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type your command in Hindi / Hinglish / English (e.g. 8 passport photo bana do)..."
            className="flex-1 bg-[#F6F8FC] border border-[#E4E7EC] focus:border-[#155EEF] focus:bg-white rounded-xl px-4 py-2.5 text-xs text-[#101828] outline-none transition-all placeholder:text-[#667085]"
          />

          <button
            onClick={() => handleSend()}
            disabled={loading || !query.trim()}
            className="clay-button-royal px-4 py-2.5 font-bold text-xs disabled:opacity-50 flex items-center gap-1.5"
          >
            {loading ? (
              <span className="animate-spin">⏳</span>
            ) : (
              <>
                <span>Run</span>
                <Send className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
