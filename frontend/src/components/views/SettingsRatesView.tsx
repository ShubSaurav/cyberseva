import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { 
  Sliders, 
  Save, 
  CheckCircle2, 
  QrCode, 
  Building, 
  CreditCard,
  Copy,
  Check
} from 'lucide-react';
import { ShopSettings } from '../../types';
import { api } from '../../services/api';

interface SettingsRatesViewProps {
  settings: ShopSettings;
  onUpdateSettings: (newSettings: ShopSettings) => void;
}

export const SettingsRatesView: React.FC<SettingsRatesViewProps> = ({
  settings,
  onUpdateSettings
}) => {
  const [form, setForm] = useState<ShopSettings>(settings);
  const [isSaved, setIsSaved] = useState(false);
  const [quickAmount, setQuickAmount] = useState<number>(46);
  const [copied, setCopied] = useState(false);

  const dynamicUpiString = `upi://pay?pa=${encodeURIComponent(form.upiId)}&pn=${encodeURIComponent(form.shopName)}&am=${quickAmount}&cu=INR&tn=CyberSevaBill`;

  const handlePriceChange = (key: string, val: number) => {
    setForm(prev => ({
      ...prev,
      pricingMatrix: {
        ...prev.pricingMatrix,
        [key]: val
      }
    }));
  };

  const handleSave = async () => {
    await api.updateSettings(form);
    onUpdateSettings(form);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const copyUpi = () => {
    navigator.clipboard.writeText(form.upiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="space-y-6 pb-12 animate-fadeIn max-w-5xl mx-auto">
      {/* Top Banner */}
      <div className="clean-card p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-800 flex items-center justify-center shadow-sm">
            <Sliders className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-[#071A52]">
              रेट लिस्ट व दुकान सेटिंग्स (Rates & UPI)
            </h2>
            <p className="text-xs text-slate-500">
              अपनी दुकान के रेट तय करें, UPI ID सेट करें और काउंटर पेमेंट QR जनरेट करें
            </p>
          </div>
        </div>

        <button
          onClick={handleSave}
          className="btn-primary px-5 py-2.5 font-bold text-xs flex items-center gap-1.5 self-start sm:self-auto"
        >
          {isSaved ? <CheckCircle2 className="w-4 h-4 text-emerald-300" /> : <Save className="w-4 h-4" />}
          <span>{isSaved ? 'रेट लिस्ट सेव हो गई!' : 'रेट लिस्ट सेव करें'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Live Dynamic UPI QR for Counter Payments (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="clean-card p-6 text-center space-y-4">
            <div className="flex items-center justify-between text-left pb-2 border-b border-slate-200">
              <div>
                <h3 className="text-xs font-extrabold text-[#071A52] uppercase tracking-wide">
                  काउंटर पेमेंट UPI QR कोड
                </h3>
                <p className="text-[11px] text-slate-500">ग्राहक से स्कैन करवाकर सीधे खाते में पैसे लें</p>
              </div>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                0% चार्ज
              </span>
            </div>

            {/* Quick Amount Changer */}
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-left">
              <label className="text-[11px] font-bold text-slate-600 block mb-1">
                कितने रुपये लेने हैं? (Enter Amount):
              </label>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-extrabold text-[#071A52]">₹</span>
                <input
                  type="number"
                  value={quickAmount}
                  onChange={(e) => setQuickAmount(Math.max(1, parseInt(e.target.value) || 0))}
                  className="w-full bg-white border border-slate-300 focus:border-[#155EEF] rounded-xl px-3 py-2 text-xl font-extrabold text-[#071A52] outline-none"
                />
              </div>

              {/* Quick Preset Buttons */}
              <div className="flex items-center gap-2 mt-2.5 overflow-x-auto text-xs font-bold">
                {[10, 15, 20, 30, 46, 50, 100].map((amt) => (
                  <button
                    key={amt}
                    onClick={() => setQuickAmount(amt)}
                    className="px-2.5 py-1 rounded-lg bg-white hover:bg-blue-50 border border-slate-200 text-slate-800"
                  >
                    ₹{amt}
                  </button>
                ))}
              </div>
            </div>

            {/* QR Frame */}
            <div className="mx-auto w-48 h-48 bg-white p-3 rounded-2xl border-2 border-emerald-300 shadow-md flex items-center justify-center">
              <QRCodeSVG value={dynamicUpiString} size={168} level="M" />
            </div>

            {/* Shop UPI ID display */}
            <div className="p-3 bg-slate-100 rounded-xl text-xs text-left">
              <div className="flex items-center justify-between">
                <span className="text-slate-600 font-medium">आपकी दुकान की UPI ID:</span>
                <button onClick={copyUpi} className="text-[#155EEF] hover:underline flex items-center gap-1 font-bold">
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'कॉपी हो गया' : 'कॉपी करें'}</span>
                </button>
              </div>
              <p className="font-mono font-bold text-[#071A52] mt-0.5">{form.upiId}</p>
            </div>
          </div>
        </div>

        {/* Right Side: Rate List & Shop Details (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Shop Profile */}
          <div className="clean-card p-5 space-y-3">
            <span className="text-xs font-extrabold text-slate-700 uppercase tracking-wide block pb-2 border-b border-slate-200">
              दुकान का विवरण (Shop Profile):
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">दुकान का नाम:</label>
                <input
                  type="text"
                  value={form.shopName}
                  onChange={(e) => setForm({ ...form, shopName: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-bold outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">दुकानदार का नाम:</label>
                <input
                  type="text"
                  value={form.ownerName}
                  onChange={(e) => setForm({ ...form, ownerName: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-bold outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">मोबाइल नंबर:</label>
                <input
                  type="text"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-bold outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">UPI ID (जिसमें पैसे आएंगे):</label>
                <input
                  type="text"
                  value={form.upiId}
                  onChange={(e) => setForm({ ...form, upiId: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-bold font-mono outline-none text-[#155EEF]"
                />
              </div>
            </div>
          </div>

          {/* Rates Matrix */}
          <div className="clean-card p-5 space-y-3">
            <span className="text-xs font-extrabold text-slate-700 uppercase tracking-wide block pb-2 border-b border-slate-200">
              सेवाओं की रेट लिस्ट (प्रति कॉपी या शीट):
            </span>

            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {[
                { key: 'a4_bw_single', label: 'A4 ब्लैक एंड व्हाइट (1 साइड)' },
                { key: 'a4_bw_both', label: 'A4 ब्लैक एंड व्हाइट (दोनों साइड)' },
                { key: 'a4_color_single', label: 'A4 कलर प्रिंट (1 साइड)' },
                { key: 'aadhaar_smart_print', label: 'आधार स्मार्ट प्रिंट (Front + Back A4)' },
                { key: 'passport_photo_8', label: '8 पासपोर्ट साइज फोटो शीट' },
                { key: 'passport_photo_16', label: '16 पासपोर्ट साइज फोटो शीट' },
                { key: 'document_scan', label: 'दस्तावेज स्कैन (प्रति पेज)' },
                { key: 'lamination_a4', label: 'A4 लैमिनेशन (125 माइक्रोन)' },
                { key: 'pdf_merge_edit', label: 'PDF जोड़ना व साइज ठीक करना' }
              ].map((srv) => (
                <div key={srv.key} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                  <span className="font-bold text-slate-800">{srv.label}</span>
                  <div className="flex items-center gap-1">
                    <span className="font-extrabold text-[#071A52]">₹</span>
                    <input
                      type="number"
                      min="1"
                      value={form.pricingMatrix[srv.key] ?? 10}
                      onChange={(e) => handlePriceChange(srv.key, parseInt(e.target.value) || 0)}
                      className="w-16 bg-white border border-slate-300 rounded-lg px-2 py-1 text-center font-bold text-xs outline-none"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
