import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  IndianRupee, 
  Printer, 
  Users, 
  FileText, 
  Sparkles, 
  ArrowUpRight,
  Send,
  PieChart
} from 'lucide-react';
import { ShopSettings, Printer as PrinterType, Job } from '../../types';
import { api } from '../../services/api';

interface ReportsViewProps {
  settings: ShopSettings;
  printers: PrinterType[];
  jobs: Job[];
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  settings,
  printers,
  jobs
}) => {
  const [aiQuestion, setAiQuestion] = useState('');
  const [aiAnswer, setAiAnswer] = useState<string | null>(null);
  const [aiHindiAnswer, setAiHindiAnswer] = useState<string | null>(null);
  const [isAsking, setIsAsking] = useState(false);

  const handleAskBusinessAI = async (customQ?: string) => {
    const q = customQ || aiQuestion;
    if (!q.trim()) return;

    setIsAsking(true);
    try {
      const plan = await api.askCopilot(q);
      setAiAnswer(plan.explanation);
      setAiHindiAnswer(plan.hindiExplanation);
    } catch (e) {
      console.error(e);
    } finally {
      setIsAsking(false);
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      {/* Header */}
      <div className="clay-card p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-purple-100 text-purple-700">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-[#071A52] flex items-center gap-2">
              Business Intelligence & Analytics (दुकान का लेखा-जोखा)
              <span className="text-xs bg-purple-100 text-purple-700 font-bold px-2 py-0.5 rounded-full">
                AI Driven
              </span>
            </h2>
            <p className="text-xs text-[#667085]">
              Real-time revenue tracking, top services, printer volume, and voice/text business advisor
            </p>
          </div>
        </div>
      </div>

      {/* AI Business Assistant Box */}
      <div className="clay-card p-5 bg-gradient-to-r from-blue-50/70 via-indigo-50/60 to-purple-50/70 border border-blue-200 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#155EEF]" />
            <h3 className="font-extrabold text-xs uppercase tracking-wider text-[#071A52]">
              Ask CyberSeva Business Advisor (व्यापार सलाहकार):
            </h3>
          </div>
          <span className="text-[10px] bg-white text-[#155EEF] font-bold px-2 py-0.5 rounded shadow-sm">
            Hindi & Hinglish
          </span>
        </div>

        {/* Suggested Queries */}
        <div className="flex flex-wrap gap-2 pt-1">
          {[
            'Mera revenue last month ke comparison mein kaisa hai?',
            'Sabse zyada kaunsi service bikti hai?',
            'Kaunsa printer sabse zyada use hua?',
            'Paper stock kaisa hai?'
          ].map((prompt, i) => (
            <button
              key={i}
              onClick={() => {
                setAiQuestion(prompt);
                handleAskBusinessAI(prompt);
              }}
              className="text-xs bg-white hover:bg-blue-50 text-[#344054] hover:text-[#155EEF] px-3 py-1.5 rounded-lg border border-[#E4E7EC] font-medium transition-all shadow-sm"
            >
              "{prompt}"
            </button>
          ))}
        </div>

        {/* Query Input */}
        <div className="flex items-center gap-2 pt-1">
          <input
            type="text"
            value={aiQuestion}
            onChange={(e) => setAiQuestion(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAskBusinessAI()}
            placeholder="Ask about revenue, profits, printer efficiency or stock in Hindi/English..."
            className="flex-1 bg-white border border-[#E4E7EC] focus:border-[#155EEF] rounded-xl px-4 py-2 text-xs outline-none shadow-inner"
          />
          <button
            onClick={() => handleAskBusinessAI()}
            disabled={isAsking || !aiQuestion.trim()}
            className="clay-button-royal px-4 py-2 font-bold text-xs flex items-center gap-1.5 disabled:opacity-50"
          >
            {isAsking ? <span>Thinking...</span> : <><span>Ask</span><Send className="w-3.5 h-3.5" /></>}
          </button>
        </div>

        {/* Answer Box */}
        {aiAnswer && (
          <div className="p-4 bg-white rounded-xl border border-blue-200 shadow-sm animate-fadeIn space-y-1">
            <p className="text-xs font-bold text-[#101828] leading-relaxed">
              💡 {aiAnswer}
            </p>
            {aiHindiAnswer && (
              <p className="text-xs font-medium text-[#155EEF]">
                🇮🇳 {aiHindiAnswer}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="clay-card p-4">
          <div className="flex justify-between items-center text-[#667085] text-xs font-bold mb-1">
            <span>WEEKLY REVENUE</span>
            <span className="p-1 rounded-md bg-emerald-50 text-emerald-600"><TrendingUp className="w-3.5 h-3.5" /></span>
          </div>
          <div className="text-2xl font-extrabold text-[#071A52]">₹18,450</div>
          <p className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center gap-0.5">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+16.03% vs last week</span>
          </p>
        </div>

        <div className="clay-card p-4">
          <div className="flex justify-between items-center text-[#667085] text-xs font-bold mb-1">
            <span>AVG ORDER VALUE</span>
            <span className="p-1 rounded-md bg-blue-50 text-[#155EEF]"><IndianRupee className="w-3.5 h-3.5" /></span>
          </div>
          <div className="text-2xl font-extrabold text-[#071A52]">₹32.40</div>
          <p className="text-[11px] text-[#667085] mt-1">
            Across 147 customer jobs
          </p>
        </div>

        <div className="clay-card p-4">
          <div className="flex justify-between items-center text-[#667085] text-xs font-bold mb-1">
            <span>SHEETS PRINTED TODAY</span>
            <span className="p-1 rounded-md bg-purple-50 text-purple-600"><Printer className="w-3.5 h-3.5" /></span>
          </div>
          <div className="text-2xl font-extrabold text-[#071A52]">312 Prints</div>
          <p className="text-[11px] text-purple-600 font-semibold mt-1">
            HP M404n handled 69%
          </p>
        </div>

        <div className="clay-card p-4">
          <div className="flex justify-between items-center text-[#667085] text-xs font-bold mb-1">
            <span>MOBILE QR SHARE</span>
            <span className="p-1 rounded-md bg-orange-50 text-[#FF6B00]"><Users className="w-3.5 h-3.5" /></span>
          </div>
          <div className="text-2xl font-extrabold text-[#FF6B00]">41% of Jobs</div>
          <p className="text-[11px] text-[#667085] mt-1">
            38 customers used phone QR
          </p>
        </div>
      </div>

      {/* Hourly Trends & Printer Efficiency */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hourly Volume */}
        <div className="clay-card p-5 space-y-4">
          <h3 className="font-extrabold text-xs text-[#071A52] uppercase tracking-wider">
            Peak Counter Hours (Prints & Revenue)
          </h3>
          <div className="space-y-3">
            {[
              { time: '08:00 AM - 10:00 AM', prints: 45, rev: 360, width: '35%' },
              { time: '10:00 AM - 12:00 PM', prints: 112, rev: 920, width: '90%' },
              { time: '12:00 PM - 02:00 PM', prints: 84, rev: 710, width: '70%' },
              { time: '02:00 PM - 04:00 PM', prints: 40, rev: 310, width: '32%' },
              { time: '04:00 PM - 07:00 PM', prints: 95, rev: 840, width: '78%' }
            ].map((slot, i) => (
              <div key={i} className="text-xs">
                <div className="flex justify-between font-semibold mb-1">
                  <span>{slot.time}</span>
                  <span className="font-bold text-[#071A52]">₹{slot.rev} ({slot.prints} prints)</span>
                </div>
                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-[#155EEF] h-full rounded-full" style={{ width: slot.width }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Printer Load Breakdown */}
        <div className="clay-card p-5 space-y-4">
          <h3 className="font-extrabold text-xs text-[#071A52] uppercase tracking-wider">
            Printer Workload Distribution
          </h3>
          <div className="space-y-3">
            {printers.map((p) => (
              <div key={p.id} className="p-3 rounded-xl bg-[#F8FAFF] border border-[#E4E7EC] text-xs">
                <div className="flex justify-between font-bold mb-1">
                  <span>{p.name}</span>
                  <span className="text-[#155EEF]">{p.totalPrintsToday} prints today</span>
                </div>
                <div className="text-[11px] text-[#667085] flex items-center justify-between">
                  <span>Location: {p.location}</span>
                  <span>Toner Remaining: {p.tonerBlack}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
