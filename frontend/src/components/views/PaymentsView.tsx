import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { 
  CreditCard, 
  QrCode, 
  Save, 
  CheckCircle2, 
  IndianRupee, 
  Sliders, 
  HelpCircle,
  Copy,
  Check
} from 'lucide-react';
import { ShopSettings } from '../../types';
import { api } from '../../services/api';

interface PaymentsViewProps {
  settings: ShopSettings;
  onUpdateSettings: (newSettings: ShopSettings) => void;
}

export const PaymentsView: React.FC<PaymentsViewProps> = ({
  settings,
  onUpdateSettings
}) => {
  // Configurable UPI & Pricing
  const [upiId, setUpiId] = useState(settings.upiId);
  const [pricingMatrix, setPricingMatrix] = useState(settings.pricingMatrix);
  const [isSaved, setIsSaved] = useState(false);

  // Dynamic Counter Quick Calculator
  const [quickAmount, setQuickAmount] = useState<number>(46);
  const [copied, setCopied] = useState(false);

  const dynamicUpiString = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(settings.shopName)}&am=${quickAmount}&cu=INR&tn=CyberSevaPayment`;

  const handlePriceChange = (key: string, val: number) => {
    setPricingMatrix(prev => ({
      ...prev,
      [key]: val
    }));
  };

  const handleSaveSettings = async () => {
    const updated = {
      ...settings,
      upiId,
      pricingMatrix
    };
    await api.updateSettings(updated);
    onUpdateSettings(updated);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const copyUpiId = () => {
    navigator.clipboard.writeText(upiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      {/* Header */}
      <div className="clay-card p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-emerald-100 text-emerald-700">
            <CreditCard className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-[#071A52] flex items-center gap-2">
              Payments, UPI & Counter Rates Matrix
              <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                Zero Gateway Charges
              </span>
            </h2>
            <p className="text-xs text-[#667085]">
              Configure your shop's direct UPI ID and edit service charges per copy
            </p>
          </div>
        </div>

        <button
          onClick={handleSaveSettings}
          className="clay-button-royal px-5 py-2 font-bold text-xs flex items-center gap-1.5 self-start sm:self-auto"
        >
          {isSaved ? <CheckCircle2 className="w-4 h-4 text-emerald-300" /> : <Save className="w-4 h-4" />}
          <span>{isSaved ? 'Rates Saved Successfully!' : 'Save Pricing & UPI'}</span>
        </button>
      </div>

      {/* Grid: Dynamic Amount Counter QR on Left, Rates Matrix on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Quick UPI QR Counter Display (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="clay-card p-5 text-center space-y-4">
            <div className="flex items-center justify-between text-left pb-2 border-b border-[#E4E7EC]">
              <div>
                <h3 className="text-xs font-extrabold text-[#071A52] uppercase tracking-wider">
                  Live Dynamic Counter QR
                </h3>
                <p className="text-[11px] text-[#667085]">Customer scans to pay exact bill directly</p>
              </div>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                Direct to Bank
              </span>
            </div>

            {/* Quick Amount Changer */}
            <div className="bg-[#F8FAFF] p-3 rounded-xl border border-[#E4E7EC] text-left">
              <label className="text-[11px] font-bold text-[#667085] uppercase tracking-wider block mb-1">
                Enter Amount to Collect (राशि):
              </label>
              <div className="flex items-center gap-2">
                <span className="text-xl font-extrabold text-[#071A52]">₹</span>
                <input
                  type="number"
                  value={quickAmount}
                  onChange={(e) => setQuickAmount(Math.max(1, parseInt(e.target.value) || 0))}
                  className="w-full bg-white border border-[#E4E7EC] focus:border-[#155EEF] rounded-lg px-3 py-1.5 font-extrabold text-lg text-[#071A52] outline-none"
                />
              </div>

              {/* Quick Preset Buttons */}
              <div className="flex items-center gap-1.5 mt-2 overflow-x-auto text-[11px] font-bold">
                {[10, 15, 20, 30, 46, 50, 100].map((amt) => (
                  <button
                    key={amt}
                    onClick={() => setQuickAmount(amt)}
                    className="px-2 py-1 rounded bg-white hover:bg-blue-50 border border-gray-200 text-[#101828]"
                  >
                    ₹{amt}
                  </button>
                ))}
              </div>
            </div>

            {/* Generated QR Card */}
            <div className="mx-auto w-48 h-48 bg-white p-3 rounded-2xl border-2 border-emerald-200 shadow-md flex items-center justify-center">
              <QRCodeSVG value={dynamicUpiString} size={168} level="M" />
            </div>

            {/* Shop UPI Details */}
            <div className="p-3 bg-[#F1F4F9] rounded-xl border border-[#E4E7EC] text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[#667085]">Shop UPI VPA:</span>
                <button onClick={copyUpiId} className="text-[#155EEF] hover:underline flex items-center gap-1 font-bold">
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <p className="font-mono font-bold text-[#071A52] mt-0.5 text-left">{upiId}</p>
              <p className="text-[10px] text-emerald-600 text-left mt-1 font-semibold">
                ✓ 100% money goes directly to your bank account with zero platform commission.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Editable Rates Matrix (7 Cols) */}
        <div className="lg:col-span-7 clay-card p-5 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#E4E7EC]">
            <div>
              <h3 className="text-xs font-extrabold text-[#071A52] uppercase tracking-wider">
                Counter Service Pricing Matrix (दुकान की रेट लिस्ट)
              </h3>
              <p className="text-[11px] text-[#667085]">
                Change prices here. They will automatically reflect across all job calculators.
              </p>
            </div>
          </div>

          {/* Pricing List Table */}
          <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
            {[
              { key: 'a4_bw_single', label: 'A4 Black & White (Single Side)', desc: 'Standard JK Copier 75 GSM' },
              { key: 'a4_bw_both', label: 'A4 Black & White (Both Sides)', desc: 'Duplex printing' },
              { key: 'a4_color_single', label: 'A4 Color Print (Single Side)', desc: 'Ink Tank color inkjet' },
              { key: 'a4_color_both', label: 'A4 Color Print (Both Sides)', desc: 'Double sided color' },
              { key: 'aadhaar_smart_print', label: 'Aadhaar Smart Print (Front + Back)', desc: 'Dual card fit on A4' },
              { key: 'aadhaar_laminated', label: 'Aadhaar Print + Lamination', desc: '125 Micron laminated copy' },
              { key: 'pan_print', label: 'PAN Card Printout', desc: 'Crisp ID card print' },
              { key: 'passport_photo_8', label: '8 Passport Photos (Glossy Sheet)', desc: '35x45mm cut guides' },
              { key: 'passport_photo_16', label: '16 Passport Photos (Glossy Sheet)', desc: 'Full A4 sheet' },
              { key: 'document_scan', label: 'Document Scanning (per page)', desc: '300 DPI high clarity scan' },
              { key: 'lamination_a4', label: 'A4 Size Lamination (125 Micron)', desc: 'Heavy pouch lamination' },
              { key: 'lamination_id', label: 'ID Card Lamination', desc: 'Pocket sized lamination' },
              { key: 'pdf_merge_edit', label: 'PDF Merge & Compress Service', desc: 'Government portal size fix' },
              { key: 'online_form_apply', label: 'Online Form Filling Assistance', desc: 'SSC / Railway / Sarkari Result' },
              { key: 'pvc_card_print', label: 'PVC Smart Plastic Card Print', desc: 'Direct PVC card printing' }
            ].map((service) => (
              <div
                key={service.key}
                className="flex items-center justify-between p-3 rounded-xl bg-[#F8FAFF] border border-[#E4E7EC] text-xs hover:border-[#155EEF]/40 transition-colors"
              >
                <div>
                  <div className="font-bold text-[#101828]">{service.label}</div>
                  <div className="text-[11px] text-[#667085]">{service.desc}</div>
                </div>

                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <span className="font-extrabold text-[#071A52]">₹</span>
                  <input
                    type="number"
                    min="1"
                    value={pricingMatrix[service.key] ?? 10}
                    onChange={(e) => handlePriceChange(service.key, parseInt(e.target.value) || 0)}
                    className="w-16 bg-white border border-[#E4E7EC] focus:border-[#155EEF] rounded-lg px-2 py-1 text-center font-bold text-xs outline-none"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
