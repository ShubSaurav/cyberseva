import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { X, Printer, CheckCircle2 } from 'lucide-react';
import { Job, ShopSettings } from '../../types';

interface SimpleReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  job: Job | null;
  settings: ShopSettings;
}

export const SimpleReceiptModal: React.FC<SimpleReceiptModalProps> = ({
  isOpen,
  onClose,
  job,
  settings
}) => {
  if (!isOpen || !job) return null;

  const upiPayString = `upi://pay?pa=${encodeURIComponent(settings.upiId)}&pn=${encodeURIComponent(settings.shopName)}&am=${job.totalAmount}&cu=INR&tn=${encodeURIComponent('Bill ' + job.jobCode)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn no-print">
      <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Top Control */}
        <div className="bg-[#071A52] text-white p-3.5 px-4 flex items-center justify-between">
          <span className="font-extrabold text-sm">दुकान रसीद (Bill Receipt)</span>
          <button onClick={onClose} className="p-1 rounded hover:bg-white/10 text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Thermal Receipt Card */}
        <div className="p-6 bg-white overflow-y-auto space-y-4 text-slate-900 text-xs">
          {/* Shop Header */}
          <div className="text-center border-b border-dashed border-slate-300 pb-3">
            <img src="/cybersevalogo2.png" alt="CyberSeva" className="h-8 mx-auto mb-1.5 object-contain" />
            <h3 className="font-extrabold text-sm text-[#071A52]">{settings.shopName}</h3>
            <p className="text-[11px] text-slate-500">{settings.address}</p>
            <p className="text-[11px] text-slate-500">मो: {settings.phone}</p>
          </div>

          {/* Job Info */}
          <div className="flex justify-between border-b border-dashed border-slate-300 pb-2 text-[11px]">
            <div>
              <p><span className="text-slate-500">जॉब नंबर:</span> <strong>{job.jobCode}</strong></p>
              <p><span className="text-slate-500">ग्राहक:</span> <strong>{job.customerName}</strong></p>
            </div>
            <div className="text-right">
              <p><span className="text-slate-500">तारीख:</span> {new Date(job.createdAt).toLocaleDateString()}</p>
              <p><span className="text-slate-500">काउंटर:</span> {job.operator}</p>
            </div>
          </div>

          {/* Line Items */}
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 pb-1">
                <th className="text-left font-bold pb-1">काम (Service)</th>
                <th className="text-center font-bold pb-1">मात्रा</th>
                <th className="text-right font-bold pb-1">रुपये</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {job.services.map((s, idx) => (
                <tr key={idx}>
                  <td className="py-1.5 font-medium">{s.name}</td>
                  <td className="py-1.5 text-center font-bold">{s.quantity}</td>
                  <td className="py-1.5 text-right font-extrabold">₹{s.total}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Total & UPI QR */}
          <div className="border-t-2 border-slate-900 pt-2 space-y-2">
            <div className="flex justify-between items-center text-sm font-extrabold">
              <span>कुल देय राशि:</span>
              <span className="text-lg text-[#071A52]">₹{job.totalAmount}</span>
            </div>
            <div className="flex justify-between text-[11px] text-slate-500">
              <span>भुगतान:</span>
              <span className="font-bold text-slate-800">{job.paymentMode} ({job.paymentStatus})</span>
            </div>
          </div>

          {/* Dynamic UPI Payment QR Code */}
          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 flex items-center justify-between">
            <div className="text-left pr-2 text-[11px]">
              <p className="font-bold text-[#071A52]">UPI से तुरंत भुगतान:</p>
              <p className="text-[10px] text-slate-500 font-mono">{settings.upiId}</p>
              <p className="text-[10px] text-emerald-600 font-bold mt-0.5">राशि सेट: ₹{job.totalAmount}</p>
            </div>
            <div className="p-1 bg-white rounded-lg shadow-sm border border-slate-200">
              <QRCodeSVG value={upiPayString} size={60} level="M" />
            </div>
          </div>

          <p className="text-center text-[10px] text-slate-400 pt-2 border-t border-dashed border-slate-300">
            दुकान पर पधारने के लिए धन्यवाद!
          </p>
        </div>

        {/* Print Button */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button onClick={onClose} className="px-4 py-2 font-bold text-xs text-slate-500 hover:text-slate-800">
            बंद करें
          </button>
          <button
            onClick={() => window.print()}
            className="btn-primary px-5 py-2 font-bold text-xs flex items-center gap-1.5 shadow-sm"
          >
            <Printer className="w-4 h-4" />
            <span>रसीद प्रिंट निकालें</span>
          </button>
        </div>
      </div>
    </div>
  );
};
