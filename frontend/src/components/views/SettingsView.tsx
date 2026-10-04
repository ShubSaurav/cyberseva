import React, { useState } from 'react';
import { 
  Settings, 
  Save, 
  CheckCircle2, 
  Printer, 
  ShieldCheck, 
  Globe, 
  Clock, 
  CreditCard,
  Building,
  History
} from 'lucide-react';
import { ShopSettings, Printer as PrinterType, AuditLogEntry } from '../../types';
import { api } from '../../services/api';

interface SettingsViewProps {
  settings: ShopSettings;
  printers: PrinterType[];
  onUpdateSettings: (newSettings: ShopSettings) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  printers,
  onUpdateSettings
}) => {
  const [form, setForm] = useState<ShopSettings>(settings);
  const [isSaved, setIsSaved] = useState(false);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([
    {
      id: 'log-1',
      timestamp: '10:25 AM',
      staffName: 'Rajesh Sharma',
      jobCode: '#10293',
      action: 'Automatic Privacy Purge',
      details: 'Customer Aadhaar temporary memory buffer destroyed securely (Zero retention).',
      privacySafe: true
    },
    {
      id: 'log-2',
      timestamp: '10:22 AM',
      staffName: 'Rajesh Sharma',
      jobCode: '#10293',
      action: 'Print Completed',
      details: 'Aadhaar front-back A4 dispatched to HP LaserJet Pro M404n.',
      privacySafe: true
    },
    {
      id: 'log-3',
      timestamp: '10:16 AM',
      staffName: 'Rajesh Sharma',
      jobCode: '#10293',
      action: 'Document Layout Engine',
      details: 'Dual perspective crop and auto-deskew applied for Aadhaar card.',
      privacySafe: true
    }
  ]);

  const handleSave = async () => {
    await api.updateSettings(form);
    onUpdateSettings(form);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="space-y-6 pb-12 animate-fadeIn max-w-5xl mx-auto">
      {/* Header */}
      <div className="clay-card p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-gray-100 text-[#071A52]">
            <Settings className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-[#071A52] flex items-center gap-2">
              Counter Settings & Privacy Policies (सेटिंग्स)
            </h2>
            <p className="text-xs text-[#667085]">
              Configure shop profile, default printer spooler, UPI details, and auto-purge retention
            </p>
          </div>
        </div>

        <button
          onClick={handleSave}
          className="clay-button-royal px-5 py-2 font-bold text-xs flex items-center gap-1.5 self-start sm:self-auto"
        >
          {isSaved ? <CheckCircle2 className="w-4 h-4 text-emerald-300" /> : <Save className="w-4 h-4" />}
          <span>{isSaved ? 'Settings Saved!' : 'Save All Settings'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Shop Information */}
        <div className="clay-card p-5 space-y-4">
          <h3 className="font-extrabold text-xs text-[#071A52] uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-[#E4E7EC]">
            <Building className="w-4 h-4 text-[#155EEF]" />
            <span>Shop Profile & Counter Identity:</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <label className="font-bold text-[#101828] block mb-1">Shop / Kendra Name:</label>
              <input
                type="text"
                value={form.shopName}
                onChange={(e) => setForm({ ...form, shopName: e.target.value })}
                className="w-full bg-[#F6F8FC] border border-[#E4E7EC] focus:border-[#155EEF] rounded-xl px-3 py-2 text-xs font-semibold outline-none"
              />
            </div>

            <div>
              <label className="font-bold text-[#101828] block mb-1">Owner / Operator Full Name:</label>
              <input
                type="text"
                value={form.ownerName}
                onChange={(e) => setForm({ ...form, ownerName: e.target.value })}
                className="w-full bg-[#F6F8FC] border border-[#E4E7EC] focus:border-[#155EEF] rounded-xl px-3 py-2 text-xs font-semibold outline-none"
              />
            </div>

            <div>
              <label className="font-bold text-[#101828] block mb-1">Shop Address & Landmark:</label>
              <input
                type="text"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                className="w-full bg-[#F6F8FC] border border-[#E4E7EC] focus:border-[#155EEF] rounded-xl px-3 py-2 text-xs font-semibold outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-[#101828] block mb-1">Mobile / WhatsApp:</label>
                <input
                  type="text"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full bg-[#F6F8FC] border border-[#E4E7EC] focus:border-[#155EEF] rounded-xl px-3 py-2 text-xs font-semibold outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-[#101828] block mb-1">GSTIN (Optional):</label>
                <input
                  type="text"
                  value={form.gstin || ''}
                  onChange={(e) => setForm({ ...form, gstin: e.target.value })}
                  className="w-full bg-[#F6F8FC] border border-[#E4E7EC] focus:border-[#155EEF] rounded-xl px-3 py-2 text-xs font-semibold outline-none font-mono"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Hardware & Privacy Policies */}
        <div className="clay-card p-5 space-y-4">
          <h3 className="font-extrabold text-xs text-[#071A52] uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-[#E4E7EC]">
            <Printer className="w-4 h-4 text-[#FF6B00]" />
            <span>Default Hardware & Privacy Policies:</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <label className="font-bold text-[#101828] block mb-1">Default Fast Printer:</label>
              <select
                value={form.defaultPrinterId}
                onChange={(e) => setForm({ ...form, defaultPrinterId: e.target.value })}
                className="w-full bg-[#F6F8FC] border border-[#E4E7EC] focus:border-[#155EEF] rounded-xl px-3 py-2 text-xs font-semibold outline-none"
              >
                {printers.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.type})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-bold text-[#101828] block mb-1">Shop UPI ID (Direct Bank):</label>
              <input
                type="text"
                value={form.upiId}
                onChange={(e) => setForm({ ...form, upiId: e.target.value })}
                className="w-full bg-[#F6F8FC] border border-[#E4E7EC] focus:border-[#155EEF] rounded-xl px-3 py-2 text-xs font-bold text-[#071A52] font-mono outline-none"
              />
              <span className="text-[10px] text-[#667085] mt-1 block">
                Payments from customer QR will directly hit this UPI ID with zero fee.
              </span>
            </div>

            <div>
              <label className="font-bold text-[#101828] block mb-1">
                Zero-Retention Auto-Purge Duration:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[5, 15, 60].map((mins) => (
                  <button
                    key={mins}
                    onClick={() => setForm({ ...form, autoPurgeMinutes: mins })}
                    className={`py-2 rounded-xl border text-center font-bold text-xs transition-all ${
                      form.autoPurgeMinutes === mins
                        ? 'bg-[#155EEF] text-white border-blue-600 shadow-sm'
                        : 'bg-[#F8FAFF] text-[#101828] border-[#E4E7EC]'
                    }`}
                  >
                    {mins} Minutes
                  </button>
                ))}
              </div>
              <span className="text-[10px] text-emerald-600 font-semibold mt-1 block">
                🛡️ Customer documents will be permanently purged from memory after this time.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="clay-card p-5 space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-[#E4E7EC]">
          <h3 className="font-extrabold text-xs text-[#071A52] uppercase tracking-wider flex items-center gap-2">
            <History className="w-4 h-4 text-[#155EEF]" />
            <span>Counter Security & Privacy Audit Trail (ऑडिट लॉग)</span>
          </h3>
          <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold">
            Zero File Contents Logged
          </span>
        </div>

        <div className="space-y-2">
          {auditLogs.map((log) => (
            <div key={log.id} className="p-3 bg-[#F8FAFF] rounded-xl border border-[#E4E7EC] flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <span className="font-mono text-[#667085] text-[11px]">{log.timestamp}</span>
                <div>
                  <div className="font-bold text-[#101828] flex items-center gap-1.5">
                    <span>{log.action}</span>
                    {log.jobCode && (
                      <span className="text-[10px] bg-blue-100 text-[#155EEF] px-1.5 py-0.2 rounded font-mono font-bold">
                        {log.jobCode}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-[#667085]">{log.details}</p>
                </div>
              </div>
              <span className="text-[10px] text-gray-500 font-medium">{log.staffName}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
