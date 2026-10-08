import React, { useState, useMemo } from 'react';
import { 
  IndianRupee, 
  Calendar, 
  Search, 
  Eye, 
  Trash2, 
  Printer, 
  Plus, 
  TrendingUp, 
  CreditCard, 
  Banknote, 
  Clock, 
  User, 
  CheckCircle2,
  Filter
} from 'lucide-react';
import { Job, ShopSettings } from '../../types';
import { Language, translations } from '../../utils/i18n';

interface SalesKhataViewProps {
  jobs: Job[];
  settings: ShopSettings;
  language: Language;
  onOpenQuickSale: () => void;
  onViewReceipt: (job: Job) => void;
  onDeleteJob: (jobId: string) => void;
}

export const SalesKhataView: React.FC<SalesKhataViewProps> = ({
  jobs,
  settings,
  language,
  onOpenQuickSale,
  onViewReceipt,
  onDeleteJob
}) => {
  const t = translations[language];

  const [viewMode, setViewMode] = useState<'daily' | 'monthly'>('daily');
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [selectedMonth, setSelectedMonth] = useState<string>(new Date().toISOString().slice(0, 7)); // YYYY-MM
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPayment, setFilterPayment] = useState<'ALL' | 'CASH' | 'UPI_QR' | 'PENDING'>('ALL');

  // Filter jobs based on daily/monthly selection
  const filteredByPeriod = useMemo(() => {
    return jobs.filter((job) => {
      const jobDate = job.createdAt ? job.createdAt.split('T')[0] : '';
      if (viewMode === 'daily') {
        return jobDate === selectedDate;
      } else {
        return jobDate.startsWith(selectedMonth);
      }
    });
  }, [jobs, viewMode, selectedDate, selectedMonth]);

  // Search & Payment Mode filter
  const displayedJobs = useMemo(() => {
    return filteredByPeriod.filter((job) => {
      const matchesSearch = 
        searchQuery.trim() === '' ||
        job.jobCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.operator.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.services.some(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesPayment = 
        filterPayment === 'ALL' ||
        (filterPayment === 'PENDING' ? job.paymentStatus === 'PENDING' : job.paymentMode === filterPayment);

      return matchesSearch && matchesPayment;
    });
  }, [filteredByPeriod, searchQuery, filterPayment]);

  // Financial Metrics Calculations
  const metrics = useMemo(() => {
    let totalRevenue = 0;
    let cashTotal = 0;
    let upiTotal = 0;
    let pendingTotal = 0;

    filteredByPeriod.forEach((job) => {
      totalRevenue += job.totalAmount || 0;
      if (job.paymentStatus === 'PENDING' || job.paymentMode === 'SPLIT') {
        pendingTotal += job.totalAmount || 0;
      } else if (job.paymentMode === 'CASH') {
        cashTotal += job.totalAmount || 0;
      } else if (job.paymentMode === 'UPI_QR') {
        upiTotal += job.totalAmount || 0;
      }
    });

    const txCount = filteredByPeriod.length;
    const avgTicket = txCount > 0 ? Math.round(totalRevenue / txCount) : 0;

    return { totalRevenue, cashTotal, upiTotal, pendingTotal, txCount, avgTicket };
  }, [filteredByPeriod]);

  // Service Breakdown
  const serviceBreakdown = useMemo(() => {
    const map: Record<string, { count: number; total: number }> = {};
    filteredByPeriod.forEach((job) => {
      job.services.forEach((s) => {
        const name = s.name || 'Counter Service';
        if (!map[name]) map[name] = { count: 0, total: 0 };
        map[name].count += s.quantity || 1;
        map[name].total += s.total || s.unitPrice || 0;
      });
    });
    return Object.entries(map).sort((a, b) => b[1].total - a[1].total).slice(0, 5);
  }, [filteredByPeriod]);

  // Staff Breakdown
  const staffBreakdown = useMemo(() => {
    const map: Record<string, { count: number; total: number }> = {};
    filteredByPeriod.forEach((job) => {
      const op = job.operator || 'Unknown';
      if (!map[op]) map[op] = { count: 0, total: 0 };
      map[op].count += 1;
      map[op].total += job.totalAmount || 0;
    });
    return Object.entries(map).sort((a, b) => b[1].total - a[1].total);
  }, [filteredByPeriod]);

  return (
    <div className="space-y-6 pb-12 animate-fadeIn max-w-7xl mx-auto">
      {/* Top Banner & Fast Actions */}
      <div className="clean-card p-5 sm:p-6 bg-gradient-to-r from-emerald-50/70 via-white to-blue-50/70 border border-emerald-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#071A52] tracking-tight flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-emerald-600" />
            <span>{t.salesKhataTitle}</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            {t.salesKhataSub}
          </p>
        </div>

        <button
          onClick={onOpenQuickSale}
          className="btn-green px-5 py-2.5 font-extrabold text-xs flex items-center justify-center gap-2 self-start md:self-auto shadow-md shadow-emerald-500/20 active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>{t.logSaleBtn}</span>
        </button>
      </div>

      {/* Date & Period Controls */}
      <div className="clean-card p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4 bg-white">
        {/* Daily / Monthly Toggle */}
        <div className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200">
          <button
            onClick={() => setViewMode('daily')}
            className={`px-4 py-1.5 rounded-xl text-xs font-extrabold transition-all ${
              viewMode === 'daily'
                ? 'bg-white text-[#155EEF] shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            📅 {t.viewDaily}
          </button>
          <button
            onClick={() => setViewMode('monthly')}
            className={`px-4 py-1.5 rounded-xl text-xs font-extrabold transition-all ${
              viewMode === 'monthly'
                ? 'bg-white text-[#155EEF] shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            📊 {t.viewMonthly}
          </button>
        </div>

        {/* Date Selector */}
        <div className="flex items-center gap-2">
          {viewMode === 'daily' ? (
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-600">{t.selectDate}</span>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-slate-300 bg-white font-bold text-xs text-slate-800 shadow-xs focus:outline-none focus:border-[#155EEF]"
              />
              <button
                onClick={() => setSelectedDate(new Date().toISOString().split('T')[0])}
                className="px-2.5 py-1.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700"
              >
                Today
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-600">{t.selectMonth}</span>
              <input
                type="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-slate-300 bg-white font-bold text-xs text-slate-800 shadow-xs focus:outline-none focus:border-[#155EEF]"
              />
            </div>
          )}
        </div>
      </div>

      {/* 4 Financial Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        {/* Card 1: Total Revenue */}
        <div className="clean-card p-4 sm:p-5 bg-gradient-to-br from-emerald-50 to-white border-2 border-emerald-200/80">
          <div className="flex items-center justify-between text-emerald-700 mb-2">
            <span className="text-[11px] font-extrabold uppercase tracking-wide">
              {viewMode === 'daily' ? t.todayTotal : t.totalRevenue}
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center">
              <IndianRupee className="w-4 h-4 text-emerald-700" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#071A52]">
            ₹{metrics.totalRevenue.toLocaleString('en-IN')}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            {metrics.txCount} {t.transactionsCount}
          </p>
        </div>

        {/* Card 2: Cash in Hand */}
        <div className="clean-card p-4 sm:p-5 bg-gradient-to-br from-blue-50 to-white border-2 border-blue-200/80">
          <div className="flex items-center justify-between text-blue-700 mb-2">
            <span className="text-[11px] font-extrabold uppercase tracking-wide">
              {t.cashCollected}
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-100 flex items-center justify-center">
              <Banknote className="w-4 h-4 text-[#155EEF]" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#071A52]">
            ₹{metrics.cashTotal.toLocaleString('en-IN')}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            {metrics.totalRevenue > 0 ? Math.round((metrics.cashTotal / metrics.totalRevenue) * 100) : 0}% of revenue
          </p>
        </div>

        {/* Card 3: UPI Collections */}
        <div className="clean-card p-4 sm:p-5 bg-gradient-to-br from-purple-50 to-white border-2 border-purple-200/80">
          <div className="flex items-center justify-between text-purple-700 mb-2">
            <span className="text-[11px] font-extrabold uppercase tracking-wide">
              {t.upiReceived}
            </span>
            <div className="w-8 h-8 rounded-xl bg-purple-100 flex items-center justify-center">
              <CreditCard className="w-4 h-4 text-purple-700" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#071A52]">
            ₹{metrics.upiTotal.toLocaleString('en-IN')}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Bank transfers & QR
          </p>
        </div>

        {/* Card 4: Pending / Due (Udhar) */}
        <div className="clean-card p-4 sm:p-5 bg-gradient-to-br from-amber-50 to-white border-2 border-amber-200/80">
          <div className="flex items-center justify-between text-amber-700 mb-2">
            <span className="text-[11px] font-extrabold uppercase tracking-wide">
              {t.pendingUdhar}
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center">
              <Clock className="w-4 h-4 text-amber-700" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-amber-900">
            ₹{metrics.pendingTotal.toLocaleString('en-IN')}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            To be collected
          </p>
        </div>
      </div>

      {/* Breakdowns Split (Services & Staff) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Service Breakdown */}
        <div className="clean-card p-5 space-y-3">
          <h3 className="text-sm font-extrabold text-[#071A52] flex items-center gap-2">
            <span>{t.salesByService}</span>
          </h3>
          {serviceBreakdown.length === 0 ? (
            <p className="text-xs text-slate-400 py-3 text-center">No service data for this period.</p>
          ) : (
            <div className="space-y-2.5">
              {serviceBreakdown.map(([name, data]) => {
                const pct = metrics.totalRevenue > 0 ? Math.round((data.total / metrics.totalRevenue) * 100) : 0;
                return (
                  <div key={name} className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                      <span>{name} ({data.count})</span>
                      <span className="font-extrabold text-[#071A52]">₹{data.total}</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-[#155EEF] h-full rounded-full transition-all" style={{ width: `${pct}%` }}></div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Staff Breakdown */}
        <div className="clean-card p-5 space-y-3">
          <h3 className="text-sm font-extrabold text-[#071A52] flex items-center gap-2">
            <User className="w-4 h-4 text-[#155EEF]" />
            <span>{t.salesByStaff}</span>
          </h3>
          {staffBreakdown.length === 0 ? (
            <p className="text-xs text-slate-400 py-3 text-center">No staff data for this period.</p>
          ) : (
            <div className="space-y-2.5">
              {staffBreakdown.map(([name, data]) => {
                const pct = metrics.totalRevenue > 0 ? Math.round((data.total / metrics.totalRevenue) * 100) : 0;
                return (
                  <div key={name} className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                      <span>{name} ({data.count} sales)</span>
                      <span className="font-extrabold text-emerald-700">₹{data.total}</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full rounded-full transition-all" style={{ width: `${pct}%` }}></div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Full Transaction Records Table */}
      <div className="clean-card p-5 space-y-4">
        {/* Table Filters & Search */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
          <div>
            <h3 className="text-base font-extrabold text-[#071A52]">
              {t.allSalesRecords} ({displayedJobs.length})
            </h3>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Payment Filter */}
            <select
              value={filterPayment}
              onChange={(e) => setFilterPayment(e.target.value as any)}
              className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white font-bold text-xs text-slate-700 focus:outline-none"
            >
              <option value="ALL">All Payments</option>
              <option value="CASH">Cash Only</option>
              <option value="UPI_QR">UPI Only</option>
              <option value="PENDING">Pending / Udhar</option>
            </select>

            {/* Search Input */}
            <div className="relative w-full sm:w-56">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.searchSalesPlaceholder}
                className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 focus:outline-none focus:border-[#155EEF]"
              />
            </div>
          </div>
        </div>

        {/* Interactive Table */}
        <div className="overflow-x-auto">
          {displayedJobs.length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-xs">
              {t.noSalesToday}
            </div>
          ) : (
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">{t.colJobId}</th>
                  <th className="py-3 px-4">{t.colTime}</th>
                  <th className="py-3 px-4">{t.colCustomer}</th>
                  <th className="py-3 px-4">{t.colService}</th>
                  <th className="py-3 px-4">{t.colAmount}</th>
                  <th className="py-3 px-4">{t.colPayment}</th>
                  <th className="py-3 px-4">{t.colStaff}</th>
                  <th className="py-3 px-4 text-right">{t.colActions}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {displayedJobs.map((job) => (
                  <tr key={job.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-[#071A52]">
                      {job.jobCode}
                    </td>
                    <td className="py-3 px-4 text-slate-500 whitespace-nowrap">
                      {job.createdAt ? new Date(job.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—'}
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900">
                      {job.customerName}
                    </td>
                    <td className="py-3 px-4 text-slate-700 font-medium">
                      {job.services.map(s => `${s.name}${s.quantity > 1 ? ` (x${s.quantity})` : ''}`).join(', ') || 'Counter Service'}
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-extrabold text-[#071A52]">₹{job.totalAmount}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                        job.paymentStatus === 'PENDING'
                          ? 'bg-amber-100 text-amber-800'
                          : job.paymentMode === 'CASH'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-blue-100 text-[#155EEF]'
                      }`}>
                        {job.paymentStatus === 'PENDING' ? '⏳ Due' : job.paymentMode === 'CASH' ? '💵 Cash' : '💳 UPI'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600 font-medium whitespace-nowrap">
                      {job.operator}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onViewReceipt(job)}
                          className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 transition-colors"
                          title={t.btnReceipt}
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDeleteJob(job.id)}
                          className="p-1.5 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors"
                          title={t.btnDelete}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
