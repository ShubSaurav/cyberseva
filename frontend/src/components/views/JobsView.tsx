import React, { useState } from 'react';
import { 
  Clock, 
  Search, 
  Filter, 
  Eye, 
  Printer, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  PlusCircle,
  FileText
} from 'lucide-react';
import { Job, ShopSettings } from '../../types';

interface JobsViewProps {
  jobs: Job[];
  settings: ShopSettings;
  onViewReceipt: (job: Job) => void;
  onPurgeJob: (jobId: string) => void;
  onOpenNewJob: () => void;
  onUpdateStatus: (jobId: string, status: Job['status']) => void;
}

export const JobsView: React.FC<JobsViewProps> = ({
  jobs,
  settings,
  onViewReceipt,
  onPurgeJob,
  onOpenNewJob,
  onUpdateStatus
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const filteredJobs = jobs.filter((j) => {
    const matchesSearch = 
      j.jobCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      j.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (j.customerPhone && j.customerPhone.includes(searchTerm));

    const matchesStatus = statusFilter === 'ALL' || j.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      {/* Header */}
      <div className="clay-card p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-orange-100 text-[#FF6B00]">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-[#071A52] flex items-center gap-2">
              Jobs Management Queue (दैनिक कार्य सूची)
              <span className="text-xs bg-blue-100 text-[#155EEF] font-bold px-2 py-0.5 rounded-full">
                {jobs.length} Total
              </span>
            </h2>
            <p className="text-xs text-[#667085]">
              Track customer jobs, print status, receipts, and trigger zero-retention memory purge
            </p>
          </div>
        </div>

        <button
          onClick={onOpenNewJob}
          className="clay-button-orange px-4 py-2 font-bold text-xs flex items-center gap-1.5 self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>+ Create New Job</span>
        </button>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#667085]" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by Job ID, Customer or Phone..."
            className="w-full pl-9 pr-4 py-2 bg-white border border-[#E4E7EC] focus:border-[#155EEF] rounded-xl text-xs outline-none shadow-sm"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto text-xs font-bold">
          {['ALL', 'NEW', 'PROCESSING', 'PRINTING', 'READY', 'COMPLETED'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap ${
                statusFilter === st
                  ? 'bg-[#071A52] text-white shadow-sm'
                  : 'bg-white text-[#667085] border border-[#E4E7EC] hover:bg-gray-50'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Jobs Table */}
      <div className="clay-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#F8F9FC] text-[#667085] font-semibold border-b border-[#E4E7EC]">
              <tr>
                <th className="p-3.5">Job ID</th>
                <th className="p-3.5">Customer & Phone</th>
                <th className="p-3.5">Services Ordered</th>
                <th className="p-3.5">Amount & Payment</th>
                <th className="p-3.5">Operator</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E4E7EC]">
              {filteredJobs.map((job) => (
                <tr key={job.id} className="hover:bg-[#F8FAFF] transition-colors">
                  <td className="p-3.5 font-mono font-bold text-[#071A52]">
                    {job.jobCode}
                  </td>
                  <td className="p-3.5">
                    <div className="font-bold text-[#101828]">{job.customerName}</div>
                    <div className="text-[11px] text-[#667085]">{job.customerPhone || 'Walk-in'}</div>
                  </td>
                  <td className="p-3.5">
                    <div className="font-medium text-[#101828] max-w-[240px] truncate">
                      {job.services.map(s => `${s.name} (x${s.quantity})`).join(', ')}
                    </div>
                    <div className="text-[10px] text-[#667085] mt-0.5">
                      {new Date(job.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </td>
                  <td className="p-3.5">
                    <div className="font-extrabold text-[#071A52]">₹{job.totalAmount}</div>
                    <span className={`inline-block text-[10px] font-bold px-1.5 py-0.2 rounded ${
                      job.paymentStatus === 'PAID' ? 'text-emerald-700 bg-emerald-50' : 'text-amber-700 bg-amber-50'
                    }`}>
                      {job.paymentMode} • {job.paymentStatus}
                    </span>
                  </td>
                  <td className="p-3.5 text-[#667085] font-medium">
                    {job.operator}
                  </td>
                  <td className="p-3.5">
                    <select
                      value={job.status}
                      onChange={(e) => onUpdateStatus(job.id, e.target.value as any)}
                      className={`text-[11px] font-bold px-2 py-1 rounded-lg border outline-none cursor-pointer ${
                        job.status === 'COMPLETED'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                          : job.status === 'PRINTING'
                          ? 'bg-blue-50 text-blue-800 border-blue-300 animate-pulse'
                          : job.status === 'PROCESSING'
                          ? 'bg-amber-50 text-amber-800 border-amber-300'
                          : 'bg-gray-100 text-gray-800 border-gray-300'
                      }`}
                    >
                      <option value="NEW">NEW</option>
                      <option value="PROCESSING">PROCESSING</option>
                      <option value="PRINTING">PRINTING</option>
                      <option value="READY">READY</option>
                      <option value="COMPLETED">COMPLETED</option>
                      <option value="CANCELLED">CANCELLED</option>
                    </select>
                  </td>
                  <td className="p-3.5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onViewReceipt(job)}
                        className="px-2.5 py-1 rounded-lg bg-blue-50 text-[#155EEF] hover:bg-blue-100 font-bold text-[11px] flex items-center gap-1"
                        title="Customer Bill Receipt"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Receipt</span>
                      </button>

                      {job.hasTemporaryFiles ? (
                        <button
                          onClick={() => onPurgeJob(job.id)}
                          className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold text-[11px] flex items-center gap-1"
                          title="Purge temporary buffer"
                        >
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>Purge</span>
                        </button>
                      ) : (
                        <span className="text-[10px] text-gray-400 font-semibold px-2">
                          Purged
                        </span>
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
