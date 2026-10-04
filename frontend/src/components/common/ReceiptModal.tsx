import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { X, Printer, CheckCircle2, ShieldCheck } from 'lucide-react';
import { Job, ShopSettings } from '../../types';

interface ReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  job: Job | null;
  settings: ShopSettings;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({
  isOpen,
  onClose,
  job,
  settings
}) => {
  if (!isOpen || !job) return null;

  const upiPayString = `upi://pay?pa=${encodeURIComponent(settings.upiId)}&pn=${encodeURIComponent(settings.shopName)}&am=${job.totalAmount}&cu=INR&tn=${encodeURIComponent('Bill ' + job.jobCode)}`;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn no-print">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-gray-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Top Bar */}
        <div className="bg-[#071A52] text-white p-3.5 px-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-sm">Customer Bill & Tax Receipt</span>
            <span className="text-[10px] bg-emerald-500 font-bold px-1.5 py-0.5 rounded">
              {job.paymentStatus}
            </span>
          </div>
          <button onClick={onClose} className="p-1 rounded hover:bg-white/10 text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Receipt Body */}
        <div id="thermal-receipt" className="p-6 bg-white overflow-y-auto space-y-4 text-[#101828]">
          {/* Shop Header */}
          <div className="text-center border-b border-dashed border-gray-300 pb-4">
            <img
              src="/cybersevalogo2.png"
              alt="CyberSeva"
              className="h-9 mx-auto mb-2 object-contain"
            />
            <h3 className="font-extrabold text-base text-[#071A52]">{settings.shopName}</h3>
            <p className="text-xs text-[#667085]">{settings.address}</p>
            <p className="text-xs text-[#667085]">Mob: {settings.phone} {settings.gstin ? `| GSTIN: ${settings.gstin}` : ''}</p>
          </div>

          {/* Job Meta */}
          <div className="flex justify-between text-xs border-b border-dashed border-gray-300 pb-2">
            <div>
              <p><span className="text-[#667085]">Job ID:</span> <strong>{job.jobCode}</strong></p>
              <p><span className="text-[#667085]">Customer:</span> <strong>{job.customerName}</strong></p>
            </div>
            <div className="text-right">
              <p><span className="text-[#667085]">Date:</span> {new Date(job.createdAt).toLocaleDateString()}</p>
              <p><span className="text-[#667085]">Operator:</span> {job.operator}</p>
            </div>
          </div>

          {/* Line Items */}
          <div>
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-gray-200 text-[#667085] pb-1">
                  <th className="text-left font-semibold pb-1">Service</th>
                  <th className="text-center font-semibold pb-1">Qty</th>
                  <th className="text-right font-semibold pb-1">Rate</th>
                  <th className="text-right font-semibold pb-1">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {job.services.map((s, idx) => (
                  <tr key={idx} className="py-1">
                    <td className="py-1.5 font-medium">{s.name}</td>
                    <td className="py-1.5 text-center">{s.quantity}</td>
                    <td className="py-1.5 text-right">₹{s.unitPrice}</td>
                    <td className="py-1.5 text-right font-bold">₹{s.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Total & UPI QR */}
          <div className="border-t-2 border-gray-800 pt-2 space-y-2">
            <div className="flex justify-between items-center text-sm font-extrabold">
              <span>NET PAYABLE:</span>
              <span className="text-lg text-[#071A52]">₹{job.totalAmount}</span>
            </div>
            <div className="flex justify-between text-xs text-[#667085]">
              <span>Payment Mode:</span>
              <span className="font-bold text-[#101828]">{job.paymentMode}</span>
            </div>
          </div>

          {/* Dynamic UPI Payment QR (If Pending or for digital verification) */}
          <div className="bg-[#F8F9FC] p-3 rounded-xl border border-gray-200 flex items-center justify-between">
            <div className="text-left pr-2">
              <p className="text-xs font-bold text-[#071A52]">Scan to Pay via UPI:</p>
              <p className="text-[11px] text-[#667085] font-mono">{settings.upiId}</p>
              <p className="text-[10px] text-emerald-600 font-bold mt-1">Pre-filled Amount: ₹{job.totalAmount}</p>
            </div>
            <div className="p-1.5 bg-white rounded-lg shadow-sm border border-gray-200">
              <QRCodeSVG value={upiPayString} size={70} level="M" />
            </div>
          </div>

          {/* Footer */}
          <div className="text-center text-[10px] text-[#667085] border-t border-dashed border-gray-300 pt-2">
            <p>Thank you for visiting! Please verify your prints before leaving.</p>
            <p className="font-bold text-[#071A52] mt-0.5">Powered by CyberSeva — One Counter. Every Service.</p>
          </div>
        </div>

        {/* Modal Buttons */}
        <div className="p-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-[#667085] hover:bg-gray-200 transition-colors"
          >
            Close
          </button>
          <button
            onClick={handlePrint}
            className="clay-button-royal px-5 py-2 font-bold text-xs flex items-center gap-1.5"
          >
            <Printer className="w-4 h-4" />
            <span>Print Receipt</span>
          </button>
        </div>
      </div>
    </div>
  );
};
