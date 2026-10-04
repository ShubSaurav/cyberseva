import React from 'react';
import { 
  TrendingUp, 
  Clock, 
  Users, 
  Printer, 
  PlusCircle, 
  FileText, 
  Camera, 
  FileStack, 
  QrCode, 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle,
  ArrowUpRight,
  Eye,
  Trash2,
  RefreshCw,
  Zap,
  PenTool
} from 'lucide-react';
import { Job, Printer as PrinterType, ShopSettings } from '../../types';

interface DashboardViewProps {
  settings: ShopSettings;
  jobs: Job[];
  printers: PrinterType[];
  onNavigate: (tab: string, state?: any) => void;
  onOpenNewJob: () => void;
  onOpenCustomerQR: () => void;
  onOpenCopilot: () => void;
  onViewReceipt: (job: Job) => void;
  onPurgeJob: (jobId: string) => void;
  onQuickPrint: (docName: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  settings,
  jobs,
  printers,
  onNavigate,
  onOpenNewJob,
  onOpenCustomerQR,
  onOpenCopilot,
  onViewReceipt,
  onPurgeJob,
  onQuickPrint
}) => {
  const defaultPrinter = printers.find(p => p.isDefault) || printers[0];

  const totalRevenue = jobs.reduce((sum, j) => sum + (j.paymentStatus === 'PAID' ? j.totalAmount : 0), 0) + 2840;
  const totalJobsCount = jobs.length + 143; // 147
  const totalCustomers = 93;
  const totalPrints = printers.reduce((acc, p) => acc + p.totalPrintsToday, 0) + 200; // 312
  const pendingJobsCount = jobs.filter(j => j.status === 'PROCESSING' || j.status === 'NEW').length;

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      {/* Top Greeting & Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-[#071A52] via-[#0B256B] to-[#155EEF] p-6 rounded-clay-lg text-white shadow-lg relative overflow-hidden">
        {/* Subtle decorative background watermarks */}
        <div className="absolute right-0 top-0 bottom-0 opacity-10 pointer-events-none flex items-center pr-6">
          <img src="/cybersevalogo1.png" alt="watermark" className="h-44 w-auto" />
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider bg-white/20 text-blue-100 px-2.5 py-0.5 rounded-full backdrop-blur-sm">
              Today's Counter Session
            </span>
            <span className="text-xs text-blue-200">
              {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold mt-1 tracking-tight">
            Good Morning, {settings.ownerName} 👋
          </h2>
          <p className="text-xs sm:text-sm text-blue-100 mt-1 max-w-xl">
            Ready to serve customers at {settings.shopName}. All printer spoolers are active and responsive.
          </p>
        </div>

        {/* Quick Launch Actions on Header */}
        <div className="relative z-10 flex flex-wrap items-center gap-2.5">
          <button
            onClick={onOpenCustomerQR}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs backdrop-blur-md transition-all active:scale-95"
          >
            <QrCode className="w-4 h-4 text-orange-300" />
            <span>Customer QR</span>
          </button>

          <button
            onClick={onOpenCopilot}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-extrabold text-xs shadow-md shadow-orange-500/30 transition-all hover:brightness-110 active:scale-95"
          >
            <Sparkles className="w-4 h-4 fill-white" />
            <span>Copilot (Voice/Text)</span>
          </button>

          <button
            onClick={onOpenNewJob}
            className="clay-button-royal px-5 py-2.5 font-extrabold text-xs flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            <span>+ Create Job</span>
          </button>
        </div>
      </div>

      {/* KPI Cards: Revenue, Jobs, Customers, Prints, Pending */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5">
        {/* Revenue */}
        <div className="clay-card p-4 border-l-4 border-l-[#155EEF]">
          <div className="flex items-center justify-between text-[#667085] mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">Today's Revenue</span>
            <div className="p-1.5 rounded-lg bg-blue-50 text-[#155EEF]">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-[#071A52] tracking-tight">
            ₹{totalRevenue.toLocaleString('en-IN')}
          </div>
          <p className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center gap-0.5">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+14.2% vs yesterday</span>
          </p>
        </div>

        {/* Jobs */}
        <div className="clay-card p-4 border-l-4 border-l-[#FF6B00]">
          <div className="flex items-center justify-between text-[#667085] mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">Today's Jobs</span>
            <div className="p-1.5 rounded-lg bg-orange-50 text-[#FF6B00]">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-[#101828] tracking-tight">
            {totalJobsCount} Jobs
          </div>
          <p className="text-[11px] text-[#667085] mt-1">
            Avg time: 45 sec / job
          </p>
        </div>

        {/* Customers */}
        <div className="clay-card p-4 border-l-4 border-l-purple-500">
          <div className="flex items-center justify-between text-[#667085] mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">Customers</span>
            <div className="p-1.5 rounded-lg bg-purple-50 text-purple-600">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-[#101828] tracking-tight">
            {totalCustomers}
          </div>
          <p className="text-[11px] text-purple-600 font-semibold mt-1">
            38 Mobile QR uploads
          </p>
        </div>

        {/* Total Prints */}
        <div className="clay-card p-4 border-l-4 border-l-emerald-500">
          <div className="flex items-center justify-between text-[#667085] mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">Total Prints</span>
            <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
              <Printer className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-[#101828] tracking-tight">
            {totalPrints} Sheets
          </div>
          <p className="text-[11px] text-emerald-600 font-semibold mt-1">
            238 B&W • 74 Color
          </p>
        </div>

        {/* Pending / Active */}
        <div className="clay-card p-4 border-l-4 border-l-amber-500">
          <div className="flex items-center justify-between text-[#667085] mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">Pending Counter</span>
            <div className="p-1.5 rounded-lg bg-amber-50 text-amber-600">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-amber-600 tracking-tight">
            {pendingJobsCount} In Progress
          </div>
          <p className="text-[11px] text-[#667085] mt-1">
            Spooling & payment
          </p>
        </div>
      </div>

      {/* Quick Service Recipes (One-Click Operations for cyber café operators) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#667085] flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-[#FF6B00]" />
            <span>Fast 1-Click Counter Recipes (त्वरित सेवा):</span>
          </h3>
          <span className="text-xs text-[#155EEF] font-semibold cursor-pointer hover:underline" onClick={() => onNavigate('new-job')}>
            View All Services →
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <button
            onClick={() => onNavigate('document-studio', { preset: 'AADHAAR' })}
            className="clay-card p-3 text-left clay-card-interactive group border-l-2 border-l-[#155EEF]"
          >
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#155EEF] flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <FileText className="w-4 h-4" />
            </div>
            <div className="font-extrabold text-xs text-[#101828]">Aadhaar Smart A4</div>
            <div className="text-[10px] text-[#667085] mt-0.5">Front + Back Dual Fit</div>
            <div className="mt-2 text-[11px] font-bold text-[#155EEF]">₹15 standard</div>
          </button>

          <button
            onClick={() => onNavigate('photo-studio', { count: 8 })}
            className="clay-card p-3 text-left clay-card-interactive group border-l-2 border-l-[#FF6B00]"
          >
            <div className="w-8 h-8 rounded-xl bg-orange-50 text-[#FF6B00] flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <Camera className="w-4 h-4" />
            </div>
            <div className="font-extrabold text-xs text-[#101828]">8 Passport Photos</div>
            <div className="text-[10px] text-[#667085] mt-0.5">35x45mm Cut Marks</div>
            <div className="mt-2 text-[11px] font-bold text-[#FF6B00]">₹30 sheet</div>
          </button>

          <button
            onClick={() => onNavigate('document-studio', { preset: 'SIGNATURE' })}
            className="clay-card p-3 text-left clay-card-interactive group border-l-2 border-l-emerald-500"
          >
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <PenTool className="w-4 h-4" />
            </div>
            <div className="font-extrabold text-xs text-[#101828]">Signature 20 KB</div>
            <div className="text-[10px] text-[#667085] mt-0.5">SSC / UPSC Exam Ready</div>
            <div className="mt-2 text-[11px] font-bold text-emerald-600">₹10 quick</div>
          </button>

          <button
            onClick={() => onNavigate('pdf-studio', { action: 'compress' })}
            className="clay-card p-3 text-left clay-card-interactive group border-l-2 border-l-indigo-500"
          >
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <FileStack className="w-4 h-4" />
            </div>
            <div className="font-extrabold text-xs text-[#101828]">Compress PDF</div>
            <div className="text-[10px] text-[#667085] mt-0.5">&lt; 500 KB Govt Portal</div>
            <div className="mt-2 text-[11px] font-bold text-indigo-600">₹10 edit</div>
          </button>

          <button
            onClick={() => onNavigate('pdf-studio', { action: 'merge' })}
            className="clay-card p-3 text-left clay-card-interactive group border-l-2 border-l-pink-500"
          >
            <div className="w-8 h-8 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <PlusCircle className="w-4 h-4" />
            </div>
            <div className="font-extrabold text-xs text-[#101828]">Merge Documents</div>
            <div className="text-[10px] text-[#667085] mt-0.5">Combine Marksheets</div>
            <div className="mt-2 text-[11px] font-bold text-pink-600">₹15 bundle</div>
          </button>

          <button
            onClick={onOpenCustomerQR}
            className="clay-card p-3 text-left clay-card-interactive group border-l-2 border-l-amber-500"
          >
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <QrCode className="w-4 h-4" />
            </div>
            <div className="font-extrabold text-xs text-[#101828]">Customer QR</div>
            <div className="text-[10px] text-[#667085] mt-0.5">Direct Mobile Beam</div>
            <div className="mt-2 text-[11px] font-bold text-amber-600">Instant</div>
          </button>
        </div>
      </div>

      {/* Main Grid: Recent Jobs + Printer Status & Top Services */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Recent Jobs Table */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-[#071A52] flex items-center gap-2">
              <span>Recent Counter Jobs</span>
              <span className="text-xs bg-blue-100 text-[#155EEF] font-bold px-2 py-0.5 rounded-full">
                Live Queue
              </span>
            </h3>
            <button
              onClick={() => onNavigate('jobs')}
              className="text-xs font-bold text-[#155EEF] hover:underline"
            >
              Manage All Jobs ({jobs.length}) →
            </button>
          </div>

          <div className="clay-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#F8F9FC] text-[#667085] font-semibold border-b border-[#E4E7EC]">
                  <tr>
                    <th className="p-3">Job ID</th>
                    <th className="p-3">Customer</th>
                    <th className="p-3">Services</th>
                    <th className="p-3">Amount</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E4E7EC]">
                  {jobs.slice(0, 6).map((job) => (
                    <tr key={job.id} className="hover:bg-[#F8FAFF] transition-colors">
                      <td className="p-3 font-mono font-bold text-[#071A52]">
                        {job.jobCode}
                      </td>
                      <td className="p-3">
                        <div className="font-bold text-[#101828]">{job.customerName}</div>
                        {job.customerPhone && (
                          <div className="text-[11px] text-[#667085]">{job.customerPhone}</div>
                        )}
                      </td>
                      <td className="p-3">
                        <div className="font-medium text-[#101828] max-w-[200px] truncate">
                          {job.services.map(s => s.name).join(', ')}
                        </div>
                        <div className="text-[10px] text-[#667085]">{job.operator}</div>
                      </td>
                      <td className="p-3">
                        <div className="font-extrabold text-[#071A52]">₹{job.totalAmount}</div>
                        <span className={`inline-block text-[10px] font-bold px-1.5 py-0.2 rounded ${
                          job.paymentStatus === 'PAID' ? 'text-emerald-700 bg-emerald-50' : 'text-amber-700 bg-amber-50'
                        }`}>
                          {job.paymentMode} • {job.paymentStatus}
                        </span>
                      </td>
                      <td className="p-3">
                        <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full ${
                          job.status === 'COMPLETED'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : job.status === 'PRINTING'
                            ? 'bg-blue-50 text-blue-700 border border-blue-200 animate-pulse'
                            : job.status === 'PROCESSING'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {job.status}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onViewReceipt(job)}
                            className="p-1.5 rounded-lg text-[#667085] hover:text-[#155EEF] hover:bg-blue-50"
                            title="Print Customer Bill Receipt"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {job.hasTemporaryFiles && (
                            <button
                              onClick={() => onPurgeJob(job.id)}
                              className="p-1.5 rounded-lg text-emerald-600 hover:text-emerald-800 hover:bg-emerald-50"
                              title="Secure Zero-Trace Purge"
                            >
                              <ShieldCheck className="w-4 h-4" />
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

        {/* Right 1 Col: Live Printer Status & Top Services */}
        <div className="space-y-4">
          {/* Printer Bridge Live Status */}
          <div className="clay-card p-4 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#E4E7EC]">
              <div className="flex items-center gap-2">
                <Printer className="w-4 h-4 text-[#155EEF]" />
                <h3 className="font-extrabold text-xs text-[#071A52] uppercase tracking-wide">
                  Connected Printers (3 Devices)
                </h3>
              </div>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                Bridge v1.4
              </span>
            </div>

            <div className="space-y-2.5">
              {printers.map((p) => (
                <div key={p.id} className="p-2.5 rounded-xl bg-[#F8FAFF] border border-[#E4E7EC] flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-[#101828] flex items-center gap-1.5">
                      <span>{p.name}</span>
                      {p.isDefault && (
                        <span className="text-[9px] bg-blue-100 text-[#155EEF] px-1 rounded font-bold">
                          DEF
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-[#667085] mt-0.5">
                      {p.type} • {p.tonerBlack}% Toner
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`inline-flex items-center gap-1 font-bold text-[10px] px-2 py-0.5 rounded-md ${
                      p.status === 'ONLINE' ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-600'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${p.status === 'ONLINE' ? 'bg-emerald-500' : 'bg-gray-400'}`}></span>
                      {p.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => onNavigate('printers')}
              className="w-full text-center py-1.5 bg-[#F1F4F9] hover:bg-gray-200 text-[#071A52] font-bold text-xs rounded-xl transition-colors"
            >
              Open Windows Spooler & Settings →
            </button>
          </div>

          {/* Top Services Breakdown */}
          <div className="clay-card p-4 space-y-3">
            <h3 className="font-extrabold text-xs text-[#071A52] uppercase tracking-wide">
              Top Services Today
            </h3>

            <div className="space-y-2">
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span>Aadhaar Smart Print</span>
                  <span className="text-[#155EEF]">68 Prints (36%)</span>
                </div>
                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-[#155EEF] h-full rounded-full" style={{ width: '36%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span>Passport Photos (8/16-up)</span>
                  <span className="text-[#FF6B00]">34 Sheets (24%)</span>
                </div>
                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-[#FF6B00] h-full rounded-full" style={{ width: '24%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span>PDF Compress & SSC Forms</span>
                  <span className="text-purple-600">28 Jobs (18%)</span>
                </div>
                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-purple-600 h-full rounded-full" style={{ width: '18%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span>Color Marksheet Prints</span>
                  <span className="text-emerald-600">22 Prints (14%)</span>
                </div>
                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-600 h-full rounded-full" style={{ width: '14%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
