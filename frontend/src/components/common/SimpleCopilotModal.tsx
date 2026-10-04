import React, { useState } from 'react';
import { 
  Sparkles, 
  X, 
  Send, 
  CheckCircle2, 
  ArrowRight,
  Play
} from 'lucide-react';
import { api } from '../../services/api';
import { CopilotActionPlan } from '../../types';

interface SimpleCopilotModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExecute: (plan: CopilotActionPlan) => void;
  initialQuery?: string;
}

export const SimpleCopilotModal: React.FC<SimpleCopilotModalProps> = ({
  isOpen,
  onClose,
  onExecute,
  initialQuery = ''
}) => {
  const [query, setQuery] = useState(initialQuery);
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<CopilotActionPlan | null>(null);

  if (!isOpen) return null;

  const quickChips = [
    'आधार आगे पीछे एक A4 पेज पर प्रिंट करो',
    'इस फोटो के 8 पासपोर्ट साइज बना दो',
    'PDF 500 KB से कम करो और पेज 4 हटाओ',
    'साइन 20 KB का बना दो',
    'आज की कुल कमाई व प्रिंट बताओ'
  ];

  const handleAsk = async (textToSend?: string) => {
    const q = textToSend || query;
    if (!q.trim()) return;
    setLoading(true);
    try {
      const res = await api.askCopilot(q);
      setPlan(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleRunAction = () => {
    if (plan) {
      onExecute(plan);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn no-print">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#071A52] to-[#155EEF] text-white p-4 px-6 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-white/15 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h2 className="text-base font-extrabold">CyberSeva AI सहायक (Copilot)</h2>
              <p className="text-xs text-blue-200">ग्राहक का काम बोलें या लिखें — यह तुरंत काम तैयार कर देगा</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-white/10 text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 overflow-y-auto">
          {/* Quick Clickable Suggestions */}
          <div>
            <span className="text-xs font-bold text-slate-500 block mb-2">
              ⚡ किसी भी आम काम पर क्लिक करें:
            </span>
            <div className="flex flex-wrap gap-2">
              {quickChips.map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setQuery(chip);
                    handleAsk(chip);
                  }}
                  className="text-xs bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-[#155EEF] px-3 py-1.5 rounded-xl border border-slate-200 text-left font-medium transition-all"
                >
                  "{chip}"
                </button>
              ))}
            </div>
          </div>

          {/* Action Result Card */}
          {plan && (
            <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-2xl space-y-3 animate-fadeIn">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-sm text-[#071A52] flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{plan.title}</span>
                </span>
                <span className="text-[10px] font-mono font-bold bg-[#155EEF] text-white px-2 py-0.5 rounded">
                  तैयार
                </span>
              </div>

              <p className="text-xs text-slate-700 leading-relaxed font-medium bg-white p-3 rounded-xl border border-blue-100">
                🇮🇳 {plan.hindiExplanation}
              </p>

              <button
                onClick={handleRunAction}
                className="w-full btn-primary py-3 font-extrabold text-xs flex items-center justify-center gap-2 shadow-md"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>यह काम अभी स्क्रीन पर खोलें (Start Now)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-3.5 bg-slate-50 border-t border-slate-200 flex items-center gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAsk()}
            placeholder="जैसे: '8 पासपोर्ट फोटो बना दो' या 'आधार आगे पीछे प्रिंट करो'..."
            className="flex-1 bg-white border border-slate-300 focus:border-[#155EEF] rounded-xl px-4 py-2.5 text-xs text-slate-900 outline-none shadow-inner"
          />
          <button
            onClick={() => handleAsk()}
            disabled={loading || !query.trim()}
            className="btn-primary px-4 py-2.5 font-bold text-xs flex items-center gap-1.5 disabled:opacity-50"
          >
            {loading ? <span>सोच रहा है...</span> : <><span>चलाएं</span><Send className="w-3.5 h-3.5" /></>}
          </button>
        </div>
      </div>
    </div>
  );
};
