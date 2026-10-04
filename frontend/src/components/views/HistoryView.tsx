import React, { useState } from 'react';
import { 
  Clock, 
  Search, 
  Eye, 
  Printer, 
  ShieldCheck, 
  CheckCircle2, 
  IndianRupee 
} from 'lucide-react';
import { Job } from '../../types';
import { Language, translations } from '../../utils/i18n';

interface HistoryViewProps {
  jobs: Job[];
  onViewReceipt: (job: Job) => void;
  onPurgeJob: (jobId: string) => void;
  onQuickPrint: (job: Job) => void;
  language: Language;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  jobs,
  onViewReceipt,
  onPurgeJob,
  onQuickPrint,
  language
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const t = translations[language];

  const filtered = jobs.filter(
    j => j.jobCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
         j.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
         (j.customerPhone && j.customerPhone.includes(searchTerm))
  );

  const totalCollected = jobs.reduce((sum, j) => sum + (j.paymentStatus === 'PAID' ? j.totalAmount : 0), 0) + 2840;

  return (
    <div className="space-y-6 pb-12 animate-fadeIn max-w-5xl mx-auto">
      {/* Top Banner */}
      <div className="clean-card p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#155EEF] flex items-center justify-center shadow-sm">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-[#071A52]">
              {t.jobsHeading}
            </h2>
            <p className="text-xs text-slate-500">
              {t.jobsSub}
            </p>
          </div>
        </div>

        {/* Daily Cash Total Badge */}
        <div className="bg-emerald-50 border border-emerald-200 px-4 py-2 rounded-2xl flex items-center gap-2 self-start sm:self-auto">
          <IndianRupee className="w-5 h-5 text-emerald-600" />
          <div>
            <span className="text-[10px] uppercase font-bold text-emerald-700 block">{t.todayEarnings}</span>
            <span className="font-extrabold text-base text-emerald-900">₹{totalCollected.toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-3 bg-white p-2.5 rounded-2xl border border-slate-200 shadow-sm max-w-md">
        <Search className="w-4 h-4 text-slate-400 ml-2" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search customer, phone or job #..."
          className="w-full text-xs font-medium text-slate-900 outline-none placeholder:text-slate-400"
        />
      </div>

      {/* Clean Jobs List */}
      <div className="clean-card overflow-hidden">
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
              {filtered.map((job) => (
                <tr key={job.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-[#071A52]">
                    {job.jobCode}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-900">
                    {job.customerName}
                    {job.customerPhone && <span className="block text-[11px] text-slate-500 font-normal">{job.customerPhone}</span>}
                  </td>
                  <td className="py-3.5 px-4 text-slate-700 font-medium">
                    {job.services.map(s => `${s.name} (x${s.quantity})`).join(', ')}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-extrabold text-[#071A52]">₹{job.totalAmount}</span>
                    <span className="text-[10px] text-slate-500 ml-1">({job.paymentMode})</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>{job.status === 'COMPLETED' ? t.statusPrinted : job.status}</span>
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onViewReceipt(job)}
                        className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-xs flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5 text-slate-500" />
                        <span>{t.btnReceipt}</span>
                      </button>

                      <button
                        onClick={() => onQuickPrint(job)}
                        className="px-3 py-1.5 rounded-xl bg-blue-50 text-[#155EEF] hover:bg-blue-100 font-bold text-xs flex items-center gap-1"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>{t.btnPrint}</span>
                      </button>

                      {job.hasTemporaryFiles && (
                        <button
                          onClick={() => onPurgeJob(job.id)}
                          className="px-2.5 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold text-[11px] flex items-center gap-1"
                          title="Wipe customer data"
                        >
                          <ShieldCheck className="w-3.5 h-3.5" />
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
